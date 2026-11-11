import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { PromptMasterStatus } from '../types'

const status = atom(
  { plugin: 'prompt-master', key: 'status' } as const,
  'idle' as PromptMasterStatus,
  { shape: 'status-1' },
)
const original = atom(
  { plugin: 'prompt-master', key: 'original' } as const,
  null as string | null,
  { shape: 'original-1' },
)

const rough = atom({ plugin: 'prompt-master', key: 'rough' } as const, '', { shape: 'rough-1' })
const result = atom(
  { plugin: 'prompt-master', key: 'result' } as const,
  null as string | null,
  { shape: 'result-1' },
)
const note = atom(
  { plugin: 'prompt-master', key: 'note' } as const,
  null as string | null,
  { shape: 'note-1' },
)

const PANE = 'prompt-master'
const MODEL = 'sonnet'

const SYSTEM = `You are Prompt Master. You rewrite a person's rough prompt for an AI assistant into a clear, complete, well structured prompt.

Rules:
- Return ONLY the rewritten prompt. No preface, no notes, no quotes, no code fences.
- Do NOT answer or carry out the prompt. Only rewrite it.
- Keep the person's intent, facts, names, numbers and language exactly. If they wrote in Tamil, write in Tamil; if they mixed Tamil and English, keep that mix.
- Never invent facts. Where key details are missing, add a short placeholder in square brackets, like [client name] or [date of notice].
- Make the goal clear in the first line. Then add, only where they help: the context, the exact deliverable and its format, the audience, the tone, and any limits (length, jurisdiction, deadline).
- For legal or business work, ask for statute sections, rules and case citations where that fits the request, and ask the assistant to flag anything it is not sure of.
- Use plain, simple English. Short sentences. No em dashes.
- Keep it proportionate: a one line question becomes a few lines, not a page.`

async function rewrite($: EngineInterface, input: string) {
  const r = await $.model.complete({
    model: MODEL,
    system: SYSTEM,
    prompt: `Rewrite this rough prompt:\n\n<rough_prompt>\n${input}\n</rough_prompt>`,
    maxTokens: 2000,
    effort: 'low',
    timeoutMs: 45000,
  })
  if (!r.isAnswered) {
    return { error: r.reason === 'api-error' ? `API error ${r.status}` : r.reason }
  }
  const text = r.text.trim()

  return text ? { text } : { error: 'empty reply' }
}

async function improveDraft($: EngineInterface) {
  if ((await read($, status)) === 'working') return
  const { text: draft } = await $.prompt.read()
  if (!draft.trim()) {
    $.ui.toast('Type a rough prompt first, then press Prompt Master.')
    return
  }
  await update($, status, () => 'working' as const)
  $.ui.status('Prompt Master: rewriting...')
  try {
    const out = await rewrite($, draft)
    if ('error' in out) {
      $.ui.toast(`Prompt Master could not rewrite it (${out.error}). Your draft is unchanged.`)
      return
    }
    // Do not overwrite the box if the person kept typing while we worked.
    const { text: now } = await $.prompt.read()
    if (now !== draft) {
      $.ui.toast('Your draft changed while Prompt Master was working, so it was left as is.')
      return
    }
    const filled = await $.prompt.fill({ text: out.text, mode: 'replace' })
    if (filled.isFilled) {
      await update($, original, () => draft)
      $.ui.toast('Prompt improved. Review it, then send. Press Undo to go back.')
    } else {
      $.ui.toast('Prompt Master could not write into the prompt box right now.')
    }
  } finally {
    $.ui.status(undefined)
    await update($, status, () => 'idle' as const)
  }
}

async function undo($: EngineInterface) {
  const before = await read($, original)
  if (before === null) return
  const filled = await $.prompt.fill({ text: before, mode: 'replace' })
  if (filled.isFilled) await update($, original, () => null)
}


// Panel: rewrite what was typed in the panel's field, or else the prompt box draft.
async function rewriteFromPanel($: EngineInterface, typed?: string) {
  if ((await read($, status)) === 'working') return
  let text = (typed ?? (await read($, rough))).trim()
  if (!text) text = (await $.prompt.read()).text.trim()
  if (!text) {
    await update($, note, () => 'Type your rough prompt in the box above first.')
    return
  }
  await update($, status, () => 'working' as const)
  await update($, note, () => 'Rewriting...')
  try {
    const out = await rewrite($, text)
    if ('error' in out) {
      await update($, note, () => `Could not rewrite it (${out.error}). Try again.`)
      return
    }
    await update($, result, () => out.text)
    await update($, note, () => null)
  } finally {
    await update($, status, () => 'idle' as const)
  }
}

