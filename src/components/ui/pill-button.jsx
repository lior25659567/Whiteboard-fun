import './pill-button.css'

// Pill button — the only CTA shape in the Letters system.
// variant: 'primary' (black, scarce) | 'secondary' (white) | 'ghost' (soft-cloud)
const PillButton = ({
  variant = 'primary',
  type = 'button',
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  const cls = `pill-button pill-button--${disabled ? 'disabled' : variant} ${className}`.trim()
  return (
    <button type={type} className={cls} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}

export default PillButton
