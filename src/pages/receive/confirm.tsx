import { useSearchParams } from 'react-router-dom'
import SvgIcon from '@/components/svg-icon'
import NavHeaderLayout from '@/layouts/header'
import ShareIcon from '@/assets/pngs/share.png'
import QrcodeView from '@/components/qrcode'
import { useEffect, useState } from 'react'
import { $wallet, getBalance, publicApi, startTransfer } from '@/stores'
import { Dialog, Input, Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import InputBG from '../send/red_packet_bcg.png'
import { useRequest } from 'ahooks'
import copy from 'copy-to-clipboard'
import request, { loadingRequest } from '@/helpers/request'
import { useShare } from '@/hooks/use-share'
import AttentionIcon from './attention.png'

const nets: any = {
  ETH: 'Ethereum',
  TRX: 'Tron',
  BSC: 'Binance Smart Chain',
}

export default function ReceiveConfirm() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const share = useShare()

  const { data, loading } = useRequest(async () => {
    const { result } = await request.get('/balance/getBalanceBySymbol', {
      params: {
        net: searchParams.get('net'),
        symbol: searchParams.get('symbol'),
      },
    })

    return result
  })
  const net = searchParams.get('net')
  const coinType = searchParams.get('coinType')
  const symbol = searchParams.get('prefix')

  useEffect(() => {
    let timer: any
    if (data) {
      const onConfirm = async () => {
        loadingRequest.show()
        try {
          const el = document.getElementById('amount-input') as HTMLInputElement

          const value = +el.value || 0

          if (!value) {
            throw t('recharge.inputFee')
          }

          if (value < 0.000001) {
            throw t('recharge.inputMin')
          }

          const res = (await getBalance(net!, coinType!, $wallet.get().detail?.address as string)) as any

          if (!res) {
            Toast.show(t('depositPage.chainMismatch'))
            return
          }

          // if (res.tokenBalance < value) {
          //   throw Toast.show(t('withdrawPage.insufficientBalance'))
          // }

          timer = setTimeout(async () => {
            Toast.show({
              content: t('withdrawPage.onTheAir'),
              duration: 3000,
            })
            Dialog.clear()
          }, 5000)
          const hash = (await startTransfer({
            toAddress: data.address,
            tokenAddr: coinType as string,
            amount: value,
          })) as any

          Dialog.clear()
          if (hash?.result) {
            clearTimeout(timer)
            Dialog.confirm({
              content: (
                <>
                  <header className="mb-4 text-sm text-left">{t('recordPage.SUCCESS')}</header>
                  <p
                    className="text-sm bg-clip-text text-transparent font-medium text-left"
                    style={{ backgroundImage: 'linear-gradient(180deg,#b5b5b5,#383838)' }}>
                    {hash.result as string}
                  </p>
                </>
              ),
              onConfirm: () => {
                copy(hash.result as string)
                Toast.show(t('common.copySuccess'))
                return Promise.resolve()
              },
              onCancel() {
                clearTimeout(timer)
              },
              confirmText: t('pickupPage.copy'),
              cancelText: t('buyWow.cancel'),
            })
          } else {
            Toast.show(t('common.actionSuccess'))
            clearTimeout(timer)
          }

          console.log('hash', hash)
          // await request.post('/order/receive', {
          //   deliverGoods: 0,
          //   inputValue: value,
          //   net,
          //   symbol,
          //   toAddress: data.address,
          // })
        } catch (error) {
          if (typeof error === 'string') {
            Toast.show(error)
          }
          clearTimeout(timer)
        }
        loadingRequest.hide()
      }

      Dialog.confirm({
        content: <ConfirmContent symbol={searchParams.get('prefix')!} />,
        onClose: () => {
          publicApi('取消接收数量弹窗')
          loadingRequest.hide()
        },
        onConfirm: () => {
          publicApi('确认接收数量弹窗')
          onConfirm()
          return Promise.reject()
        },
        confirmText: t('myWowList.confirmTransform'),
        cancelText: t('buyWow.cancel'),
      })

      return () => {
        Dialog.clear()
      }
    }
  }, [data])

  return (
    <NavHeaderLayout
      headerChildren={<span className="text-base text-white font-normal">{t('rechargeRecordPage.topUp')}</span>}
      contentClassName="px-4">
      <div className="invitation-record mt-10">
        <div className="content p-4">
          <header className="flex items-center justify-between">
            <div className="flex items-center">
              <SvgIcon name="usdt" className="w-8 h-8" />
              <span className="block mx-2 text-base font-semibold text-[#b9b9b9]">{searchParams.get('prefix')}</span>
              <span className="text-xs text-[#b9b9b9]">{searchParams.get('name')}</span>
            </div>
            <img
              src={ShareIcon}
              className="w-[18px] h-[18px]"
              onClick={() => {
                publicApi('点击接收界面分享按钮跳转二维码接收界面')
                share()
              }}
            />
          </header>

          <div className="line-bottom my-4"></div>

          <div className="pt-1 pb-6">
            {loading ? (
              <div className="w-64 h-64 m-auto rounded overflow-hidden mt-6 bg-white"></div>
            ) : (
              <QrcodeView text={data?.address} />
            )}
          </div>
        </div>
      </div>
      <div className="py-3 px-6 text-white text-xs bg-[#302319] mt-12 flex items-center rounded-lg">
        <img className='w-[1.375rem] h-[1.375rem] mr-3' src={AttentionIcon} />
        <span>{t('public.receptionHint').replace('$1', `${net}(${nets[net?.toLocaleUpperCase() as any]})`)}</span>
      </div>
    </NavHeaderLayout>
  )
}

const ConfirmContent = ({ symbol }: { symbol: string }) => {
  const { t } = useTranslation()
  const [input, setInput] = useState<string>()

  return (
    <>
      <header className="mb-4 text-sm text-left">{t('public.inputMoenyTip')}</header>
      <div
        className="bg-contain bg-no-repeat p-2 mt-2 flex justify-between items-center mb-6"
        style={{ backgroundImage: `url(${InputBG})`, backgroundSize: '100% 100%' }}>
        <Input
          id="amount-input"
          className="bg-transparent outline-none w-full flex-1 !placeholder:text-[#5b5b5b]"
          inputMode="decimal"
          value={input}
          onChange={(val) => {
            setInput((val || '').replace(',', '.'))
          }}
        />
        <span>{symbol}</span>
      </div>
    </>
  )
}
