import { Fragment } from 'react'
import { icons } from './icons'
// import { openWalletConnect } from '@/stores/wallet'
import { constructLink } from '@/helpers/utils'

const url = constructLink(new URLSearchParams(location.search).get('invitationCode') || '')

const list = [
  // {
  //   icon: icons['Meta Mask'],
  //   title: 'Meta Mask',
  //   link: `https://metamask.app.link/dapp/${url}`,
  //   info: 'Connect to your MetaMask Wallet',
  // },
  // {
  //   icon: icons['Trust Wallet'],
  //   title: 'Trust Wallet',
  //   link: 'https://link.trustwallet.com/open_url?coin_id=60&url=' + encodeURIComponent(url),
  //   info: 'Connect to your Trust Wallet',
  // },
  {
    title: 'WOW EARN',
    link: 'ullawallet://v1.0.9/default_page?url=' + url,
    icon: icons['WOW EARN'],
    info: 'Connect to your WOW EARN Wallet',
    append: '+50%',
  },
  // {
  //   title: 'WalletConnect',
  //   onClick: () => {
  //     openWalletConnect()
  //   },
  //   link: 'javascript:;',
  //   info: 'Scan with WalletConnect to connect',
  //   icon: icons['WalletConnect'],
  // },
]

/**
 * 选择钱包到钱包中打开
 */
export default function WalletSelection({setVisible}: {
  setVisible: (visible: boolean) => void
}) {
  return list.map((item, index) => (
    <Fragment key={index}>
      <a className="flex items-center w-56 my-3 mx-4" href={item.link} onClick={() => {
          // @ts-ignore
          item.onClick?.()
          setVisible(false)
        }}>
        <img className="w-9 mr-3 h-10" src={item.icon} />
        <div className="flex flex-col">
          <header className="flex justify-between">
            <span className="font-bold text-base">{item.title}</span>
            <span className="text-text-primary text-sm font-semibold">{item.append}</span>
          </header>
          <div className="text-[#868686] font-semibold text-xs">{item.info}</div>
        </div>
      </a>
      {index !== list.length - 1 && <div className="line-bottom !border-[#484848]"></div>}
    </Fragment>
  ))
}
