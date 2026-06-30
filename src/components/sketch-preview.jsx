import { useMemo } from 'react'
import rough from 'roughjs'
import './sketch-preview.css'

// Renders a sketch's block grammar as a hand-drawn, low-fidelity wireframe —
// wobbly pencil strokes (roughjs), a handwriting font (Caveat), a little window
// frame, and lo-fi placeholders (squiggle lines, chart bars, image X's). The
// layout math is shared with sketch-to-shapes.js so "Insert into canvas" lands
// the same wireframe as editable shapes.
//
// Grammar:
//   { band: 'text' }                 a title bar
//   { row: [cell, ...], h }          a row; h: 'short'|'tall'|'xtall'
//   cell = 'label' | { t, k, w }     k: btn|note|kpi|chart|line|list|nav|field|tab|tag|avatar|image
//                                    w: relative column width

const W = 360
const PAD = 14
const GAP = 9
const BAND_H = 30
const CHROME_H = 28
const ROW_H = { short: 26, default: 48, tall: 80, xtall: 112 }

const normalizeCell = (cell) =>
  typeof cell === 'string' ? { t: cell, k: 'box', w: 1 } : { w: 1, k: 'box', ...cell }

// Walk the blocks once into positioned items. Shared by the renderer and the
// canvas translator so both agree on exactly where everything sits.
export const layoutSketch = (blocks) => {
  const items = []
  let y = PAD + CHROME_H
  blocks.forEach((block) => {
    if (block.band !== undefined) {
      items.push({ role: 'band', kind: 'band', x: PAD, y, w: W - PAD * 2, h: BAND_H, text: block.band })
      y += BAND_H + GAP
      return
    }
    if (block.row) {
      const h = ROW_H[block.h] || ROW_H.default
      const cells = block.row.map(normalizeCell)
      const total = cells.reduce((s, c) => s + c.w, 0) || 1
      const innerW = W - PAD * 2 - GAP * (cells.length - 1)
      let cx = PAD
      cells.forEach((c) => {
        const cw = (innerW * c.w) / total
        items.push({ role: 'cell', kind: c.k, x: cx, y, w: cw, h, text: c.t })
        cx += cw + GAP
      })
      y += h + GAP
    }
  })
  return { items, width: W, height: y - GAP + PAD }
}

// ---- hand-drawn rendering ----
const gen = rough.generator()
const FILLED = new Set(['btn', 'note', 'kpi', 'tab', 'tag'])
const CENTERED = new Set(['btn', 'kpi', 'tab', 'tag'])
const TOP_LABEL = new Set(['chart', 'line', 'list', 'nav'])

const fillFor = (k) => (k === 'btn' ? '#2b2b33' : k === 'note' || k === 'kpi' ? '#cfe2f3' : '#e0eaf4')

const truncate = (t, wpx, per = 7.4) => {
  const max = Math.max(3, Math.floor(wpx / per))
  return t.length > max ? `${t.slice(0, max - 1)}…` : t
}

