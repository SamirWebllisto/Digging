
import { useTranslation } from "react-i18next"
import BG from '@/assets/pngs/register-gift-msg.png'
import { ReadProps } from "."
import { useEffect } from "react"
import { useShare } from '@/hooks/use-share'
import { useAuthNavigate } from "@/hooks/auth-navigate"
export default function RegisterGift(props: ReadProps) {
  const { t } = useTranslation()
  const share = useShare()
  const authNavigate = useAuthNavigate()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div
      className="w-[19.8125rem] h-[21.875rem] bg-contain bg-no-repeat m-auto mt-2 text-center"
      style={{ backgroundImage: `url(${BG})` }}>
        <p className="pt-40 m-0 text-sm font-semibold mb-1">{t('webmsg_003')}</p>
        <p className="text-sm my-0">{t('webmsg_008')}</p>

        <p className="my-3 font-semibold text-white text-3xl">1 USDT</p>

        <p className="text-xs text-[#777] mt-0 mb-4">{t('webmsg_010')}</p>
        <a onClick={() => authNavigate('/invitation')} className="text-[#242424] bg-[#fcdc00] h-10 rounded-full leading-10 w-[9.75rem] mx-auto block mb-0 text-sm font-semibold">
          {t('webmsg_011')}
        </a>
      {/* <p className="pt-56 text-2xl font-semibold">{t('webmsg_002')}</p>
      <p className="w-36 h-9 ring-1 ring-white text-sm rounded-full leading-9 mx-auto">
        {t(get ? 'webmsg_020' : 'activity.getTrail')}
      </p> */}
    </div>
  )
}
