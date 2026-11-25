import { expect, test } from 'claude-code/testing'

const USAGE = { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 }

const REPLY = `<improved>
Draft a cease and desist notice to [XYZ].
</improved>
<second lang="Tamil">
[XYZ]-க்கு ஒரு நிறுத்த அறிவிப்பை வரைவு செய்யவும்.
</second>`

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  props: { hasSurvey: false, isCollapsed: false, isWorking: false, maxRows: 10, scroll: { offset: 0, bodyRows: 10 } },
} as const

const PANE = {
  plugin: 'prompt-master',
  component: 'Pane',
  requestId: 'prompt-master',
  props: { title: '✨ Prompt Master', isFocused: false, bodyColumns: 50, placement: 'dock', scroll: { offset: 0, bodyRows: 40 }, view: {} },
} as const

test('the button puts the English prompt in the box, the Tamil one in the panel, and Undo restores', async ($, on) => {
  let box = 'draft cnd to xyz for using my mark'
  on('prompt.read', () => ({ value: { text: box, cursor: box.length } }))
  on('prompt.fill', (_, e) => {
    box = e.text
    return { isFilled: true, text: box, cursor: box.length }
  })
  on('model.complete', () => ({ value: { isAnswered: true, text: REPLY, usage: USAGE } }))
  on('ui.toast', () => ({ value: undefined }))
  on('ui.open', () => ({ value: { isPlaced: true } }))

  for (const surface of ['terminal', 'desktop'] as const) {
    box = 'draft cnd to xyz for using my mark'
    const band = await $.ui.mount({ ...BAND, surface } as any)
    await band.press({ key: 'prompt-master' })
    expect(box).toBe('Draft a cease and desist notice to [XYZ].')

    const pane = await $.ui.mount({ ...PANE, surface } as any)
    expect((await pane.find({ type: 'Text', text: /Tamil version/ }))?.text).toBe('Tamil version')
    expect((await pane.find({ type: 'Text', text: /நிறுத்த/ }))?.text).toBe('[XYZ]-க்கு ஒரு நிறுத்த அறிவிப்பை வரைவு செய்யவும்.')
    await pane.press({ key: 'use-second' })
    expect(box).toBe('[XYZ]-க்கு ஒரு நிறுத்த அறிவிப்பை வரைவு செய்யவும்.')
    await pane.unmount()

    await band.press({ key: 'prompt-master-undo' })
    expect(box).toBe('draft cnd to xyz for using my mark')
    await band.unmount()
  }
})

test('the panel shows both versions on every app', async ($, on) => {
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('model.complete', () => ({ value: { isAnswered: true, text: REPLY, usage: USAGE } }))
  for (const surface of ['terminal', 'desktop', 'vscode', 'mobile'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface } as any)
    await ui.press({ key: 'clear' })
    await ui.input({ key: 'rough', text: 'rough idea' })
    expect((await ui.find({ type: 'Text', text: /cease and desist/ }))?.text).toBe('Draft a cease and desist notice to [XYZ].')
    expect((await ui.find({ type: 'Text', text: /நிறுத்த/ }))).toBeTruthy()
    await ui.unmount()
  }
})

test('a reply without the blocks is used whole, with no second version', async ($, on) => {
  on('prompt.read', () => ({ value: { text: '', cursor: 0 } }))
  on('model.complete', () => ({ value: { isAnswered: true, text: 'Just a better prompt.', usage: USAGE } }))
  const ui = await $.ui.mount({ ...PANE, surface: 'desktop' } as any)
  await ui.press({ key: 'clear' })
  await ui.input({ key: 'rough', text: 'rough idea' })
  expect((await ui.find({ type: 'Text', text: /Just a better prompt/ }))?.text).toBe('Just a better prompt.')
  expect(await ui.find({ type: 'Text', text: /version$/ })).toBeFalsy()
  await ui.unmount()
})
