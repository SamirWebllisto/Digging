import { $wallet } from '@/stores/wallet'
import { useStore } from '@nanostores/react'
import { Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useNavigate, NavigateProps, To } from 'react-router-dom'

export function useAuthNavigate() {
  const wallet = useStore($wallet)
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (to: string | To, option?: NavigateProps) => {
    if (wallet.detail) {
      navigate(to, option)
    } else {
      Toast.show(t('common.loginTips'))
    }
  }
}
