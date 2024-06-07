import { useRef, useEffect, useState } from 'react'
import LuckyWheel from '@/helpers/luck'
import WBgIcon from './rate-glod17.png'
import ButtonBgIcon from './turntable-btn.png'
import ButtonDisabledBgIcon from './countdown-t.png'
import request from '@/helpers/request'
import { useRequest } from 'ahooks'
import { Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { publicApi } from '@/stores'

const indexs: any = {
  4: 0,
  10: 1,
  11: 11,
  6: 2,
  13: 3,
  9: 4,
  2: 5,
  7: 6,
  12: 7,
  5: 8,
  8: 9,
  3: 10,
}

let btnloading = false
export default function WLuck({ play }: { play: () => void }) {
  const [disable, setDisabled] = useState(false)
  const { t } = useTranslation()
  // const [disabled, setDisabled] = useState(false)
  const luckyWheelRef = useRef<LuckyWheel | null>(null)
  const luckyDomRef = useRef<HTMLDivElement>(null)

  const { data, run, loading } = useRequest(async () => {
    const { result } = await request.get('/balance/getUsdtBalance', {
      params: {
        symbol: 'TRCUSDT',
        net: 'TRX',
      },
    })
    return result
  })
  const hasMoney = +data?.balance >= 1 || +data?.rewardBalance >= 1

  useEffect(() => {
    if (luckyDomRef.current) {
      luckyWheelRef.current = new LuckyWheel({
        element: luckyDomRef.current!,
        len: 12,
        onFinished: (index: any) => {
          btnloading = false
          setDisabled(false)
          console.log('finished-->', index)
        },
      })
    }
  }, [luckyDomRef])

  const handleStart = async () => {

      // @ts-ignore
      // const grecaptcha = window.grecaptcha;
      // grecaptcha.ready(async function () {
        try {
          if (loading || btnloading) return
          if (!hasMoney) {
            return Toast.show(t('activity.turntableBlanceTip'))
          }
          btnloading = true
          // const token: string = await grecaptcha.execute('6LeJm1IpAAAAAK5uuSUFV0yGEavZiuEbz0zB3ORg', { action: 'submit' })
          // console.log(token)
          const { result } = await request.post('/common/turntable/gold')
          if (!result.id) throw ''
          setDisabled(true)
          luckyWheelRef.current!.play()
          play()
          // run()

          // console.log(result)

          setTimeout(() => {
            luckyWheelRef.current!.stop(indexs[result.id] as number)
            run()
          }, 2500)

        } finally {
          btnloading = false
          setDisabled(false)
        }
      // });
  }

  // const handleEnd = () => {
  //   luckyWheelRef.current!.stop(0)
  //   setDisabled(true)
  // }

  return (
    <div className="relative">
      <div ref={luckyDomRef}>
        <img className="w-[22.3125rem]" src={WBgIcon} />
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={() => {
          publicApi('点击U转盘')
          handleStart()
        }}>
        <div className="w-[7.125rem] h-[7.125rem] relative flex">
          <img className="w-[7.125rem] h-auto" src={disable ? ButtonDisabledBgIcon : ButtonBgIcon} />
          <div
            className="absolute font-bold left-1/2 top-1/2 flex flex-col"
            style={{ transform: 'translate(-50%,-50%)' }}>
            <span className="bottom-0 top-0 text-center z-10 w-full text-2xl font-bold">SPIN</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 500,
                marginTop: -1,
                textAlign: 'center',
                transform: 'scale(0.83)',
                whiteSpace: 'nowrap',
              }}>
              {t('activity.openMoeny')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
