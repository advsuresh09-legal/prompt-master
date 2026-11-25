# Prompt Master

A Claude Code plugin that rewrites a rough prompt into a clear, complete one before you send it.

- It keeps your facts and your language (Tamil, English or a mix).
- It never invents details. Where something important is missing, it adds a placeholder like `[client name]`.
- For legal and business work, it asks for statute sections, rules and case citations, and asks Claude to flag anything it is not sure of.

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

- **Button:** type your rough prompt in the main box, then click **✨ Prompt Master** above it. Your draft is replaced with the improved prompt. Read it, edit if needed, then send. Click **Undo** to get your original back.
- **Panel:** type or paste a rough prompt in the panel on the right, press **Rewrite**, then **Put in prompt box** or **Copy**. Press **Clear** to start again.
- **Command:** type `/pm` followed by your rough prompt. `/pm` on its own opens the panel.

Each rewrite is one short call to Claude Sonnet, billed to your Claude account.

## If something goes wrong

| What you see | What to do |
|---|---|
| No button and no panel | Check that the session runs on **This computer**, start a new session, and send a first message. |
| `/pm isn't a command` | The plugin's code is not loading. Install with the `/plugin install` command above, then start a new session. |
| "Failed to add marketplace" | Check the spelling `advsuresh09-legal/prompt-master` and your internet connection. |
| "blocked by enterprise policy" | Ask your admin to allow this marketplace (see Enterprise accounts). |
| Two Prompt Masters in the list | Remove one in **Settings → Customize → Plugins → Yours → ⋯ → Remove**. |
| Missing in a cloud session or on your phone | Expected. Prompt Master runs only in local sessions. |

## Remove

Go to **Settings → Customize → Plugins → Yours**, click **⋯** next to Prompt master and choose **Remove**.
