export type PromptMasterStatus = 'idle' | 'working'

// The same improved prompt in the second language: Tamil, or English when the
// rough prompt was written in Tamil.
export type SecondVersion = { label: 'Tamil' | 'English'; text: string }

declare module 'claude-code' {
  interface PluginState {
    'prompt-master': {
      status: Shaped<PromptMasterStatus>
      // The draft as it was before the last rewrite, so Undo can put it back.
      original: Shaped<string | null>
      // What the person typed into the panel's own field.
      rough: Shaped<string>
      // The last improved prompt, shown in the panel.
      result: Shaped<string | null>
      // The last improved prompt in the second language, shown in the panel.
      second: Shaped<SecondVersion | null>
      // A short line the panel shows under the buttons.
      note: Shaped<string | null>
    }
  }
}
