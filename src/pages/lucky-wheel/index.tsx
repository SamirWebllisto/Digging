import { useState, useRef } from 'react'
import NavHeaderLayout from '@/layouts/header'
import PageBG from './turntable-bg.png'
import PointerIcon from './turntable2-jian.png'
import SwitchHeader from './newturntable2-top.png'
import BorderIcon from './choose-border.png'
import Border2Icon from './choose-border-2.png'
import WLuck from './wluck'
import ULuck from './uluck'
import { useTranslation } from 'react-i18next'
import ActivityIcon from '@/assets/pngs/activity-icon.png';
import { useNavigate } from 'react-router-dom'
import { publicApi } from '@/stores'

export default function LuckyWheel() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [type, setType] = useState<'w' | 'u'>('w')
  const mp3 = useRef<HTMLAudioElement>(null)

  const play = () => {
    if (mp3.current) {
      mp3.current.currentTime = 0
      mp3.current?.play()
    }
  }

  return (
    <NavHeaderLayout
      pageName='幸运转盘'
      headerChildren={t('activity.turntable')}
      headerTransparent
      className="overflow-hidden bg-no-repeat"
      right={
        <span onClick={() =>{publicApi('查看转盘中奖记录');navigate('/lucky-wheel-record')}} className='flex justify-end'>
          <img src={ActivityIcon} className='w-[18px] h-[21px]'/>
        </span>
      }
      style={{ backgroundSize: '100%', backgroundImage: 'url(' + PageBG + ')' }}>
      <div className="relative w-[22.3125rem] m-auto mt-10">
        <div className="relative w-[18.25rem] m-auto">
          <img
            src={PointerIcon}
            className="absolute w-[1.875rem] h-[2.875rem] left-1/2 -translate-x-1/2 bottom-2 z-20"
          />
          {type === 'u' ? (
            <img
              src={Border2Icon}
              className="absolute z-10 w-[4.9375rem] ml-[0.125rem] left-1/2 -translate-x-1/2 -bottom-[4.8rem]"
            />
          ) : (
            <img
              src={BorderIcon}
              className="absolute z-10 w-[7.1875rem] left-1/2 -translate-x-1/2 -bottom-[5.125rem]"
            />
          )}
          <img className="" src={SwitchHeader} />
          <div className="absolute top-0 left-0 right-0 bottom-0 flex">
            <div className="flex-1 z-10" onClick={() => {publicApi('切换W转盘');setType('w')}}></div>
            <div className="flex-1 z-10" onClick={() => {publicApi('切换U转盘');setType('u')}}></div>
          </div>
        </div>
        <div className="-mt-[3.2rem]">{type === 'w' ? <WLuck play={play} /> : <ULuck play={play} />}</div>
      </div>
      <audio ref={mp3} src='/turntable.mp3' />
    </NavHeaderLayout>
  )
}
