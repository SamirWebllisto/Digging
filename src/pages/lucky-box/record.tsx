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
import { publicApi } from '@/stores'

export default function Record() {
  const { t } = useTranslation()
  const [type, setType] = useState<'w' | 'u'>('w')

  const { data } = useRequest(
    async () => {
      const { result } = await request.get('/common/blingBox/orderList', {
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
      <NavHeaderLayout
      pageName='盲盒中奖列表'
        headerTransparent
        headerChildren={<span className="text-white text-base font-normal">{t('activity.winningRecords')}</span>}
        contentClassName="mx-5">
        <CapsuleTabs  activeKey={type} onChange={(val) => {publicApi(`切换${val as 'w' | 'u'}中奖盲盒记录`); setType(val as 'w' | 'u')}} className="switch-card mb-3 mt-6" >
          <CapsuleTabs.Tab   className='px-[0.1875rem]'
            title={
              <div className="flex justify-center items-center w-[8.2968rem]" >
                <img src={LogoIcon} className="w-5 h-5 mr-2" />
                <span className='w-[6.525rem] truncate'>{t('activity.winningRecords')}</span>
              </div>
            }
            key="w"
          />
          <CapsuleTabs.Tab className='px-[0.1875rem]'
            title={
              <div className="flex justify-center items-center w-[8.2968rem] ">
                <SvgIcon name="usdt" className="w-5 h-5 mr-2" />
                <span className='w-[6.525rem] truncate'>{t('activity.winningRecords')}</span>
              </div>
            }
            key="u"
          />
        </CapsuleTabs>

        <div className="mt-2 rounded-xl px-4 border-[0.5px] border-[#9e9e9e]">
          <div className="p-4">
            <header className="flex text-center text-[#838383] text-xs">
              <div className="w-1/3">{t('activity.prize')}</div>
              <div className="w-2/3">{t('invite.time')}</div>
            </header>
            <div className="line-bottom mt-2 !border-[#454545]"></div>
            <main className="">
              {data?.map((item: any, index: number) => (
                <div className="flex py-2" key={index}>
                  <div className="text-[#28a27c] font-bold w-1/3 text-center text-xs	font-normal ">{item.name}</div>
                  <div className="w-2/3 text-[#bfbfbf] text-center text-xs	font-normal">{dayjs(+item.time).format('HH:mm:ss DD-MM-YYYY')}</div>
                </div>
              ))}
              {!data?.length ? <ListEmpty className='!pb-0' textStyle={{color: '#838383'}} /> : null}
            </main>
          </div>
        </div>
      </NavHeaderLayout>
    </>
  )
}
