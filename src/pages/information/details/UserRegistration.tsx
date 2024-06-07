import { useTranslation } from "react-i18next"
import { NetworkIcon, TelegramIcon } from "../SmallPicture"
import LogoIcon from '@/assets/pngs/logo.png'
import { ReadProps } from "."
import { useEffect } from "react"

export default function UserRegistration(props: ReadProps) {
  const { t } = useTranslation()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div className="invitation-record w-[19.8125rem] mx-auto mt-2">
      <div className="content text-center pt-10 pb-6">
        <img className="w-24 h-24 m-auto mb-5" src={LogoIcon} />
        <p className="m-0 text-xl font-semibold mb-4">{t('message.helloUser')}</p>
        <p className='text-[#b9b9b9] text-sm my-0'>
          <div className='mb-1'>
            {t('bootpage.click')}
            <a href="https://t.me/wowearnen"
          target="_blank"><NetworkIcon className="w-[0.875rem] h-[0.875rem] inline-block mx-1" />
            https://t.me/wowearnen</a>
          </div>
          <div>
            {t('webmsg_016')}
            <TelegramIcon className="w-[0.875rem] h-[0.875rem] inline-block mx-1" />
            {t('webmsg_017')}
          </div>
        </p>

        <p className='my-8 font-semibold text-white text-2xl'>
          {t('activity.getTrail')} WOW {t('mining.rewards')}
        </p>

        <a
          href="https://t.me/wowearnen"
          target="_blank"
          className="text-[#242424] bg-[#fcdc00] h-10 rounded-full leading-10 w-[16.25rem] mx-auto block mb-0 text-sm font-semibold">
          {t('message.welcomeJoinUs')}
        </a>
      </div>
    </div>
  )
}
