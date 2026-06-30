// Whiteboard prompt deck — UX challenges set in the world of Microsoft Fabric
// (and the Power BI tools inside it). Each brief names the real Fabric surface
// but glosses it in plain, everyday language. Every prompt ships a full worked
// solution whose `steps` work through the SAME seven best-practice whiteboard
// steps shown in the sidebar (keyed by id), in detail — restate & clarify,
// users & their job, the main path, the layout, the key screen, the tricky
// states, and how you'd measure success — plus detailed lo-fi `sketches`.
//
// solution.steps keys (match FRAMEWORK_STEPS ids): scope·users·tasks·ia·screen·states·metrics
// Sketch grammar (see components/sketch-preview.jsx):
//   { band }  { row:[cell,...], h }   cell = 'label' | { t, k, w }
//   k: btn|note|kpi|chart|line|list|nav|field|tab|tag|avatar|image   w: column weight

export const CATEGORIES = [
  { id: 'all', label: 'Surprise me' },
  { id: 'engineering', label: 'Getting data ready' },
  { id: 'quality', label: 'Trust & quality' },
  { id: 'analytics', label: 'Charts & dashboards' },
  { id: 'exploration', label: 'Exploring data' },
  { id: 'admin', label: 'Setup & access' },
]

export const DIFFICULTIES = [
  { id: 'all', label: 'Any level' },
  { id: 'warmup', label: 'Warm-up' },
  { id: 'core', label: 'Core' },
  { id: 'stretch', label: 'Stretch' },
]

