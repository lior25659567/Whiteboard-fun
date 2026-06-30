import { layoutSketch } from './sketch-preview.jsx'

// Translate a sketch's block grammar into editable whiteboard shapes, so the
// example wireframe can be dropped onto the canvas and reworked. Uses the same
// layout as <SketchPreview> so the inserted version matches the preview.
//
// Filled cells (buttons, callouts, KPIs, tabs, tags) become sticky notes;
// outline cells become rectangles with a text label; bands become a framed
// title with a label.
const FILLED = new Set(['btn', 'note', 'kpi', 'tab', 'tag'])
const INK = '#070709'
const SKY = '#2597d0'
const CHARCOAL = '#60606c'

export const sketchToShapes = (blocks, { ox = 64, oy = 56, scale = 1.6 } = {}) => {
  const { items } = layoutSketch(blocks)
  const shapes = []

  for (const it of items) {
    const x = ox + it.x * scale
    const y = oy + it.y * scale
    const w = it.w * scale
    const h = it.h * scale

    if (it.role === 'band') {
      shapes.push({ type: 'rect', x, y, w, h, color: INK })
      if (it.text) shapes.push({ type: 'text', x: x + 10, y: y + 8, text: it.text, fontSize: 14, color: CHARCOAL })
      continue
    }

    if (!it.text && it.kind === 'box') continue // spacer

    if (FILLED.has(it.kind)) {
      // sticky notes are filled + already carry their own text
      shapes.push({ type: 'sticky', x, y, w, h, color: it.kind === 'btn' ? INK : SKY, text: it.text || '' })
    } else {
      shapes.push({ type: 'rect', x, y, w, h, color: it.kind === 'note' ? SKY : INK })
      if (it.text) shapes.push({ type: 'text', x: x + 10, y: y + 10, text: it.text, fontSize: 13, color: INK })
    }
  }

  return shapes
}
