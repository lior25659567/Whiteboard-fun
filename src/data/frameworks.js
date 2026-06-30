// The whiteboard-challenge framework, aligned to the widely-taught best practice
// (clarify → user story → generate ideas → sketch the critical screens →
// summarise), adapted for data-product UX. Each step carries a `hint` (what to
// do) and a `tip` (a pro move from how real whiteboard interviews are run).
// Ticking these off builds a repeatable habit; each prompt's worked solution
// answers these same steps in order.
// (Keep ids stable: sessions store which steps were ticked by id, and the
// solution walkthrough is keyed to these ids. `ideate` has no per-prompt answer
// — it's your divergent thinking — so the solution shows this guidance for it.)

export const FRAMEWORK_STEPS = [
  {
    id: 'scope',
    label: 'Clarify the challenge',
    hint: 'Resist drawing first. Restate the problem, then ask the questions that shape everything: who the users are and their pain points, where and when they’ll use it, the business goals, any constraints, the device, and what success looks like.',
    tip: 'Role-play it — ask your interviewer to act as a user or stakeholder while you clarify.',
  },
  {
    id: 'users',
    label: 'Who it’s for, and why',
    hint: 'Pick one user and the single job they’re trying to get done. If there are several, choose one out loud and say why, noting the others you’re setting aside.',
    tip: 'Designing for everyone helps no one — commit to one persona and one job.',
  },
  {
    id: 'tasks',
    label: 'Outline the user story',
    hint: 'List the path the user takes to reach their goal as a simple, bulleted flow, then pick the one step that matters most.',
    tip: 'A flow on the board keeps you and the interviewer oriented before you draw any screens.',
  },
  {
    id: 'ideate',
    label: 'Generate ideas',
    hint: 'Go wide before you commit — rough out two or three different directions for the solution, then narrow to the one or two that best fit the user’s pain points and the constraints you uncovered.',
    tip: 'Stuck? Just start sketching — putting marker to board gets ideas flowing. Quantity first, quality second.',
  },
  {
    id: 'ia',
    label: 'Block out the layout',
    hint: 'Rough in the chosen screen — what goes where, the regions and hierarchy, and what should stand out most.',
    tip: 'Split your board: notes and the user flow on the left, sketches on the right (rough ideas up top, detailed wireframes below).',
  },
  {
    id: 'screen',
    label: 'Sketch the key screen',
    hint: 'Zoom in on the one screen that matters and fill it with real-looking content. Label it and match it to a step in your flow.',
    tip: 'Narrate as you draw and treat it as a conversation — fold in the interviewer’s feedback as you go.',
  },
  {
    id: 'states',
    label: 'Handle the tricky moments',
    hint: 'Think through what happens when it’s empty, loading, broken, off-limits, or huge — the states that make or break a data UI.',
    tip: 'Cover the primary path first; reach for edge cases only once the happy path is solid and you have time.',
  },
  {
    id: 'metrics',
    label: 'Summarise & success',
    hint: 'Recap how your design serves both the user and the business, then name a couple of signs it’s working — faster, fewer mistakes, more adoption.',
    tip: 'With time left, mention other use cases you’d explore or what you’d iterate next.',
  },
]