// roughjs Drawable -> array of <path> elements.
const toPaths = (drawable, key) =>
  gen.toPaths(drawable).map((p, i) => (
    <path
      key={`${key}_${i}`}
      d={p.d}
      stroke={p.stroke}
      strokeWidth={p.strokeWidth}
      fill={p.fill || 'none'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ))

const decor = (it, i, seed) => {
  const { x, y, w, h, kind: k } = it
  const out = []
  if (k === 'chart') {
    const bars = [0.5, 0.85, 0.4, 0.95, 0.6]
    const bw = (w - 24) / (bars.length * 1.5)
    const base = y + h - 10
    bars.forEach((b, j) => {
      const bh = (h - 28) * b
      out.push(
        ...toPaths(
          gen.rectangle(x + 12 + j * bw * 1.5, base - bh, bw, bh, {
            roughness: 0.8,
            fill: '#aed2ee',
            fillStyle: 'hachure',
            fillWeight: 1,
            hachureGap: 3,
            stroke: '#7eb4dd',
            strokeWidth: 0.7,
            seed: seed + j + 1,
          }),
          `ch${i}${j}`,
        ),
      )
    })
  } else if (k === 'line') {
    const pts = [
      [12, h - 14],
      [w * 0.3, h * 0.42],
      [w * 0.5, h * 0.62],
      [w * 0.72, h * 0.3],
      [w - 14, h * 0.5],
    ].map(([px, py]) => [x + px, y + py])
    out.push(...toPaths(gen.linearPath(pts, { roughness: 1, stroke: '#5fa8d8', strokeWidth: 1.4, seed }), `ln${i}`))
  } else if (k === 'list') {
    const widths = [0.92, 0.66, 0.82, 0.6]
    widths.forEach((lw, j) => {
      const ly = y + (it.text ? 26 : 16) + j * 12
      if (ly < y + h - 5)
        out.push(
          ...toPaths(
            gen.line(x + 12, ly, x + 12 + (w - 24) * lw, ly, { roughness: 0.7, stroke: '#aab0bd', strokeWidth: 1, seed: seed + j }),
            `li${i}${j}`,
          ),
        )
    })
  } else if (k === 'nav') {
    ;[0, 1, 2].forEach((j) => {
      const cy = y + 18 + j * 14
      if (cy < y + h - 2)
        out.push(
          ...toPaths(gen.circle(x + 15, cy, 7, { roughness: 0.7, stroke: '#aab0bd', strokeWidth: 1, seed: seed + j }), `nv${i}${j}`),
        )
    })
  } else if (k === 'avatar') {
    const d = Math.min(h, 26) - 6
    out.push(...toPaths(gen.circle(x + d / 2 + 8, y + h / 2, d, { roughness: 0.9, stroke: '#8a90a0', strokeWidth: 1, seed }), `av${i}`))
  } else if (k === 'image') {
    // classic wireframe image placeholder: a box with an X
    out.push(...toPaths(gen.line(x + 6, y + 6, x + w - 6, y + h - 6, { roughness: 0.8, stroke: '#b3b8c4', strokeWidth: 1, seed }), `ix${i}a`))
    out.push(...toPaths(gen.line(x + w - 6, y + 6, x + 6, y + h - 6, { roughness: 0.8, stroke: '#b3b8c4', strokeWidth: 1, seed: seed + 1 }), `ix${i}b`))
  }
  return out
}

const renderItem = (it, i) => {
  const seed = i + 3
  const out = []
  if (it.role === 'band') {
    out.push(
      ...toPaths(
        gen.rectangle(it.x, it.y, it.w, it.h, { roughness: 1, bowing: 1.4, stroke: '#9aa0ad', strokeWidth: 1, seed }),
        `b${i}`,
      ),
    )
    if (it.text)
      out.push(
        <text key={`bt${i}`} className="sk-text sk-band" x={it.x + 11} y={it.y + it.h / 2 + 5}>
          {truncate(it.text, it.w - 22, 7)}
        </text>,
      )
    return out
  }

  const k = it.kind
  if (!it.text && k === 'box') return out // spacer

  const opts = {
    roughness: 1.1,
    bowing: 1,
    stroke: k === 'btn' ? '#2b2b33' : '#7c8493',
    strokeWidth: k === 'btn' ? 1.7 : 1.1,
    seed,
  }
  if (FILLED.has(k)) {
    opts.fill = fillFor(k)
    opts.fillStyle = 'solid'
  }
  out.push(...toPaths(gen.rectangle(it.x, it.y, it.w, it.h, opts), `c${i}`))
  out.push(...decor(it, i, seed))

  if (it.text) {
    const centered = CENTERED.has(k)
    const top = TOP_LABEL.has(k)
    const tx = k === 'avatar' ? it.x + Math.min(it.h, 26) + 6 : centered ? it.x + it.w / 2 : it.x + 11
    const ty = top ? it.y + 15 : it.y + it.h / 2 + (k === 'kpi' ? 7 : 5)
    const cls = ['sk-text', k === 'btn' ? 'sk-on-dark' : '', k === 'kpi' ? 'sk-kpi' : ''].filter(Boolean).join(' ')
    out.push(
      <text key={`t${i}`} className={cls} x={tx} y={ty} textAnchor={centered ? 'middle' : 'start'}>
        {truncate(it.text, centered ? it.w - 12 : it.w - 22, k === 'kpi' ? 9 : 7.4)}
      </text>,
    )
  }
  return out
}

const SketchPreview = ({ blocks = [] }) => {
  const { items, height } = useMemo(() => layoutSketch(blocks), [blocks])

  const chrome = useMemo(() => {
    const out = []
    out.push(
      ...toPaths(
        gen.rectangle(5, 5, W - 10, height - 10, { roughness: 0.7, bowing: 0.5, stroke: '#b6bcc7', strokeWidth: 1.3, seed: 99 }),
        'frame',
      ),
    )
    out.push(...toPaths(gen.line(5, 5 + CHROME_H, W - 5, 5 + CHROME_H, { roughness: 0.7, stroke: '#cfd3da', strokeWidth: 1, seed: 98 }), 'bar'))
    ;[0, 1, 2].forEach((j) =>
      out.push(...toPaths(gen.circle(22 + j * 15, 5 + CHROME_H / 2, 8, { roughness: 0.6, stroke: '#c2c7d0', strokeWidth: 1, seed: 90 + j }), `dot${j}`)),
    )
    return out
  }, [height])

  const body = useMemo(() => items.flatMap((it, i) => renderItem(it, i)), [items])

  return (
    <svg
      className="sketch-preview"
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Example low-fidelity sketch"
    >
      <rect x="0" y="0" width={W} height={height} fill="var(--color-canvas)" />
      {chrome}
      {body}
    </svg>
  )
}

export default SketchPreview
