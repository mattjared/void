# Void

A minimal note-taking app. Use it as a website or load it as a Chrome extension that replaces your new tab page.

Notes are saved automatically — in the extension via `chrome.storage`, and on the website via `localStorage`.

## Features

- Distraction-free textarea, full viewport
- Notes persist across sessions
- Character count
- Export to Obsidian (opens a new note and clears the pad)
- Rotating placeholder prompts every 3 seconds

---

## Using as a Website

```
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

---

## Installing as a Chrome Extension (local / unpacked)

The extension replaces your new tab page with Void.

### Step 1 — Build the extension

```bash
node scripts/build-extension.js
```

This copies the extension files into `chrome-extension-build/` and bumps the version number.

### Step 2 — Load it in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **Developer mode** on (top-right corner)
3. Click **Load unpacked**
4. Select the `chrome-extension-build/` folder inside this project
5. Open a new tab — Void is now your new tab page

### Updating after changes

After editing `script.js`, `styles.css`, or `index.html`:

1. Run `node scripts/build-extension.js` again
2. Go to `chrome://extensions/`
3. Click the **refresh icon** on the Void card (or toggle it off and back on)
4. Open a new tab to see the changes

### Removing the extension

Go to `chrome://extensions/`, find Void, and click **Remove**.

---

## Project structure

```
/
├── index.html              # Extension HTML (new tab page)
├── script.js               # Extension JS (chrome.storage + localStorage fallback)
├── styles.css              # Extension styles
├── manifest.json           # Chrome extension manifest (MV3)
├── chrome-extension-build/ # Built extension — load this folder into Chrome
├── app/                    # Next.js website version
└── scripts/
    └── build-extension.js  # Build script (copies files, bumps version)
```
