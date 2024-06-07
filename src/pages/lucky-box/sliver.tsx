import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import request from '@/helpers/request'
import { useCountDown, useRequest } from 'ahooks'
import LogoIcon from '@/assets/pngs/logo.png'
import ButtonIcon from './icons/blind2-btn.png'
import ButtonDisabledIcon from './icons/blind2-btn-disable.png'
import BG from './icons/blind2-bg.png'
import SliverBoxIcon from './icons/blind2-sliver.png'
import SliverBgIcon from './icons/blind2-open-sliver.png'
import dayjs from 'dayjs'
import { publicApi } from '@/stores'

let btnloading = false
export default function SliverBox({play}: {play: () => void}) {
  const [isopen, setIsopen] = useState(false)
  const [detail, setDetail] = useState<any>(null)
  const { t } = useTranslation()

  const { data, run, loading } = useRequest(async () => {
    const data = await request.get('/common/blingBox/countdown')
    btnloading = false
    return data.result
  })

  const lottery = async () => {
    if (data?.nextTime > 0 || loading || btnloading) return
    if (isopen) {
      setIsopen(false)
      btnloading = false
      return
    }
    btnloading = true
    try {
      const { result } = await request.post('/common/blingBox/silver')
      btnloading = false
      if (!result) return
      setDetail(result)
      setIsopen(true)
      play()
      run()
    } catch (error) {
      btnloading = false
    }
  }

  const [countdown] = useCountDown({
    leftTime: data?.nextTime * 1000 || 0,
    interval: 1000,
  })

  const time = dayjs.duration(countdown)

  return (
    <div style={{ backgroundImage: 'url(' + BG + ')', backgroundSize: '100% 100%' }} className="bg-no-repeat pb-9 overflow-hidden">
      {isopen ? (
        <div className="animate__animated animate__zoomIn animate__faster relative  pt-2 h-[16rem]">
        <img className='w-[16rem] mx-auto' src={SliverBgIcon} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
          <p className="text-[#39BC5C] font-bold text-[29px] m-0 mt-0.5 mb-1">{detail.amount}</p>
          <img src={LogoIcon} className="w-6 h-6" />
        </div>
      </div>
      ) : (
        <img className="w-[16.4375rem] h-[14.5625rem] mx-auto animate__animated animate__backInLeft" src={SliverBoxIcon} />
      )}
      <div className='mt-6' >
        <p className="text-center text-[#f9df7a] text-[15px] tracking-widest font-semibold">{t('activity.freeBlindbox')}</p>
        <p className="text-white font-semibold tracking-widest flex items-center justify-center text-[17px]">
          {t('activity.maxWinning')} 50
          <img src={LogoIcon} className="w-4 h-4 ml-1" />
        </p>
      </div>
      <div onClick={() => {publicApi('开起W盲盒') ;lottery()}} className="relative inline-block mt-3 ml-[50%] -translate-x-1/2" >
        <img src={data?.nextTime > 0 ? ButtonDisabledIcon : ButtonIcon} className="w-[8.6875rem] h-16 mx-auto" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2 text-white text-base select-none">
          {data?.nextTime > 0 ? time.format('HH:mm:ss') : t(isopen ? 'activity.continue' : 'activity.get')}
        </span>
      </div>
    </div>
  )
}