export const PROMPTS = [
  // ---------- Getting data ready ----------
  {
    id: 'eng-lakehouse-empty',
    category: 'engineering',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Lakehouse',
    title: 'A brand-new, empty Lakehouse',
    scenario:
      'In Microsoft Fabric, someone just created a new Lakehouse — a place to keep their tables and files together. Right now it’s completely empty: no tables, no files, nothing. Design what they see the first time they open it.',
    primaryUser: 'A data engineer starting a new project who needs to get data in',
    constraints: [
      'Nothing is in here yet — don’t leave them staring at a blank page',
      'A few ways to add data: upload a file, build a pipeline, use a notebook, or make a shortcut',
      'They should grasp the two buckets a Lakehouse holds: tidy Tables vs. loose Files',
    ],
    solution: {
      steps: {
        scope:
          'Restate it: a Lakehouse that is empty on first open, and the job is to move the person from “nothing here” to “my data is in here” as fast as possible. Before drawing, ask what matters most — how technical they are, what kind of data they usually start with, and whether there’s a sample they could play with so the screen isn’t a dead end.',
        users:
          'One data engineer kicking off a fresh project. The single thing they want right now is to get data in and watch it appear — not to learn what every menu does — so the design should remove decisions, not add them.',
        tasks:
          'Walk the happy path: land on the empty space → choose a way to add data → watch it import → see the first table listed. The make-or-break step is choosing how to add data, so make the most common route (upload or pipeline) the biggest, most obvious option and tuck the rest behind it.',
        ia:
          'Block the screen top to bottom: a friendly title and a one-line “it’s empty, here’s what to do”; then one primary “Get data” action with two or three alternates beside it; then a faint preview of the Tables-vs-Files structure so they learn the model before it fills. The primary action should clearly out-weigh everything else.',
        screen:
          'Draw it with real content: two labelled drop areas (“Tables — rows & columns” and “Files — anything else”), a bold “＋ Get data” button, a row of routes (upload / pipeline / notebook), and a low-key “try a sample dataset” so they can explore risk-free before committing real data.',
        states:
          'This screen IS the empty state, so also design the moments around it: an import in progress with a clear progress hint, an import that fails with a plain reason and a retry, and the payoff when the first table lands (confirm it and point them straight to it). Don’t forget a large upload that takes a while.',
        metrics:
          'Track activation — the share of new lakehouses that get their first table — and time-to-first-table. Watch how many people open the empty screen and leave without adding anything; that bounce is the number to drive down.',
      },
      sketches: [
        {
          caption: 'The empty Lakehouse on first open',
          blocks: [
            { band: 'Lakehouse' },
            { row: [{ t: 'It’s empty in here — let’s add your first data', k: 'note' }] },
            { row: [{ t: '＋ Get data', k: 'btn', w: 1.4 }, { t: 'Try a sample', k: 'btn', w: 1 }] },
            { row: ['Upload a file', 'Build a pipeline', 'Use a notebook'] },
            { row: [{ t: 'Tables (rows & columns)', k: 'list', w: 1 }, { t: 'Files (anything else)', k: 'list', w: 1 }], h: 'tall' },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-dataflow-fail',
    category: 'engineering',
    difficulty: 'core',
    context: 'Microsoft Fabric · Data pipelines',
    title: 'A nightly pipeline broke',
    scenario:
      'In Microsoft Fabric, a pipeline runs every night to copy and clean up data. Last night it stopped with an error. Design the screen someone opens in the morning to find out what went wrong and fix it.',
    primaryUser: 'The data engineer who looks after that pipeline',
    constraints: [
      'The pipeline has lots of steps, and any one of them could be the culprit',
      'They need the actual reason it broke, not just a red “failed”',
      'After fixing it, they want to re-run — ideally just the part that broke',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: an automated nightly pipeline failed, and the goal is to get the owner from “something broke” to “it’s running again” quickly. Clarify what matters most — do they need the exact failing step and reason, can they re-run just part of it, and how urgent is downstream impact?',
        users:
          'The pipeline’s owner, opening this first thing with a bit of pressure because reports depend on it. Their one job is to diagnose the cause and recover, ideally before colleagues notice the data is stale.',
        tasks:
          'Trace the path: open the failed run → read what broke and why → jump to the offending step → fix or re-run from there. The pivotal moment is understanding the cause, so the screen must answer “which step and why” before anything else.',
        ia:
          'Lead with an error summary banner at the top. Below it, two panes: the list of steps on the left (the broken one clearly marked) and the selected step’s details and log on the right. Put recovery actions along the bottom so the fix is always in reach.',
        screen:
          'Fill it in: “Step 7 failed — a column it expected was missing”, the step list with 7 flagged red, the actual error text plus a peek at the log, and clear buttons to re-run from step 7, edit the step, or open the full log.',
        states:
          'Design the neighbours of failure too: a run that’s still in progress, one that succeeded (quiet confirmation), and a partly-done run. When the cause is ambiguous, fall back to surfacing the raw logs rather than a vague message.',
        metrics:
          'Measure time-to-recovery (opening the screen → a successful re-run) and the share of failures fixed without escalating to someone else. A drop in “how do I read this error?” support questions is a good qualitative signal.',
      },
      sketches: [
        {
          caption: 'The pipeline run-detail when it fails',
          blocks: [
            { band: 'Pipeline run · stopped with an error' },
            { row: [{ t: '✕ Step 7 failed — a column it expected was missing', k: 'note' }] },
            { row: [{ t: 'Steps (7 marked red)', k: 'list', w: 1 }, { t: 'Details of step 7 + log', k: 'list', w: 1.3 }], h: 'xtall' },
            { row: [{ t: '↻ Re-run from step 7', k: 'btn', w: 1.3 }, { t: 'Edit step 7', k: 'btn', w: 1 }, 'Full log'] },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-pipeline-runs',
    category: 'engineering',
    difficulty: 'core',
    context: 'Microsoft Fabric · Pipeline monitoring',
    title: 'A pipeline’s run history',
    scenario:
      'A Microsoft Fabric pipeline runs every hour. Design the monitoring screen that shows its recent run history, so someone can spot when it tends to fail and dig into any single run.',
    primaryUser: 'A data engineer keeping an eye on whether a pipeline is healthy',
    constraints: [
      'Hundreds of runs pile up over weeks — it has to stay easy to scan',
      'Each run has a time, how long it took, whether it worked, and how much it handled',
      'A pattern of failures matters more than one bad run',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a pipeline runs constantly, and we need a view that makes its health obvious and lets someone drill into any single run. Ask what matters — are they hunting for a flaky pattern, a one-off failure, or a slow creep in run time?',
        users:
          'A caretaker who checks in between other work and just wants to answer “is this still healthy?” at a glance. They only stop to investigate when something looks off.',
        tasks:
          'Main path: scan the recent picture → notice a cluster of trouble → open the specific run that needs attention. The key moment is the scan, so the top of the screen has to reveal patterns instantly without reading every row.',
        ia:
          'Top: a compact health strip across time. Middle: quick filters defaulting to “needs attention”. Below: a scannable list of runs, where any row opens its detail without losing your place.',
        screen:
          'Draw a strip of status dots over time so red clusters jump out, filter chips (needs attention / all / last 7 days), and a list showing time · duration · result · rows handled per run.',
        states:
          'Handle the edges: a brand-new pipeline with no runs yet (explain what will appear), an all-green history (reassure, nothing to do), and a long failing streak (make it impossible to miss). Show a slow-but-passing trend as a soft warning.',
        metrics:
          'Track time-to-detect a failing pattern and the share of incidents the owner catches here before someone downstream reports it. Fewer “why is the data stale?” pings means the monitor is doing its job.',
      },
      sketches: [
        {
          caption: 'Run history at a glance',
          blocks: [
            { band: 'Pipeline runs · last 200' },
            { row: [{ t: 'Status over time — red clusters jump out', k: 'chart' }], h: 'tall' },
            { row: [{ t: 'Needs attention', k: 'tab' }, { t: 'All', k: 'tab' }, { t: 'Last 7 days', k: 'tab' }] },
            { row: [{ t: 'Runs — time · how long · result · rows', k: 'list' }], h: 'xtall' },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-notebook-attach',
    category: 'engineering',
    difficulty: 'core',
    context: 'Microsoft Fabric · Notebooks',
    title: 'Browse Lakehouse data while coding',
    scenario:
      'In a Microsoft Fabric notebook, someone is writing code to work with data. Design the side panel that lets them browse the Lakehouse tables and pull one into their code, without leaving the page.',
    primaryUser: 'A data engineer who codes and needs to see the data alongside it',
    constraints: [
      'The notebook code is the main thing — the data browser is a helper on the side',
      'Some tables have a huge number of columns',
      'They want to see the columns and a few example rows before writing anything',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a companion panel inside a code notebook for browsing tables and grabbing one without breaking flow. Clarify what matters — is it a quick peek at columns, example rows, or also being able to insert working code?',
        users:
          'A data engineer mid-flow in their notebook. The one thing they want is to confirm a table’s shape and pull it in without switching context and losing their train of thought.',
        tasks:
          'Main path: find the table → check its columns and a few example rows → drop it into the code at the cursor. The decisive step is “see enough to trust it” before they write a line.',
        ia:
          'Keep code dominant: a collapsible panel pinned to the right that never crowds the editor. Inside it: search at the top, a table list, then the selected table’s columns and a row preview, with the insert action at the bottom.',
        screen:
          'Fill it: a search field, a short list (orders · customers · products), the columns plus three example rows, and an “＋ Add to code” button that drops a ready-to-run read snippet where the cursor is.',
        states:
          'Cover the hard cases: no tables yet (point them to add data), a very wide table with hundreds of columns (search within columns, don’t endless-scroll), and a table still loading its preview.',
        metrics:
          'Measure how often people use the panel versus leaving the notebook, and time from opening it to a first working query. If they stop tab-switching to another window, it’s working.',
      },
      sketches: [
        {
          caption: 'Notebook on the left, Lakehouse helper on the right',
          blocks: [
            { band: 'Notebook' },
            { row: [{ t: 'Your code', k: 'list', w: 1.7 }, { t: '🔍 Search tables', k: 'field', w: 1 }], h: 'tall' },
            { row: ['', { t: 'orders · customers · products', k: 'nav', w: 1 }], h: 'tall' },
            { row: ['', { t: 'Columns + 3 example rows', k: 'list', w: 1 }] },
            { row: ['', { t: '＋ Add to code', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-shortcut',
    category: 'engineering',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · OneLake shortcuts',
    title: 'A shortcut to data elsewhere',
    scenario:
      'Microsoft Fabric lets you create a shortcut — a link to data kept somewhere else (another lakehouse, or an outside store) so it shows up here without making a copy. Design that setup flow. The tricky part is making “this is a link, not a copy” crystal clear.',
    primaryUser: 'A data engineer pulling together data from a few different places',
    constraints: [
      'People assume it copies the data — it doesn’t, and that matters',
      'The other place usually needs a sign-in to connect',
      'They should see where the shortcut will appear before they finish',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a flow to create a link to data that lives elsewhere, with no copy made — and the whole challenge is making that mental model unmistakable. Ask what matters most: do users worry about storage cost, duplication, or stale copies?',
        users:
          'A data engineer unifying scattered sources. Their job is to make outside data appear here while staying 100% sure nothing was duplicated or moved.',
        tasks:
          'Main path: pick the source → sign in → choose exactly what to link → name it and place it. The crucial step is the conceptual one: every screen must reinforce “pointer, not copy”.',
        ia:
          'A short stepped flow with a persistent reminder banner (“lives over there, we just point to it”) and, before the final confirm, a preview of where the shortcut will land in their tree.',
        screen:
          'Draw it: stepper (source → sign in → pick → place), the “no copy” reminder, a picker for what to link, and a preview showing the new shortcut slotting into their Lakehouse — then a single “Create shortcut”.',
        states:
          'Design failure and time: a sign-in that fails, a source that becomes unreachable later (a broken shortcut — show it clearly and offer to reconnect), and a name that clashes with something existing.',
        metrics:
          'Track shortcut creation success rate and, as a trust signal, how rarely people ask “did this copy my data?” afterwards. Broken-shortcut recovery rate matters over time.',
      },
      sketches: [
        {
          caption: 'Step-by-step shortcut setup',
          blocks: [
            { band: 'New OneLake shortcut' },
            { row: [{ t: '1 Source', k: 'tab' }, { t: '2 Sign in', k: 'tab' }, { t: '3 Pick', k: 'tab' }, { t: '4 Place', k: 'tab' }] },
            { row: [{ t: '🔗 Lives over there — we only point to it, no copy', k: 'note' }] },
            { row: [{ t: '🔍 Choose what to link', k: 'field' }] },
            { row: [{ t: 'Preview: it will appear here in your Lakehouse', k: 'list' }], h: 'tall' },
            { row: [{ t: 'Create shortcut', k: 'btn' }] },
          ],
        },
      ],
    },
  },

  // ---------- Trust & quality ----------
  {
    id: 'qual-monitor',
    category: 'quality',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Data quality',
    title: 'Catch bad data across many tables',
    scenario:
      'A Microsoft Fabric lakehouse holds 200+ tables. Design a data-quality screen that flags the ones with problems — stale data, too many blanks, sudden drops in rows — so someone knows what to fix first.',
    primaryUser: 'The person responsible for keeping the data trustworthy',
    constraints: [
      'Hundreds of tables — a plain long list is useless',
      'Problems come in different flavours: out of date, missing values, sudden changes',
      'They need to triage by how serious and how important, not just pass/fail',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: among 200+ tables, surface the ones with problems and make it obvious what to fix first. Ask what matters — which checks count (freshness, blanks, volume), and does business importance outrank raw severity?',
        users:
          'The data steward who owns trust in the data. Their one job each morning is to spend limited time on the issues that actually matter, not chase every yellow flag.',
        tasks:
          'Main path: read the overall health → open the worst problems first → jump to the owning table to fix it. The pivotal step is triage: ranking the right thing to the top.',
        ia:
          'Top: a small health summary (a few big numbers). Middle: filters by problem type. Below: a list ordered by serious-and-important, each row linking to its table and a clear action.',
        screen:
          'Fill it: KPIs (92% healthy · 11 broken now · 6 trending bad), filter chips (serious / stale / blanks / drops), and a worst-first list showing table · what’s wrong · how important, with “Open table”, mute and assign.',
        states:
          'Cover the extremes: everything healthy (reassure, nothing urgent), a flood of failures (group and prioritise rather than overwhelm), and the difference between “broken right now” and “slowly degrading”.',
        metrics:
          'Track time-to-fix for serious problems and the share of issues caught here before a consumer complains. A shrinking backlog of unaddressed flags is the headline measure.',
      },
      sketches: [
        {
          caption: 'Health overview that drills into problems',
          blocks: [
            { band: 'Data quality · 217 tables' },
            { row: [{ t: '92% healthy', k: 'kpi' }, { t: '11 broken now', k: 'kpi' }, { t: '6 trending bad', k: 'kpi' }] },
            { row: [{ t: 'Serious', k: 'tab' }, { t: 'Stale', k: 'tab' }, { t: 'Blanks', k: 'tab' }, { t: 'Drops', k: 'tab' }] },
            { row: [{ t: 'Worst first — table · what’s wrong · how important', k: 'list' }], h: 'xtall' },
            { row: [{ t: 'Open table', k: 'btn', w: 1 }, 'Mute', 'Assign'] },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-lineage',
    category: 'quality',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Lineage',
    title: 'See what feeds and depends on a table',
    scenario:
      'Design Microsoft Fabric’s lineage view: it shows where a table’s data comes from and which reports rely on it, so someone can tell what would break if they change it.',
    primaryUser: 'A data engineer about to change a table and worried what it affects',
    constraints: [
      'These lineage maps get huge and tangled very fast',
      'Both directions matter: where it comes from, and what uses it',
      'The real question is “what breaks if I change this?”',
    ],
    solution: {
      steps: {
        scope:
          'Restate: show what feeds a table and what depends on it, so a change’s blast radius is clear. Ask what matters — table-level is enough, or do they need column-level impact, and how deep do they really look?',
        users:
          'An engineer weighing a risky change. The one thing they need is confidence about who and what they’ll affect before they touch anything.',
        tasks:
          'Main path: centre on their table → expand the side they care about → spot the high-risk dependents. The key step is keeping it readable while answering “what breaks if I change this?”',
        ia:
          'Put the chosen table dead centre, sources to the left, consumers to the right, and keep everything else collapsed. Let them expand one hop at a time rather than dumping the whole graph.',
        screen:
          'Draw it focused: “ORDERS” in the middle, “2 sources” on the left and “5 reports ⚠” on the right, expand controls on each side, and a callout that two downstream reports are high-traffic — change with care.',
        states:
          'Handle the edges: nothing upstream (a raw source), a giant tangle (collapse aggressively, search to refocus), and a node the user can’t see because they lack access.',
        metrics:
          'Measure the drop in surprise breakages after changes and how often people consult lineage before editing. Fewer “who changed this and broke my report?” incidents is the win.',
      },
      sketches: [
        {
          caption: 'The table in the middle, lineage either side',
          blocks: [
            { band: 'Lineage · Orders' },
            { row: [{ t: 'Comes from', k: 'tag', w: 1 }, '', { t: 'Used by', k: 'tag', w: 1 }] },
            { row: [{ t: '2 sources', k: 'list', w: 1 }, { t: 'ORDERS', k: 'note', w: 1 }, { t: '5 reports ⚠', k: 'list', w: 1 }], h: 'tall' },
            { row: ['Expand sources ▾', '', 'Expand reports ▾'] },
            { row: [{ t: '⚠ 2 reports are high-traffic — change with care', k: 'note' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-activator',
    category: 'quality',
    difficulty: 'core',
    context: 'Microsoft Fabric · Data Activator',
    title: 'Tell me when a number crosses a line',
    scenario:
      'Microsoft Fabric’s Data Activator can watch a number and act when it crosses a line. Design the setup where someone says “let me know if daily orders drop below 1000” and picks where to be notified — without writing any code.',
    primaryUser: 'A business person who watches a number and isn’t technical',
    constraints: [
      'No code, no formulas — plain language only',
      'They need: the condition, the thing to watch, and who to tell',
      'It shouldn’t turn into a constant stream of noisy alerts',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a no-code way to watch a number and get told when it crosses a line. Clarify what matters — plain language over formulas, control over noise, and confidence it’s actually watching.',
        users:
          'A non-technical business owner of a metric. The one thing they want is a reliable heads-up when something moves — without learning query syntax or building a dashboard.',
        tasks:
          'Main path: choose the number → set the line → pick who to tell → turn it on. The make-or-break step is expressing the condition in words they trust.',
        ia:
          'Build the rule as a single fill-in-the-blanks sentence at the top, a preview of how often it would have fired underneath, then notification settings, then the on switch.',
        screen:
          'Fill it: “daily orders / goes below / 1000”, a note (“on the last 30 days this would have fired twice”), notify target and frequency (Teams channel, at most once a day), and “Send a test” + “Turn it on”.',
        states:
          'Handle noise and edges: a rule that would fire constantly (warn before they enable it), one that would never fire (let them know), and a test notification that fails to deliver.',
        metrics:
          'Track alerts set up versus abandoned mid-setup, and the share later muted for being too noisy. Low mute rates mean the preview-and-throttle controls are working.',
      },
      sketches: [
        {
          caption: 'Fill-in-the-blanks alert',
          blocks: [
            { band: 'Data Activator · tell me when…' },
            { row: [{ t: 'daily orders ▾', k: 'field', w: 1.2 }, { t: 'goes below ▾', k: 'field', w: 1 }, { t: '1000', k: 'field', w: 0.6 }] },
            { row: [{ t: '⚡ On the last 30 days this would have fired twice', k: 'note' }] },
            { row: [{ t: 'Notify: my Teams channel ▾', k: 'field', w: 1 }, { t: 'At most once a day ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'Send a test', k: 'btn', w: 1 }, { t: 'Turn it on', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-classify',
    category: 'quality',
    difficulty: 'core',
    context: 'Microsoft Fabric · Sensitivity labels',
    title: 'Label the sensitive columns',
    scenario:
      'Microsoft Fabric has flagged some columns that might hold personal info (names, emails, and so on). Design how someone reviews each flag and applies a sensitivity label — Public, Confidential, or Restricted.',
    primaryUser: 'The person responsible for handling data carefully',
    constraints: [
      'The system suggests a label; a human confirms or changes it',
      'Dozens of flagged columns across several tables',
      'Getting a label wrong has real consequences',
    ],
    solution: {
      steps: {
        scope:
          'Restate: the system has guessed which columns are sensitive, and a human needs to confirm or correct the label on each. Ask what matters — speed on obvious cases, evidence for doubtful ones, and an audit trail for overrides.',
        users:
          'A governance owner accountable for getting this right. Their one job is to clear the queue correctly, knowing a wrong label has compliance consequences.',
        tasks:
          'Main path: see a flagged column and why it was flagged → check the evidence → confirm or change the label. The key step is making the doubtful cases easy to judge.',
        ia:
          'A review queue, each item showing the suggested label, the reason it was flagged, masked example values, and the three choices — with a way to bulk-accept the obvious ones.',
        screen:
          'Fill it: tabs (to review 38 / done) and an “Accept all obvious (24)” action, then a card — “email · looks like emails · sample a••@••.com” — with Public / Confidential / Restricted and “Confirm & next”.',
        states:
          'Cover the edges: nothing flagged (clean, reassure), an overwhelming backlog (bulk tools + sorting), and disagreement with the suggestion (override with an audit note).',
        metrics:
          'Measure how quickly the backlog clears and how rarely a wrong label is caught later. A low post-review correction rate means the evidence shown was enough to decide well.',
      },
      sketches: [
        {
          caption: 'A review queue of flagged columns',
          blocks: [
            { band: 'Sensitivity labels · 38 flagged' },
            { row: [{ t: 'To review (38)', k: 'tab' }, { t: 'Done', k: 'tab' }, { t: 'Accept all obvious (24)', k: 'btn', w: 1.4 }] },
            { row: [{ t: '“email” · looks like emails · sample a••@••.com', k: 'list' }], h: 'tall' },
            { row: [{ t: 'Public', k: 'tab' }, { t: 'Confidential ✓', k: 'tab' }, { t: 'Restricted', k: 'tab' }] },
            { row: [{ t: 'Confirm & next', k: 'btn', w: 1 }, 'Skip'] },
          ],
        },
      ],
    },
  },

  // ---------- Charts & dashboards ----------
  {
    id: 'bi-semantic-model',
    category: 'analytics',
    difficulty: 'stretch',
    context: 'Power BI in Fabric · Data model',
    title: 'Connect tables for a report',
    scenario:
      'In Power BI (part of Microsoft Fabric), design the model view where someone links tables together so a report knows how they relate. Get the links wrong and the numbers come out wrong.',
    primaryUser: 'An analyst preparing data so reports add up correctly',
    constraints: [
      'Tables are boxes; relationships are lines, each with a direction and a one-to-many sense',
      'A real setup has lots of tables and gets messy',
      'Bad relationships quietly produce wrong totals — that needs guarding against',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a canvas to join tables so a report knows how they relate, where wrong links silently break the numbers. Ask what matters — keeping a big model readable, and catching bad relationships before they ship.',
        users:
          'An analyst setting up data so downstream reports can be trusted. The one thing they want is correct relationships, with the dangerous ones flagged rather than silently accepted.',
        tasks:
          'Main path: place the tables → draw a relationship between two → set its direction and one-to-many sense. The pivotal step is making the relationship’s meaning visible so mistakes are obvious.',
        ia:
          'A canvas of table boxes joined by lines, with a side panel for the selected relationship’s details. Auto-arrange so the web stays legible; let them focus on one fact table at a time.',
        screen:
          'Draw it: Customers and Products around a central Orders table, lines labelled with direction and “one → many”, a warning on a fuzzy relationship with a “Fix”, plus “Tidy up” and “Check for problems”.',
        states:
          'Cover the edges: a single lonely table, a messy 30-table model (auto-layout + collapse), and an ambiguous or many-to-many relationship that must be warned about before it produces wrong totals.',
        metrics:
          'Track the reduction in wrong-number reports and how many model warnings get resolved before publishing. Fewer “the totals look off” escalations is the real measure.',
      },
      sketches: [
        {
          caption: 'Tables joined by relationships',
          blocks: [
            { band: 'Model view' },
            { row: [{ t: 'Customers', k: 'note', w: 1 }, '', { t: 'Products', k: 'note', w: 1 }] },
            { row: ['one→many ↘', { t: 'Orders (centre)', k: 'note', w: 1.2 }, '↙ one→many'], h: 'tall' },
            { row: [{ t: '⚠ One fuzzy relationship — set its direction', k: 'note', w: 1.4 }, { t: 'Fix', k: 'btn', w: 1 }] },
            { row: [{ t: 'Tidy up', k: 'tab' }, { t: 'Check for problems', k: 'tab' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-field-picker',
    category: 'analytics',
    difficulty: 'core',
    context: 'Power BI in Fabric · Report building',
    title: 'Pick fields to build a chart',
    scenario:
      'In a Power BI report, design the Data pane — the list someone uses to drag fields onto a chart. There are hundreds of fields across many tables, and finding the right one is the whole game.',
    primaryUser: 'An analyst building a Power BI report',
    constraints: [
      'Hundreds of fields — finding the right one is everything',
      'A mix of measures (totals) and dimensions (things to group by)',
      'They often know the name but not which table it’s in',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a pane for finding and placing fields onto a chart, where findability across hundreds of fields is the whole game. Ask what matters — do they search by name, browse by table, and how do measures differ from dimensions for them?',
        users:
          'An analyst building a report who often knows a field’s name but not which table it lives in. Their one job is to find the right field in seconds and drop it on the chart.',
        tasks:
          'Main path: search or browse → tell a measure from a dimension → drag it onto the chart. The decisive step is search, because browsing hundreds of fields by hand is hopeless.',
        ia:
          'Search on top; results grouped by table; recently-used surfaced near the top; each field tagged by type. Measures and “group by” fields must be visually distinct.',
        screen:
          'Fill it: a search field over 240 fields, chips for “recently used” and “all tables”, then two clearly separated groups — “∑ Measures (revenue, count, total)” and “▦ Group by (region, date, product)”.',
        states:
          'Cover the edges: a search with no results (suggest close matches), a field with no description (still usable), and a brand-new model where nothing’s been used yet.',
        metrics:
          'Measure time-to-find-a-field and how often people fall back to scrolling the whole list. Heavy use of search and recents over scrolling means it’s working.',
      },
      sketches: [
        {
          caption: 'The Data pane, searchable',
          blocks: [
            { band: 'Data pane' },
            { row: [{ t: '🔍 Search 240 fields', k: 'field' }] },
            { row: [{ t: 'Recently used', k: 'tag', w: 1 }, { t: 'All tables ▾', k: 'tag', w: 1 }] },
            { row: [{ t: '∑ Measures — revenue, count, total…', k: 'list' }], h: 'tall' },
            { row: [{ t: '▦ Group by — region, date, product…', k: 'list' }], h: 'tall' },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-large-dashboard',
    category: 'analytics',
    difficulty: 'core',
    context: 'Power BI in Fabric · Dashboard',
    title: 'A one-glance summary screen',
    scenario:
      'Design a single Power BI dashboard for a busy leader: revenue, growth, top regions, and one thing that needs attention. It has to make sense in about five seconds.',
    primaryUser: 'A busy leader scanning for the headline',
    constraints: [
      'One screen, no scrolling, readable at a glance',
      'It should answer “are we ok?” before “why?”',
      'A big model underneath, but they only see the summary',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: one no-scroll screen that a busy leader can read in about five seconds, answering “are we ok?” before “why?”. Ask what matters — which three or four numbers count, and what “needs attention” looks like.',
        users:
          'A leader scanning between meetings, not analysing. The one thing they want is the headline — are we on track, and is there anything I must look at right now?',
        tasks:
          'Main path: read the few hero numbers → notice the one flagged thing → optionally dig in. The make-or-break step is the five-second glance, so hierarchy is everything.',
        ia:
          'Hero numbers across the top with direction vs. target, a single attention callout below them, and supporting charts beneath that — so the eye lands on the summary first, detail second.',
        screen:
          'Fill it: three KPIs (Revenue ▲4% · Growth ▲2% · New customers ▼), one callout (“look at this: returns up sharply in the north”), and two small supporting charts (top regions, trend).',
        states:
          'Design the variants: a great week with no flags (don’t invent a problem), missing or late data (say so honestly), and an all-red alarming week (escalate clearly without panic).',
        metrics:
          'Test whether a first-time viewer can state the headline in five seconds, and watch how long people linger before drilling. Quick comprehension and short dwell time mean the hierarchy works.',
      },
      sketches: [
        {
          caption: 'Glanceable leadership dashboard',
          blocks: [
            { band: 'Dashboard · this week' },
            { row: [{ t: 'Revenue ▲ 4%', k: 'kpi' }, { t: 'Growth ▲ 2%', k: 'kpi' }, { t: 'New cust: ▼', k: 'kpi' }] },
            { row: [{ t: '⚠ Look at this: returns up sharply in the north', k: 'note' }] },
            { row: [{ t: 'Top regions', k: 'chart', w: 1 }, { t: 'Trend', k: 'line', w: 1 }], h: 'tall' },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-refresh-schedule',
    category: 'analytics',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Scheduled refresh',
    title: 'Keep a dataset up to date',
    scenario:
      'Design the settings where someone sets how often a Power BI dataset refreshes, and sees whether recent refreshes worked.',
    primaryUser: 'An analyst who owns a dataset and wants it current',
    constraints: [
      'They set a schedule and see the status of recent refreshes',
      'Refreshes can quietly fail — they shouldn’t',
      'There’s a limit on how often updates can run',
    ],
    solution: {
      steps: {
        scope:
          'Restate: settings to choose how often a dataset refreshes and to see whether recent refreshes worked. Ask what matters — surfacing silent failures and the cap on how often refreshes are allowed.',
        users:
          'A report owner who wants their data current and a clear heads-up the moment a refresh breaks. The one thing they fear is stale data nobody noticed.',
        tasks:
          'Main path: set how often it refreshes → check recent results → refresh now if needed. The key step is making failures impossible to miss.',
        ia:
          'Schedule editor on one side, the recent-refreshes log on the other, and the frequency cap shown right where they’d hit it. Successes stay quiet; failures stand out.',
        screen:
          'Fill it: “every morning” schedule, a recent-refreshes list, a loud “yesterday’s refresh failed — see why”, the cap (“up to 8 refreshes/day”), and a “Refresh now”.',
        states:
          'Cover the edges: never refreshed yet, a failing streak (explain and alert), and bumping into the frequency limit (explain why, don’t just grey it out).',
        metrics:
          'Track the share of datasets staying current and how fast failed refreshes get noticed and fixed. Fewer “this report is out of date” complaints is the goal.',
      },
      sketches: [
        {
          caption: 'Schedule next to recent refreshes',
          blocks: [
            { band: 'Scheduled refresh · Sales dataset' },
            { row: [{ t: 'Every morning ▾', k: 'field', w: 1 }, { t: 'Recent refreshes', k: 'list', w: 1.3 }], h: 'xtall' },
            { row: [{ t: '⚠ Yesterday’s refresh failed — see why', k: 'note' }] },
            { row: [{ t: 'Up to 8 refreshes/day', k: 'tag', w: 1.4 }, { t: 'Refresh now', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },

  // ---------- Exploring data ----------
  {
    id: 'exp-sql-results',
    category: 'exploration',
    difficulty: 'core',
    context: 'Microsoft Fabric · SQL endpoint',
    title: 'Look through a huge query result',
    scenario:
      'In Microsoft Fabric’s SQL query editor, someone runs a query that returns ten million rows. They’re exploring, not downloading. Design the results screen.',
    primaryUser: 'An analyst exploring a very large table',
    constraints: [
      'You can’t show ten million rows — be honest about showing a slice',
      'Wide tables: lots of columns to scan',
      'They want to understand the shape and spot anything odd, fast',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: results for a query too big to show in full, where the person is exploring rather than exporting. Ask what matters — being honest about the slice shown, and helping them grasp the shape fast.',
        users:
          'An analyst poking at a large table to understand it. The one thing they want is the gist — what’s in here and is anything weird — without waiting for ten million rows.',
        tasks:
          'Main path: read the visible slice → scan per-column hints to orient → narrow the query if something’s off. The key step is orientation, not pagination.',
        ia:
          'A clear “showing N of millions” banner up top, quick per-column stats under it, then the scrollable grid with sticky headers and a pinned first column.',
        screen:
          'Fill it: “showing 200 of 10,000,000 rows”, per-column hints (blanks · range · distinct), a header row with a pinned id, the grid scrolling sideways, and “Load more” / “Narrow the query”.',
        states:
          'Cover the edges: zero results (suggest loosening the query), an extremely wide table (column search, freeze a column), and a slow query still running (progress, let them cancel).',
        metrics:
          'Measure time-to-first-insight and how often people refine the query versus give up scrolling. If they refine quickly instead of dumping to a file, the orientation tools work.',
      },
      sketches: [
        {
          caption: 'A readable slice of a giant result',
          blocks: [
            { band: 'SQL results · 200 of 10,000,000 rows' },
            { row: [{ t: 'Per-column hints: blanks · range · distinct', k: 'note' }] },
            { row: [{ t: 'id ▸', k: 'tag', w: 0.6 }, 'name', 'date', 'amount', 'status'] },
            { row: [{ t: 'The grid — sticky header, pinned id, scroll →', k: 'list' }], h: 'xtall' },
            { row: ['Load more', { t: 'Narrow the query', k: 'btn', w: 1.2 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'exp-search',
    category: 'exploration',
    difficulty: 'core',
    context: 'Microsoft Fabric · OneLake data hub',
    title: 'Find something across all workspaces',
    scenario:
      'Design the Microsoft Fabric search (the OneLake data hub) that helps someone find a report, dataset, or table across dozens of workspaces in a big organisation.',
    primaryUser: 'Someone who knows it exists but not which workspace it’s in',
    constraints: [
      'Results are a mix of items: reports, lakehouses, datasets, and more',
      'The same name gets reused across workspaces',
      'They may not have access to everything that turns up',
    ],
    solution: {
      steps: {
        scope:
          'Restate: one search across dozens of workspaces and many item types, to find the right thing fast. Ask what matters — telling duplicates apart, knowing what’s trustworthy, and handling items they can’t open.',
        users:
          'Someone who’s sure the thing exists but not where it lives. The one thing they want is to land on the right item, not a near-duplicate, quickly.',
        tasks:
          'Main path: search → filter by type or workspace → pick the right result (or request access). The crucial step is disambiguating same-named results.',
        ia:
          'A search bar on top, filters by type / workspace / owner, then a mixed results list where each row carries enough context to tell duplicates apart.',
        screen:
          'Fill it: query “quarterly sales”, filter chips (all types / any workspace / any owner), results showing name · type · workspace · owner · updated, a “certified” badge, and a “no access — ask” row.',
        states:
          'Cover the edges: no matches (offer suggestions), dozens of near-duplicates (sort by trust and recency), and a result they can’t open (clear, with a request-access path).',
        metrics:
          'Measure time-to-the-right-result and first-try success rate. Fewer “I opened the wrong one” moments and access requests routed correctly is the win.',
      },
      sketches: [
        {
          caption: 'Data hub search across workspaces',
          blocks: [
            { band: '🔍 Data hub · “quarterly sales”' },
            { row: [{ t: 'All types ▾', k: 'tag', w: 1 }, { t: 'Any workspace ▾', k: 'tag', w: 1 }, { t: 'Any owner ▾', k: 'tag', w: 1 }] },
            { row: [{ t: 'Results — name · type · workspace · owner · updated', k: 'list' }], h: 'xtall' },
            { row: [{ t: '✓ certified', k: 'tag', w: 1 }, { t: '🔒 no access — ask', k: 'note', w: 1.6 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'exp-profile',
    category: 'exploration',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Column profiling',
    title: 'Quick look at one column',
    scenario:
      'Design a quick column-profiling panel in Microsoft Fabric: pick a column and instantly see how its values are spread out, how many are blank, and the most common ones.',
    primaryUser: 'An analyst getting to know an unfamiliar table',
    constraints: [
      'It should feel instant and light, not a heavy report',
      'Numbers, categories, and dates each deserve a different little chart',
      'For big tables it looks at a sample, not everything',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a fast, lightweight snapshot of a single column so someone can understand it at a glance. Ask what matters — speed over depth, the right chart per data type, and honesty that it’s a sample.',
        users:
          'An analyst sizing up an unfamiliar table before trusting it. The one thing they want is to know a column’s shape — blanks, distinct values, distribution — in a second.',
        tasks:
          'Main path: pick a column → read the headline stats → glance at the right little chart. The key step is choosing the visualisation that fits the column’s type.',
        ia:
          'A compact panel: headline numbers (blanks, distinct) on top, the type-appropriate chart below, opened in one click from a column header.',
        screen:
          'Fill it: “Column: age (based on a sample)”, KPIs (3% blank · 64 distinct · avg 38), a distribution chart, and a short list of most-common values.',
        states:
          'Cover the edges: an all-blank column (say so plainly), an all-unique column like an id (a distribution is meaningless — show counts instead), and a still-sampling state.',
        metrics:
          'Track how often the panel is opened and whether it reduces bad assumptions downstream. If people check a column here before building on it, it’s earning its place.',
      },
      sketches: [
        {
          caption: 'A column snapshot',
          blocks: [
            { band: 'Column profile · “age” (sample)' },
            { row: [{ t: '3% blank', k: 'kpi' }, { t: '64 distinct', k: 'kpi' }, { t: 'avg 38', k: 'kpi' }] },
            { row: [{ t: 'How the values are spread', k: 'chart' }], h: 'tall' },
            { row: [{ t: 'Most common values', k: 'list' }] },
          ],
        },
      ],
    },
  },

  // ---------- Setup & access ----------
  {
    id: 'adm-capacity',
    category: 'admin',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Capacity admin',
    title: 'Watch how much capacity is used',
    scenario:
      'Microsoft Fabric runs on a shared pool of compute called capacity. Design the screen for a capacity admin to see how much is being used and what’s eating it, so they can act before things slow down (throttling).',
    primaryUser: 'The Fabric capacity admin',
    constraints: [
      'Usage spikes and “slowing down when you run out” are abstract — make them feel real',
      'They need to know which workspace or item is using the most',
      'The goal is to act before users feel the slowdown',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a view of shared-compute usage that shows what’s eating it, so the admin can act before users feel a slowdown. Ask what matters — making the abstract “throttling” tangible and attributing usage to a culprit.',
        users:
          'The capacity admin who wants to get ahead of problems, not react to complaints. The one thing they need is early warning plus the name of whatever’s burning the budget.',
        tasks:
          'Main path: see usage over time → find the biggest consumer → add capacity or set an alert. The pivotal step is connecting a spike to a specific workspace or item.',
        ia:
          'A usage-over-time chart with the throttling threshold drawn in, a ranked list of top consumers below it, and clear actions at the bottom.',
        screen:
          'Fill it: a line of usage over time with a dashed “throttling” line near the top, a “biggest users right now (by workspace)” list, and “Add capacity” / “Set an alert”.',
        states:
          'Cover the edges: calm steady usage, a brief healthy spike (don’t cry wolf), and sustained overload that’s already throttling (escalate, point straight at the cause).',
        metrics:
          'Measure how often the admin acts before users notice and the total time spent over the throttling line. Fewer slowdown complaints reaching end users is the headline.',
      },
      sketches: [
        {
          caption: 'Capacity usage with the throttling line',
          blocks: [
            { band: 'Capacity · shared compute' },
            { row: [{ t: 'Usage over time · dashed “throttling” line near top', k: 'line' }], h: 'xtall' },
            { row: [{ t: 'Biggest users right now (by workspace)', k: 'list' }], h: 'tall' },
            { row: [{ t: 'Add capacity', k: 'btn', w: 1 }, { t: 'Set an alert', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-create-item',
    category: 'admin',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · New item',
    title: 'Create a new item',
    scenario:
      'Design the “+ New” experience in a Microsoft Fabric workspace, where someone can create a new item — a report, a lakehouse, a notebook, a pipeline, and so on. There are many types and newcomers don’t know which they need.',
    primaryUser: 'Anyone starting a new piece of work in a workspace',
    constraints: [
      'There are many item types, and newcomers don’t know which to pick',
      'Some items need another item first (a report needs a dataset)',
      'It shouldn’t feel like an intimidating wall of options',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a “create new” for many item types that doesn’t intimidate newcomers who don’t know the jargon. Ask what matters — guiding the choice by goal and handling prerequisites gracefully.',
        users:
          'Often a newcomer who knows what they want to do but not which item type does it. The one thing they want is to start the right thing without a wall of options.',
        tasks:
          'Main path: see the common starting points → understand each in a line → create it. The key step is grouping choices by goal instead of an A–Z type dump.',
        ia:
          'Group items by what people are trying to do, with the popular ones front and centre and the rare ones behind a “more”. Each item gets a one-line plain explanation.',
        screen:
          'Fill it: a “most people start with one of these” note, three big cards (📊 Report · 🗄 Lakehouse · 💻 Notebook) each with a plain one-liner, and a “More item types ▾”.',
        states:
          'Cover the edges: a first-ever item (extra hand-holding), a missing prerequisite (a report needs a dataset — guide them, don’t error later), and the full list for power users who want everything.',
        metrics:
          'Track how often newcomers create the right item on the first try and drop-off on this screen. Fewer abandoned or deleted-immediately items means the grouping is guiding well.',
      },
      sketches: [
        {
          caption: 'New item, grouped by goal',
          blocks: [
            { band: 'Workspace · ＋ New' },
            { row: [{ t: 'Most people start with one of these', k: 'note' }] },
            { row: [{ t: '📊 Report', k: 'list', w: 1 }, { t: '🗄 Lakehouse', k: 'list', w: 1 }, { t: '💻 Notebook', k: 'list', w: 1 }], h: 'tall' },
            { row: [{ t: 'Each item has a one-line plain explanation', k: 'tag' }] },
            { row: ['More item types ▾'] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-rls-share',
    category: 'admin',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Sharing & row-level security',
    title: 'Share so each person sees only their rows',
    scenario:
      'Design the sharing dialog for a sensitive Power BI dataset that uses row-level security — different people should only see their own region’s rows. The owner needs to be sure they’re not accidentally over-sharing.',
    primaryUser: 'The owner of a sensitive dataset, sharing it carefully',
    constraints: [
      'Sharing and “which rows they see” happen in one flow without confusion',
      'It’s easy to over-share by accident, and the stakes are high',
      'The owner wants to check what a given person will actually see',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a sharing dialog for sensitive data where each person is limited to their own rows, and the owner must avoid accidental over-sharing. Ask what matters — combining access level and row scope in one clear flow, and verifying before sending.',
        users:
          'A careful dataset owner who can’t afford to leak the wrong rows. The one thing they want is certainty about exactly what each person will be able to see.',
        tasks:
          'Main path: pick a person → set their access and row-level role → verify, then share. The make-or-break step is making the resulting access unmistakable before they confirm.',
        ia:
          'One dialog: person + access level + row-level role together, a “view as them” preview, and a warning zone for risky grants — never a hidden second step for the security role.',
        screen:
          'Fill it: jordan@… set to “view only”, “row-level role: North region”, a “👁 View as Jordan (preview their rows)”, a sensitive-data warning, and Cancel / Share.',
        states:
          'Cover the edges: a broad “whole org” share (strong warning, maybe block), edit access on sensitive data (extra confirmation), and the preview itself showing exactly which rows they’d get.',
        metrics:
          'Measure over-share mistakes caught before sending and how often owners use “view as” before sharing. A low rate of access later being revoked means the dialog prevented errors.',
      },
      sketches: [
        {
          caption: 'Share with a row-level limit',
          blocks: [
            { band: 'Share “Finance dataset” (sensitive)' },
            { row: [{ t: 'jordan@…', k: 'avatar', w: 1.4 }, { t: 'view only ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'Row-level role: North region ▾', k: 'field' }] },
            { row: [{ t: '👁 View as Jordan (preview their rows)', k: 'btn' }] },
            { row: [{ t: '⚠ Sensitive data — double-check before sharing', k: 'note' }] },
            { row: ['Cancel', { t: 'Share', k: 'btn', w: 1.2 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-onboard-source',
    category: 'admin',
    difficulty: 'core',
    context: 'Microsoft Fabric · Get data',
    title: 'Connect your first data source',
    scenario:
      'Design the “Get data” first-time experience for someone connecting their very first source to Microsoft Fabric. They’ve never used it, and the sign-in step is the scary part.',
    primaryUser: 'A brand-new user on their first ever visit',
    constraints: [
      'There are many connectors; they know their own source, not the jargon',
      'The sign-in/connect step is where people get stuck and nervous',
      'They want a quick win to feel it was worth it',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a first-time “Get data” flow that gets a nervous newcomer to their first preview, with sign-in being the scary moment. Ask what matters — reducing connector jargon and making sign-in feel safe.',
        users:
          'A brand-new user who knows their own source but not the connector names. The one thing they want is a quick win — to see their data appear and feel this was worth it.',
        tasks:
          'Main path: find their source → sign in safely → see their first table. The pivotal step is sign-in, where most people stall, so it must feel safe and explained.',
        ia:
          'A short three-step flow: search for the source, a reassuring sign-in with a plain explanation, then a first-data preview. Rush them toward the “aha”, not through a connector catalogue.',
        screen:
          'Fill it: “Get data · step 1 of 3”, a “type where your data lives” search, a note (“we only use your sign-in to read this data — nothing else”), “Sign in safely”, then “🎉 here’s your first table”.',
        states:
          'Cover the edges: a sign-in that fails (kind, specific recovery), a source needing extra setup like a gateway, and an empty source with no tables (explain, don’t dead-end).',
        metrics:
          'Track the share who reach a first preview, time to that first “aha”, and drop-off at the sign-in step. Lowering sign-in abandonment is the key lever.',
      },
      sketches: [
        {
          caption: 'Get data, kept reassuring',
          blocks: [
            { band: 'Get data · step 1 of 3' },
            { row: [{ t: '🔍 Type where your data lives', k: 'field' }] },
            { row: [{ t: 'We only use your sign-in to read this data — nothing else', k: 'note' }] },
            { row: [{ t: 'Sign in safely', k: 'btn' }] },
            { row: [{ t: '🎉 Here’s your first table', k: 'list' }], h: 'tall' },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-access-request',
    category: 'admin',
    difficulty: 'core',
    context: 'Microsoft Fabric · Access requests',
    title: 'Ask for access to a locked report',
    scenario:
      'Design what someone sees in Microsoft Fabric when they open a report they’re not allowed to view, and how they request access — without hitting a dead end.',
    primaryUser: 'Someone who just hit a “you can’t see this” wall',
    constraints: [
      'A blank “access denied” is a frustrating dead end',
      'They should reach the right person, not nobody',
      'That person needs enough context to say yes quickly',
    ],
    solution: {
      steps: {
        scope:
          'Restate: replace a dead-end “access denied” with a path that gets the right person asked and the requester told what happens next. Ask what matters — who the approver is and how to give them enough to decide fast.',
        users:
          'A blocked user who just wants in, plus the owner who has to decide. The one thing the requester wants is to not hit a wall with nowhere to go.',
        tasks:
          'Main path: understand what this is → ask the owner → learn what happens next. The key step is turning the dead end into a one-tap request to the right person.',
        ia:
          'Explain the item and its owner, an optional reason field, a clear request button, and an expectation line — and design the approver’s side so they can decide quickly.',
        screen:
          'Fill it: “🔒 you don’t have access to this report”, “it’s ‘Regional sales’, owned by Sam”, an optional “why do you need it?”, “Request access from Sam”, and “usually answered within a day”.',
        states:
          'Cover the edges: owner unknown or left the company (route to an admin), a request already pending (don’t let them spam), and the approver’s view with enough context to say yes.',
        metrics:
          'Measure the share of blocks that turn into a request and the time from request to decision. Fewer abandoned dead-ends and faster approvals is the win.',
      },
      sketches: [
        {
          caption: 'A helpful locked screen',
          blocks: [
            { band: '🔒 You don’t have access to this report' },
            { row: [{ t: 'It’s “Regional sales”, owned by Sam', k: 'note' }] },
            { row: [{ t: 'Why do you need it? (optional)', k: 'field' }], h: 'tall' },
            { row: [{ t: 'Request access from Sam', k: 'btn' }] },
            { row: [{ t: 'Usually answered within a day', k: 'tag' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-workspace-roles',
    category: 'admin',
    difficulty: 'core',
    context: 'Microsoft Fabric · Workspace roles',
    title: 'Manage who’s in the workspace',
    scenario:
      'Design the Microsoft Fabric workspace access screen where a manager handles who belongs and assigns roles (Admin, Member, Contributor, Viewer).',
    primaryUser: 'The manager of a Fabric workspace',
    constraints: [
      'Four roles whose differences aren’t obvious',
      'Workspaces range from a handful of people to over a hundred',
      'Mistakes here lock people out or hand out too much power',
    ],
    solution: {
      steps: {
        scope:
          'Say it back: a screen to manage workspace members and assign one of four roles, where the role differences aren’t obvious and mistakes lock people out or over-grant. Ask what matters — making roles legible and scaling from a few to 100+ people.',
        users:
          'A workspace manager balancing easy access against safety. The one thing they want is to give the right access without accidentally locking someone out or handing over too much power.',
        tasks:
          'Main path: find a person → understand what each role can do → change a role or remove them. The key step is making role powers plain at the moment of choosing.',
        ia:
          'A searchable, filterable member table with an add-people action, where each role explains itself on tap and risky changes ask for confirmation.',
        screen:
          'Fill it: “Workspace access · 42 members”, search + role filter + “＋ Add”, rows like “jordan@… — Can edit ▾” and “sam@… — View only ▾”, a “tap a role to see what it can do”, and a remove-confirmation note.',
        states:
          'Cover the edges: a tiny workspace, a 100+ person one (bulk actions, search), and removing the last Admin (block it so nobody’s locked out).',
        metrics:
          'Track access mistakes and lockouts, and time to onboard or offboard a member. Fewer “I can’t get in” and “why could they edit that?” incidents means roles are clear.',
      },
      sketches: [
        {
          caption: 'Workspace members and their roles',
          blocks: [
            { band: 'Workspace access · 42 members' },
            { row: [{ t: '🔍 Search people', k: 'field', w: 1.4 }, { t: 'Role: all ▾', k: 'tag', w: 1 }, { t: '＋ Add', k: 'btn', w: 0.8 }] },
            { row: [{ t: 'jordan@…', k: 'avatar', w: 1.4 }, { t: 'Member ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'sam@…', k: 'avatar', w: 1.4 }, { t: 'Viewer ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'Tap a role to see exactly what it can do', k: 'tag' }] },
            { row: [{ t: '⚠ Removing someone? We’ll ask you to confirm', k: 'note' }] },
          ],
        },
      ],
    },
  },

  // ===== More projects =====
  {
    id: 'eng-import-mapping',
    category: 'engineering',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Get data',
    title: 'Match a file’s columns to a table',
    scenario:
      'Someone is loading a CSV into a Lakehouse, but its columns don’t quite line up with the table they’re loading into. Design the screen where they map each file column to the right table column before loading.',
    primaryUser: 'A data engineer loading a slightly messy file',
    constraints: [
      'Column names in the file don’t exactly match the table',
      'Some columns are required, some should be skipped',
      'They want to catch type mismatches before the load runs',
    ],
    solution: {
      steps: {
        scope:
          'Restate: line up an imperfect file’s columns with a target table and catch problems before loading. Ask what matters — which columns are required, and what to do with extras and mismatches.',
        users:
          'A data engineer importing a file that’s a bit off. Their one job is a clean load — not a failed run discovered an hour later.',
        tasks:
          'Main path: review the auto-matched columns → fix the wrong guesses → confirm and load. The key step is reviewing the auto-match rather than mapping every column by hand.',
        ia:
          'File columns on the left, table columns on the right, auto-matched pairs joined with sample values, and any problems floated to the top.',
        screen:
          'Fill it: rows of “file column → table column ▾” with green ticks on confident matches, a ⚠ on a type mismatch, a “skip” for extras, and a “Load 12,400 rows”.',
        states:
          'Cover the edges: a required column with no match (block and explain), a type mismatch like text into a number (warn or offer to convert), and extra file columns (skip or add).',
        metrics:
          'Track loads that succeed first try and how rarely a mapping causes a failed run later. Fewer post-load “why is this column empty?” surprises is the win.',
      },
      sketches: [
        {
          caption: 'Map the file to the table',
          blocks: [
            { band: 'Map your file → Customers table' },
            { row: [{ t: 'cust_name', k: 'field', w: 1 }, { t: '→ CustomerName ✓', k: 'field', w: 1.2 }] },
            { row: [{ t: 'amt', k: 'field', w: 1 }, { t: '⚠ Amount (text → number)', k: 'note', w: 1.2 }] },
            { row: [{ t: 'notes', k: 'field', w: 1 }, { t: '→ Skip ▾', k: 'field', w: 1.2 }] },
            { row: [{ t: 'Load 12,400 rows', k: 'btn' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-transform-steps',
    category: 'engineering',
    difficulty: 'core',
    context: 'Power Query in Fabric · Dataflow',
    title: 'Clean up messy data, step by step',
    scenario:
      'Someone needs to clean a raw table — trim spaces, fix dates, split a column — before it’s usable. Design the editor where they build that clean-up as a list of steps and watch the data update as they go.',
    primaryUser: 'A data engineer shaping raw data into something usable',
    constraints: [
      'Each clean-up is a step in a list they can reorder or undo',
      'They need to see the data change after each step',
      'A step can break if the data shifts later',
    ],
    solution: {
      steps: {
        scope:
          'Restate: build a repeatable clean-up as an ordered list of steps, with the table updating live. Ask what matters — editing and reordering steps, and seeing each step’s effect.',
        users:
          'A data engineer turning raw data into something usable. Their one job is to shape the data confidently, seeing exactly what each step does.',
        tasks:
          'Main path: pick a column → apply a transform → see the table change → add the next step. The key step is the live preview that builds trust.',
        ia:
          'The data grid takes most of the screen; a list of applied steps runs down one side, each one selectable to jump back to that point.',
        screen:
          'Fill it: the grid with a column selected, an “Applied steps” list (Removed blanks · Trimmed spaces · Split name), and a “⚠ Step 3 broke — see why”.',
        states:
          'Cover the edges: a step that errors when the data shifts (flag which step and why), an empty result after a filter (warn), and a very large table (preview on a sample).',
        metrics:
          'Track how often clean-ups run later without manual fixing and time to a usable table. Fewer broken-step reruns means the live preview works.',
      },
      sketches: [
        {
          caption: 'Steps on the side, data updating live',
          blocks: [
            { band: 'Clean up · Customers (raw)' },
            { row: [{ t: 'Applied steps', k: 'list', w: 1 }, { t: 'The data — updates per step', k: 'list', w: 1.6 }], h: 'xtall' },
            { row: [{ t: '＋ Add step ▾', k: 'btn', w: 1 }, { t: '⚠ Step 3 broke — see why', k: 'note', w: 1.4 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'eng-incremental',
    category: 'engineering',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Incremental refresh',
    title: 'Only load what’s new each night',
    scenario:
      'A table has years of history and grows daily. Reloading all of it every night is slow and wasteful. Design the setup where someone says “keep 3 years, and each night only load the last few days that changed.”',
    primaryUser: 'A data engineer optimising a slow nightly load',
    constraints: [
      'Two ranges to set: how much history to keep, and how recent a window to refresh',
      'The idea — don’t reload everything — is the hard part to convey',
      'Getting it wrong can drop data or quietly reload everything',
    ],
    solution: {
      steps: {
        scope:
          'Restate: configure a table to keep a long history but only refresh a recent window each run, so loads are fast. Ask what matters — making the two ranges and the “only new data” idea clear.',
        users:
          'A data engineer fixing a slow, wasteful nightly load. Their one job is to set this up once, correctly, without risking dropped or duplicated rows.',
        tasks:
          'Main path: set how much history to keep → set the recent window to refresh → preview what runs each night. The key step is making the two ranges concrete with a timeline.',
        ia:
          'A timeline at the centre showing the long “kept history” and the small “refreshed each night” window, with two range controls and a plain summary.',
        screen:
          'Fill it: a timeline bar (3 years kept · last 5 days refreshed), two range pickers, and a summary “each night, reload the last 5 days only”.',
        states:
          'Cover the edges: the first full load (warn it’s slow once), a missed night (how it catches up), and a setting that would reload everything (warn before saving).',
        metrics:
          'Track nightly load time before vs. after and any data gaps introduced. A big speed-up with zero missing rows is the goal.',
      },
      sketches: [
        {
          caption: 'A timeline: keep history, refresh the tip',
          blocks: [
            { band: 'Refresh only what’s new' },
            { row: [{ t: 'Timeline — kept history ▓▓▓ · refreshed tip ▒', k: 'line' }], h: 'tall' },
            { row: [{ t: 'Keep: 3 years ▾', k: 'field', w: 1 }, { t: 'Refresh: last 5 days ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'Each night, reload the last 5 days only', k: 'note' }] },
            { row: [{ t: 'Save', k: 'btn' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-compare',
    category: 'quality',
    difficulty: 'core',
    context: 'Microsoft Fabric · Table compare',
    title: 'What changed since yesterday?',
    scenario:
      'A table updated overnight and something looks off. Design a view that compares the table now versus yesterday — rows added, removed, or changed — so someone can see exactly what moved.',
    primaryUser: 'A data steward investigating an unexpected change',
    constraints: [
      'Show added, removed, and changed rows clearly',
      'The table is large — summarise before showing every diff',
      'They want to judge whether the change was expected',
    ],
    solution: {
      steps: {
        scope:
          'Restate: compare a table across two points in time and show what was added, removed, or changed. Ask what matters — a summary first, then the specific rows.',
        users:
          'A steward chasing a surprising change. Their one job is to see exactly what moved and judge whether it’s normal.',
        tasks:
          'Main path: read the summary of changes → drill into a category → inspect specific rows. The key step is summarising before dumping every diff.',
        ia:
          'A summary band of counts (added / removed / changed) on top, then a switchable list of actual rows with before and after side by side.',
        screen:
          'Fill it: KPIs (+1,204 added · −37 removed · 512 changed), tabs for each, and a row showing “amount: 100 → 1000” old beside new.',
        states:
          'Cover the edges: no changes (reassure), a massive overhaul (sample + warn), and a column type change (call it out specially).',
        metrics:
          'Track time to explain an unexpected change and how often it prevents a bad downstream decision. Faster “is this normal?” answers is the measure.',
      },
      sketches: [
        {
          caption: 'Counts first, then the changed rows',
          blocks: [
            { band: 'What changed · Orders (since yesterday)' },
            { row: [{ t: '+1,204 added', k: 'kpi' }, { t: '−37 removed', k: 'kpi' }, { t: '512 changed', k: 'kpi' }] },
            { row: [{ t: 'Added', k: 'tab' }, { t: 'Removed', k: 'tab' }, { t: 'Changed', k: 'tab' }] },
            { row: [{ t: 'Rows — amount: 100 → 1000 (old → new)', k: 'list' }], h: 'xtall' },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-rule-builder',
    category: 'quality',
    difficulty: 'core',
    context: 'Microsoft Fabric · Data quality rules',
    title: 'Set a rule for what counts as valid',
    scenario:
      'Someone wants to enforce that every order has a positive amount and a real email. Design the no-code builder where they write these rules and choose what happens when data breaks them.',
    primaryUser: 'A data steward setting guardrails on a table',
    constraints: [
      'No code — plain conditions',
      'Each rule needs an action when broken (warn, block, quarantine)',
      'They want to test a rule before turning it on',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a no-code way to define what valid data looks like and what happens when it isn’t. Ask what matters — plain conditions and a safe way to test before enforcing.',
        users:
          'A steward setting guardrails. Their one job is to express rules they trust without accidentally blocking good data.',
        tasks:
          'Main path: write a rule as a sentence → pick the action when broken → test it on current data → turn it on. The key step is testing before enforcing.',
        ia:
          'A list of rules, each a plain sentence with its action; a builder for new ones; and a “test on current data” preview of how many rows would fail.',
        screen:
          'Fill it: a rule “amount is greater than 0”, action “warn”, a test result (“23 rows would fail today”), an enable toggle, and “＋ Add rule”.',
        states:
          'Cover the edges: a rule that fails most rows (warn it’s too strict), a rule whose column is missing, and rules that conflict.',
        metrics:
          'Track bad records caught and how rarely a rule blocks good data. Fewer “the rule rejected valid data” complaints is the win.',
      },
      sketches: [
        {
          caption: 'Plain-language rule with a test',
          blocks: [
            { band: 'Data quality rules · Orders' },
            { row: [{ t: 'amount ▾', k: 'field', w: 1 }, { t: 'is greater than ▾', k: 'field', w: 1.2 }, { t: '0', k: 'field', w: 0.5 }] },
            { row: [{ t: 'When broken: warn ▾', k: 'field', w: 1 }, { t: 'Test on current data', k: 'btn', w: 1 }] },
            { row: [{ t: '✓ 23 rows would fail today', k: 'note' }] },
            { row: [{ t: '＋ Add rule', k: 'btn', w: 1 }, { t: 'Turn on', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'qual-certify',
    category: 'quality',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Endorsement',
    title: 'Mark a dataset as trusted',
    scenario:
      'Lots of similar datasets float around and people don’t know which to use. Design how an owner marks a dataset as “certified” so it stands out as the trustworthy one to build on.',
    primaryUser: 'A data owner vouching for their dataset',
    constraints: [
      'Certifying is a meaningful claim, not a casual toggle',
      'Others should see the badge wherever the dataset appears',
      'Only certain people are allowed to certify',
    ],
    solution: {
      steps: {
        scope:
          'Restate: let an authorised owner mark a dataset as trusted so it stands out among lookalikes. Ask what matters — making it a deliberate, permissioned claim.',
        users:
          'A data owner vouching for quality. Their one job is to signal “use this one” clearly and responsibly.',
        tasks:
          'Main path: open the dataset → certify it with a short why → see the badge appear everywhere it’s listed. The key step is making certification feel weighty, not a casual switch.',
        ia:
          'A clear certify action gated to the right people, a short justification, and a visible badge that travels with the dataset across search and lists.',
        screen:
          'Fill it: the dataset header, a “Certify this dataset” button, a short “why it’s trustworthy” field, and a preview of the ✓ Certified badge.',
        states:
          'Cover the edges: someone without permission (explain who can), an already-certified item (option to revoke), and a stale certification (prompt to review).',
        metrics:
          'Track adoption of certified datasets over uncertified lookalikes and duplicate-dataset sprawl. More people building on the certified one is the goal.',
      },
      sketches: [
        {
          caption: 'A deliberate “certify” claim',
          blocks: [
            { band: 'Sales dataset' },
            { row: [{ t: 'Certify this dataset', k: 'btn' }] },
            { row: [{ t: 'Why is it trustworthy? (short note)', k: 'field' }], h: 'tall' },
            { row: [{ t: '✓ Certified — how others will see it', k: 'note' }] },
            { row: [{ t: 'Only data owners can certify', k: 'tag' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-chart-pick',
    category: 'analytics',
    difficulty: 'warmup',
    context: 'Power BI in Fabric · Visuals',
    title: 'Pick the right chart for this data',
    scenario:
      'Someone has selected some fields and now needs to choose how to show them. Design the visual picker that suggests sensible chart types for what they picked and warns when a choice would mislead.',
    primaryUser: 'An analyst choosing how to visualise data',
    constraints: [
      'Suggest charts that fit the fields chosen',
      'Lots of chart types — don’t overwhelm',
      'Some choices mislead (a pie with 30 slices)',
    ],
    solution: {
      steps: {
        scope:
          'Restate: help someone choose a chart that fits the fields they picked, steering away from misleading ones. Ask what matters — sensible defaults over a giant gallery.',
        users:
          'An analyst who knows their data but not chart theory. Their one job is to land on a clear, honest visual quickly.',
        tasks:
          'Main path: see suggested charts for the current fields → preview one → apply it. The key step is suggesting, not making them scan every type.',
        ia:
          'A small “suggested for your data” row up front, the full gallery tucked behind “more”, and a gentle warning when a pick would mislead.',
        screen:
          'Fill it: “Suggested” thumbnails (bar, line, table), a “⚠ a pie with 30 slices is hard to read — try a bar”, and “More chart types ▾”.',
        states:
          'Cover the edges: too many categories for the chart, a single number (suggest a card), and time data (suggest a line).',
        metrics:
          'Track how often people accept a suggestion and how rarely charts get swapped right after. Fewer misleading visuals shipped is the win.',
      },
      sketches: [
        {
          caption: 'Suggested charts for your fields',
          blocks: [
            { band: 'Choose a chart' },
            { row: [{ t: 'Suggested for your data', k: 'tag' }] },
            { row: [{ t: 'Bar', k: 'chart', w: 1 }, { t: 'Line', k: 'line', w: 1 }, { t: 'Table', k: 'list', w: 1 }], h: 'tall' },
            { row: [{ t: '⚠ A pie with 30 slices is hard to read — try a bar', k: 'note' }] },
            { row: ['More chart types ▾'] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-drillthrough',
    category: 'analytics',
    difficulty: 'core',
    context: 'Power BI in Fabric · Drill-through',
    title: 'Click a bar to see what’s behind it',
    scenario:
      'A chart shows sales by region. Someone wants to click the “North” bar and land on a detail page filtered to just North. Design how that drill-through is set up and how it feels to use.',
    primaryUser: 'An analyst wiring up an interactive report',
    constraints: [
      'Clicking a data point opens a detail page filtered to it',
      'The detail page must make clear what it’s filtered to',
      'Both set-up and the click experience matter',
    ],
    solution: {
      steps: {
        scope:
          'Restate: let a click on a data point open a detail page filtered to that point — covering both setting it up and using it. Ask what matters — making the filter obvious on arrival.',
        users:
          'An analyst building the report, and the viewer who clicks through. The one thing the viewer needs is to know what they’re now looking at.',
        tasks:
          'Main path (use): click a bar → land on a detail page → see it’s filtered to that bar → step back. Setup: point a detail page at a field.',
        ia:
          'On the chart, a clear “see details” affordance; on the detail page, a prominent “filtered to: North” chip and an easy way back.',
        screen:
          'Fill it: a regions bar chart with “North” highlighted, a “See details for North →”, and a detail header “Showing: North ✕ · Back”.',
        states:
          'Cover the edges: a point with no detail data, multiple filters stacking, and a back path that preserves the original view.',
        metrics:
          'Track drill-through usage and how often viewers get lost. Clear orientation on arrival is the measure.',
      },
      sketches: [
        {
          caption: 'Click a bar → a filtered detail page',
          blocks: [
            { band: 'Sales by region' },
            { row: [{ t: 'Regions', k: 'chart' }], h: 'tall' },
            { row: [{ t: 'Right-click North → See details', k: 'note' }] },
            { row: [{ t: 'Detail page — Showing: North ✕', k: 'tag', w: 1.4 }, { t: 'Back', k: 'btn', w: 0.7 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-mobile',
    category: 'analytics',
    difficulty: 'core',
    context: 'Power BI in Fabric · Mobile layout',
    title: 'Make this report work on a phone',
    scenario:
      'A report looks great on a laptop but is unusable on a phone. Design how someone creates a phone-friendly version — stacking the key visuals and dropping what doesn’t fit.',
    primaryUser: 'An analyst making a report usable on mobile',
    constraints: [
      'A wide desktop layout doesn’t fit a narrow phone',
      'They choose which visuals matter on a small screen',
      'It should feel like arranging, not rebuilding',
    ],
    solution: {
      steps: {
        scope:
          'Restate: build a phone version of a desktop report by stacking the visuals that matter and dropping the rest. Ask what matters — reuse over rebuild, and which visuals are essential.',
        users:
          'An analyst who wants their report readable on a phone. Their one job is a usable small-screen layout without starting over.',
        tasks:
          'Main path: switch to a phone canvas → drag the key visuals into a stack → hide the rest. The key step is choosing what survives the small screen.',
        ia:
          'A phone-shaped canvas beside a tray of the report’s existing visuals; drag to place, stack to order, leftovers stay in the tray.',
        screen:
          'Fill it: a phone frame with two stacked KPIs and a chart, a tray of unused visuals, and a “Preview on phone”.',
        states:
          'Cover the edges: a visual too wide to fit (resize or drop), nothing placed yet (suggest the top visuals), and a very tall stack (scroll).',
        metrics:
          'Track phone vs. desktop engagement and how often the mobile layout is actually built. Higher mobile usage on key reports is the goal.',
      },
      sketches: [
        {
          caption: 'A phone canvas and a tray of visuals',
          blocks: [
            { band: 'Phone layout' },
            { row: [{ t: 'Phone canvas', k: 'image', w: 1 }, { t: 'Unused visuals (tray)', k: 'list', w: 1 }], h: 'xtall' },
            { row: [{ t: 'Drag the visuals that matter into the stack', k: 'note' }] },
            { row: [{ t: 'Preview on phone', k: 'btn' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-subscribe',
    category: 'analytics',
    difficulty: 'warmup',
    context: 'Power BI in Fabric · Subscriptions',
    title: 'Email me this report every Monday',
    scenario:
      'Someone wants a report to land in their inbox on a schedule instead of remembering to open it. Design the subscription setup — when to send, to whom, and a preview of what arrives.',
    primaryUser: 'A report viewer who wants it delivered',
    constraints: [
      'Pick a schedule and recipients',
      'They should see what the email will look like',
      'Avoid sending stale data (tie to the refresh)',
    ],
    solution: {
      steps: {
        scope:
          'Restate: let someone subscribe to a report so it’s emailed on a schedule. Ask what matters — a preview of the email and not sending stale data.',
        users:
          'A viewer who’d rather have the report delivered than chase it. Their one job is to set a schedule and trust the right thing arrives.',
        tasks:
          'Main path: choose when → choose who → preview the email → turn it on. The key step is the preview so they trust what lands.',
        ia:
          'A simple schedule + recipients form with a live email preview beside it, and a note tying send time to the data refresh.',
        screen:
          'Fill it: “Every Monday 8am”, recipients, an email preview, a “sends after the morning refresh” note, and “Turn on”.',
        states:
          'Cover the edges: a send scheduled before the data refreshes (warn), a failed send, and easy unsubscribe.',
        metrics:
          'Track active subscriptions and how rarely people unsubscribe over stale or mistimed emails. Reliable, timely delivery is the measure.',
      },
      sketches: [
        {
          caption: 'Schedule with an email preview',
          blocks: [
            { band: 'Email me this report' },
            { row: [{ t: 'Every Monday ▾', k: 'field', w: 1 }, { t: '8:00am ▾', k: 'field', w: 1 }] },
            { row: [{ t: 'To: me + team ▾', k: 'field' }] },
            { row: [{ t: 'Email preview', k: 'image' }], h: 'tall' },
            { row: [{ t: 'Sends after the morning refresh', k: 'note', w: 1.4 }, { t: 'Turn on', k: 'btn', w: 1 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'bi-comment',
    category: 'analytics',
    difficulty: 'warmup',
    context: 'Power BI in Fabric · Comments',
    title: 'Leave a note on a chart',
    scenario:
      'Someone spots something odd in a chart and wants to ask a colleague about it, right there. Design how they leave a comment pinned to the chart and @mention a teammate.',
    primaryUser: 'An analyst collaborating on a report',
    constraints: [
      'A comment is pinned to a specific visual',
      'Mentioning a teammate should notify them',
      'Others should see the conversation in context',
    ],
    solution: {
      steps: {
        scope:
          'Restate: let someone pin a comment to a specific visual and @mention a colleague, in context. Ask what matters — tying the note to the right visual and notifying the right person.',
        users:
          'An analyst who spotted something and wants a quick answer. Their one job is to ask about this exact chart without leaving the report.',
        tasks:
          'Main path: select the visual → write a comment → @mention a teammate → they’re notified and reply. The key step is anchoring the comment to the visual.',
        ia:
          'A comment pin on the visual, a side thread panel for the conversation, and an @mention that triggers a notification.',
        screen:
          'Fill it: a chart with a 💬 pin, a thread (“@sam this dip looks wrong?”), a reply box, and a note that Sam was notified.',
        states:
          'Cover the edges: a comment on a visual that later changes, resolving a thread, and mentioning someone without access.',
        metrics:
          'Track questions resolved in-context vs. over email and time to an answer. More in-report conversation is the win.',
      },
      sketches: [
        {
          caption: 'A comment pinned to a chart',
          blocks: [
            { band: 'Report · Sales' },
            { row: [{ t: 'Chart 💬', k: 'chart', w: 1.4 }, { t: 'Thread', k: 'list', w: 1 }], h: 'tall' },
            { row: [{ t: '@sam this dip looks wrong?', k: 'note' }] },
            { row: [{ t: 'Reply…', k: 'field', w: 1.4 }, { t: 'Send', k: 'btn', w: 0.6 }] },
          ],
        },
      ],
    },
  },
  {
    id: 'exp-filter',
    category: 'exploration',
    difficulty: 'core',
    context: 'Microsoft Fabric · Visual filter',
    title: 'Narrow a huge table without code',
    scenario:
      'Someone wants to see just last month’s orders over $500 from one region, but they can’t write a query. Design the visual filter builder that lets them stack simple conditions and see the count update live.',
    primaryUser: 'An analyst exploring without writing queries',
    constraints: [
      'No query language — pick column, operator, value',
      'Multiple conditions stack together',
      'The result count should update as they go',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a no-code way to stack simple conditions and narrow a big table, with a live count. Ask what matters — plain conditions and instant feedback.',
        users:
          'An analyst who can’t or won’t write a query. Their one job is to slice the data to what they care about and watch it shrink as they add filters.',
        tasks:
          'Main path: add a condition → see the count drop → add another → view the rows. The key step is the live count that confirms each filter.',
        ia:
          'A stack of condition rows (column · operator · value) with a running result count, an add button, and the resulting rows below.',
        screen:
          'Fill it: conditions (date is last month · amount > 500 · region is North), a live “1,204 rows match”, “＋ Add”, and the result grid.',
        states:
          'Cover the edges: zero matches (suggest loosening), a condition on a missing column, and many conditions (keep it readable).',
        metrics:
          'Track successful exploration without falling back to SQL and time to the rows they wanted. More self-serve slicing is the win.',
      },
      sketches: [
        {
          caption: 'Stacked conditions with a live count',
          blocks: [
            { band: 'Filter · Orders' },
            { row: [{ t: 'date is last month ▾', k: 'field' }] },
            { row: [{ t: 'amount > 500 ▾', k: 'field' }] },
            { row: [{ t: 'region is North ▾', k: 'field', w: 1.3 }, { t: '＋ Add', k: 'btn', w: 0.7 }] },
            { row: [{ t: '1,204 rows match', k: 'note' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'exp-export',
    category: 'exploration',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Export',
    title: 'Take a slice of this data elsewhere',
    scenario:
      'Someone wants to pull a filtered slice of a table into a spreadsheet. Design the export dialog — format, what’s included, and an honest heads-up about row limits.',
    primaryUser: 'An analyst taking data into another tool',
    constraints: [
      'Choose a format and what to include (filtered vs. all)',
      'Big exports have row limits — be honest',
      'Avoid accidentally exporting sensitive columns',
    ],
    solution: {
      steps: {
        scope:
          'Restate: export a slice of data to another tool, honestly handling format, scope, and limits. Ask what matters — filtered vs. all, and row caps.',
        users:
          'An analyst moving data into a spreadsheet or another tool. Their one job is the right slice without surprises about what came out.',
        tasks:
          'Main path: choose format → choose scope → see the row count and any limit → export. The key step is being honest about caps.',
        ia:
          'A compact dialog: format, scope toggle, a clear row count and limit note, and a warning if sensitive columns are included.',
        screen:
          'Fill it: format (CSV ▾), scope (current filter: 1,204 • or all: 10M, capped at 150k), a “⚠ includes a sensitive column”, and “Export”.',
        states:
          'Cover the edges: an export over the limit (explain, offer to narrow), a sensitive column included (warn), and a slow export (progress).',
        metrics:
          'Track exports that match expectations and how rarely sensitive data leaks. Fewer “this is truncated / why is this here?” surprises is the goal.',
      },
      sketches: [
        {
          caption: 'Export with honest limits',
          blocks: [
            { band: 'Export' },
            { row: [{ t: 'Format: CSV ▾', k: 'field', w: 1 }, { t: 'Current filter (1,204) ▾', k: 'field', w: 1.2 }] },
            { row: [{ t: 'All = 10M, capped at 150k rows', k: 'note' }] },
            { row: [{ t: '⚠ Includes a sensitive column', k: 'note' }] },
            { row: [{ t: 'Export', k: 'btn' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'exp-related',
    category: 'exploration',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Related records',
    title: 'Follow a customer to their orders',
    scenario:
      'Someone is looking at one customer and wants to jump to that customer’s orders, then into a specific order’s items — following the connections without writing joins. Design that navigation.',
    primaryUser: 'An analyst tracing connected records',
    constraints: [
      'Move from one record to its related records easily',
      'Keep track of where they came from',
      'Relationships branch (a customer has orders, payments, tickets)',
    ],
    solution: {
      steps: {
        scope:
          'Restate: let someone hop from a record to its related records (customer → orders → items) without writing joins. Ask what matters — not getting lost while branching.',
        users:
          'An analyst tracing connections. Their one job is to follow the thread and still know where they came from.',
        tasks:
          'Main path: open a record → see its related sets → jump into one → drill again. The key step is a breadcrumb so they can step back.',
        ia:
          'A record view with a panel of related sets showing counts, and a breadcrumb trail across the top as they drill.',
        screen:
          'Fill it: “Customer: Jordan”, related chips (Orders 14 · Payments 9 · Tickets 2), a breadcrumb “Customer › Orders › Order #1842”, and the current set.',
        states:
          'Cover the edges: a record with no related items, a set with thousands (paginate), and a deep trail (jump back to any crumb).',
        metrics:
          'Track multi-hop journeys completed without writing a query and how often they backtrack confused. Smooth tracing is the measure.',
      },
      sketches: [
        {
          caption: 'Hop across related records with a trail',
          blocks: [
            { band: 'Customer: Jordan' },
            { row: [{ t: 'Orders 14', k: 'tag', w: 1 }, { t: 'Payments 9', k: 'tag', w: 1 }, { t: 'Tickets 2', k: 'tag', w: 1 }] },
            { row: [{ t: 'Customer › Orders › Order #1842', k: 'note' }] },
            { row: [{ t: 'Items in this order', k: 'list' }], h: 'tall' },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-deploy',
    category: 'admin',
    difficulty: 'stretch',
    context: 'Microsoft Fabric · Deployment pipeline',
    title: 'Move a report from test to live',
    scenario:
      'A report is finished in a test workspace and needs to go to production. Design the screen that moves it through stages (Dev → Test → Live), showing what differs between stages before each promotion.',
    primaryUser: 'A workspace lead releasing changes safely',
    constraints: [
      'Three stages, content promoted between them',
      'Show what changed before promoting',
      'A bad promotion affects real users',
    ],
    solution: {
      steps: {
        scope:
          'Restate: promote content through Dev → Test → Live, showing what differs before each step. Ask what matters — seeing the diff and not breaking production.',
        users:
          'A workspace lead shipping changes. Their one job is to release safely, knowing exactly what’s changing for real users.',
        tasks:
          'Main path: pick the stage to promote → review what differs → confirm the promotion. The key step is the pre-promotion diff.',
        ia:
          'Three stage columns (Dev / Test / Live) side by side, each showing its contents and a “what’s different” summary, with a deploy action between them.',
        screen:
          'Fill it: three columns, a “3 items changed since Live — review” note, the list of changed items, and a “Deploy to Live”.',
        states:
          'Cover the edges: nothing changed (nothing to deploy), a breaking change (warn strongly), and a deployment in progress (lock, show status).',
        metrics:
          'Track safe releases and how rarely a promotion causes a production incident. Fewer “the live report broke” events is the win.',
      },
      sketches: [
        {
          caption: 'Three stages with a diff before deploy',
          blocks: [
            { band: 'Deployment · Sales report' },
            { row: [{ t: 'Dev', k: 'list', w: 1 }, { t: 'Test', k: 'list', w: 1 }, { t: 'Live', k: 'list', w: 1 }], h: 'tall' },
            { row: [{ t: '3 items changed since Live — review', k: 'note' }] },
            { row: [{ t: 'Deploy to Live', k: 'btn' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-cost',
    category: 'admin',
    difficulty: 'core',
    context: 'Microsoft Fabric · Cost & usage',
    title: 'See what’s costing money this month',
    scenario:
      'A finance-minded admin wants to know where this month’s Fabric spend is going. Design a screen that breaks down cost by workspace and trend, and flags anything growing fast.',
    primaryUser: 'An admin watching the budget',
    constraints: [
      'Break down spend by workspace or item',
      'Show the trend, not just a total',
      'Flag fast-growing costs early',
    ],
    solution: {
      steps: {
        scope:
          'Restate: show where this month’s spend goes and flag what’s growing fast. Ask what matters — attribution to a workspace and an early-warning trend.',
        users:
          'An admin accountable for the budget. Their one job is to see where money goes and catch a runaway cost before the invoice.',
        tasks:
          'Main path: see the total and trend → find the biggest or fastest-growing area → act or investigate. The key step is surfacing the fast-growers, not just totals.',
        ia:
          'A headline spend + trend line on top, a ranked breakdown by workspace below, and a “growing fast” flag on outliers.',
        screen:
          'Fill it: KPIs (this month £4.2k · ▲18%), a spend trend line, a “top workspaces by cost” list, and a “⚠ Marketing up 60%” flag.',
        states:
          'Cover the edges: a quiet month (no alarms), a sudden spike (explain and attribute), and incomplete month-to-date data (project carefully).',
        metrics:
          'Track surprises avoided (caught before invoice) and time to attribute a spike. Fewer budget overruns is the headline.',
      },
      sketches: [
        {
          caption: 'Spend, trend, and fast-growers',
          blocks: [
            { band: 'Cost · this month' },
            { row: [{ t: '£4.2k spent', k: 'kpi' }, { t: '▲18% vs last', k: 'kpi' }] },
            { row: [{ t: 'Spend trend', k: 'line' }], h: 'tall' },
            { row: [{ t: 'Top workspaces by cost', k: 'list' }] },
            { row: [{ t: '⚠ Marketing up 60% this week', k: 'note' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-recycle',
    category: 'admin',
    difficulty: 'warmup',
    context: 'Microsoft Fabric · Recycle bin',
    title: 'Get back something I deleted',
    scenario:
      'Someone deleted a report by accident and panics. Design the recycle bin where they find recently deleted items and restore the right one — with a clear window before things are gone for good.',
    primaryUser: 'Someone who deleted something by mistake',
    constraints: [
      'Find the deleted item among recent deletions',
      'Be clear how long until it’s gone for good',
      'Restore should put it back where it was',
    ],
    solution: {
      steps: {
        scope:
          'Restate: a place to find and restore recently deleted items, with a clear deadline before permanent deletion. Ask what matters — fast findability and reassurance.',
        users:
          'A panicked user who deleted something by accident. Their one job is to find it and put it back fast.',
        tasks:
          'Main path: open the bin → find the item → restore it to where it was. The key step is making the right item easy to find and the deadline clear.',
        ia:
          'A searchable list of deleted items with who/when and days-left-to-restore, and a prominent restore action per row.',
        screen:
          'Fill it: “Recently deleted”, search, a row “Sales report · deleted 2h ago by you · 28 days left” with “Restore”.',
        states:
          'Cover the edges: an item past its window (explain it’s gone), a name clash on restore (where to put it), and an empty bin.',
        metrics:
          'Track successful self-restores and how rarely people raise a “help, I deleted X” ticket. Fewer panic tickets is the win.',
      },
      sketches: [
        {
          caption: 'Find and restore a deleted item',
          blocks: [
            { band: 'Recently deleted' },
            { row: [{ t: '🔍 Search deleted items', k: 'field' }] },
            { row: [{ t: 'Sales report · deleted 2h ago · 28 days left', k: 'list', w: 1.6 }, { t: 'Restore', k: 'btn', w: 0.8 }] },
            { row: [{ t: 'Marketing dashboard · 5 days ago', k: 'list', w: 1.6 }, { t: 'Restore', k: 'btn', w: 0.8 }] },
            { row: [{ t: 'After 30 days, items are gone for good', k: 'note' }] },
          ],
        },
      ],
    },
  },
  {
    id: 'adm-audit',
    category: 'admin',
    difficulty: 'core',
    context: 'Microsoft Fabric · Audit log',
    title: 'Who opened this sensitive report?',
    scenario:
      'After a leak scare, an admin needs to see who viewed, shared, or exported a sensitive report and when. Design the audit view that answers that without drowning them in raw logs.',
    primaryUser: 'An admin investigating access to sensitive data',
    constraints: [
      'Filter to one item and the actions that matter (view, share, export)',
      'Raw logs are overwhelming — summarise',
      'Needs to spot anything unusual',
    ],
    solution: {
      steps: {
        scope:
          'Restate: show who did what (viewed, shared, exported) to a sensitive item and when, without raw-log overload. Ask what matters — filtering to the actions that count and spotting the unusual.',
        users:
          'An admin investigating after a scare. Their one job is to answer “who touched this and is anything off?” quickly.',
        tasks:
          'Main path: scope to the item → filter to risky actions → scan for anything unusual → drill into an entry. The key step is summarising over dumping logs.',
        ia:
          'A scoped header (this item), action filters (view / share / export), a list of who-did-what-when, with unusual entries flagged.',
        screen:
          'Fill it: “Audit · Finance report”, filter chips (views / shares / exports), a list “Jordan exported · 9:14am ⚠ unusual”, and an export-evidence action.',
        states:
          'Cover the edges: no activity (reassure), a flood of normal views (summarise counts), and a genuinely suspicious pattern (flag clearly).',
        metrics:
          'Track time to answer “who accessed this?” and incidents caught. Faster, clearer investigations is the measure.',
      },
      sketches: [
        {
          caption: 'Audit, filtered and summarised',
          blocks: [
            { band: 'Audit · Finance report' },
            { row: [{ t: 'Views', k: 'tab' }, { t: 'Shares', k: 'tab' }, { t: 'Exports', k: 'tab' }] },
            { row: [{ t: 'Who did what, when', k: 'list' }], h: 'xtall' },
            { row: [{ t: '⚠ Jordan exported at 9:14am — unusual', k: 'note' }] },
          ],
        },
      ],
    },
  },
]

// Pick a random prompt matching the chosen category + difficulty filters.
export const pickPrompt = (categoryId, difficultyId, excludeId) => {
  let pool = PROMPTS.filter((p) => {
    const catOk = categoryId === 'all' || p.category === categoryId
    const diffOk = difficultyId === 'all' || p.difficulty === difficultyId
    return catOk && diffOk
  })
  if (pool.length === 0) pool = PROMPTS
  // Avoid immediately repeating the same prompt when more than one is available.
  const filtered = pool.length > 1 && excludeId ? pool.filter((p) => p.id !== excludeId) : pool
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export const categoryLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || id

export const difficultyLabel = (id) => DIFFICULTIES.find((d) => d.id === id)?.label || id
