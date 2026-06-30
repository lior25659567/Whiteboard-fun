import './whiteboard-toolbar.css'

// Constrained, on-brand palette. Literal hex (not CSS vars) so exported SVG
// rasterizes correctly. `tint` is the sticky-note fill for each ink.
export const BOARD_COLORS = [
  { id: 'ink', value: '#070709', tint: '#ececef' },
  { id: 'sky', value: '#2597d0', tint: '#c9def0' },
  { id: 'charcoal', value: '#60606c', tint: '#e7e7ea' },
  { id: 'steel', value: '#99a0ae', tint: '#eef0f3' },
]

const TOOLS = [
  { id: 'select', label: 'Select', glyph: '⤢' },
  { id: 'rect', label: 'Box', glyph: '▭' },
  { id: 'sticky', label: 'Sticky note', glyph: '▤' },
  { id: 'text', label: 'Text', glyph: 'T' },
  { id: 'arrow', label: 'Arrow', glyph: '→' },
  { id: 'pen', label: 'Pen', glyph: '✎' },
  { id: 'eraser', label: 'Erase', glyph: '⌫' },
]

const WhiteboardToolbar = ({
  tool,
  onToolChange,
  color,
  onColorChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  onExport,
}) => {
  return (
    <div className="wb-toolbar">
      <div className="wb-toolbar__group">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            title={t.label}
            aria-label={t.label}
            aria-pressed={tool === t.id}
            className={`wb-tool ${tool === t.id ? 'wb-tool--active' : ''}`}
            onClick={() => onToolChange(t.id)}
          >
            <span className="wb-tool__glyph" aria-hidden="true">
              {t.glyph}
            </span>
          </button>
        ))}
      </div>

      <div className="wb-toolbar__divider" />

      <div className="wb-toolbar__group wb-toolbar__swatches">
        {BOARD_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.id}
            aria-label={`Color ${c.id}`}
            aria-pressed={color === c.value}
            className={`wb-swatch ${color === c.value ? 'wb-swatch--active' : ''}`}
            style={{ background: c.value }}
            onClick={() => onColorChange(c.value)}
          />
        ))}
      </div>

      <div className="wb-toolbar__divider" />

      <div className="wb-toolbar__group">
        <button
          type="button"
          className="wb-tool wb-tool--text"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
        >
          Undo
        </button>
        <button
          type="button"
          className="wb-tool wb-tool--text"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
        >
          Redo
        </button>
        <button type="button" className="wb-tool wb-tool--text" onClick={onClear} title="Clear board">
          Clear
        </button>
      </div>

      <div className="wb-toolbar__spacer" />

      <button type="button" className="wb-toolbar__export" onClick={onExport}>
        Export PNG
      </button>
    </div>
  )
}

export default WhiteboardToolbar
