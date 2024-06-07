import Lists from '@/components/lists'
import request from '@/helpers/request'
import NavHeaderLayout from '@/layouts/header'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import BG from './icons/red-record-bg.png'
import { truncateString } from '@/helpers/utils'
import dayjs from 'dayjs'
import ListEmpty from '@/components/empty'
import { publicApi } from '@/stores'
import Marquee from "@/components/Marquee"

const status = {
  0: 'depositPage.transactionPending',
  1: 'recordPage.SUCCESS',
  2: 'recordPage.FAIL',
}
export default function SendRedBagRecord() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <NavHeaderLayout
    pageName='红包发送记录'
      headerChildren={<span className="text-[19px]">{t('packetPage.title')}</span>}
      right={
        <span
        onClick={() =>{publicApi('红包发送记录界面点击创建钱包跳转发送红包界面'); navigate('/send-red-bag')}}
        className="block w-[110px] h-[27px] text-xs leading-[25px] text-center rounded-full"
        style={{ backgroundImage: 'linear-gradient(90deg,#b5b5b5,#383838)' }}>
              <Marquee className="w-11/12 text-center h-[27px] leading-[25px]">{t('packetPage.createPacket')}</Marquee>
          {/* <Marquee className='w-[100px] text-center h-[27px] leading-[25px] text-orange-600	'>
             {t('packetPage.createPacket')}
            </Marquee> */}
        </span>
      }>
      <div className="h-full">
        <div
          className="text-center pt-[0.625rem] pb-[0.875rem]"
          style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%', margin: '22px 10px 0 12px' }}>
          <div
            className="rounded-[5px]"
            style={{ margin: '10px 14px 0 10px', backgroundColor: 'rgba(0,0,0,.3)', padding: '12px 10px' }}>
            <div className="text-[#838383] text-13">
              <td className="inline-block  text-[#838383] w-1/5"> 
              {t('withdrawPage.amount')}
            </td>
              <td className="inline-block w-1/5">{t('public.adress')}</td>
              <td className="inline-block w-2/5">{t('invite.time')}</td>
              <td className="inline-block w-1/5">{t('public.status')}</td>
            </div>
          </div>
          <div className="text-[#bfbfbf] text-xs">
            <Lists
              request={async (params) => {
                const { result } = await request.post('/balance/gratuity/queryByPage', {
                  ...params,
                })

                return result
              }}>
              {(records, loading) => {
                if (!loading && !records.length)
                  return (
                    <ListEmpty
                      className="pt-[1.75rem] pb-0 text-[#838383] !bg-none"
                      textStyle={{
                        backgroundImage: 'none',
                        color: '#838383',
                      }}
                    />
                  )
                return records.map((item: any) => (
                  <div className="p-[0.625rem] border-b border-[#767474]" style={{ margin: '0 14px 0 10px' }}>
                    <td className="inline-block w-1/5">{item.amount}</td>
                    <td className="inline-block w-1/5">{truncateString(item.toAddress)}</td>
                    <td className="inline-block w-2/5">{dayjs(item.createTime).format('HH:mm:ss DD-MM')}</td>
                    <td className="inline-block w-1/5">{t(status[item.status as keyof typeof status] as string)}</td>
                  </div>
                ))
              }}
            </Lists>
          </div>
        </div>
      </div>
    </NavHeaderLayout>
  )
}
