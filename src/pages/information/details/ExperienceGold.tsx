import { useTranslation } from "react-i18next"
import { useNavigate } from 'react-router-dom'
import ExperienceBG from '../msg-bodys/experience-gold.png'
import { $user } from "@/stores"
import { useStore } from '@nanostores/react'
import { ReadProps } from "."
import { useEffect } from "react"
export default function ExperienceGold(props: ReadProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useStore($user)

  const goGet = () => {
    if (user.data?.sampleFlag === 0) {
      navigate('/fast?source=sample')
    }
  }

  useEffect(() => {
    props.read()
  }, [])

  return (
    <div
      className="w-[19.8125rem] h-[21.875rem] bg-contain bg-no-repeat m-auto mt-2 text-center"
      style={{ backgroundImage: `url(${ExperienceBG})` }}>
      <p className="pt-56 text-2xl font-semibold">{t('webmsg_002')}</p>
      <p className="w-36 h-9 ring-1 ring-white text-sm rounded-full leading-9 mx-auto" onClick={goGet}>
        {t(user.data?.sampleFlag !== 0 ? 'webmsg_020' : 'activity.getTrail')}
      </p>
    </div>
  )
}
