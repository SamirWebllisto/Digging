import { $wallet } from '@/stores/wallet'
import { Ellipsis } from 'antd-mobile'
import BG from '../msg-bodys/bg-income.png'
import { useTranslation } from 'react-i18next'
import { ReadProps } from '.'
import { useEffect } from 'react'
import UserIcon from '../icons/3-0.png'
import { truncateString } from '@/helpers/utils'
import dayjs from 'dayjs'

export default function BeIncome(props: ReadProps & {detail: Record<string, any>}) {
  const { t } = useTranslation()

  useEffect(() => {
    props.read()
  }, [])

  let json = {} as Record<string, any>
  try {
    json = JSON.parse(props.detail.content)
  } catch (error) { /* empty */ }

  console.log(json)

  return (
    <div
      className="bg-contain bg-no-repeat mx-auto mt-2 w-[19.8125rem] h-[21.4375rem] relative"
      style={{ backgroundImage: `url(${BG})`, padding: '31px 15px 0 27px' }}>
      <img className="w-10 h-10 rounded-full mb-3" src={UserIcon}/>
      <div className="text-[#b2b2b2] text-xs mb-4 w-24 break-words">
        {truncateString(json.walletAddress)}
      </div>
      <div className="text-sm text-white mb-1">{dayjs(json.createTime).format('HH:mm:ss DD/MM/YYYY')} {t('webmsg_019')}</div>
      <div className="text-3xl font-semibold text-white mb-1">{json.name}</div>
      <div className="text-white text-sm">{t('webmsg_018')}</div>
      <div className="absolute bottom-4 right-4 text-[#777]">{t('webmsg_015')}</div>
    </div>
  )
}
