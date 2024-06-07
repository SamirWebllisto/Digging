type SvgIconProps = JSX.ElementAttributesProperty['props'] & {
  name: string
  prefix?: string
  color?: string
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<SVGSVGElement>
}

export default function SvgIcon({
  name,
  prefix = 'icon',
  color = 'rgba(255, 255, 255, 0.06)',
  ...props
}: SvgIconProps) {
  const symbolId = `#${prefix}-${name}`

  return (
    <svg {...props} aria-hidden="true">
      <use href={symbolId} fill={color} />
    </svg>
  )
}
