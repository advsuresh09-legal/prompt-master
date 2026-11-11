import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, scroll: { offset: 0, bodyRows: 10 } },
} as const

test('the button rewrites the draft, and Undo puts it back', async ($, on) => {
  let box = 'draft cnd to xyz for using my mark'
  const fills: string[] = []
  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    box = e.text
    fills.push(e.text)
    return { isFilled: true, text: box, cursor: box.length }
  })
  on('model.complete', () => ({
    value: { isAnswered: true, text: 'Draft a cease and desist notice to [XYZ].', usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
  }))
  on('ui.toast', () => ({ value: undefined }))

  for (const surface of ['terminal', 'desktop'] as const) {
    box = 'draft cnd to xyz for using my mark'
    const ui = await $.ui.mount({ ...BAND, surface } as any)
    await ui.press({ key: 'prompt-master' })
    expect(box).toBe('Draft a cease and desist notice to [XYZ].')
    await ui.press({ key: 'prompt-master-undo' })
    expect(box).toBe('draft cnd to xyz for using my mark')
    await ui.unmount()
  }
})

const PANE = {
  plugin: 'prompt-master',
  component: 'Pane',
  requestId: 'prompt-master',
  props: { title: '✨ Prompt Master', isFocused: false, bodyColumns: 50, placement: 'dock', scroll: { offset: 0, bodyRows: 30 }, view: {} },
} as const

test('the panel rewrites typed text on every app', async ($, on) => {
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('model.complete', () => ({
    value: { isAnswered: true, text: 'Better prompt.', usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } },
  }))
  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface } as any)
    await ui.press({ key: 'clear' })
    await ui.input({ key: 'rough', text: 'rough idea' })
    expect((await ui.find({ type: 'Text', text: /Better prompt/ }))?.text).toBe('Better prompt.')
    await ui.unmount()
  }
})
