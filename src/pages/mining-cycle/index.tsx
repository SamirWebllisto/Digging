import NavHeaderLayout from '@/layouts/header'
import { useCountDown } from 'ahooks'
import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import { useTranslation } from 'react-i18next'
import { $user, publicApi } from '@/stores'
import { useStore } from '@nanostores/react'
import classNames from 'classnames'
import { Popup } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import { RightOutline } from 'antd-mobile-icons'
import Marquee from "@/components/Marquee"

dayjs.extend(Duration)

export default function MiningCycle() {
  const user = useStore($user)
  const { t } = useTranslation()

  const [visible, setVisible] = useState('')

  const targetDate = dayjs(user.data?.endTime as number).valueOf()

  const [countdown] = useCountDown({
    targetDate,
    interval: 1000,
  })

  const authNavigate = useAuthNavigate()

  const time = dayjs.duration(countdown)

  let timer: any = null
  useEffect(() => {
    if (visible) {
      clearTimeout(timer)
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setTimeout(() => {
        setVisible('')
      }, 3000)
    }
  }, [visible])
  return (
    <NavHeaderLayout
    pageName='挖矿周期结束'
      headerChildren={
        <span className="text-base text-white font-normal">
          {t('mining.endTheCycle')} {time.format('HH:mm:ss')}
        </span>
      }>
      <Popup
        position="top"
        visible={!!visible}
        mask={false}
        style={
          {
            '--adm-color-background': 'transparent',
          } as any
        }>
        <p className="mt-12 bg-black p-2 text-center leading-5 text-sm">{t(visible)}</p>
      </Popup>
      <div>
        <div className="invitation-record bg-white/5 mt-5 mb-3 mx-[1.125rem] rounded-xl px-4"  >
          <div className="content p-3 pb-4">
            <p className="my-0 text-[1.0625rem] font-medium mb-4">
              {t('mining.totalAmount')}
              <span className="text-17 text-text-primary">{user.data?.incomeTotalHour as string}</span>
              <span className="text-15 text-text-primary"> WOW/Hr</span>
            </p>
            <div className="flex h-14 justify-center items-center mb-3" >
              <div
                className="bg-[#d9d9d9]/20 rounded flex flex-col py-3 justify-between text-sm font-medium w-[186px] "
                onClick={() => setVisible('invite.baseSpeedTip')}>
                <p className="my-0 text-[#a1a1a1] text-sm">{t('mining.baseRate')}</p>
                <p className="my-0 text-text-primary">
                  <span className="">{user.data?.incomeBaseHour as string}</span>
                  <span className="text-xs">WOW/Hr</span>
                </p>
              </div>
              <span className="px-1 text-xs text-[#a1a1a1] font-medium">x</span>
              <div
                className="bg-[#d9d9d9]/20 rounded flex flex-col py-3 justify-between font-medium w-[120px] text-sm"
                onClick={() => setVisible('invite.boostersTip')}>
                <p className="my-0 text-[#a1a1a1] text-sm ">{t('mining.boosters')}</p>
                <p className="my-0 text-text-primary">{user.data?.incomeTotalRatio as number}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="invitation-record bg-white/5 mt-6 mx-[1.125rem] rounded-xl px-4">
          <div className="content p-4 pb-5">
            <p className="m-0 mb-4 flex justify-between font-medium text-white text-lg">
              <span>{t('mining.boosters')}</span>
              <span className="text-text-primary">{user.data?.incomeTotalRatio as number}%</span>
            </p>

            <div
              className="bg-[#d9d9d9]/5 py-3 px-4 text-sm font-medium mb-3"
              onClick={() => setVisible('invite.baseRateTip')}>
              <div className="flex justify-between text-sm ">
                {/* <p className="my-0 text-[#a1a1a1] text-left text-sm">{t('mining.baseRate')}</p> */}
                <Marquee className='w-7/12 text-left !text-13'>{t('mining.baseRate')}</Marquee>
                <p
                  className={classNames('my-0 text-[#b9b6b6]', {
                    '!text-text-primary': (user.data?.incomeBaseRatio as number) > 0,
                  })}>
                  <span className="">{user.data?.incomeBaseRatio as number}</span>
                  <span>%</span>
                </p>
              </div>
              <p className="text-right m-0 text-sm text-white/20 mt-1">{user.data?.incomeBaseFormula as string}</p>
            </div>

            <div
              className="bg-[#d9d9d9]/5 py-3 px-4 text-sm font-medium mb-3"
              onClick={() => setVisible('invite.wowWalletSpeedTip')}>
              <div className="flex justify-between text-sm">
                {/* <p className="my-0 text-[#a1a1a1] text-left text-sm">WOW EARN {t('common.computingPower')}</p> */}
                <Marquee className='w-7/12 text-left !text-13'>WOW EARN {t('common.computingPower')}</Marquee>

                <p
                  className={classNames('my-0 text-[#b9b6b6]', {
                    '!text-text-primary': (user.data?.incomeWalletRatio as number) > 0,
                  })}>
                  <span className="">{user.data?.incomeWalletRatio as number}</span>
                  <span>%</span>
                </p>
              </div>
              <p className="text-right m-0 text-sm text-white/20 mt-1">
                {user.data?.incomeWalletRatioFormula as string}
              </p>
            </div>

            <div
              className={user.data?.incomeInviteRatioFormula?.length!==1&&user.data?.incomeInviteRatioFormula!==null?'bg-[#d9d9d9]/5 py-3 px-4 text-sm font-medium mb-3 pb-0.5':'bg-[#d9d9d9]/5 py-3 px-4 text-sm font-medium mb-3'}
              onClick={() => setVisible('invite.invitationGrowthRateTip')}>
              <div className="flex justify-between text-sm">
                {/* <p className="my-0 text-[#a1a1a1] text-left ">{t('mining.invitationRate')}</p> */}
                <Marquee className='w-7/12 text-left !text-13'>{t('mining.invitationRate')}</Marquee>

                <p
                  className={classNames('my-0 text-[#b9b6b6]', {
                    '!text-text-primary': (user.data?.incomeInviteRatio as number) > 0,
                  })}>
                  <span className="">{user.data?.incomeInviteRatio as number}</span>
                  <span>%</span>
                </p>
              </div>
              <p className="text-right m-0 text-xs text-white/20 mt-1 text-[#7d7c7c] ">
                {user.data?.incomeInviteRatioFormula as string}
              </p>
            </div>
            <div
            className={user.data?.incomeRobotRatioFormula?.length!==1&&user.data?.incomeRobotRatioFormula!==null?'bg-[#d9d9d9]/5 font-medium mb-3 py-3 px-4 pb-0.5':'bg-[#d9d9d9]/5 font-medium mb-3 py-3 px-4'}
              onClick={() => setVisible('invite.stakeHashPowerTip')}>
              <div className="flex justify-between text-sm ">
                {/* <p className="my-0 text-[#a1a1a1] text-left text-sm">{t('mining.stakePower')} </p> */}
                <Marquee className='w-7/12 text-left !text-13'>{t('mining.stakePower')}</Marquee>

                <p
                  className={classNames('my-0 text-[#b9b6b6]', {
                    '!text-text-primary': (user.data?.incomeRobotRatio as number) > 0,
                  })}>
                  <span className="">{user.data?.incomeRobotRatio as number}</span>
                  <span>%</span>
                </p>
              </div>
              <p className="text-right m-0  text-white/20 mt-1 text-[#7d7c7c]">
                {user.data?.incomeRobotRatioFormula as string}
              </p>
            </div>
            <div
              className={user.data?.incomeInviteRobotRatioFormula?.length!=1&&user.data?.incomeInviteRobotRatioFormula!==null?'bg-[#d9d9d9]/5 font-medium mb-3 py-3 px-4 pb-0.5':'bg-[#d9d9d9]/5 font-medium mb-3 py-3 px-4'}
              onClick={() => setVisible('invite.stakingInvitesHashPower')}>
              <div className="flex justify-between text-sm">
                {/* <p className="my-0 text-[#a1a1a1] text-left text-sm" >{t('mining.InvitationStakeHashPower')}</p> */}
                <Marquee className='w-7/12 text-left !text-13'>{t('mining.InvitationStakeHashPower')}</Marquee>

                <p
                  className={classNames('my-0 text-[#b9b6b6]', {
                    '!text-text-primary': (user.data?.incomeInviteRobotRatio as number) > 0,
                  })}>
                  <span className="">{user.data?.incomeInviteRobotRatio as number}</span>
                  <span>%</span>
                </p>
              </div>
              <p className="text-right m-0 text-xs text-white/20 mt-1 ">
              <Marquee className='!text-right  !text-white/20 !text-13'>{user.data?.incomeInviteRobotRatioFormula as string}</Marquee>
              </p>
            </div>
          </div>
        </div>

        <div className="invitation-record bg-white/5 mt-6 mx-[1.125rem] rounded-xl px-4">
          <div className="content p-4 pb-5">
            <div
              className="bg-[#d9d9d9]/5 font-medium mb-3 py-3 px-4"
              onClick={() =>{publicApi('挖矿算力界面点击邀请算力收益跳转邀请算力收益界面'); authNavigate('/invitation-power')}}>
              <div className="flex justify-between text-sm">
                {/* <p className="my-0 text-[#a1a1a1] text-left text-sm">{t('invitation.power')}</p> */}
                <Marquee className='w-7/12 text-left !text-13'>{t('invitation.power')}</Marquee>

                <p
                  className={classNames('my-0 text-[#b9b6b6] flex items-center', {
                    '!text-text-primary': (user.data?.infiniteInviteIncome as number) > 0,
                  })}>
                  <span className="">{user.data?.infiniteInviteIncome as number}</span>
                  <span> <RightOutline /></span>
                </p>
              </div>
            </div>

            <div
              className="bg-[#d9d9d9]/5 flex py-3 px-4 justify-between text-sm font-medium text-left"
              onClick={() =>{publicApi('挖矿算力界面点击质押邀请算力收益跳转质押邀请算力收益界面'); authNavigate('/invitation-pledge-power')}}>
              {/* <p className="my-0 text-[#a1a1a1] text-left text-sm w-[163px]" style={{border:'1px solid #fff'}}> */}
                {/* {t('invitation.pledge.power')} */}
                <Marquee className='w-7/12 text-left !text-13'>{t('invitation.pledge.power')}</Marquee>
                {/* </p> */}
              <p
                className={classNames('my-0 text-[#b9b6b6] flex items-center ', {
                  '!text-text-primary': (user.data?.infinitePawnInviteIncome as number) > 0,
                })}>
                <span className="">{user.data?.infinitePawnInviteIncome as number}</span>
                <span> <RightOutline /></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </NavHeaderLayout>
  )
}
