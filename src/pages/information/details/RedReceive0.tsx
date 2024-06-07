
import { useTranslation } from 'react-i18next'
import BG from '../msg-bodys/red-receive-bg.png'
import Logo from '@/assets/pngs/logo.png'
import dayjs from 'dayjs'
import { useEffect } from 'react'
import { ReadProps } from '.'

export default function RedReceive(props: ReadProps) {
  const { t } = useTranslation()

  useEffect(() => {
    props.read()
  }, [])

  let json = {} as Record<string, any>
  try {
    json = JSON.parse(props.detail?.content)
  } catch (error) { /* empty */ }

  console.log(json)

  return (
    <>
      <div
        className="w-[19.8125rem] h-[22.8125rem] mx-auto mt-2 bg-contain bg-no-repeat text-center"
        style={{ backgroundImage: `url(${BG})` }}>
        <h3 className="my-0 text-white/50 text-xl font-semibold pt-11">{t('notice.redEnvelope')}</h3>

        <p className="text-white/70 mt-16">{dayjs(props.detail?.createTime).format('HH:mm:ss DD/MM/YYYY')}</p>
        <img src={Logo} className="w-20 h-20 mx-auto mt-5" />
        <p className="text-white text-xl font-semibold mt-5">{json.amount} WOW</p>
      </div>
    </>
  )
}
