import { NavBar, NavBarProps } from 'antd-mobile'
import classNames from 'classnames'
import NetworkError from '@/components/network-error'
import SafeAreaLayout from './safe-area'
import { publicApi } from '@/stores'

type NavHeaderProps = Omit<NavBarProps, 'children'> & {
  pageName?:string
  headerChildren: React.ReactNode
  contentClassName?: string
  defaultBackPath?: string
  contentStyle?: React.CSSProperties
  className?: string
  style?: React.CSSProperties
  headerTransparent?: boolean
  doNotFillTheHeight?: boolean
  error?: Error
  refresh?: () => void
  children: React.ReactNode | (() => React.ReactNode | React.ReactNode | JSX.Element)
}

export default function NavHeaderLayout({
  pageName,
  children,
  headerChildren,
  contentClassName,
  contentStyle,
  className,
  defaultBackPath,
  style,
  headerTransparent,
  doNotFillTheHeight,
  error,
  refresh,
  onBack,
  ...rest
}: NavHeaderProps) {
  const back = () => {
    publicApi(`${pageName}界面返回按钮`)
    if (window.history.length <= 1) {
      window.location.hash = defaultBackPath || ''
      return
    }
    window.history.back()
  }
  return (
    <SafeAreaLayout>
      <div className={classNames('min-h-screen flex flex-col', className)} style={style}>
        <NavBar
          {...rest}
          className="fixed w-full top-0 z-10 bg-top bg-cover bg-fixed wow-width h-[2.1875rem]"
          style={{ backgroundColor: !headerTransparent ? 'var(--main-background-color)' : undefined }}
          onBack={onBack || back}>
          <span
            className="text-[23px] bg-clip-text text-transparent font-semibold"
            style={{ backgroundImage: 'linear-gradient(180deg,#c4c4c4,#757575)' }}>
            {headerChildren}
          </span>
        </NavBar>
        {doNotFillTheHeight ? null : <div className="h-8" />}
        <div className={classNames('flex-1 mt-1', contentClassName)} style={contentStyle}>
          {error ? <NetworkError refresh={refresh} /> : typeof children === 'function' ? children() : children}
        </div>
      </div>
    </SafeAreaLayout>
  )
}
