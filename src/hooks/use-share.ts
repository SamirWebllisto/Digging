import { constructLink } from '@/helpers/utils'
import { $user } from '@/stores'
import { useStore } from '@nanostores/react'
import { useNavigate } from 'react-router-dom'

export function useShare() {
  const user = useStore($user)
  const navigate = useNavigate()
  return () => {
    const instance = (window as any).Ulla
    if (instance) {
      instance.postMessage(JSON.stringify({
        api: 'shareWay',
        content: constructLink(user.data?.invitationCode as string),
      }))
      return
    }
    if (typeof navigator.share === 'function') {
      try {
        navigator.share({
          url: constructLink(user.data?.invitationCode as string),
          title: document.title
        })
      } catch (error) {
        navigate('/qrcode')
      }
    } else {
      navigate('/qrcode')
    }
  }
}
