export type PromptMasterStatus = 'idle' | 'working'

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
      // A short line the panel shows under the buttons.
      note: Shaped<string | null>
    }
  }
}
