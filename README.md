# Prompt Master

A Claude Code mod that rewrites a rough prompt into a clear, complete one before you send it. It keeps your facts and your language (Tamil, English or a mix), never invents details, and adds placeholders like `[client name]` where something important is missing. For legal and business work it asks for sections, rules and case citations.

## Install

In a local Claude Code session (terminal, or a local session in the Claude desktop app), type:

```
/plugin install prompt-master --marketplace advsuresh09-legal/prompt-master
```

Answer `y` to add the marketplace, then pick a scope (User keeps it in every session).

This repository is private, so your computer must be signed in to GitHub with access to it.

## Use

- **Button:** type your rough prompt, then press **✨ Prompt Master** in the strip above the prompt box. Press **Undo** to get your draft back.
- **Panel:** the **✨ Prompt Master** panel opens beside the chat. Type or paste a rough prompt, press **Rewrite**, then **Put in prompt box** or **Copy**.
- **Command:** `/pm <your rough prompt>` rewrites it. `/pm` alone opens the panel.

Each rewrite is one short call to Sonnet, billed to your Claude account.
