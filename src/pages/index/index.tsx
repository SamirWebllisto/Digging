import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import { useEffect, useRef, useState } from 'react'
import ProgressBar from 'react-customizable-progressbar'
import UserIcon from './icons/friends02.svg'
import InvitationImg from './icons/invitation001.png'
import StopWatch from './icons/stopwatch001.svg'
import LineImg from './icons/horizontal001.svg'
import SpeedMiningImg from './icons/fast001.svg'
import FriendsIcon from './icons/friends001.svg'
import CartIcon from './icons/cart001.svg'
import ArrowIcon from './icons/arrow-001.svg'
import Logo from '@/assets/pngs/logo.png'
import MiningIcon from '@/assets/pngs/mining.png'
import { useCountDown, useDocumentVisibility, useEventListener, useInterval } from 'ahooks'
import { Popup } from 'antd-mobile'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import { useTranslation } from 'react-i18next'
import Guide from './guide'
import Mining from '@/popups/mining'
import { $user, $wallet, syncMessageCount, syncUser } from '@/stores'
import { useStore } from '@nanostores/react'
import numberParse from '@/helpers/number'
import BigNumber from 'bignumber.js'
import classNames from 'classnames'
import request from '@/helpers/request'
import { publicApi } from '@/stores/panel'
import Starting from './starting'

dayjs.extend(Duration)

const img = new Image()

img.src = Logo
img.width = 16
img.height = 16
img.style.position = 'absolute'

