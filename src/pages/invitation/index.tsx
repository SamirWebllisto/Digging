import NavHeaderLayout from '@/layouts/header'
import { useNavigate } from 'react-router-dom'
import './index.css'
import InputBG from '../send/red_packet_bcg.png'
import Icon3 from './icons/icon3.png'
import Icon2 from './icons/icon2.png'
import Icon1 from './icons/icon1.png'
import SvgIcon from '@/components/svg-icon'

import HasUserIcon from './icons/has-user.png'
import WaitUserIcon from './icons/wait-user.png'

import Record from './record'
import classNames from 'classnames'
import { useInterval, useRequest } from 'ahooks'
import request from '@/helpers/request'
import { Dialog, Input, Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useShare } from '@/hooks/use-share'
import numberParse from '@/helpers/number'
import { publicApi } from '@/stores'
import i18n from "@/locales";

export default function Invitation() {
  const share = useShare()
  const navigate = useNavigate()
  const [usdtAccumulate, setUsdtAccumulate] = useState<number>(0)
  const { t } = useTranslation()

  const { data, loading, error, refresh } = useRequest(async () => {
    const res = await request.get('/team/getTeam')
    return res.result
  })

  useInterval(
    async () => {
      setUsdtAccumulate(usdtAccumulate + +data?.incomeStep)
    },
    1000,
    {
      immediate: true,
    }
  )

  if (loading) {
    return null
  }

  const userLevelIcons = [Icon3, Icon2, Icon1]

  const userLevel = data?.sixOpenId ? 2 : data?.twoOpenId ? 1 : 0
  const leftUserLevel = data?.fourOpenId ? 1 : 0
  const rightUserLevel = data?.sixOpenId ? 1 : 0

  return (
    <NavHeaderLayout
      pageName='邀请界面'
      error={error}
      refresh={refresh}
      headerChildren={<span className="text-base text-white font-normal">{t('invite.messageReferral')}</span>}>
      {() => (
        <>
          <div className="px-3 m-auto mt-2">
            <header className="flex justify-between items-center mb-5">
              <div
                className="flex-1 h-[3.125rem] rounded-[0.625rem] flex leading-[3rem] text-[#bfbfbf] text-xs px-6 justify-between bg-contain bg-no-repeat items-center mt-3"
                style={{
                  backgroundImage: 'linear-gradient(144deg,hsla(0,0%,50%,.38),rgba(49,48,48,.52))',
                  boxShadow: '0px 0px 4px 0px rgba(0,0,4,.46)',
                }}>
                <span className="invitation-text-fill text-15">{t('invite.earning')}</span>
                <div className="pl-8">
                  <span className="invitation-text-fill text-17 leading-[3rem]">
                    {numberParse(+(data.income || 0) + (usdtAccumulate || 0), 6)} <span className="text-15">USDT</span>
                  </span>
                </div>
              </div>
              <div className=' h-[3.125rem] flex items-end' >
                <SvgIcon
                  name="up-share"
                  className="w-6 h-6 "
                  style={{ margin: '0 15px 0 17px' }}
                  onClick={() => {
                     publicApi('邀请收益提现按钮')
                    let val: string
                    Dialog.confirm({
                      bodyClassName: "DialogBox",
                      style: {
                        '--min-width': '22.125rem',
                        '--max-width': '22.125rem',
                      } as any,
                      maskClassName: 'cover-background',
                      content: <WithdrawalContent income={data.extractableIncome} onChange={(v) => (val = v)} />,
                      onConfirm: async () => {
                        publicApi('邀请收益提币确认按钮')
                        await request.post('/mining/incomeExtraction', {
                          amount: val,
                        })
                        refresh()
                        Dialog.clear()
                        Toast.show(t('msg_004').replace('%s', val))
                        console.log('success')
                      },
                      confirmText: t('public.confirm'),
                      cancelText: t('buyWow.cancel'),
                    })
                  }}
                />
              </div>

            </header>
            <div className="invite-container relative mt-2" >
              <ItemView
                friendId='a'
                src={userLevelIcons[data.userLevel - 1]}
                starting={!!data.uidStatus}
                uid={data.openId}
                invitationCode={data.invitationCode}
                big
                border
                className="absolute top-8 left-1/2 -translate-x-1/2 -translate-y-1/2"
              />
              <ItemView
                friendId='一级1号位'
                starting={!!data.oneUidStatus}
                src={userLevelIcons[data.oneUserLevel - 1]}
                uid={data.oneOpenId}
                invitationCode={data.invitationCode}
                border
                className="absolute top-[6.6rem] left-1/3 -translate-x-2/3"
              />
              <ItemView
                friendId='一级2号位'
                starting={!!data.twoUidStatus}
                invitationCode={data.invitationCode}
                src={userLevelIcons[data.twoUserLevel - 1]}
                uid={data.twoOpenId}
                border
                className="absolute top-[6.6rem] left-3/4 -translate-x-[100%]"
              />
              <ItemView
                friendId='二级1号位'
                starting={!!data.threeUidStatus}
                invitationCode={data.invitationCode}
                src={userLevelIcons[data.threeUserLevel - 1]}
                uid={data.threeOpenId}
                border
                className="absolute top-[12.7rem] left-[20%] -translate-x-[90%]"
              />
              <ItemView
                friendId='二级2号位'
                starting={!!data.fourUidStatus}
                invitationCode={data.invitationCode}
                src={userLevelIcons[data.fourUserLevel - 1]}
                uid={data.fourOpenId}
                border
                className="absolute top-[12.7rem] left-[46%] -translate-x-[90%]"
              />
              <ItemView
                friendId='二级3号位'
                starting={!!data.fiveUidStatus}
                invitationCode={data.invitationCode}
                src={userLevelIcons[data.fiveUserLevel - 1]}
                uid={data.fiveOpenId}
                border
                className="absolute top-[12.7rem] left-[68%] -translate-x-[90%]"
              />
              <ItemView
                friendId='二级4号位'
                starting={!!data.sixUidStatus}
                invitationCode={data.invitationCode}
                src={userLevelIcons[data.sixUserLevel - 1]}
                uid={data.sixOpenId}
                border
                className="absolute top-[12.7rem] left-[90%] -translate-x-[90%]"
              />

              <p
                className={classNames(
                  'absolute left-1/2 -translate-x-1/2 h-4 top-[9.35rem] text-xs text-[#aeaeae] rounded-lg px-1',
                  { '!text-[#39BC5C]': data.oneSpeedActive === 2 }
                )}
                style={{
                  backgroundImage: 'linear-gradient(90deg,#303030,#555 53%,#222)',
                }}>
                +{data.oneSpeed} WOW/Hr
              </p>
              <p
                className={classNames(
                  'absolute left-1/2 -translate-x-1/2 h-4 top-[15.35rem] text-xs text-[#aeaeae] rounded-lg px-1',
                  { '!text-[#39BC5C]': data.oneSpeedActive === 2 && data.twoSpeedActive === 4 && data.miningFlag == 1 }
                )}
                style={{
                  backgroundImage: 'linear-gradient(90deg,#303030,#555 53%,#222)',
                }}>
                +{data.twoSpeed} WOW/Hr
              </p>
            </div>

            <div className="flex justify-around mt-5" >
              <SvgIcon name="red-packet" className="w-[1.5625rem] h-[1.5625rem]" onClick={() => { publicApi('邀请界面跳转发送红包界面'); navigate('/send-red-bag') }} />
              <SvgIcon name="qrcode" className="w-[1.5625rem] h-[1.5625rem]" onClick={() => { publicApi('邀请界面点击二维码跳转地址二维码界面'); navigate('/qrcode-address') }} />
              <SvgIcon name="share-right" className="w-[1.5625rem] h-[1.5625rem]" onClick={() => { publicApi('邀请界面点击分享邀请码'); share() }} />
            </div>
          </div>

          <Record list={data.inviteTeamVos || []} />
        </>
      )}
    </NavHeaderLayout>
  )
}

