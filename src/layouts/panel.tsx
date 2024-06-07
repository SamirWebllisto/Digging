/* eslint-disable no-empty */
import Logo from '@/assets/pngs/logo.png'
import { truncateString } from '@/helpers/utils'
import { $money, $panel, $user, $wallet, DEFAULT_MAIN_CHAINS, INetId, logout, startConnect, startDisconnect, startLogin } from '@/stores'
import { useStore } from '@nanostores/react'
import { animated, useSpring } from '@react-spring/web'
import { Badge, Popover, Popup, SafeArea, Toast } from 'antd-mobile'
import copy from 'copy-to-clipboard'
import { useRef, useState } from 'react'
// @ts-ignore
import CopyAddIcon from '@/assets/copy-icon01.svg'
import FastIcon from '@/assets/fast001.svg'
import ConnectedWalletIcon from '@/assets/ic_wallet.svg'
import FooterMenuImg from '@/assets/pngs/footermenu001.png'
import PanelBG from '@/assets/pngs/panel-bg.png'
import WalletImg from '@/assets/wallet002.svg'
import TabHomeIcon from '@/assets/wow-logo01.svg'
import Aside from '@/components/aside'
import Lang from '@/popups/lang'
import Money from '@/popups/money'
// import WalletConnect from '@/assets/pngs/ic_connect.png'
import ETHLogoIcon from '@/assets/eth-icon001.svg'
import BUSDIcon from '@/assets/pngs/BUSD@2x.png'
import TRXcon from '@/assets/pngs/TRX@2X.png'
import SvgIcon from '@/components/svg-icon'
import WalletSelection from '@/components/wallet-selection'
import { loadingRequest } from '@/helpers/request'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import { publicApi } from '@/stores/panel'
import { useEventListener } from 'ahooks'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'



const icons = {
  ETH: ETHLogoIcon,
  BSC: BUSDIcon,
  TRX: TRXcon,
}