export default function Index() {
  const authNavigate = useAuthNavigate()
  const { t } = useTranslation()
  const user = useStore($user)
  const targetDate = dayjs(user.data?.endTime as number).valueOf()
  const [stepAccumulate, setStepAccumulate] = useState<number>(0)
  const domVisible = useDocumentVisibility()

  const [width, setWidth] = useState(window.innerWidth)
  const [loading, setLoading] = useState(false)
  const [inviteLable, setInviteLable] = useState('')
  const [speedMining, setSpeedMining] = useState('')


  useEventListener('resize', () => {
    // 监听窗口大小变化
    setWidth(window.innerWidth)
  })

  const [countdown] = useCountDown({
    targetDate,
    interval: 1000,
  })

  const time = dayjs.duration(countdown)

  const ProgressBarRef = useRef<any>(null)

  useInterval(async () => {
    setStepAccumulate(stepAccumulate + +((user.data?.incomeTotalHour as number) / 60 / 60) || 0)
  }, 1000)

  useEffect(() => {
    if (user.status !== 'login') return
    syncUser()
  }, [domVisible])

  useEffect(() => {
    console.log(t('mining.invite'), 111);

    if (t('mining.invite') !== 'mining.invite') {
      setInviteLable(t('mining.invite'))
    }
    if (t('mining.highSpeedMining') !== 'mining.highSpeedMining') {
      setSpeedMining(t('mining.highSpeedMining'))
    }
  }, [t('mining.invite'), t('mining.highSpeedMining')])

  const miningVisible = () => {
    const wallet = $wallet.get()
    if (user.data?.guideFlag === 0) return false
    return !!(user.status === 'login' && user.data?.status === 0 && user.isFirstLogin === 0 && wallet.detail)
  }

  const start = async () => {
    if (loading || user.status !== 'login') return
    setLoading(true)
    try {
      await request.post('/mining/start')
      await syncUser()
    } catch (error) {
      /* empty */
    }
    setLoading(false)
  }

  useEffect(() => {
    syncMessageCount()
  }, [])

  useEffect(() => {
    const el = ProgressBarRef.current as HTMLDivElement
    if (el && user.status === 'login') {
      const svg = el.querySelector('svg')!
      if (!svg.querySelector('defs')) {
        const pointer = svg.querySelector('.RCP__pointer') as SVGAElement

        if (!(user.status !== 'login' || user?.data?.status === 0)) {
          const prect = svg.getClientRects()[0] as DOMRect
          const rect = pointer.getBoundingClientRect()
          if (rect && prect) {
            const x = rect.x - prect.x
            const y = rect.y - prect.y
            img.style.left = x - 8 + 'px'
            img.style.top = y - 8 + 'px'
            svg.parentElement?.appendChild(img)
          }
        }

        pointer?.setAttribute('fill', 'url(#ProgressBarRefImage)')
      }

      return () => {
        try {
          el?.querySelector('.RCP')?.removeChild?.(img)
        } catch (error) {
          /* empty */
        }
      }
    }
  }, [ProgressBarRef, user, width])

  return (
    <>
      <Popup
        visible={miningVisible()}
        position="bottom"
        closeOnMaskClick={false}
        bodyStyle={{ backgroundColor: 'transparent' }}>
        <Mining />
      </Popup>
      <div className="relative w-full m-auto px-[15px] pt-5 pb-0" ref={ProgressBarRef}>
        <ProgressBar
          className="m-auto bg-[#141414] rounded-[100%] joyride-steps-9"
          radius={(Math.min(414, width) * 0.75) / 2}
          progress={(user.data?.progressRatio as number) || 0}
          strokeWidth={2}
          transition=""
          trackTransition=""
          initialAnimation={false}
          strokeColor="rgb(93, 218, 167)"
          trackStrokeColor="#383838"
          trackStrokeWidth={miningVisible() ? 0 : 2}
          pointerRadius={user.status !== 'login' ? 0 : 1}
          pointerStrokeColor="red"
          pointerStrokeWidth={0}>
          {user.status !== 'login' || user?.data?.status === 0 ? (
            <div
              id="index-mining"
              onClick={() => {
                start();
                publicApi('首页未挖矿图标点击开始挖矿');
              }}
              className="w-[17.5rem] h-[17.5rem] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex items-center flex-col">
              <img src={MiningIcon} className="w-[75px] h-[75px] m-auto rotationAnimation" />
            </div>
          )
            //  : user?.data?.status === 2 ? (
            //   <Starting/>
            // )
            : (
              <div className="w-[17.5rem] h-[17.5rem] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] pt-12 flex items-center flex-col">
                <div className="flex items-center flex-col" onClick={() => { publicApi('首页logo跳转至钱包界面'); authNavigate('/wallet') }}>
                  <img src={Logo} className="mb-4 w-12 h-12" />
                  <span className="text-[1.75rem] font-bold text-white font-wowRegular">
                    {numberParse(
                      BigNumber(user.data?.balance as number)
                        .plus(stepAccumulate)
                        .toNumber(),
                      6
                    )}
                  </span>
                </div>
                {/* <div className="w-[9.375rem] border-b border-[#424242] mt-2"></div> */}
                <img src={LineImg} className="mr-1 w-[9.5rem] h-[0.125rem] mt-2" />
                <div className="flex items-center flex-col" onClick={() => { publicApi('首页时间部分跳转至挖矿算力界面'); authNavigate('/mining-cycle') }}>
                  <div className="text-[#2FD15B] pt-2 text-[12px] text-center after:content-['WOW/Hr'] after:text-[12px] after:ml-1 mt-2">
                    {' '}
                    +{numberParse(user.data?.incomeTotalHour as number)}
                  </div>
                  <div className="flex items-center mt-1 pb-5">
                    <img src={StopWatch} className="mr-1 w-4 h-4" />
                    <span className="text-[0.8125rem] text-[#4f4f4f]">{time.format('HH:mm:ss')}</span>
                  </div>
                </div>
              </div>
            )}
        </ProgressBar>
      </div>

      {user.data?.guideFlag === 0 ? <Guide /> : null}

      <div className="flex justify-center">
        <div
          onClick={() => { publicApi('首页团队人数跳转至我的团队界面'); authNavigate('/team') }}
          id="joyride-steps-3"
          className="inline-flex justify-center items-center my-4 mb-5">
          <span className="text-15 text-white">
            <span className="font-normal text-[12px]">{(user.data?.teamActiveCount as string) || 0}</span>

            <span className="mx-[1px] font-normal text-[12px]">/7</span>
          </span>
          <img src={UserIcon} className="w-[18px] h-[18px] mb-1 ml-1" />
        </div>
      </div>

      <div
        id="joyride-steps-1"
        className="flex justify-between items-center mx-auto w-[19.625rem] h-[4rem] px-5 py-3 bg-[#242424] rounded-[12px]"
        onClick={() => {
          publicApi('首页闪邀请加速跳转至邀请界面')
          authNavigate('/invitation')
        }}>
        <div className="flex-1 flex items-center">
           <img src={InvitationImg} className="w-[25px] h-[25px]" />
          <div className="flex flex-col pl-[11px]">
            <span className="text-[#ffffff] text-sm mb-1">{inviteLable}</span>
            <span
              className={classNames('text-[#9e9e9e] text-xs', {
                '!text-text-primary': (user.data?.incomeInviteHour as number) > 0,
              })}>
              +{(user.data?.incomeInviteHour as string) || '0.06'} WOW/Hr
            </span>
          </div>
        </div>
        <img src={FriendsIcon} className="w-6 h-[1.3419rem] mr-[22px]" />
        <img src={ArrowIcon}  className="w-[0.2956rem] h-[0.66rem]" />
      </div>
      <div
        id="joyride-steps-2"
        className="flex justify-between items-center mx-auto w-[19.625rem] h-[4rem] px-5 py-3 bg-contain mt-[0.7rem] bg-[#242424] rounded-[12px]"
        onClick={() => {
          publicApi('首页闪电挖矿跳转至质押界面');
          authNavigate('/fast')
        }}>
        <div className="flex-1 flex items-center">
           <img src={SpeedMiningImg} className="w-[13px] h-6" />
          <div className="flex flex-col pl-[21px]">
            <span className="text-[#ffffff] text-sm mb-1">{speedMining}</span>
            <span
              className={classNames('text-[#9e9e9e] text-xs', {
                '!text-text-primary': (user.data?.incomeRobotHour as number) > 0,
              })}>
              +{(user.data?.incomeRobotHour as string) || '0.045'} WOW/Hr
            </span>
          </div>
        </div>
        <img src={CartIcon} className="w-6 h-[1.1663rem] mr-[23px]" />
        <img src={ArrowIcon} className="w-[0.2956rem] h-[0.66rem]" />
      </div>
    </>
  )
}
