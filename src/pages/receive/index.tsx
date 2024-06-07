import SvgIcon from '@/components/svg-icon'
import request from '@/helpers/request'
import { useAuthNavigate } from '@/hooks/auth-navigate'
import NavHeaderLayout from '@/layouts/header'
import { useRequest } from 'ahooks'
import { Button, DotLoading } from 'antd-mobile'
import classNames from 'classnames'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import WalletBg from '../wallet/icons/wallet-bg.png'
import { $wallet, DEFAULT_MAIN_CHAINS, publicApi } from '@/stores'

export default function Receive() {
  const [wallet, setWallet] = useState<any>()
  const { t } = useTranslation()
  const authNavigate = useAuthNavigate()

  const { data, error, refresh, loading } = useRequest(async () => {
    const { result } = await request.get('/balance/getReceiveCoinList', {
      params: {
        net: DEFAULT_MAIN_CHAINS[$wallet.get().netId]
      }
    })

    setWallet(result[0])
    return result
  })

  const isEq = (a?: any, b?: any) =>
    a?.symbol === b?.symbol && a?.net === b?.net && a?.coinType === b?.coinType

  if (loading) return <DotLoading />
  return (
    <NavHeaderLayout refresh={refresh} error={error} headerChildren={<span className='text-base text-white font-normal'>{t('walletPage.receive')}</span>} contentClassName="px-4">
      {() => (
        <>
          <div
            className="mt-10"
            style={{
              backgroundImage: 'url(' + WalletBg + ')',
              backgroundSize: '100% 100%',
              borderRadius: '10px',
              position: 'unset',
              padding: '25px 17px',
              paddingRight: '22px',
            }}>
            {data?.map((item: any, index: number) => (
              <div
                key={index}
                onClick={() => {publicApi(`接收界面选择${item.prefix}链:${item.name}`);setWallet(item)}}
                className={classNames('flex justify-between items-center py-2 px-3 rounded-xl mb-4 h-[3.25rem]', {
                  'ring-[0.5px] ring-white': isEq(wallet, item),
                })}
                style={{
                  backgroundImage: 'linear-gradient(99deg, rgba(0, 0, 0, 0.51) 3%, rgba(71, 71, 71, 0.38) 65%)',
                }}>
                <div className="flex items-center">
                  <SvgIcon name={['usdt', 'usdc'].includes(item.prefix?.toLocaleLowerCase()) ? item.prefix?.toLocaleLowerCase() : 'usdt'} className="w-8 h-8 mr-2" />
                  <span
                    className={classNames('text-[#8e8c8c] text-17 font-semibold', {
                      '!text-white': isEq(wallet, item),
                    })}>
                    {item.prefix}
                  </span>
                </div>
                <span
                  className={classNames('text-[#b9b9b9] text-sm', {
                    '!text-white': isEq(wallet, item),
                  })}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>

          <Button
            onClick={() =>{
              publicApi('点击接收界面下一步跳转接收输入数量界面');
              authNavigate({
                pathname: '/receive-confirm',
                search: `?symbol=${wallet?.symbol}&net=${wallet?.mainSymbol}&coinType=${wallet?.coinType}&name=${wallet?.name}&prefix=${wallet?.prefix}`,
              })
            }
            }
            className="w-28 h-8 rounded-2xl text-lg block p-0 m-auto mt-8 bg-white/5 border-none"
            style={{ backgroundImage: 'linear-gradient(rgb(181, 181, 181) 0%, rgb(56, 56, 56) 100%)' }}>
            {t('withdrawMethodPage.next')}
          </Button>
        </>
      )}
    </NavHeaderLayout>
  )
}
