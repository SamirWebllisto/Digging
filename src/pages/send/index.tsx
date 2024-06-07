import { useState } from 'react'
import SvgIcon from '@/components/svg-icon'
import NavHeaderLayout from '@/layouts/header'
import { Button, Dialog, Form, Input, Popover, Popup, Toast } from 'antd-mobile'
import { DownOutline } from 'antd-mobile-icons'
import styles from './index.module.less'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { useAsyncEffect, useRequest } from 'ahooks'
import request from '@/helpers/request'
import BG from './withdraw_bcg.png'
import QrcodeIcon from '@/pages/send/qrcode_icon.png'
import { $wallet, DEFAULT_MAIN_CHAINS, publicApi } from '@/stores'
import QrcodeScan from '@/popups/qrcode-scan'

type Balance = {
  address: string
  balance: number
  blockedBalance: number
  net: string
  symbol: string
  prefix: string
  name: string
  mainSymbol: string
}

export default function Send() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [balanceValue, setBalanceValue] = useState<Balance | null>(null)
  const [scanQrcode, setScanQrcode] = useState(false)
  const [val, setVal] = useState('')
  const [form] = Form.useForm()

  const inputAmount = Form.useWatch('inputValue', form)
  const toAddress = Form.useWatch('toAddress', form)

  const {data: config} = useRequest(async () => {

    const { result } = await request.get('/setting/get/WITHDRAWAL_SETTING', {

    })

    return result

  })

  const { data } = useRequest(async () => {
    const { result } = await request.get('/balance/getSendCoinList', {
      params: {
        net: DEFAULT_MAIN_CHAINS[$wallet.get().netId],
      },
    })

    setBalance(result[0])
    return result as Balance[]
  })

  const onConfirm = async (vals: any) => {
    try {
      await request.post('/order/send', {
        ...vals,
        symbol: balance?.symbol,
        net: balance?.mainSymbol,
        deliverGoods: 0,
        type: 'sell',
      })
      Toast.show(t('common.sendSuccess'))
      Dialog.clear()
    } catch (error) {
      if ((error as any)?.code === 20044 || (error as any)?.data?.code === 20044) {
        setTimeout(() => Toast.show(t('common.WITHDRAW_ERROR')))
      }else if ((error as any)?.code === 34007 || (error as any)?.data?.code === 34007) {
        setTimeout(() => Toast.show(t('common.WITHDRAW_LIMIT') + (error as any)?.message))
      }
    }
  }

  const submit = async (vals?: Record<string, unknown>) => {
    if (disabled) return
    Dialog.confirm({
      content: (
        <p
          className="mt-0 mb-12 p-2 text-xl tracking-widest text-left bg-clip-text text-transparent"
          style={{ backgroundImage: 'linear-gradient(180deg,#c4c4c4,#757575)' }}>
          {t('createPacketPage.create.tip')}
        </p>
      ),
      onConfirm: () => {
        publicApi('确认发送按钮')
        onConfirm(vals)
      },
      confirmText: t('myWowList.confirmTransform'),
      cancelText: t('buyWow.cancel'),
    })
  }

  useAsyncEffect(async () => {
    if (!balance) return
    const { result } = await request.get('/balance/getUsdtBalance', {
      params: {
        symbol: balance?.symbol,
        net: balance?.mainSymbol,
      },
    })

    setBalanceValue({ ...balance, balance: result.balance })
  }, [balance])

  const disabled = !inputAmount || !toAddress

  const list = data?.filter((item) => item.net !== balance?.net || item.symbol !== balance?.symbol)

  console.log(config)

  return (
    <NavHeaderLayout
      headerChildren={<span className="text-base text-white font-normal">{t('walletPage.send')}</span>}
      contentClassName="px-[16px]">
      <div className="mt-8 p-[1.4375rem]" style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%' }}>
        <Form form={form} className={classNames(styles.form)} onFinish={(vals)=>{publicApi('发送界面发送按钮');submit(vals)}}>
          <div className="flex">
            <Popover
              trigger="click"
              mode="dark"
              visible={visible}
              onVisibleChange={(val) => (data?.length || 0) > 1 && setVisible(val)}
              className="border border-[#999] rounded-md bg-gradient-to-r from-[#454545] to-[#151515]"
              // @ts-ignore
              style={{ '--background': 'transparent' }}
              placement="bottomRight"
              content={list?.map((item) => (
                <p
                  className="m-0 flex items-center justify-center text-[#b5b5b5]"
                  onClick={() => {
                    publicApi(`切换发送${item.prefix}链:${item.name}`)
                    setBalance(item)
                    setVisible(false)
                  }}>
                  <SvgIcon name="usdt" className="w-6 h-7 mr-2" />
                  <span className="text-sm">
                    {item?.prefix} ({item?.name})
                  </span>
                </p>
              ))}>
              <header className="inline-flex items-center">
                <SvgIcon name="usdt" className="w-6 h-7 mr-2" />
                {balance && (
                  <>
                    <div className="text-[#b5b5b5] font-semibold">
                      <span className="text-[19px]">{balance?.prefix}</span>
                      <span className="text-base uppercase">({balance?.name})</span>
                    </div>
                    {(data?.length || 0) > 1 ? <DownOutline className="ml-1 text-[#b5b5b5]" /> : null}
                  </>
                )}
              </header>
            </Popover>
          </div>

          <div className="line-bottom pt-6"></div>
          <Form.Item
            className='relative'
            name="toAddress"
            label={<span>{t('public.adress')}</span>}
            style={{ '--padding-left': '0px', '--padding-right': '0px' } as object}>
            <div className={styles.input}>
              <Input value={val} style={{ '--font-size': '15px', 'paddingRight': 20 }} clearable onClear={() => {
                form.setFieldValue('toAddress', '')
                setVal('')

              }}
              onChange={val => {
                setVal(val)
              }} />
              <img onClick={() =>{publicApi('发送界面扫描钱包地址');setScanQrcode(true)} } src={QrcodeIcon}  className='absolute right-2 w-[0.875rem]'/>
            </div>
          </Form.Item>
          <Form.Item
            name="inputValue"
            shouldUpdate
            label={<span>{t('withdrawPage.amount')}</span>}
            style={{ '--padding-left': '0px', '--padding-right': '0px' } as object}>
            <div>
              <div className={styles.input}>
                <Input
                  style={{ '--font-size': '15px' }}
                  placeholder={t('withdrawPage.minimumFee') + ': ' + (config?.minPrice || 100) + (balance?.prefix || '')}
                  inputMode="decimal"
                  clearable
                  value={inputAmount}
                  onChange={val => {
                    setTimeout(() => {
                      form.setFieldValue('inputValue', (val || '').replace(',', '.'))
                    }, 0);
                  }}
                  onClear={() => form.setFieldValue('inputValue', '')}
                />
                <span>{balance?.prefix}</span>
              </div>
              <footer className="text-[#757575] text-xs text-right mt-2">
                {t('withdrawPage.available')}: {balanceValue?.balance} {balance?.prefix}
              </footer>
            </div>
          </Form.Item>
          <div className="line-bottom mt-1 mb-4"></div>
          <footer className="flex justify-between items-center">
            <div className="flex flex-col text-xs text-[#7c7c7c] items-start">
              <span>
                {t('withdrawPage.realFee')}: {Math.max((inputAmount || 0) - (config?.commission || 1), 0).toLocaleString()} {balance?.prefix}
              </span>
              <span className="inline-block mt-1">
                {t('contract.serviceCharge')}: {config?.commission || 1} {balance?.prefix}
              </span>
            </div>
            <Button
              type="submit"
              className={classNames('w-14 h-6 rounded-2xl text-sm p-0 m-0 bg-white/5 ml-3 border-none', {
                '!bg-[d9d9d9]/10 !text-[#787676]': disabled,
              })}
              style={{ backgroundImage: disabled ? '' : 'linear-gradient(112deg, #B5B5B5 15%, #383838 100%)' }}>
              {t('walletPage.send')}
            </Button>
          </footer>
        </Form>
      </div>
      <Popup visible={scanQrcode} showCloseButton onClose={() =>setScanQrcode(false)} destroyOnClose>
        <QrcodeScan close={() => setScanQrcode(false)} getResult={address => {
          form.setFieldValue('toAddress', address)
          setVal(address)
        }}/>
      </Popup>
    </NavHeaderLayout>
  )
}
