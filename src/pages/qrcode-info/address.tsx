import NavHeaderLayout from '@/layouts/header'
import QrcodeView from '@/components/qrcode'
import { $wallet, publicApi } from '@/stores'
import Logo from '@/assets/pngs/logo.png'
import BG from './bg_deposit_short.png'
import SvgIcon from '@/components/svg-icon'
import { useShare } from '@/hooks/use-share'

export default function QrcodeAddress() {
  const share = useShare()
  return (
    <NavHeaderLayout pageName='地址二维码' className="bg-transparent" headerChildren="" contentClassName="relative p-[15px]">
      <div style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%', padding: '23px', marginTop: 23, height: '29.8rem'}}>
        <header className="flex items-start justify-between">
          <div className="flex items-center">
            <img src={Logo} className="w-[1.875rem] h-[1.875rem] mr-3" />
            <span className="text-19 text-[#b9b9b9] font-semibold">WOW</span>
          </div>
          <SvgIcon name="up-share" className="w-[18px] h-[18px] mt-[6px]" onClick={()=>{publicApi('分享邀请链接'); share();}}/>
        </header>
        <div className='line-bottom' style={{margin: '18px 0px 27px'}}></div>
        <QrcodeView className="w-[245px] !mt-16" text={$wallet.get().detail?.address as string} />
      </div>
    </NavHeaderLayout>
  )
}
