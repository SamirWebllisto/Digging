import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import request from '@/helpers/request'
import ButtonIcon from './icons/blind2-btn.png'
import BG from './icons/blind2-bg.png'
import GlodBoxIcon from './icons/blind2-glod2.png'
import GlodBgIcon from './icons/blind2-open-glod.png'
import SvgIcon from '@/components/svg-icon'
import { useRequest } from 'ahooks'
import { Toast } from 'antd-mobile'
import { publicApi } from '@/stores'

let btnloading = false
export default function GlodBox({play}: {play: () => void}) {
  const { t } = useTranslation()
  const [isopen, setIsopen] = useState(false)
  const [detail, setDetail] = useState<any>(null)

  const { data, run, loading } = useRequest(async () => {
    const { result } = await request.get('/balance/getUsdtBalance', {
      params: {
        symbol: 'TRCUSDT',
        net: 'TRX',
      },
    })
    btnloading = false
    return result
  })
  const hasMoney = +data?.balance >= 1 || +data?.rewardBalance >= 1
  const lottery = async () => {
    if (loading || btnloading) return
    if (!hasMoney) {
      return Toast.show(t('activity.turntableBlanceTip'))
    }
    if (isopen) {
      setIsopen(false)
      btnloading = false
      return
    }
    btnloading = true
    try {
      const { result } = await request.post('/common/blingBox/gold')
      setDetail(result)
      setIsopen(true)
      play()
      run()
    } catch (error) {
      btnloading = false
    }
  }

  return (
    <div style={{ backgroundImage: 'url(' + BG + ')', backgroundSize: '100% 100%' }} className="bg-no-repeat pb-9 overflow-hidden">
      <div className="w-[16.4375rem] h-[14.5625rem] mx-auto pt-2">
        {isopen ? (
          <div className="animate__animated animate__zoomIn animate__faster relative pt-2 h-[16rem]">
          <img className='w-[16rem] mx-auto' src={GlodBgIcon} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
            <p className='text-[#39BC5C] font-bold  text-[29px] m-0 mt-0.5 mb-1'>{detail.amount}</p>
            <SvgIcon name="usdt" className='w-6 h-6'/>
          </div>
        </div>
        ) : (
          <img className="w-[16.4375rem] h-[14.5625rem] mx-auto animate__animated animate__backInRight" src={GlodBoxIcon} />
        )}
      </div>
      <div className='mt-6'>
        <p className="text-center text-[#f9df7a]  text-[15px] font-semibold flex items-center justify-center">
          1 <SvgIcon name="usdt" className="w-4 h-4 mr-1" />
          {t('activity.openOneBlind')}
        </p>
        <p className="text-white font-semibold text-[17px] tracking-widest	text-center">
          {t('activity.maxWinning')}<span className='text-[17px]'>10,000 USDT</span>
        </p>
      </div>
      <div onClick={() => {publicApi('开起U盲盒');lottery()}} className="relative inline-block mt-3 ml-[50%] -translate-x-1/2">
        <img src={ButtonIcon} className="w-[8.6875rem] h-16 mx-auto" />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -mt-2 text-white text-base">
          {t(isopen ? 'activity.continue' : 'activity.get')}
        </span>
      </div>
    </div>
  )
}
