
import { useTranslation } from 'react-i18next'
import Logo from '../icons/icon.png'
import { useEffect, useState } from 'react'
import { ReadProps } from '.'
import request from '@/helpers/request'

export default function RedReceive(props: ReadProps) {
  const { t } = useTranslation()
  const [type , setType] = useState<0|1|2|null>(null)

  useEffect(() => {
    props.read()
  }, [])

  let json = {} as Record<string, any>
  try {
    json = JSON.parse(props.detail?.content)
    if(typeof json.receiveStatus === 'number' && type === null) {
      console.log(json.receiveStatus)
      setType(json.receiveStatus as any)
    }
  } catch (error) { /* empty */ }

  const confirm = async (type: 0 | 1 | 2) => {
    try {
      await request.post('/balance/receiveGratuity', {
        id: props.detail?.id,
        miningRedOrderId: json?.miningRedOrderId,
        receiveStatus: type,
      })
      setType(type)
    } catch (error) { /* empty */ }
  }

  return (
    <div className="invitation-record w-[19.15625rem] mx-auto mt-2">
      <div
        className="content mx-auto bg-contain bg-no-repeat text-center p-6">
        {/* <h3 className="my-0 text-white/50 text-xl font-semibold pt-11">{t('notice.redEnvelope')}</h3> */}
        <p className="text-white/70 py-3 text-sm my-0 break-words " style={{wordBreak: 'break-all'}}>{t('red-receive.senduser').replace(': ', ':').replace('$user', json?.fromAddress || '')}</p>
        <p className="text-white text-xl font-semibold my-0">{json.amount} WOW</p>
        <img src={Logo} className="w-32 mx-auto mt-2" />

        <p className="text-[#767676] my-0 text-11 text-left leading-4">Tips: {t('red-receive.tips')}</p>

        {type == 0 ? (
          <div className='text-sm flex justify-around items-center mt-7'>
            <div className='w-28 rounded-full h-10 leading-10 text-[#ADADAD] border border-[#ADADAD]' onClick={() => confirm(2)}>{t('red-receive.ignore')}</div>
            <div className='w-28 rounded-full h-10 leading-10 text-[#FEBA1F] border border-[#FEBA1F]' onClick={() => confirm(1)}>{t('red-receive.agree')}</div>
          </div>
        ) : null}

      </div>
    </div>
  )
}
