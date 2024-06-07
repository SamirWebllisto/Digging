import classNames from "classnames"
import { useEffect, useRef, useState } from "react"

export default function Marquee({ children, className }: { children: React.ReactNode, className?: string }) {
  const el = useRef<HTMLHtmlElement>(null)
  const span = useRef<HTMLHtmlElement>(null)

  const [exceed, setExceed] = useState(false)

  useEffect(() => {
    const rect = el.current?.getClientRects()[0]
    const spanrect = span.current?.getClientRects()[0]

    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    setExceed(spanrect?.width! > rect?.width!)
  }, [el])

  // @ts-ignore
  return exceed ? <marquee ref={el} style={{ '-webkit-overflow-scrolling': 'touch', 'overflow-y': 'auto' }} className={className} behavior="alternate" scrolldelay="1200" scrollamount="4"><span ref={span} className={classNames(["text-text-trade text-[12px] leading-8", className])} style={{ whiteSpace: 'nowrap' }}>{children}</span></marquee> : <div className={className} style={{ whiteSpace: 'nowrap' }} ref={el}><span ref={span} className={classNames(['text-text-trade text-[12px] leading-8', className])} >{children}</span></div>
}
