
import Icon from '@/assets/pngs/mining-msg.png'
import { Button } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ReadProps } from '.'
import { useEffect } from 'react'
export default function Mining(props: ReadProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div className="invitation-record w-[19.8125rem] mx-auto mt-2">
      <div className="content pt-8 pb-6 px-6 text-center">
        <p className='text-base my-0'>{t('webmsg_013')}</p>
        <p className='text-3xl my-0 mt-2'>{t('webmsg_014')}</p>
        <img className='mt-9 w-40 m-auto' src={Icon}/>
        <Button onClick={() => navigate('/')} className="mt-16 bottom-5 rounded-full w-28 h-9 leading-9  p-0 text-sm">
        {t('invite.miningTitle')}
      </Button>
      </div>
    </div>
  )
}
