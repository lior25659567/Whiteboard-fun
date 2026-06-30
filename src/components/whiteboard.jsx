import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import './whiteboard.css'
import WhiteboardToolbar, { BOARD_COLORS } from './whiteboard-toolbar.jsx'
import { sketchToShapes } from './sketch-to-shapes.js'

// ---- geometry helpers ----
let idCounter = 0
const nextId = () => `s${Date.now().toString(36)}${idCounter++}`

const stickyTint = (colorValue) =>
  BOARD_COLORS.find((c) => c.value === colorValue)?.tint || 'var(--color-sky-soft)'

// Naive word-wrap into lines that fit a sticky's width (rendered as <tspan>s,
// not <foreignObject>, so PNG export rasterizes reliably across browsers).
const wrapText = (text, widthPx, fontSize) => {
  if (!text) return []
  const charsPerLine = Math.max(4, Math.floor(widthPx / (fontSize * 0.56)))
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > charsPerLine && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines.slice(0, 8)
}

const distToSegment = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1
  const dy = y2 - y1
  const len2 = dx * dx + dy * dy || 1
  let t = ((px - x1) * dx + (py - y1) * dy) / len2
  t = Math.max(0, Math.min(1, t))
  const cx = x1 + t * dx
  const cy = y1 + t * dy
  return Math.hypot(px - cx, py - cy)
}

const hitTest = (shape, px, py) => {
  const pad = 8
  if (shape.type === 'rect' || shape.type === 'sticky') {
    const x = Math.min(shape.x, shape.x + shape.w)
    const y = Math.min(shape.y, shape.y + shape.h)
    return (
      px >= x - pad &&
      px <= x + Math.abs(shape.w) + pad &&
      py >= y - pad &&
      py <= y + Math.abs(shape.h) + pad
    )
  }
  if (shape.type === 'text') {
    // Stored y is the top edge (text renders with a hanging baseline).
    const w = Math.max(40, (shape.text?.length || 1) * shape.fontSize * 0.6)
    return px >= shape.x - pad && px <= shape.x + w && py >= shape.y - pad && py <= shape.y + shape.fontSize + pad
  }
  if (shape.type === 'arrow') {
    return distToSegment(px, py, shape.x1, shape.y1, shape.x2, shape.y2) < 10
  }
  if (shape.type === 'path') {
    return shape.points.some((pt) => Math.hypot(px - pt.x, py - pt.y) < 10)
  }
  return false
}

const moveShape = (shape, dx, dy) => {
  switch (shape.type) {
    case 'rect':
    case 'sticky':
    case 'text':
      return { ...shape, x: shape.x + dx, y: shape.y + dy }
    case 'arrow':
      return { ...shape, x1: shape.x1 + dx, y1: shape.y1 + dy, x2: shape.x2 + dx, y2: shape.y2 + dy }
    case 'path':
      return { ...shape, points: shape.points.map((p) => ({ x: p.x + dx, y: p.y + dy })) }
    default:
      return shape
  }
}