async function sendResultToBox($: EngineInterface) {
  const text = await read($, result)
  if (!text) return
  const filled = await $.prompt.fill({ text, mode: 'replace' })
  await update($, note, () =>
    filled.isFilled
      ? 'Done. It is in your prompt box. Review it, then send.'
      : 'This app does not let mods write into the prompt box. Use Copy, then paste it.',
  )
}

async function copyResult($: EngineInterface, surface: Parameters<EngineInterface['ui']['copy']>[0]['surface']) {
  const text = await read($, result)
  if (!text) return
  const copied = await $.ui.copy({ text, surface })
  await update($, note, () =>
    copied.isCopied ? 'Copied. Paste it into the prompt box.' : 'Copy did not work here. Select the text above and copy it.',
  )
}

async function clearPanel($: EngineInterface) {
  await update($, rough, () => '')
  await update($, result, () => null)
  await update($, note, () => null)
}


export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'pm',
      description: 'Prompt Master: rewrite your rough prompt into a better one (/pm <your rough prompt>)',
    })
    void $.ui.open({ id: PANE, title: '✨ Prompt Master' })

    return next(e)
  })

  on('session.attach', async ($, e, next) => {
    void $.ui.open({ id: PANE, title: '✨ Prompt Master' })

    return next(e)
  })

  // The side panel: works on every app (desktop, web, mobile, terminal).
  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Button, Input, Text } = $.ui.resolve(e)
    const isWorking = (await read($, status)) === 'working'
    const typed = await read($, rough)
    const improved = await read($, result)
    const line = await read($, note)

    return (
      <Box flexDirection="column" gap={1}>
        <Text dimColor>Type or paste your rough prompt, then press Rewrite.</Text>
        <Input
          key="rough"
          rows={4}
          value={typed}
          placeholder="e.g. draft notice to xyz for copying my mark"
          submitLabel="rewrite"
          onInput={value => void update($, rough, () => value)}
          onSubmit={value => void rewriteFromPanel($, value)}
        />
        <Box flexDirection="row" gap={1}>
          <Button
            key="rewrite"
            variant="primary"
            label={isWorking ? 'Rewriting...' : '✨ Rewrite'}
            onPress={() => rewriteFromPanel($)}
          />
          <Button key="clear" label="Clear" dimColor onPress={() => clearPanel($)} />
        </Box>
        {improved !== null && (
          <Box flexDirection="column" gap={1}>
            <Text bold>Improved prompt</Text>
            <Text>{improved}</Text>
            <Box flexDirection="row" gap={1}>
              <Button key="use" variant="primary" label="Put in prompt box" onPress={() => sendResultToBox($)} />
              <Button key="copy" label="Copy" onPress={press => copyResult($, press.surface)} />
            </Box>
          </Box>
        )}
        {line !== null && <Text dimColor>{line}</Text>}
      </Box>
    )
  })

  // Forget the Undo copy once a prompt is sent.
  on('prompt.submit', async ($, e, next) => {
    void update($, original, () => null).catch(() => undefined)
    return next(e)
  })

  // The button row directly above the prompt box (terminal and desktop app).
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const isWorking = (await read($, status)) === 'working'
    const canUndo = (await read($, original)) !== null

    return (
      <Box flexDirection="row" gap={1}>
        <Button
          key="prompt-master"
          label={isWorking ? '✨ Rewriting...' : '✨ Prompt Master'}
          variant="primary"
          onPress={() => improveDraft($)}
        />
        {canUndo && !isWorking && (
          <Button key="prompt-master-undo" label="Undo" dimColor onPress={() => undo($)} />
        )}
        {isWorking && <Text dimColor>Improving your draft...</Text>}
      </Box>
    )
  })

  // /pm <rough prompt>: works on every surface, including the mobile app.
  on('command.run', { command: 'pm' }, async ($, e) => {
    const roughText = e.args.trim()
    if (!roughText) {
      await $.ui.open({ id: PANE, title: '✨ Prompt Master', focus: true })
      return { text: 'Prompt Master panel opened.', isTextDisplayOnly: true }
    }
    const out = await rewrite($, roughText)
    if ('error' in out) {
      return { text: `Prompt Master could not rewrite it (${out.error}).`, isTextDisplayOnly: true }
    }
    const filled = await $.prompt.fill({ text: out.text, mode: 'replace' })

    return {
      text: filled.isFilled
        ? 'Improved prompt is in your prompt box. Review it, then send.'
        : `Improved prompt (copy and send it):\n\n${out.text}`,
      isTextDisplayOnly: true,
    }
  })
}
