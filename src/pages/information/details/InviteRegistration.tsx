import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import BG from '../msg-bodys/bg-register.png'
import { ReadProps } from "."
import { useEffect } from "react"


export default function InviteRegistration(props: ReadProps) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div
      className="w-[19.8125rem] h-[21.875rem] bg-contain bg-no-repeat m-auto mt-2 text-center"
      style={{ backgroundImage: `url(${BG})` }}>
      <p className="pt-36 text-sm">{t('webmsg_022')}</p>
      <p className="text-sm">{t('infoDetailPage.foundation_reward')}</p>
      <p className="text-2xl font-semibold">1 USDT</p>
      <p className="text-sm text-[#777]">{t('webmsg_010')}</p>
      <p
        onClick={() => {
          navigate('/wallet')
        }}
        className="text-[#242424] bg-[#fcdc00] h-[2.3125rem] rounded-full leading-[2.3125rem] w-[12.1875rem] mx-auto text-sm font-semibold">
        {t('webmsg_011')}
      </p>
    </div>
  )
}
