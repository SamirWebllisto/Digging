import classNames from 'classnames'
import { ReactNode, CSSProperties } from 'react'

export default function GradientBox({children, className, style}: { children: ReactNode, className: string, style: CSSProperties }) {
  return (
    <div className={classNames('relative', className)} style={style}>
      {children}
      <div className='bg'></div>
    </div>
  )
}
