import Icon from '@/assets/pngs/friend-recharge-msg.png'
import { Ellipsis } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReadProps } from '.'
import { useEffect } from 'react'
export default function FriendRecharge(props: ReadProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    props.read()
  }, [])

  const texts = t('webmsg_021').split('__address__')

  return (
    <div className="invitation-record w-[19.8125rem] mx-auto mt-2">
      <div className="content pt-8 pb-6 px-6 text-left">
        <p className="text-base my-0">{texts[0]}</p>
        <p className="text-[#b2b2b2] text-xs mb-4 w-24 break-words"><Ellipsis direction="middle" content={'1231adwqqeqt32412'} /></p>
        <p className="text-sm my-0 mt-2">{texts[1]}</p>
        <p className="text-3xl my-0 mt-2">2222 USDT</p>
        <div className='flex items-center'>
          <span className='text-[#FCDC00] text-sm underline underline-offset-4'>{t('webmsg_024')}</span>
          <img className="mt-9 w-36 m-auto" src={Icon} />
        </div>
      </div>
    </div>
  )
}