function ItemView({
  friendId,
  border,
  big,
  className,
  style,
  starting,
  src,
  uid,
}: {
  friendId: string
  border: boolean
  big: boolean
  className?: string
  style?: React.CSSProperties
  starting: boolean
  src: string
  uid?: string
  invitationCode: string
}) {
  const share = useShare()

  const sendMessage = async () => {
    if (!starting) {
      const { result } = await request.get('/team/inviteFriendsMining', {
        params: {
          openId: uid,
        },
      })
      Toast.show(i18n.t('invite.sendMessage'))
    }
  }

  return (
    <span className={classNames('z-[1]', className)} style={style}>
      <span
        className={classNames('relative w-12 h-12 flex items-center justify-center', { '!w-16 !h-16': big })}
        style={{ backgroundImage: `url(${border ? HasUserIcon : WaitUserIcon})`, backgroundSize: '100%' }}>
        {/* {border ? (
          <img src={HasUserIcon} className={classNames('w-12 h-12', { '!w-16 !h-16': big })} style={{maxWidth: 'fit-content'}}/>
          // <SvgIcon name="has-user" className={classNames('w-12 h-12', { '!w-16 !h-16': big })} />
        ) : (
          <img src={WaitUserIcon} className={classNames('w-[2.56rem] h-[2.56rem]', { '!w-14 !h-14': big })} style={{maxWidth: 'fit-content'}}/>
          // <SvgIcon name="wait-user" className={classNames('w-[2.56rem] h-[2.56rem]', { '!w-14 !h-14': big })} />
        )} */}

        {/* <span className={classNames('w-12 h-12 block', { '!w-16 !h-16': big })}></span> */}

        {uid ? (
          <img
            className={classNames('absolute w-[1.375rem] h-[1.375rem] top-1/2 left-1/2 -translate-x-1/2 opacity-30 -translate-y-3', {
              'left-6 -translate-x-[0.65rem]': border,
              '!-translate-y-4': border && big,
              '!-translate-y-[0.75rem]': border && !big,
              'w-[1.375rem] h-[1.375rem] !-translate-x-[0.175rem]': big,
              '!opacity-100': starting,
            })}

            onClick={() => { friendId !== 'a' && publicApi(`${!starting ? `发送消息邀请${friendId}挖矿` : ''}`); sendMessage(); }}
            style={{ maxWidth: 'fit-content' }}
            src={src}
          />
        ) : (
          <span
            onClick={() => { share(); publicApi(`${`点击邀请${friendId}`}`); }}
            className={classNames('opacity-30 text-3xl font-light text-[#ccc] -mt-2 leading-[2rem] flex content-center items-center ', {
              '!opacity-100': starting,
            })}>
            +
          </span>
        )}
      </span>
    </span>
  )
}

