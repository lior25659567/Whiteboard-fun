// Self-scoring rubric shown in the review phase. Each criterion scored 1-5.

export const RUBRIC_CRITERIA = [
  {
    id: 'framing',
    label: 'Problem framing',
    hint: 'Did you clarify scope, constraints, and goals before designing?',
  },
  {
    id: 'users',
    label: 'User focus',
    hint: 'Did the solution stay anchored to a specific user and their job?',
  },
  {
    id: 'layout',
    label: 'Layout & IA clarity',
    hint: 'Is the structure legible, with a clear hierarchy and a primary action?',
  },
  {
    id: 'edge',
    label: 'Data & edge-case coverage',
    hint: 'Empty / loading / error / scale / permissions — did you handle the hard states?',
  },
  {
    id: 'comms',
    label: 'Communication & structure',
    hint: 'Did you narrate a clear story and manage time across the framework?',
  },
]

export const SCORE_SCALE = [1, 2, 3, 4, 5]

export const scoreLabel = (n) =>
  ({ 1: 'Weak', 2: 'Shaky', 3: 'Solid', 4: 'Strong', 5: 'Excellent' })[n] || ''