// ---- the editor ----
const Whiteboard = forwardRef(({ onDirtyChange }, ref) => {
  const svgRef = useRef(null)
  const interaction = useRef(null)

  const [tool, setTool] = useState('select')
  const [color, setColor] = useState(BOARD_COLORS[0].value)
  const [shapes, setShapes] = useState([])
  const [draft, setDraft] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])
  // Inline text editing overlay: { id?, kind, x, y, w, fontSize, value, isNew }
  const [editing, setEditing] = useState(null)
  const editingRef = useRef(null)
  const editorElRef = useRef(null)

  // Mirror state in refs so commit/undo/redo can update everything with flat,
  // pure setState calls (no nested updaters that StrictMode would double-run).
  const shapesRef = useRef(shapes)
  const pastRef = useRef(past)
  const futureRef = useRef(future)
  const draftRef = useRef(draft)
  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])
  useEffect(() => {
    pastRef.current = past
  }, [past])
  useEffect(() => {
    futureRef.current = future
  }, [future])
  useEffect(() => {
    draftRef.current = draft
  }, [draft])
  useEffect(() => {
    editingRef.current = editing
  }, [editing])

  const markDirty = useCallback(() => onDirtyChange?.(true), [onDirtyChange])

  const applyState = useCallback((nextShapes, nextPast, nextFuture) => {
    shapesRef.current = nextShapes
    pastRef.current = nextPast
    futureRef.current = nextFuture
    setShapes(nextShapes)
    setPast(nextPast)
    setFuture(nextFuture)
  }, [])

  // Commit a new shapes array, pushing the previous one onto the undo stack.
  const commit = useCallback(
    (updater) => {
      const prev = shapesRef.current
      const nextShapes = typeof updater === 'function' ? updater(prev) : updater
      applyState(nextShapes, [...pastRef.current, prev], [])
      markDirty()
    },
    [applyState, markDirty],
  )

  const undo = useCallback(() => {
    if (pastRef.current.length === 0) return
    const previous = pastRef.current[pastRef.current.length - 1]
    applyState(previous, pastRef.current.slice(0, -1), [shapesRef.current, ...futureRef.current])
    setSelectedId(null)
  }, [applyState])

  const redo = useCallback(() => {
    if (futureRef.current.length === 0) return
    const nextState = futureRef.current[0]
    applyState(nextState, [...pastRef.current, shapesRef.current], futureRef.current.slice(1))
  }, [applyState])

  const clearBoard = useCallback(() => {
    if (shapesRef.current.length === 0) return
    commit([])
    setSelectedId(null)
  }, [commit])

  const deleteSelected = useCallback(() => {
    if (!selectedId) return
    commit((prev) => prev.filter((s) => s.id !== selectedId))
    setSelectedId(null)
  }, [selectedId, commit])

  // ---- inline text editing ----
  // Start typing a brand-new text label at a point on the canvas. selectAfter
  // means: once committed, select it and switch to the move tool so it can be
  // dragged immediately.
  const startNewText = (x, y) => {
    setSelectedId(null)
    setEditing({ kind: 'text', isNew: true, x, y, fontSize: 18, value: '', color, selectAfter: true })
  }

  // Edit an existing text label or sticky note in place.
  const startEditShape = (shape, selectAfter = false) => {
    setSelectedId(shape.id)
    if (shape.type === 'text') {
      setEditing({ id: shape.id, kind: 'text', x: shape.x, y: shape.y, fontSize: shape.fontSize, value: shape.text || '', selectAfter })
    } else if (shape.type === 'sticky') {
      const left = Math.min(shape.x, shape.x + shape.w)
      const top = Math.min(shape.y, shape.y + shape.h)
      setEditing({
        id: shape.id,
        kind: 'sticky',
        x: left + 12,
        y: top + 10,
        w: Math.max(40, Math.abs(shape.w) - 24),
        fontSize: 14,
        value: shape.text || '',
        selectAfter,
      })
    }
  }

  const cancelEdit = useCallback(() => {
    setEditing(null)
    editingRef.current = null
  }, [])

  const commitEdit = useCallback(() => {
    const e = editingRef.current
    if (!e) return
    editingRef.current = null
    setEditing(null)
    const value = e.value.trim()
    let targetId = e.id
    if (e.isNew) {
      if (!value) return // discard an empty new label
      targetId = nextId()
      commit((prev) => [...prev, { id: targetId, type: 'text', x: e.x, y: e.y, text: value, fontSize: e.fontSize, color: e.color }])
    } else {
      commit((prev) => prev.map((s) => (s.id === e.id ? { ...s, text: e.value } : s)))
    }
    // Select what we just added/edited; optionally jump to the move tool so it
    // can be dragged right away.
    setSelectedId(targetId)
    if (e.selectAfter) setTool('select')
  }, [commit])

  const onEditorKey = (ev) => {
    if (ev.key === 'Escape') {
      ev.preventDefault()
      cancelEdit()
    } else if (ev.key === 'Enter' && !(editing?.kind === 'sticky' && ev.shiftKey)) {
      // Enter commits; Shift+Enter adds a newline inside a sticky note.
      ev.preventDefault()
      commitEdit()
    }
  }

  // When editing an existing label/note, put the cursor at the end so typing
  // appends rather than replacing the whole thing.
  const editKey = editing ? `${editing.id || 'new'}-${editing.kind}` : null
  useEffect(() => {
    const el = editorElRef.current
    if (editing && !editing.isNew && el) {
      const len = el.value.length
      el.setSelectionRange(len, len)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editKey])

  // ---- pointer math ----
  const pointFromEvent = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handlePointerDown = (e) => {
    if (e.button !== 0) return
    // A click anywhere first finishes any in-progress text edit.
    if (editingRef.current) {
      commitEdit()
      return
    }
    const { x, y } = pointFromEvent(e)
    svgRef.current.setPointerCapture(e.pointerId)

    if (tool === 'select') {
      // top-most hit
      const hit = [...shapes].reverse().find((s) => hitTest(s, x, y))
      if (hit) {
        setSelectedId(hit.id)
        interaction.current = { mode: 'move', startX: x, startY: y, moved: false, base: shapes }
      } else {
        setSelectedId(null)
      }
      return
    }

    if (tool === 'eraser') {
      const hit = [...shapes].reverse().find((s) => hitTest(s, x, y))
      if (hit) commit((prev) => prev.filter((s) => s.id !== hit.id))
      return
    }

    if (tool === 'text') {
      // Place a caret and type directly on the canvas.
      startNewText(x, y)
      return
    }

    if (tool === 'pen') {
      interaction.current = { mode: 'pen' }
      setDraft({ id: nextId(), type: 'path', points: [{ x, y }], color })
      return
    }

    // rect / sticky / arrow draw
    interaction.current = { mode: 'draw', startX: x, startY: y }
    if (tool === 'rect') setDraft({ id: nextId(), type: 'rect', x, y, w: 0, h: 0, color })
    else if (tool === 'sticky')
      setDraft({ id: nextId(), type: 'sticky', x, y, w: 0, h: 0, color, text: '' })
    else if (tool === 'arrow')
      setDraft({ id: nextId(), type: 'arrow', x1: x, y1: y, x2: x, y2: y, color })
  }

  const handlePointerMove = (e) => {
    const act = interaction.current
    if (!act) return
    const { x, y } = pointFromEvent(e)

    if (act.mode === 'move' && selectedId) {
      const dx = x - act.startX
      const dy = y - act.startY
      act.startX = x
      act.startY = y
      act.moved = true
      setShapes((prev) => prev.map((s) => (s.id === selectedId ? moveShape(s, dx, dy) : s)))
      return
    }

    if (act.mode === 'pen') {
      setDraft((d) => (d ? { ...d, points: [...d.points, { x, y }] } : d))
      return
    }

    if (act.mode === 'draw') {
      setDraft((d) => {
        if (!d) return d
        if (d.type === 'arrow') return { ...d, x2: x, y2: y }
        return { ...d, w: x - act.startX, h: y - act.startY }
      })
    }
  }

  const handlePointerUp = (e) => {
    const act = interaction.current
    interaction.current = null
    try {
      svgRef.current.releasePointerCapture(e.pointerId)
    } catch {
      /* pointer may already be released */
    }
    if (!act) return

    if (act.mode === 'move') {
      // Commit the move as one undo step using the pre-drag snapshot.
      if (act.moved) {
        applyState(shapesRef.current, [...pastRef.current, act.base], [])
        markDirty()
      }
      return
    }

    if (act.mode === 'pen') {
      const d = draftRef.current
      draftRef.current = null
      setDraft(null)
      if (d && d.points.length > 1) commit((prev) => [...prev, d])
      return
    }

    if (act.mode === 'draw') {
      const d = draftRef.current
      draftRef.current = null
      setDraft(null)
      if (!d) return
      if (d.type === 'arrow' && Math.hypot(d.x2 - d.x1, d.y2 - d.y1) < 6) return
      let finalShape = d
      if (d.type === 'sticky' || d.type === 'rect') {
        // Give a click (no drag) a sensible default size.
        const w = Math.abs(d.w) < 8 ? 160 : d.w
        const h = Math.abs(d.h) < 8 ? (d.type === 'sticky' ? 120 : 90) : d.h
        finalShape = { ...d, w, h }
      }
      commit((prev) => [...prev, finalShape])
      // Immediately type into a freshly drawn sticky note, then leave it
      // selected on the move tool so it can be repositioned.
      if (finalShape.type === 'sticky') startEditShape(finalShape, true)
    }
  }

  // Double-click to edit a text label or sticky note in place.
  const handleDoubleClick = (e) => {
    const { x, y } = pointFromEvent(e)
    const hit = [...shapes].reverse().find((s) => hitTest(s, x, y))
    if (hit && (hit.type === 'text' || hit.type === 'sticky')) startEditShape(hit)
  }

  // Recolor the selected shape when the swatch changes.
  const handleColorChange = (value) => {
    setColor(value)
    if (selectedId) {
      commit((prev) => prev.map((s) => (s.id === selectedId ? { ...s, color: value } : s)))
    }
  }

  // Keyboard: delete + undo/redo.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
      if (typing) return
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault()
        deleteSelected()
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault()
        if (e.shiftKey) redo()
        else undo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, deleteSelected, undo, redo])

  // ---- export ----
  const buildSvgString = useCallback(() => {
    const node = svgRef.current
    const w = node.clientWidth
    const h = node.clientHeight
    const clone = node.cloneNode(true)
    clone.setAttribute('width', w)
    clone.setAttribute('height', h)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    // White background rect so the PNG is not transparent.
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
    bg.setAttribute('x', 0)
    bg.setAttribute('y', 0)
    bg.setAttribute('width', w)
    bg.setAttribute('height', h)
    bg.setAttribute('fill', '#ffffff')
    clone.insertBefore(bg, clone.firstChild)
    // Drop the selection outline from the export.
    clone.querySelectorAll('[data-export-ignore]').forEach((el) => el.remove())
    return { svg: new XMLSerializer().serializeToString(clone), w, h }
  }, [])

  const exportPng = useCallback(
    (maxW) =>
      new Promise((resolve) => {
        const { svg, w, h } = buildSvgString()
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          const scale = maxW ? Math.min(1, maxW / w) : 1
          const canvas = document.createElement('canvas')
          canvas.width = Math.round(w * scale)
          canvas.height = Math.round(h * scale)
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
          URL.revokeObjectURL(url)
          resolve(canvas.toDataURL('image/png'))
        }
        img.onerror = () => {
          URL.revokeObjectURL(url)
          resolve(null)
        }
        img.src = url
      }),
    [buildSvgString],
  )

  const downloadPng = useCallback(async () => {
    const dataUrl = await exportPng()
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'whiteboard.png'
    a.click()
  }, [exportPng])

  // Drop an example sketch onto the canvas as editable shapes (one undo step).
  const insertSketch = useCallback(
    (blocks) => {
      const added = sketchToShapes(blocks).map((s) => ({ ...s, id: nextId() }))
      if (added.length === 0) return
      commit((prev) => [...prev, ...added])
      setSelectedId(null)
    },
    [commit],
  )

  // Expose to parent for saving the session and inserting sketches.
  useImperativeHandle(ref, () => ({
    getShapes: () => shapes,
    exportThumbnail: () => exportPng(480),
    isEmpty: () => shapes.length === 0,
    insertSketch,
  }))

  // ---- render a single shape ----
  const renderShape = (s) => {
    const selected = s.id === selectedId
    const common = { 'data-id': s.id }
    if (s.type === 'rect') {
      const x = Math.min(s.x, s.x + s.w)
      const y = Math.min(s.y, s.y + s.h)
      return (
        <rect
          key={s.id}
          {...common}
          x={x}
          y={y}
          width={Math.abs(s.w)}
          height={Math.abs(s.h)}
          rx="10"
          fill="none"
          stroke={s.color}
          strokeWidth={selected ? 3 : 2}
        />
      )
    }
    if (s.type === 'sticky') {
      const x = Math.min(s.x, s.x + s.w)
      const y = Math.min(s.y, s.y + s.h)
      const w = Math.abs(s.w)
      const h = Math.abs(s.h)
      return (
        <g key={s.id} {...common}>
          <rect x={x} y={y} width={w} height={h} rx="10" fill={stickyTint(s.color)} stroke="none" />
          {s.text && !(editing && editing.id === s.id) && (
            <text
              x={x + 12}
              y={y + 24}
              fill="#070709"
              fontSize="14"
              fontFamily="Manrope, sans-serif"
              fontWeight="500"
            >
              {wrapText(s.text, w - 24, 14).map((line, i) => (
                <tspan key={i} x={x + 12} dy={i === 0 ? 0 : 18}>
                  {line}
                </tspan>
              ))}
            </text>
          )}
          {selected && (
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="10"
              fill="none"
              stroke={s.color}
              strokeWidth="2"
            />
          )}
        </g>
      )
    }
    if (s.type === 'text') {
      // Hidden while it's being edited inline (the overlay input takes over).
      if (editing && editing.id === s.id) return null
      return (
        <text
          key={s.id}
          {...common}
          x={s.x}
          y={s.y}
          dominantBaseline="hanging"
          fill={s.color}
          fontSize={s.fontSize}
          fontFamily="Manrope, sans-serif"
          fontWeight="600"
          textDecoration={selected ? 'underline' : 'none'}
        >
          {s.text}
        </text>
      )
    }
    if (s.type === 'arrow') {
      const markerId = `arrowhead-${s.color.replace('#', '')}`
      return (
        <g key={s.id} {...common}>
          <defs>
            <marker
              id={markerId}
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L8,3 L0,6 Z" fill={s.color} />
            </marker>
          </defs>
          <line
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            stroke={s.color}
            strokeWidth={selected ? 3 : 2}
            markerEnd={`url(#${markerId})`}
          />
        </g>
      )
    }
    if (s.type === 'path') {
      const d = s.points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
      return (
        <path
          key={s.id}
          {...common}
          d={d}
          fill="none"
          stroke={s.color}
          strokeWidth={selected ? 3.5 : 2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )
    }
    return null
  }

  const cursorClass = `whiteboard__svg whiteboard__svg--${tool}`

  return (
    <div className="whiteboard">
      <WhiteboardToolbar
        tool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={handleColorChange}
        onUndo={undo}
        onRedo={redo}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onClear={clearBoard}
        onExport={downloadPng}
      />
      <div className="whiteboard__stage">
        <svg
          ref={svgRef}
          className={cursorClass}
          // Prevent the canvas from stealing focus so the inline text editor,
          // once focused, keeps it (clicking the canvas commits via pointerdown).
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onDoubleClick={handleDoubleClick}
        >
          {shapes.map(renderShape)}
          {draft && renderShape(draft)}
        </svg>

        {editing &&
          (editing.kind === 'sticky' ? (
            <textarea
              ref={editorElRef}
              autoFocus
              className="wb-text-editor wb-text-editor--sticky"
              style={{ left: editing.x, top: editing.y, width: editing.w, fontSize: editing.fontSize }}
              value={editing.value}
              onChange={(ev) => setEditing((p) => ({ ...p, value: ev.target.value }))}
              onBlur={commitEdit}
              onKeyDown={onEditorKey}
            />
          ) : (
            <input
              ref={editorElRef}
              autoFocus
              className="wb-text-editor"
              style={{ left: editing.x, top: editing.y, fontSize: editing.fontSize, color: editing.color }}
              value={editing.value}
              placeholder="Type…"
              onChange={(ev) => setEditing((p) => ({ ...p, value: ev.target.value }))}
              onBlur={commitEdit}
              onKeyDown={onEditorKey}
            />
          ))}
      </div>

      <p className="whiteboard__hint t-micro">
        Text tool: click and type, then drag to move it · double-click to edit · Delete removes · ⌘Z undo
      </p>
    </div>
  )
})

Whiteboard.displayName = 'Whiteboard'
export default Whiteboard
