import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import classNames from 'classnames'
// import SvgIcon from './svg-icon'

export default function ListEmpty({className, style, textStyle}: {className?: string, style?: CSSProperties, textStyle?: CSSProperties}) {
  const { t } = useTranslation()
  return (
    <div className={classNames("text-center pb-[13px] pt-[5px]", className)} style={style}>
      {/* <SvgIcon name="empty" className="w-32 m-auto" /> */}
      <span className="text-[13px] text-transparent bg-clip-text" style={
        {backgroundImage: 'linear-gradient(180deg,#c4c4c4,#757575)', ...textStyle}
      }>{t('public.noData')}</span>
    </div>
  )
}