ItemView.defaultProps = {
  border: false,
  big: false,
  starting: false,
}

function WithdrawalContent({ income, onChange }: { income: string; onChange: (v: string) => void }) {
  const { t } = useTranslation()

  const [input, setInput] = useState<string>()

  useEffect(() => {
    onChange(input!)
  }, [input, onChange])

  return (
    <>
      <header
        className="mb-4 mt-1 text-xl bg-clip-text text-transparent font-medium text-left"
        style={{ backgroundImage: 'linear-gradient(180deg,#b5b5b5,#383838)' }}>
        {t('invite.withdrawals')}
      </header>
      <div
        className="bg-contain bg-no-repeat p-2 flex justify-between items-center"
        style={{ backgroundImage: `url(${InputBG})`, backgroundSize: '100% 100%' }}>
        <Input
          placeholder={t('public.inputMoenyTip')}
          className="bg-transparent outline-none w-full flex-1  !placeholder:text-[#5b5b5b]"
          type='number'
          onChange={setInput}
          value={input}
          clearable
          onClear={() => setInput(undefined)}
        />
        <span onClick={() => { publicApi('点击提币弹窗全部'); setInput(income) }}>{t('public.all')}</span>
      </div>
      <p className="mb-1 text-[#7c7c7c] text-xs text-right">
        {t('invite.withdrawableMoeny')}: {income} USDT
      </p>
    </>
  )
}
