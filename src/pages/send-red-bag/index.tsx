import { Button, Dialog, Form, Input, Popup, TextArea, Toast } from 'antd-mobile'
import NavHeaderLayout from '@/layouts/header'
import BG from './icons/bg.png'
import NumBG from './icons/num-bg.png'
import AddBG from './icons/add-bg.png'
import Logo from '@/assets/pngs/logo.png'
import ActivityIcon from './icons/red-record.png'
import { useTranslation } from 'react-i18next'
import request, { loadingRequest } from '@/helpers/request'
import { useNavigate } from 'react-router-dom'
import { useRequest, useInterval } from 'ahooks'
import { useState } from 'react'
import numberParse from '@/helpers/number'
import { $wallet, publicApi, sendBag } from '@/stores'
import QrcodeScan from '@/popups/qrcode-scan'
import QrcodeIcon from '@/pages/send/qrcode_icon.png'

export default function SendRedBag() {
  const [wowAccumulate, setWowAccumulate] = useState(0)
  const [scanQrcode, setScanQrcode] = useState(false)
  const [val, setVal] = useState('')
  const [form] = Form.useForm()
  const [btnShow, setBtnShow] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: wowBalance, refresh } = useRequest(async () => {
    const { result } = await request.get('/balance/getWowBalance')

    return result
  })

  useInterval(
    async () => {
      setWowAccumulate((wowAccumulate || 0) + Number(wowBalance?.speedBalance / 60 / 60 || 0))
    },
    1000,
    {
      immediate: true,
    }
  )

  const onConfirm = async (vals: any) => {
    loadingRequest.show()
    try {
      // 发送红包按钮
      setBtnShow(true)
      await request.post('/balance/sendGratuityFilter', {
        ...vals,
        toAddress: vals.address,
        fromAddress: $wallet.get().detail?.address,
      })
      const data = await sendBag(vals)
      await request.post('/balance/sendGratuity', {
        ...vals,
        toAddress: vals.address,
        fromAddress: $wallet.get().detail?.address,
        tranHash: data
      })
      refresh()
      Toast.show(t('common.sendSuccess'))
      form.resetFields();
      setVal('')
      setBtnShow(false) //发送成功
      // Dialog.clear()
    } catch (error) {
      setBtnShow(false) //发送成功
      /* empty */
    }
    Dialog.clear()
    loadingRequest.hide()
  }

  return (
    <NavHeaderLayout
      pageName='发送红包'
      headerChildren={
        <div className="flex items-center justify-center" >
          <img src={Logo} className="w-5 h-5 mr-2" />
          <span className="font-wowRegular text-base text-[#b1b1b1] h-5">
            {numberParse(+(wowBalance?.balance + wowBalance?.currentBalance + wowAccumulate))} WOW
          </span>
        </div>
      }
      right={
        <span onClick={() => { publicApi('发送红包界面点击红包记录界面'); navigate('/send-red-bag/record') }} className="flex justify-end">
          <img src={ActivityIcon} className="w-[0.875rem]" />
        </span>
      }
      contentClassName="relative w-full overflow-hidden">
      <div className='mt-2'>
        {/* @ts-ignore */}
        <Form
          style={{ '--border-bottom': 'none', '--border-top': 'none', '--adm-color-background': 'transparent' } as any}
          form={form}
          onFinish={(vals: Record<string, string>) => {
            const amount = +vals.amount?.replace(',', '.')
            if (!amount || +amount <= 0) {
              return Toast.show(t('createPacketPage.invalidAmount'))
            }
            if (!vals.address) {
              return Toast.show(t('createPacketPage.invalidAddress'))
            }
            onConfirm({ ...vals, amount })

            // Dialog.confirm({
            //   content: (
            //     <p
            //       className="mt-0 mb-12 p-2 text-xl tracking-widest text-left bg-clip-text text-transparent"
            //       style={{ backgroundImage: 'linear-gradient(180deg,#c4c4c4,#757575)' }}>
            //       {t('createPacketPage.create.tip')}
            //     </p>
            //   ),
            //   onConfirm: () => {
            //     onConfirm({...vals, amount})
            //     return Promise.reject()
            //   },
            //   confirmText: t('myWowList.confirmTransform'),
            //   cancelText: t('buyWow.cancel'),
            // })
          }}>
          <div
            className="bg-cover w-[19.8rem] h-[22.5rem] m-auto mt-[1.56rem] pt-40"
            style={{ backgroundImage: 'url(' + BG + ')', backgroundSize: '100% 100%' }}>
            <Form.Item noStyle className="bg-transparent" name="amount">
              <div
                className="relative w-64 h-11 bg-cover mx-auto flex items-center"
                style={{ backgroundImage: 'url(' + NumBG + ')', backgroundSize: '100% 100%' }}>
                <Input
                  inputMode="decimal"
                  placeholder={t('withdrawPage.amount')}
                  className="w-64 h-12 !text-sm rounded-xl bg-cover mx-auto placeholder:text-text-prompt px-4"
                  style={{ '--font-size': '0.875rem', '--placeholder-color': '#777777', '--color': '#777777' }}
                  clearable
                />
                <span className="mr-3 text-text-unit text-15">WOW</span>
              </div>
            </Form.Item>
            <p className="text-right mt-1 mb-4 text-11 pr-8 text-text-money">
              {t('common.usable')}：{numberParse(wowBalance?.balance, 6)} WOW
            </p>
            <Form.Item noStyle className="bg-transparent" name="address">
              <div className='relative'>
                <TextArea
                  placeholder={t('createPacketPage.address')}
                  className="!w-64 h-[3.5625rem] !text-sm rounded-xl bg-cover mx-auto placeholder:text-text-prompt px-4 pt-[0.3125rem] pr-12"
                  style={{
                    backgroundImage: 'url(' + AddBG + ')',
                    backgroundSize: '100% 100%',
                    '--font-size': '0.875rem',
                    '--placeholder-color': '#777777',
                    '--color': '#777777',
                  }}
                  value={val}
                  onChange={val => {
                    setVal(val)
                    form.setFieldValue('address', val)
                  }}
                />
                <div onClick={() => { publicApi('发送红包界面点击扫一扫'); setScanQrcode(true) }} className='flex absolute right-11 top-4 w-7 h-7 rounded' style={{ boxShadow: '0px 3px 3px 3px rgba(0,0,0,.3', backgroundImage: 'linear-gradient(180deg,#2d2d2d,#020404)' }}>
                  <img src={QrcodeIcon} className='h-4 w-4 m-auto' />
                </div>
              </div>
            </Form.Item>
          </div>
          <Button
            disabled={btnShow}
            type="submit"
            className="rounded-full w-20 h-[1.5875rem] text-15 leading-[1.5875rem] p-0 mx-auto block mt-6 border-none"
            style={{ backgroundImage: 'linear-gradient(180deg, #B5B5B5 0%, #383838 100%)' }}>
            {t('walletPage.send')}
          </Button>
        </Form>
      </div>
      <Popup visible={scanQrcode} showCloseButton onClose={() => setScanQrcode(false)} destroyOnClose>
        <QrcodeScan close={() => setScanQrcode(false)} getResult={address => {
          form.setFieldValue('address', address)
          setVal(address)
        }} />
      </Popup>
    </NavHeaderLayout>
  )
}
