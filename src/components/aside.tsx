import classnames from 'classnames'
import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '@nanostores/react'
import { $panel, publicApi } from '@/stores/panel'
import { $money } from '@/stores/money'
import PanelLangIcon from '@/assets/panel-lang.png'
import PanelMoneyIcon from '@/assets/panel-money.png'
import TelegramIcon from '@/assets/pngs/telegram.png'
import DiscordIcon from '@/assets/pngs/discord.png'
import TwitterIcon from '@/assets/pngs/twitter.png'
import AnoutIcon from '@/assets/pngs/ic_wow.png'
import ScanIcon from '@/assets/pngs/scan.png'
import SvgIcon from './svg-icon'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { $wallet, unlink } from '@/stores/wallet'
import { useTranslation } from 'react-i18next'
import { Popup } from 'antd-mobile'
import RouterPopup from '@/components/router-popup'
import NavHeaderLayout from '@/layouts/header'

type IAsideProps = {
  setLangVisible: (visible: boolean) => void
}
export default function Aside({ setLangVisible }: IAsideProps) {
  const navigate = useNavigate()
  const authNavigate = useAuthNavigate()
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [viewType, setViewType] = useState<'paper' | 'about' | 'scan'>('paper')
  const location = useLocation()
  const panel = useStore($panel)
  const wallet = useStore($wallet)
  const type = panel.type

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        $panel.setKey('type', 'home')
        break
      case '/wallet':
        $panel.setKey('type', 'wallet')
        break
      default:
        break
    }
  }, [location])

  const viewTypes: {[key: string]: {
    url: string
    title: string
    publicApi: string
    langkey?: string
  }} = useMemo(() => ({
    about: {
      url: 'https://www.wowearn.com',
      title: '',
      publicApi: '关于界面的返回按钮'
    },
    paper: {
      url: 'https://www.wowearn.com/whitepaper/index.html',
      title: 'WOW EARN Whitepaper',
      publicApi: '白皮书界面的返回按钮'
    },
    scan: {
      url: wallet.detail ? 'https://www.wowearn.io/address/' + wallet.detail?.address : 'https://www.wowearn.io',
      title: '',
      publicApi: '浏览器的返回按钮',
      langkey: 'menu.scan'
    }
  }), [wallet])

  return (
    <aside className="flex justify-between items-center flex-col w-52 px-4 pt-4">
      <div className="pt-3 w-full">
        <div className="text-base font-semibold text-[#B3B3B3] flex items-center">
          <img src="/logo.png" className='w-[22px] h-[22px]'/>
          <strong className='text-[#a6a6a6] font-title font-bold ml-[10px] break-words text-[19px]'>WOW EARN</strong>
        </div>
        <ul className="mt-6 text-text-menu text-sm">
          <li
            onClick={() => {
              publicApi('点击侧边栏首页')
              navigate('/')
              $panel.setKey('open', false)
              $panel.setKey('type', 'home')
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'home',
            })}>
            <SvgIcon name={type === 'home' ? 'home' : 'home-unactive'} className="w-4 h-4 mr-3" />
            <span>{t('menu.home')}</span>
          </li>
          <li
            onClick={() => {
              publicApi('点击侧边栏钱包')
              authNavigate('/wallet')
              $panel.setKey('type', 'wallet')
              $panel.setKey('open', false)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'wallet',
            })}>
            <SvgIcon name={type === 'wallet' ? 'wallet-active' : 'panel-wallet'} className="w-4 h-4 mr-3" />
            <span>{t('menu.wallet')}</span>
          </li>
          <li
            onClick={() => {setLangVisible(true)}}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'lang',
            })}>
            <img className="w-4 h-4 mr-3" src={PanelLangIcon} />
            <span>{t('menu.lang')}</span>
          </li>
          <li
            onClick={() => {
              publicApi('点击侧边栏货币')
              $money.setKey('open', true)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'money',
            })}>
            <img className="w-4 h-4 mr-3" src={PanelMoneyIcon} />
            <span>{t('menu.coin')}</span>
          </li>
          <li
            onClick={() => {
              setViewType('scan')
              setVisible(true)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'money',
            })}>
            <img className="w-4 h-4 mr-3" src={ScanIcon} />
            <span>{t('menu.scan')}</span>
          </li>
          <li
            onClick={() => {
              publicApi('点击侧边栏白皮书')
              setViewType('paper')
              setVisible(true)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'paper',
            })}>
            <SvgIcon name="panel-paper" className="w-4 h-4 mr-3" />
            <span>{t('menu.whitePaper')}</span>
          </li>
          <li
            onClick={() => {
              publicApi('点击侧边栏清除缓存')
              unlink()
              $panel.setKey('open', false)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'clear',
            })}>
            <SvgIcon name="panel-clear" className="w-4 h-4 mr-3" />
            <span>{t('menu.clearStorage')}</span>
          </li>
          <li
            onClick={() => {
              publicApi('点击侧边栏关于')
              setViewType('about')
              setVisible(true)
            }}
            className={classnames('h-9 rounded-md leading-9 flex items-center pl-4 mt-3', {
              'text-white bg-black': type === 'about',
            })}>
            <img src={AnoutIcon} className="w-4 h-4 mr-3" />
            <span>{t('menu.about')}</span>
          </li>
        </ul>
      </div>
      <footer className="fixed bottom-0 w-full flex p-4">
        <a href="https://twitter.com/WOWEARNENG" target="_blank">
          <img src={TwitterIcon} className="w-4 h-4 mr-4" />
        </a>
        <a href="https://m.facebook.com/WOWEARNEN" target="_blank">
          <SvgIcon name="facebook" className="w-4 h-4 mr-4" />
        </a>
        <a href="https://t.me/wowearnen" target="_blank">
          <img src={TelegramIcon} className="w-4 h-4 mr-4" />
        </a>
        <a href="https://discord.com/channels/1086128075990908999/1086128075990909002" target="_blank">
          <img src={DiscordIcon} className="w-4 h-4" />
        </a>
      </footer>

      <RouterPopup visible={visible} onClose={() => setVisible(false)}>
        <NavHeaderLayout doNotFillTheHeight={!viewTypes[viewType].langkey} headerTransparent headerChildren={<span className='text-white text-base'>{viewTypes[viewType]?.langkey ? t(viewTypes[viewType].langkey!) : viewTypes[viewType]?.title}</span>} contentClassName="flex" onBack={() => {console.log(viewType);publicApi(viewTypes[viewType]?.publicApi);setVisible(false)}}>
          {visible && (
            <iframe
              key={viewType}
              className="border-none w-full flex-1"
              src={viewTypes[viewType]?.url}
            />
          )}
        </NavHeaderLayout>
      </RouterPopup>
    </aside>
  )
}
