import Logo from '@/assets/pngs/logo.png'
import numberParse from '@/helpers/number'
import { useTranslation } from 'react-i18next'
import { ReadProps } from '.'
import { useEffect } from 'react'

export default function ExpirationReminder({detail, read}: ReadProps) {
  const { t } = useTranslation()

  useEffect(() => {
    read()
  }, [])

  let json = {} as Record<string, any>
  try {
    json = JSON.parse(detail!.content)
  } catch (error) { /* empty */ }

  console.log(json)
  return (
    <div className="invitation-record w-[19.8125rem] mx-auto mt-2">
      <div className="content pt-8 pb-6 px-6">
        <div className="flex items-center">
          <img className="w-6 h-6 mr-2" src={Logo} />
          <span
            className="text-2xl bg-clip-text text-transparent font-semibold"
            style={{ backgroundImage: `linear-gradient(180deg,#e6e6e6,#494949)` }}>
            {json.name}
          </span>
        </div>
        <p className='my-0 mt-16 text-3xl text-[#a6a6a6] font-semibold'>{numberParse(json.principal, 6)} USDT</p>
        <p className='text-base text-[#dfdfdf] font-semibold text-right mt-16'>{t('webmsg_030').replace('$1', '1')}</p>
      </div>
    </div>
  )
}
