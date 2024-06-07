import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from '@/assets/pngs/home_layer_small.png'
import { publicApi, syncUser } from '@/stores'
import request from '@/helpers/request'

export default function Mining() {
  const { t } = useTranslation()
  const [rect, setRect] = useState<DOMRect>()
  const ref = useRef<HTMLDivElement | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const parentEl: HTMLDivElement | null = ref.current
    const el = document.querySelector('.RCP')
    const cloneel = el?.cloneNode(true) as HTMLDivElement
    console.log(parentEl)

    setRect(el?.getBoundingClientRect())
    if (parentEl) {
      parentEl?.append(cloneel)
      cloneel?.classList?.add('top-20')
    }

    cloneel?.addEventListener('click', start)

    return () => {
      if (cloneel) {
        parentEl?.removeChild?.(cloneel)
      }
      cloneel?.removeEventListener('click', start)
    }
  }, [ref])

  const start = async () => {
    if (loading) return
    setLoading(true)
    try {
      publicApi('点击开始挖矿')
      await request.post('/mining/start')
      await syncUser()
    } catch (error) { /* empty */ }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="w-full relative h-96" ref={ref}></div>
      <p className="text-center mt-20 flex justify-center items-center font-semibold text-sm">
        <span>{t('bootpage.click')}</span>
        <img src={Icon} className='w-5 h-5 mx-2' />
        <span>{t('bootpage.start')}</span>
      </p>
    </div>
  )
}
