import { useTranslation } from 'react-i18next'
import Icon from '@/assets/pngs/first-recharge-msg.png'
import { ReadProps } from '.'
import { useEffect } from 'react'
import { useShare } from '@/hooks/use-share'

export default function FirstRecharge(props: ReadProps) {
  const share = useShare()
  const { t } = useTranslation()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div className="invitation-record w-[19.8125rem] mx-auto mt-2">
      <div className="content text-center pt-6 pb-6">
        <div className="overflow-hidden">
          <img className="w-44 m-auto mb-5 -mt-16" src={Icon} />
        </div>
        <p className="m-0 text-sm font-semibold mb-1">{t('webmsg_003')}</p>
        <p className="text-sm my-0">{t('webmsg_004')}</p>

        <p className="my-4 font-semibold text-white text-3xl">1 USDT</p>

        <a onClick={share} className="text-[#242424] bg-[#fcdc00] h-10 rounded-full leading-10 w-[156px] mx-auto block mb-0 text-sm font-semibold">
          {t('webmsg_005')}
        </a>
      </div>
    </div>
  )
}
