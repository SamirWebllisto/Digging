import { NoticeBar, Toast } from 'antd-mobile'
import WalletBg from './icons/wallet-bg.png'
import Logo from '@/assets/pngs/logo.png'
import SvgIcon from '@/components/svg-icon'
import { useTranslation } from 'react-i18next'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import { useInterval, useRequest } from 'ahooks'
import { $user, $wallet, DEFAULT_MAIN_CHAINS, DEFAULT_MAIN_CHAINS_SYMBOL_USDT } from '@/stores'
import { useStore } from '@nanostores/react'
import request from '@/helpers/request'
import i18n from '@/locales'
import NetworkError from '@/components/network-error'
import numberParse from '@/helpers/number'
import SendIcon from './icons/send.png'
import CardIcon from './icons/card.png'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import Marquee from "@/components/Marquee"
import { publicApi } from '@/stores'
import Rec from "./icons/rec.svg"
import send from "./icons/send.svg"
import trade from "./icons/trade.svg"
import swap from "./icons/swap.svg"
import clock from './icons/clock.svg'
import buy from './icons/buy.svg'

export default function Wallet() {
  const authNavigate = useAuthNavigate()
  const user = useStore($user)
  const [extraAmount, setExtraAmount] = useState(0)
  const { t } = useTranslation()

  const { data, error, refresh } = useRequest<
    {
      wow: IWowBalance
      list: IWalletList
      address: string
    },
    any
  >(async () => {
    const net = DEFAULT_MAIN_CHAINS[$wallet.get().netId]
    const { result: wow } = await request.get('/balance/getWowBalance')
    const { result: list } = await request.get('/balance/getUsdtBalance')
    const { result: address } = await request.get('/balance/getBalanceBySymbol', {
      params: {
        net,
        symbol: DEFAULT_MAIN_CHAINS_SYMBOL_USDT[net as keyof typeof DEFAULT_MAIN_CHAINS_SYMBOL_USDT],
      }
    })

    return {
      wow,
      list,
      address: address.address
    }
  })

  useInterval(async () => {
    setExtraAmount(extraAmount + +(Number(data?.wow.speedBalance) || 0))
  }, 1000)

  if (error) {
    return <NetworkError refresh={refresh} />
  }

  return (
    <div className="relative w-full h-72 m-auto px-4 -mt-2">
      {data?.wow && (
        <div
          key="wow"
          className="h-[12.938rem] rounded-sm bg-bg-gray24 px-[11px] py-[18px] shadow-cardShadow bg-cover mx-auto flex flex-col justify-between bg-no-repeat"
         >
          <header className="flex flex-col ">
            <div className="flex items-center">
              <img src={Logo} className="w-7 h-7 mr-3" />
              <span
                className="text-lg font-semibold text-text-textA6 font-poppins"
                style={{ textShadow: '0px 2px 2px rgba(0,0,0,0.1759)' }}>
                {numberParse(+(data?.wow.balance + data.wow.currentBalance + extraAmount))} WOW
              </span>
            </div>
          </header>

          <div className="flex items-center justify-between text-center">
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{publicApi('钱包界面接收W币按钮'); Toast.show(t('common.developmentTip'))} }>
              {/* <SvgIcon name="send" className="w-11 h-11" /> */}
              <img src={Rec} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.receive')}</Marquee>
              {/* <NoticeBar className='flex justify-center ' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8">{t('walletPage.receive')}</span> } speed={30} /> */}
            </div>
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{publicApi('钱包界面发送W币按钮');Toast.show(t('common.developmentTip'))} }>
              <img src={send} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.send')}</Marquee>
              {/* <NoticeBar className='flex justify-center ' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8">{t('walletPage.send')}</span>} speed={30}  /> */}
            </div>
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{ publicApi('钱包界面交易W币按钮'); Toast.show(t('common.developmentTip'))}}>
            <img src={trade} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.trade')}</Marquee>
              {/* <NoticeBar className='flex justify-center ' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8">{t('walletPage.trade')}</span>} speed={30}  /> */}
            </div>
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{ publicApi('钱包界面兑换W币按钮');Toast.show(t('common.developmentTip'))}}>
            <img src={swap} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.swap')}</Marquee>
              {/* <NoticeBar className='flex justify-center ' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8">{t('walletPage.swap')}</span>} speed={30}  /> */}
            </div>
          </div>
        </div>
      )}

      {data?.list ? (
        <div
          key={data?.list.net + data?.list.symbol}
          className="h-[12.938rem] rounded-sm px-[11px] py-[18px] bg-bg-gray24 shadow-cardShadow bg-cover mx-auto flex flex-col justify-between mt-[18px] bg-no-repeat relative"
          >
            <div className='flex justify-between'>

          <header className="flex flex-col">
            <div className="flex items-center">
              <SvgIcon name="usdt" className="w-7 h-7 mr-3" />
              <span
                className="text-lg font-semibold text-text-textA6 font-poppins"
                style={{ textShadow: '0px 2px 2px rgba(0,0,0,0.1759)' }}>
                {numberParse(BigNumber(data?.list.balance).plus(data?.list.rewardBalance).toNumber())} {data?.list.name}
              </span>
            </div>
            <p
              className="text-xs text-text-textA6 m-0 ml-10 font-poppins before:content-['≈'] before:text-xs before:mr-1"
              style={{ textShadow: '0px 2px 2px rgba(0,0,0,.18)' }}>
              {user.money?.unit}{' '}
              {numberParse(
                (user.money?.exchangeRate || 1) * BigNumber(data?.list.balance).plus(data?.list.rewardBalance).toNumber()
              )}
            </p>
          </header>
          <img src={clock}  onClick={() =>{publicApi('点击钱包界面USDT卡片列表图标跳转质押列表'); authNavigate('/recharge-record')}} className="flex items-start h-max"  />
            </div>

          <div className="flex items-center justify-between text-center" style={{ height: 76 }}>
            <div className='w-1/4 flex justify-center items-center flex-col'  onClick={() =>{publicApi('点击钱包界面接收USDT按钮跳转接收界面');authNavigate('/receive')} }>
              {/* <SvgIcon name="send" className="w-11 h-11" /> */}
              <img src={Rec} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.receive')}</Marquee>
              {/* <NoticeBar className='w-full flex justify-center px-1' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={<span className="text-text-trade text-sm leading-8 text-center">{t('walletPage.receive')}</span> } speed={30}  /> */}
            </div>
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{publicApi('点击钱包界面发送USDT按钮跳转发送界面');authNavigate('/send')} }>
              <img src={send} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.send')}</Marquee>
              {/* <NoticeBar className='w-full flex justify-center  px-1' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={<span className="text-text-trade text-sm leading-8 text-center">{t('walletPage.send')}</span> } speed={30}  /> */}
            </div>
            <div className='w-1/4 flex justify-center items-center flex-col' onClick={() =>{publicApi('点击钱包界面交易USDT按钮(开发中)');Toast.show(t('common.developmentTip'))} }>
              {/* <SvgIcon name="trade" className="w-11 h-11" /> */}
              <img src={trade} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.trade')}</Marquee>
              {/* <NoticeBar className='w-full flex justify-center px-1' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8 text-center">{t('walletPage.trade')}</span> } speed={30}  /> */}
            </div>
            <a className='w-1/4 flex justify-center items-center flex-col'
              href={`/recharge-web/index.html#/startPay2?to=${data?.address}&net=${DEFAULT_MAIN_CHAINS[$wallet.get().netId]}&symbol=USDT&defaultAmount=100&language=${(i18n.language || '').split('_')?.[0]}&theme=2EBC84&businessId=1&businessUserId=50000163&ulla=Y2M4OTZhMTYtNWI4Ny00YTY5LTlhODAtMzI0MmUwZDcyZmIw`}
              target="_blank">
              <img src={buy} className="w-11 h-11" />
              <Marquee className="w-10/12 !text-xs h-8 !leading-8">{t('walletPage.buy')}</Marquee>
              {/* <NoticeBar className='w-full flex justify-center text-center px-1' style={{'--background-color': 'transparent', '--border-color': 'transparent'}} icon={null} content={
              <span className="text-text-trade text-sm leading-8 text-center mx-auto">{t('walletPage.buy')}</span> } speed={30}  /> */}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  )
}

type IWowBalance = {
  address: string
  balance: number
  blockedBalance: number
  currentBalance: number
  net: string
  speedBalance: number
  symbol: string
  unLockBalance: number
}

export type IWalletList = {
  address: string
  balance: number
  blockedBalance: number
  net: string
  symbol: string
  name: string
  logo: string
  rewardBalance: number
}
