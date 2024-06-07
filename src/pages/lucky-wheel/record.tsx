import SvgIcon from '@/components/svg-icon'
import NavHeaderLayout from '@/layouts/header'
import { CapsuleTabs } from 'antd-mobile'
import LogoIcon from '@/assets/pngs/logo.png'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListEmpty from '@/components/empty'
import dayjs from 'dayjs'
import { useRequest } from 'ahooks'
import request from '@/helpers/request'
import classNames from 'classnames'
import { publicApi } from '@/stores'

export default function Record() {
  const { t } = useTranslation()
  const [type, setType] = useState<'w' | 'u'>('w')

  const { data } = useRequest(
    async () => {
      const { result } = await request.get('/common/turntable/orderList', {
        params: {
          category: type === 'w' ? 1 : 2,
        },
      })

      return result
    },
    {
      refreshDeps: [type],
    }
  )

  return (
    <>
      <NavHeaderLayout pageName='转盘中奖记录' headerTransparent headerChildren={<span className='text-white text-base font-normal'>{t('activity.winningRecords')}</span>} contentClassName="mx-5">
        <CapsuleTabs activeKey={type} onChange={(val) => {publicApi(`切换${val as 'w' | 'u'}中奖记录`);setType(val as 'w' | 'u')}} className="switch-card my-3">
          <CapsuleTabs.Tab
            title={
              <div className="flex justify-center items-center  w-[8.2968rem]">
                <img src={LogoIcon} className="w-5 h-5 mr-2" />
                <span className='w-[6.525rem] truncate'>{t('activity.winningRecords')}</span>
              </div>
            }
            key="w"
          />
          <CapsuleTabs.Tab
            title={
              <div className="flex justify-center items-center  w-[8.2968rem]">
                <SvgIcon name="usdt" className="w-5 h-5 mr-2" />
                <span className='w-[6.525rem] truncate'>{t('activity.winningRecords')}</span>
              </div>
            }
            key="u"
          />
        </CapsuleTabs>

        <div className="mt-6 rounded-xl px-4 border-[0.5px] border-[#9e9e9e]">
          <div className="p-2">
            <header className="flex text-center text-[#838383] text-[12px]">
              <div className={classNames("w-1/2", {'!w-1/5': type === 'u'})}>{t('activity.prize')}</div>
              {type === 'u' ? <div className={classNames("w-1/5", {'!w-2/5': type === 'u'})}>{t('activity.consumptionItems')}</div> : null}
              <div className={classNames("w-1/2", {'!w-3/5': type === 'u'})}>{t('invite.time')}</div>
            </header>
            <div className="line-bottom mt-2 !border-[#454545]"></div>
            <main className="">
              {data?.map((item: any, index: number) => (
                <div className="flex py-2 text-center text-[12px]" key={index}>
                  <div className={classNames("text-[#28a27c] font-bold w-1/2 text-center text-xs	font-normal", {'!w-1/5': type === 'u'})}>{item.name}</div>
                  {type === 'u' ? <div className={classNames("text-center text-[#bfbfbf] w-1/2 text-center text-xs	font-normal", {'!w-2/5': type === 'u'})}>1USDT</div> : null}
                  <div className={classNames("text-[#bfbfbf] w-1/2 text-center text-xs	font-normal", {'!w-3/5': type === 'u'})}>{dayjs(+item.time).format('HH:mm:ss DD-MM-YYYY')}</div>
                </div>
              ))}
              {!data?.length ? <ListEmpty /> : null}
            </main>
          </div>
        </div>
      </NavHeaderLayout>
    </>
  )
}
