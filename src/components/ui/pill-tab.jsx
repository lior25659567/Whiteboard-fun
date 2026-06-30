import './pill-tab.css'

// Selectable pill tab — active state polarity-flips to the black primary fill.
const PillTab = ({ active = false, onClick, children, className = '' }) => {
  const cls = `pill-tab ${active ? 'pill-tab--active' : ''} ${className}`.trim()
  return (
    <button type="button" className={cls} aria-pressed={active} onClick={onClick}>
      {children}
    </button>
  )
}

export default PillTab
