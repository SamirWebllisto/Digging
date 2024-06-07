import { $wallet } from '@/stores'
import { useEffect } from 'react'
export default function Chat() {

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://service.wowearn.com/assets/layer/ai_service_diy_1.js?v=1697090093'
    script.async = true
    document.body.appendChild(script)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-var
    const ai_service = (window as any).ai_service || {}
    ai_service.visiter_id = $wallet.get().detail?.address
    ai_service.lang_type = localStorage.getItem('i18nextLng') || ''
    ;(window as any).ai_service = ai_service

    return () => {
      document.getElementById('blzxMinChatWindowDiv')?.style.setProperty('display', 'none',)
      document.body.removeChild(script)
    }
  }, [])

  return null
}
