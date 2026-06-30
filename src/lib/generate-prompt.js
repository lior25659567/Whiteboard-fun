import Anthropic from '@anthropic-ai/sdk'

// Generates a tailored practice brief + worked solution from a custom whiteboard
// challenge, by calling the Claude API directly from the browser with the user's
// own key. The key is stored only in this browser (localStorage).

const KEY_STORAGE = 'whiteboard-fun:anthropic-key'

export const getApiKey = () => {
  try {
    return window.localStorage.getItem(KEY_STORAGE) || ''
  } catch {
    return ''
  }
}

export const setApiKey = (key) => {
  try {
    if (key) window.localStorage.setItem(KEY_STORAGE, key)
    else window.localStorage.removeItem(KEY_STORAGE)
  } catch {
    /* ignore storage errors */
  }
}

const KINDS = ['box', 'btn', 'note', 'kpi', 'chart', 'line', 'list', 'nav', 'field', 'tab', 'tag', 'avatar', 'image']
const HEIGHTS = ['', 'short', 'tall', 'xtall']
const DIFFICULTIES = ['warmup', 'core', 'stretch']

// A strict tool schema — every property required (sentinel empties for the
// optional sketch fields), so the model returns a fully-validated object.
const TOOL = {
  name: 'whiteboard_brief',
  description: 'Return the structured whiteboard practice brief and worked solution.',
  strict: true,
  input_schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      context: { type: 'string', description: 'Short domain/surface label, e.g. "Microsoft Fabric · Lakehouse".' },
      title: { type: 'string' },
      scenario: { type: 'string' },
      primaryUser: { type: 'string' },
      constraints: { type: 'array', items: { type: 'string' } },
      difficulty: { type: 'string', enum: DIFFICULTIES },
      steps: {
        type: 'object',
        additionalProperties: false,
        properties: {
          scope: { type: 'string' },
          users: { type: 'string' },
          tasks: { type: 'string' },
          ia: { type: 'string' },
          screen: { type: 'string' },
          states: { type: 'string' },
          metrics: { type: 'string' },
        },
        required: ['scope', 'users', 'tasks', 'ia', 'screen', 'states', 'metrics'],
      },
      sketch: {
        type: 'object',
        additionalProperties: false,
        properties: {
          caption: { type: 'string' },
          blocks: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: false,
              properties: {
                band: { type: 'string', description: 'Title-bar text. Empty if this block is a row.' },
                h: { type: 'string', enum: HEIGHTS },
                row: {
                  type: 'array',
                  items: {
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      t: { type: 'string' },
                      k: { type: 'string', enum: KINDS },
                      w: { type: 'number' },
                    },
                    required: ['t', 'k', 'w'],
                  },
                },
              },
              required: ['band', 'h', 'row'],
            },
          },
        },
        required: ['caption', 'blocks'],
      },
    },
    required: ['context', 'title', 'scenario', 'primaryUser', 'constraints', 'difficulty', 'steps', 'sketch'],
  },
}

const SYSTEM = `You are a UX interview coach. Given a whiteboard design challenge, produce a structured practice brief and a fully worked solution by calling the whiteboard_brief tool.

Audience: a designer practising whiteboard interviews, often for data products (think Microsoft Fabric / Power BI — lakehouses, pipelines, dashboards, governance), but adapt to whatever the challenge is actually about.

Write in plain, concrete, everyday language — no buzzwords. Be specific to THIS challenge, not generic.

Fields:
- context: a short label naming the domain or surface, e.g. "Microsoft Fabric · Lakehouse" or "Mobile banking · Onboarding".
- title: a short, plain title for the exercise.
- scenario: 2–4 sentences restating the design problem concretely.
- primaryUser: the one person it's for and what they're trying to get done.
- constraints: 3 short, real constraints or pain points.
- difficulty: "warmup" (simple, one screen), "core" (typical), or "stretch" (ambiguous or complex).
- steps: a worked answer for each of the seven whiteboard steps — about 2 sentences each, specific to this challenge:
  - scope: restate the problem and name the key questions to clarify first.
  - users: the one user and the single job they're hiring the UI for.
  - tasks: the main path the user takes start to finish, and the one step that matters most.
  - ia: how to block out the screen — regions, hierarchy, what should stand out.
  - screen: the real, concrete content of the key screen.
  - states: the empty / loading / error / no-access / large-scale states that make or break it.
  - metrics: a couple of concrete signs it's working.
- sketch: a low-fidelity wireframe of the key screen.
  - caption: a short caption.
  - blocks: an ordered list. Each block is EITHER a title bar (put the text in "band", leave "row" empty, "h" = "") OR a row of cells (leave "band" = "", put cells in "row"). For a row you may set "h" to "short", "tall", or "xtall" (otherwise "").
  - Each cell has: t (short label text), k (kind), w (relative width, usually 1).
  - kinds: "box" (plain), "btn" (button), "note" (callout), "kpi" (big number), "chart" (bar chart), "line" (line chart), "list" (list/rows), "nav" (nav items), "field" (input or dropdown), "tab" (tab/chip), "tag" (small chip), "avatar" (person), "image" (image placeholder).
  - Build a realistic screen: about 4–6 blocks, mixing a title bar, primary actions, and content. Keep every label short.

Always fill every field.`

// Convert the model's permissive sketch shape into the app's block grammar.
const toBlocks = (blocks) =>
  (blocks || [])
    .map((b) => {
      if (b.band && b.band.trim()) return { band: b.band }
      const row = (b.row || [])
        .map((c) => ({ t: c.t || '', k: KINDS.includes(c.k) ? c.k : 'box', w: typeof c.w === 'number' ? c.w : 1 }))
      if (row.length === 0) return null
      const block = { row }
      if (['short', 'tall', 'xtall'].includes(b.h)) block.h = b.h
      return block
    })
    .filter(Boolean)

const toPrompt = (data) => ({
  id: `custom-${Date.now().toString(36)}`,
  category: 'custom',
  difficulty: DIFFICULTIES.includes(data.difficulty) ? data.difficulty : 'core',
  context: data.context || 'Your challenge',
  title: data.title || 'Your challenge',
  scenario: data.scenario || '',
  primaryUser: data.primaryUser || '',
  constraints: Array.isArray(data.constraints) && data.constraints.length ? data.constraints : ['(no constraints given)'],
  solution: {
    steps: data.steps || {},
    sketches: [{ caption: data.sketch?.caption || 'Suggested layout', blocks: toBlocks(data.sketch?.blocks) }],
  },
  custom: true,
})

// Call Claude to turn a free-text challenge into a full practice prompt.
export const generateCustomPrompt = async (challenge, apiKey) => {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  let message
  try {
    message = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 4000,
      system: SYSTEM,
      tools: [TOOL],
      tool_choice: { type: 'tool', name: TOOL.name },
      messages: [
        {
          role: 'user',
          content: `Here is the whiteboard challenge:\n\n"""${challenge.trim()}"""\n\nProduce the structured practice brief and worked solution.`,
        },
      ],
    })
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) throw new Error('That API key was rejected — double-check it.')
    if (err instanceof Anthropic.RateLimitError) throw new Error('Rate limited by the API — wait a moment and try again.')
    if (err instanceof Anthropic.APIConnectionError) throw new Error('Couldn’t reach the API — check your connection.')
    throw new Error(err?.message || 'Something went wrong generating the challenge.')
  }

  const toolUse = message.content.find((b) => b.type === 'tool_use')
  if (!toolUse) throw new Error('The model didn’t return a usable brief — try rephrasing your challenge.')
  return toPrompt(toolUse.input)
}
