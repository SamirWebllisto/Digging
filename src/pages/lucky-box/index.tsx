import { useState, useRef } from 'react'
import 'animate.css'
import SvgIcon from '@/components/svg-icon'
import NavHeaderLayout from '@/layouts/header'
import { CapsuleTabs } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import LogoIcon from '@/assets/pngs/logo.png'
import ActivityIcon from '@/assets/pngs/activity-icon.png';
import SliverBox from './sliver'
import GlodBox from './glod'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '@/stores'

export default function LuckyBox() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [type, setType] = useState<'w' | 'u'>('w')

  const mp3 = useRef<HTMLAudioElement>(null)

  const play = () => {
    if (mp3.current) {
      mp3.current.currentTime = 0
      mp3.current?.play()
    }
  }

  // const stop = () => {
  //   if (mp3.current) {
  //     mp3.current.pause()
  //   }
  // }

  return (
    <NavHeaderLayout  pageName='盲盒界面' headerTransparent headerChildren={t('activity.blindbox')} contentClassName="mx-5" right={
      <span onClick={() => {publicApi('跳转盲盒中奖记录界面'); navigate('/lucky-box-record')}} className='flex justify-end'>
        <img src={ActivityIcon} className='w-[18px] h-[21px]'/>
      </span>
    } >
      <CapsuleTabs activeKey={type} onChange={(val) => {publicApi(`切换${val as 'w' | 'u'}盲盒`); setType(val as 'w' | 'u')}} className="switch-card mt-5 mb-3">
        <CapsuleTabs.Tab
          title={
            <div className="flex justify-center items-center">
              <img src={LogoIcon} className="w-5 h-5 mr-2" />
              <span>{t('activity.openSilverBlind')}</span>
            </div>
          }
          key="w"
        />
        <CapsuleTabs.Tab
          title={
            <div className="flex justify-center items-center">
              <SvgIcon name="usdt" className="w-5 h-5 mr-2" />
              <span>{t('activity.openGoldBlind')}</span>
            </div>
          }
          key="u"
        />
      </CapsuleTabs>

      {type === 'w' ? <SliverBox play={play} /> : <GlodBox play={play}/>}
      <audio ref={mp3} src='/luck.mp3' />
    </NavHeaderLayout>
  )
}
