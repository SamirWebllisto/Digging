import { Button } from 'antd-mobile'
import BG from '../msg-bodys/bg-invite.png'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReadProps } from '.'
import { useEffect } from 'react'

export default function InviteReward(props: ReadProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div
      className="bg-contain bg-no-repeat mx-auto mt-2 w-[19.8125rem] h-[21.4375rem] relative text-center"
      style={{ backgroundImage: `url(${BG})`, padding: '20px 15px 0 10px' }}>
      <p className="text-sm">{t('webmsg_022')}</p>
      <p className="text-sm">{t('infoDetailPage.foundation_reward')}</p>
      <p className="text-3xl m-0">1 USDT</p>
      <Button onClick={() => navigate('/invitation')} className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full w-28 h-9 leading-9  p-0 text-sm">
        {t('invite.messageReferral')}
      </Button>
    </div>
  )
}
