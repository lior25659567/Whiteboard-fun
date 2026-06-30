import './card.css'

// Surface card. surface: 'cloud' (soft-cloud) | 'canvas' (white) | 'sky' (sky-soft)
// radius: 'lg' | 'xl' | 'md'.  elevated: applies soft layered shadow-2.
const Card = ({
  surface = 'cloud',
  radius = 'lg',
  elevated = false,
  className = '',
  children,
  ...rest
}) => {
  const cls = [
    'card',
    `card--${surface}`,
    `card--r-${radius}`,
    elevated ? 'card--elevated' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}

export default Card
