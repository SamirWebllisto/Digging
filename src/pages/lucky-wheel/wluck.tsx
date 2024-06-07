import { useRef, useEffect, useState } from 'react'
import LuckyWheel from '@/helpers/luck'
import WBgIcon from './rate-silver14.png'
import ButtonBgIcon from './turntable-btn.png'
import ButtonDisabledBgIcon from './countdown-t.png'
import request from '@/helpers/request'
import { useCountDown, useRequest } from 'ahooks'
import dayjs from 'dayjs'
import { publicApi } from '@/stores'
import { Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'

const indexs: any = {
  14: 0,
  15: 6,
  16: 2,
  17: 1,
  18: 7,
  19: 5,
  20: 3,
  21: 5,
}

let btnloading = false
export default function WLuck({play}: {play: () => void}) {
  const [disable, setDisabled] = useState(false)
  const luckyWheelRef = useRef<LuckyWheel | null>(null)
  const luckyDomRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const { data, run, loading } = useRequest(async () => {
    const data = await request.get('/common/turntable/countdown')
    return data.result
  })

  useEffect(() => {
    if (luckyDomRef.current) {
      luckyWheelRef.current = new LuckyWheel({
        element: luckyDomRef.current!,
        segsLen: 8,
        onFinished: (index: any) => {
          btnloading = false
          setDisabled(false)
          console.log('finished-->', index)
        },
      })
    }
  }, [luckyDomRef])

  const [countdown] = useCountDown({
    leftTime: data?.nextTime * 1000 || 0,
    interval: 1000,
  })

  const time = dayjs.duration(countdown)

  const handleStart = async () => {
    // @ts-ignore
    // const grecaptcha = window.grecaptcha;
    // grecaptcha.ready(async function () {
      try {
        if (data?.nextTime > 0 || loading || btnloading) {
          return
        }
        btnloading = true
        // const token: string = await grecaptcha.execute('6LeJm1IpAAAAAK5uuSUFV0yGEavZiuEbz0zB3ORg', { action: 'submit' })
        // console.log(token)
          const { result } = await request.post('/common/turntable/silver')
          if (!result.id) throw ''
          setDisabled(true)
          luckyWheelRef.current!.play()
          play()

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
  //   luckyWheelRef.current!.stop(indexs【】)
  //   run()
  // }
  return (
    <div className="relative">
      <div ref={luckyDomRef}>
        <img className="w-[22.3125rem] h-[22.0625rem]" src={WBgIcon} />
      </div>
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        onClick={() => {
          publicApi('点击U转盘')
          handleStart()
        }}>
        <div className="w-[7.125rem] h-[7.125rem] relative flex">
          <img className="w-[7.125rem]" src={data?.nextTime > 0 || disable ? ButtonDisabledBgIcon : ButtonBgIcon} />
          <span className="absolute bottom-0 top-0 text-center z-10 w-full leading-[7.125rem] text-2xl font-bold">
            {data?.nextTime > 0 ? <span className='text-15'>{time.format('HH:mm:ss')}</span> : 'SPIN'}
          </span>
        </div>
      </div>
    </div>
  )
}
