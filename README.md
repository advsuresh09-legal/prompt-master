# Prompt Master

A Claude Code plugin that rewrites a rough prompt into a clear, complete one before you send it.

- It keeps your facts and your language (Tamil, English or a mix).
- It never invents details. Where something important is missing, it adds a placeholder like `[client name]`.
- For legal and business work, it asks for statute sections, rules and case citations, and asks Claude to flag anything it is not sure of.
- It also gives a **Tamil version** of every improved prompt. If you write your rough prompt in Tamil, it gives an **English version** instead.

## What you need

- The Claude desktop app (Mac or Windows) or Claude Code in a terminal, signed in to your Claude account.
- An internet connection. No GitHub sign-in is needed, because this repository is public.

Prompt Master runs only in **local** sessions, which run on your own computer. It does not run in cloud sessions or in the mobile app.

## Install (recommended)

This method works on personal and Enterprise accounts, and on Mac and Windows.

1. Open the Claude desktop app and click **Code** in the left sidebar.
2. Start a new session. Make sure **This computer** is selected, not a cloud option.
3. Click **Choose a folder to work in** and pick any folder, for example Downloads. Prompt Master does not read or change your files.
4. In the prompt box, type this and press Enter:

   ```
   /plugin install prompt-master --marketplace advsuresh09-legal/prompt-master
   ```

5. Answer `y` to add the marketplace, then choose **User** so it works in every session.
6. Start a **new** session on **This computer** and send a first message such as `hi`. Plugins load only when a session starts.

You should now see the **✨ Prompt Master** button above the prompt box and the Prompt Master panel on the right.

If you use Claude Code in a terminal, type the same `/plugin install` line at the Claude prompt.

## Install from Settings (personal accounts)

1. Go to **Settings → Customize → Plugins**.
2. Click **+ Add → Add marketplace**, enter `advsuresh09-legal/prompt-master` and click **Sync**. Wait until the window closes by itself.
3. Click **Discover**, find **Prompt master** and click **Add**.
4. Start a new local session as in steps 1 to 3 and 6 above.

On Enterprise accounts this option may be hidden. Use the recommended method instead.

## Enterprise accounts

- **Use the `/plugin install` command.** Uploading the plugin to the organisation library (Organization settings → Plugins & skills) made it show as installed, but its button did not load in local sessions on Windows. The `/plugin install` command fixed this.
- If you installed it both ways, remove one copy in **Settings → Customize → Plugins → Yours → ⋯ → Remove**, so you do not have two.
- Your organisation's Claude Code managed settings can block it. If the install says **blocked by enterprise policy**, or the plugin installs but `/pm` is not recognised, ask an admin to check **Organization settings → Claude Code → Managed settings** for:
  - `strictKnownMarketplaces` or `blockedMarketplaces`: the approved list must allow `advsuresh09-legal/prompt-master`.
  - `enabledPlugins`: `prompt-master` must not be set to `false`.
  - `allowManagedHooksOnly` or `disableAllHooks`: when either is `true`, the plugin's button cannot run.

## Use

- **Button:** type your rough prompt in the main box, then click **✨ Prompt Master** above it. Your draft is replaced with the improved prompt, and the Tamil version appears in the panel on the right. Read it, edit if needed, then send. Click **Undo** to get your original back.
- **Panel:** type or paste a rough prompt in the panel on the right and press **Rewrite**. The panel shows the improved prompt and its Tamil version. Each has its own **Put in prompt box** and **Copy** buttons, so you can send either one. Press **Clear** to start again.
- **Command:** type `/pm` followed by your rough prompt. The improved prompt goes into your prompt box and the Tamil version is shown in the chat. `/pm` on its own opens the panel.

Only one version goes into the prompt box at a time, so you never send the same request twice.

Each rewrite is one short call to Claude Sonnet, billed to your Claude account.

## Update to the latest version

When a new version is published here, update each computer once:

1. Open a local session on **This computer**.
2. Ask Claude: `Run "claude plugin marketplace update prompt-master" and then "claude plugin update prompt-master@prompt-master", and tell me the result.`
3. Quit and reopen the Claude desktop app, then start a new session.

## If something goes wrong

| What you see | What to do |
|---|---|
| No button and no panel | Check that the session runs on **This computer**, start a new session, and send a first message. |
| `/pm isn't a command` | The plugin's code is not loading. Install with the `/plugin install` command above, then start a new session. |
| "Failed to add marketplace" | Check the spelling `advsuresh09-legal/prompt-master` and your internet connection. |
| "blocked by enterprise policy" | Ask your admin to allow this marketplace (see Enterprise accounts). |
| Two Prompt Masters in the list | Remove one in **Settings → Customize → Plugins → Yours → ⋯ → Remove**. |
| No Tamil version in the panel | Update to the latest version (see above), then start a new session. |
| Missing in a cloud session or on your phone | Expected. Prompt Master runs only in local sessions. |

## Remove

Go to **Settings → Customize → Plugins → Yours**, click **⋯** next to Prompt master and choose **Remove**.
