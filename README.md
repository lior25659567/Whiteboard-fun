# Whiteboard-fun

An interactive tool to **practice whiteboard UX/UI exercises** for data-field
products in the spirit of **Microsoft Fabric** — lakehouses, pipelines, semantic
models, data quality, capacity admin, and more.

It mimics a live whiteboard interview:

1. **Setup** — pick a focus area, difficulty, and a timer length. Or **paste your
   own challenge** and let Claude generate a tailored brief + worked solution +
   sketch (needs an Anthropic API key, stored only in your browser).
2. **Active** — work a real Fabric-style prompt with a countdown timer, a 7-step
   UX framework checklist, and a sketch canvas (boxes, sticky notes, arrows,
   text, freehand pen). Export your sketch as PNG anytime.
3. **Review** — score yourself against a 5-criterion rubric and add notes.
4. **History** — every session is saved locally with its sketch thumbnail and
   score so you can watch your reps add up.

The built-in deck and all scoring run offline in the browser; sessions persist
via `localStorage`. The "bring your own challenge" feature is the only part that
calls the network — it talks to the Claude API directly using your own key
(model `claude-opus-4-8`), which never leaves your browser.

## Design system

The entire UI is built in the **Letters** design language from [`letters/`](letters/)
(`DESIGN.md`): pale-sky gradient bookends, near-white surfaces, one sky accent,
black primary pills, pill-rounded everything. Tokens live in
[`src/styles/tokens.css`](src/styles/tokens.css). Open Runde isn't bundled, so
**Manrope** (its documented substitute) is loaded from Google Fonts.

## Run it

```bash
npm install
npm run dev      # open the printed localhost URL
```

```bash
npm run build    # production build
npm run preview  # preview the build
```

## Stack

React + Vite, vanilla CSS (one file per component). No Tailwind, no UI library —
the whiteboard is a dependency-free custom SVG editor so it stays on-brand.

## Possible next steps

- Dark mode (tokens are structured for it; see `letters/DESIGN-DARK.md`)
- Optional live AI critique via the Claude API
- Inline (vs. prompt-based) text editing on the canvas