/**
 * 主要的面板布局
 */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const authNavigate = useAuthNavigate()
  const [netVisible, setNetVisible] = useState(false)
  const [unlinkVisible, setUnlinkVisible] = useState(false)
  const [selectionVisible, setSelectionVisible] = useState(false)
  const [langVisible, setLangVisible] = useState(false)
  const [tmpNetId, setTmpNetId] = useState<INetId | null>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const wallet = useStore($wallet)
  const panel = useStore($panel)
  const money = useStore($money)
  const user = useStore($user)
  const search = Object.fromEntries(searchParams)
  const [width, setWidth] = useState(window.innerWidth)
  useEventListener('resize', () => {
    // 监听窗口大小变化
    setWidth(window.innerWidth)
  })

  const { percent } = useSpring({
    percent: panel.open ? 100 : 0,
    config: {
      precision: 0.1,
      mass: 0.4,
      tension: 300,
      friction: 30,
    },
  })

  const nets = ['eip155:1', 'eip155:56'].filter((net) => (tmpNetId || wallet.netId) !== net) as INetId[]



  let filterNets: INetId[] = nets

  if ((window as any).ethereum) {
    filterNets = nets.filter(item => item !== 'tron:0x2b6653dc')
  }

  if ((window as any).tronWeb && !(window as any).ethereum) {
    filterNets = nets.filter(item => item === 'tron:0x2b6653dc')
  }

  if ((window as any).tronWeb && (window as any).ethereum) {
    filterNets = nets
  }

  const asideWidth = parseFloat(document.documentElement.style.fontSize) * 208 / 16

  return (
    <div className="min-h-screen">
      <Popup
        visible={panel.open}
        onClose={() => $panel.setKey('open', false)}
        position="left"
        closeOnMaskClick
        bodyClassName="bg-cover"
        // @ts-ignore
        bodyStyle={{ '--adm-color-background': '#121212', backgroundImage: 'url(' + PanelBG + ')' }}>
        <Aside setLangVisible={setLangVisible} />
      </Popup>
      <Popup
        visible={langVisible}
        onClose={() => setLangVisible(false)}
        position="bottom"
        closeOnMaskClick
        bodyClassName="bg-cover"
      // @ts-ignore
      // bodyStyle={{ '--adm-color-background': '#121212', backgroundImage: 'url(' + PanelBG + ')' }}
      >
        <Lang setLangVisible={setLangVisible} />
      </Popup>
      <Popup
        visible={money.open}
        onClose={() => $money.setKey('open', false)}
        position="bottom"
        closeOnMaskClick
        bodyClassName="bg-cover"
      // @ts-ignore
      // bodyStyle={{ '--adm-color-background': '#121212', backgroundImage: 'url(' + PanelBG + ')' }}
      >
        <Money />
      </Popup>
      <animated.header
        className="flex justify-between fixed top-0 w-full py-4 bg-top bg-cover bg-fixed z-10"
        style={{
          backgroundColor: 'var(--main-background-color)',
          left: percent.to((v) => {
            return `${Math.max((v / 100) * asideWidth, 0)}px`
          }) as unknown as string,
        }}>
        <div className="flex justify-between w-full wow-width px-[13px]">
          <div className="flex justify-end items-center" onClick={() => { publicApi('侧边栏logo跳转至首页'); $panel.setKey('open', true); }}>
            <img src={Logo} className="w-[1.3rem] h-[1.3rem] joyride-steps-6" />
          </div>
          <div className="flex items-center">
            <Popover
              // @ts-ignore
              style={{ '--background': '#303030' }}
              visible={netVisible && filterNets.length >= 1}
              onVisibleChange={setNetVisible}
              content={filterNets.map((item, index) => (
                <p
                  key={item}
                  className={classNames('m-0 flex items-center', { 'mt-2': index !== 0 })}
                  onClick={async () => {
                    // const net = (window as any).ethereum && item === 'tron:0x2b6653dc' ? 'eip155:1' : item
                    setTmpNetId(item)
                    setNetVisible(false)
                    // reChangeChain(item)
                    loadingRequest.show()
                    try {
                      if (user.status === 'login') {
                        try {
                          await logout()
                        } catch (error) { }
                      }

                      const d = await startConnect(item)
                      console.log('d', d)
                      $wallet.setKey('netId', item)
                      setNetVisible(false)

                      if (user.status !== 'login') {
                        startLogin(d, '0')
                      }
                    } catch (error) {
                      console.log('login', error)
                    }
                    setTmpNetId(null)
                    loadingRequest.hide()
                  }}>
                  <img
                    src={icons[DEFAULT_MAIN_CHAINS[item].toLocaleUpperCase()! as keyof typeof icons || 'ETH']}
                    className="w-[1.375rem] h-[1.375rem]"
                  />
                </p>
              ))}
              placement="bottomLeft"
              mode="dark"
              trigger="click">
              <img
                src={icons[DEFAULT_MAIN_CHAINS[tmpNetId || wallet.netId]?.toLocaleUpperCase() as keyof typeof icons || 'ETH']}
                className="w-[1.375rem] h-[1.375rem] mr-3 joyride-steps-8"
              />
            </Popover>
            {wallet.detail && user.status === 'login' ? (
              <Popover
                // @ts-ignore
                style={{ '--background': 'transparent' }}
                visible={unlinkVisible}
                className="border border-[#999] rounded-md bg-gradient-to-r from-[#454545] to-[#151515]"
                onVisibleChange={(val) => (val === false ? setUnlinkVisible(false) : null)}
                content={
                  <p
                    className="m-0 flex items-center"
                    onClick={async () => {
                      publicApi('点击首页钱包地址断开链接');
                      loadingRequest.show()
                      try {
                        await startDisconnect()
                        setUnlinkVisible(false)
                      } catch (error) { }
                      loadingRequest.hide()
                    }}>
                    <span className='text-base'>{t('indexPage.disconnect')}</span>
                    <SvgIcon name="logout" className="w-4 h-4 ml-2" />
                  </p>
                }
                placement="bottomRight"
                mode="dark"
                trigger="click">
                <div className="flex items-center rounded-[4px] px-3 h-[1.875rem] bg-[#242424]" id="joyride-steps-7">
                  {/* <SvgIcon name="wallet-icon" className="w-4 h-4 mr-2" /> */}
                  <img src={ConnectedWalletIcon} className="w-[1.125rem] h-4 mr-2" />
                  <span className='text-[12px] mt-[2px]' onClick={() => setUnlinkVisible(true)}>{truncateString(wallet.detail.address)}</span>
                  <img
                    onClick={() => {
                      publicApi('登陆状态下复制地址');
                      copy(wallet.detail?.address || '')
                      Toast.show(t('common.copySuccess'))
                    }}
                    src={CopyAddIcon}
                    className="w-[0.9375rem] h-[0.9375rem] ml-2"
                  />
                </div>
              </Popover>
            ) : (
              <Popover
                visible={selectionVisible}
                onVisibleChange={(val) => (val === false ? setSelectionVisible(false) : null)}
                content={<WalletSelection setVisible={setSelectionVisible} />}
                trigger="click"
                mode="dark"
                style={{ '--content-padding': 0, '--background': 'rgba(0,0,0,.95)' } as any}>
                <div
                  className="flex items-center rounded-[4px] px-3 h-8 bg-[#242424]"
                  id="joyride-steps-7"
                  onClick={async () => {
                    publicApi('点击首页登陆')
                    loadingRequest.show()
                    try {
                      if (search.autoConnect || typeof (window as any).ethereum !== 'undefined' || typeof (window as any).tronWeb !== 'undefined') {
                        const data = await startConnect()
                        await startLogin(data, '0')
                      } else {
                        setSelectionVisible(true)
                      }
                    } catch (error) {
                      console.log('login', error)
                      await logout()
                    }
                    loadingRequest.hide()
                    // // @ts-ignore
                    // const grecaptcha = window.grecaptcha;
                    // grecaptcha.ready(function () {
                    //   grecaptcha.execute('6LeJm1IpAAAAAK5uuSUFV0yGEavZiuEbz0zB3ORg', { action: 'submit' })
                    //     .then(async function (token: string) {
                    //       // Add your logic to submit to your backend server here.
                    //       console.log(token)
                    //       publicApi('点击首页登陆')

                    //       const url = window.location.protocol === 'https:' ? '' : 'http://47.91.106.43:8011'
                    //       const res = await request.post(`${url}/recaptcha`, {
                    //         responseToken: token
                    //       })
                    //       console.log(res);

                    //       loadingRequest.show()
                    //       try {
                    //         if (search.autoConnect || typeof (window as any).ethereum !== 'undefined' || typeof (window as any).tronWeb !== 'undefined') {
                    //           const data = await startConnect()
                    //           await startLogin(data, '0')
                    //         } else {
                    //           setSelectionVisible(true)
                    //         }
                    //       } catch (error) {
                    //         console.log('login', error)
                    //         await logout()
                    //       }
                    //       loadingRequest.hide()
                    //     })
                    //     .catch(() => {
                    //       Toast.show(t('verification.failed'))
                    //     })
                    // });
                  }}>
                  {/*<img src={WalletConnect} className="w-[1.3125rem] mr-2" />*/}
                  <div className="text-sm text-white">Wallet Connect</div>
                </div>
              </Popover>
            )}
          </div>
        </div>
      </animated.header >
      <div ref={bgRef}></div>
      <animated.div
        style={{
          transform: percent.to((v) => {
            return `translate(${Math.max((v / 100) * asideWidth, 0)}px, 0)`
          }),
        }}
        className={classNames('bg-cover bg-fixed wow-width')}>
        <main className="box-border pt-20 pb-24">{children}</main>
      </animated.div>
      <animated.footer
        className="fixed -bottom-4 footer-fixed-bottom w-full bg-top"
        style={{
          left: percent.to((v) => {
            return `${Math.max((v / 100) * asideWidth, 0)}px`
          }) as unknown as string,
        }}>
        <div className='w-full flex justify-center h-14 bg-top'>
          <div
            className="wow-width w-full flex justify-around items-start bg-no-repeat pt-3"
            style={{ backgroundImage: `url(${FooterMenuImg})`, backgroundSize: '100%', backgroundPositionY: 'top' }}>
            <span className="flex justify-center flex-1" onClick={() => { publicApi('点击导航栏栏闪电图标跳转质押界面'); authNavigate('/fast') }}>
              <Badge content={user.messageCount ? Badge.dot : null}>
                <img className="block joyride-steps-5 h-6 w-[13px]" src={FastIcon} alt="" />
              </Badge>
            </span>
            <span className='w-[20%] flex justify-center'>
              <span
                className="half-border bg-[#1A1C1C] opacity-70 -mt-11 w-[58px] h-[58px] rounded-[100%] flex justify-center items-center flex-none"
                id="joyride-steps-0">
                <img onClick={() => { publicApi('点击导航栏中间logo图标跳转至首页'); authNavigate('/') }} className="w-[38px] h-[38px]" src={TabHomeIcon} alt="" />
              </span>
            </span>
            <span className="flex justify-center flex-1" onClick={() => { publicApi('点击导航栏钱包图标跳转至钱包界面'); authNavigate('/wallet') }}>
              <img className="block joyride-steps-4 w-[28px] h-[28px]" src={WalletImg} alt="" />
            </span>
          </div>
        </div>
        <SafeArea position="bottom" />
      </animated.footer>
    </div >
  )
}
