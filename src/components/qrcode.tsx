import { QRCode } from 'react-qrcode'
import copy from 'copy-to-clipboard'
import { Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import CopyIcon from '@/assets/pngs/copy.png'
import LogoIcon from '@/assets/pngs/logo.png'
import classNames from 'classnames'

export default function QrcodeView({text, className}: {text: string, className?: string}) {
  const { t } = useTranslation()

  return (
    <div className={classNames("w-[15.3125rem] m-auto rounded overflow-hidden mt-20 bg-white p-2", className)} >
      <div className='relative w-[12.375rem] h-[12.375rem] m-auto rounded-lg' style={{overflow:'hidden'}}>
        <QRCode className='mx-auto' value={text} margin={2.5} maskPattern={7} width={258} errorCorrectionLevel="H" />
        <div className='w-16 h-16 rounded-2xl bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' >
          <img src={LogoIcon} className='w-12 h-12 mt-2 mx-auto'/>
        </div>
      </div>
      <p className="flex items-center px-4 text-[#767676] mt-0">
        <span className='max-w-full break-words text-center' onClick={() => {
          copy(text)
          Toast.show(t('common.copySuccess'))
        }}>
          {text} <img className="w-3 h-3 inline" src={CopyIcon} />
        </span>
      </p>
    </div>
  )
}
