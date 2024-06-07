import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import request from '@/helpers/request'
import Lists from '@/components/lists'
import BG from './bg_record.png'
import USDTIcon from './usdt.png'
import numberParse from '@/helpers/number'

export const status = {
  0: 'recordPage.AUDIT',
  1: 'recordPage.SUCCESS',
  2: 'recordPage.FAIL',
  3: 'recordPage.PROGRESS',
  4: 'recordPage.REJECTED',
}

export default function Send() {
  const { t } = useTranslation()

  return (
    <div
      className="mx-4 h-[27.5625rem] p-[1.4375rem] mt-6 overflow-hidden overflow-y-auto"
      style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%' }}>
      <Lists
        request={async (params) => {
          const { result } = await request.get('/order/queryByPage', {
            params: { ...params, orderType: 0 },
          })

          return result
        }}>
        {(records) => {
          console.log(records)
          return records?.map((item: any, index: number) => (
            <div key={index} className="mt-3 border-b-[0.5px] last:border-b-0 font-wowRegular border-[#636262]">
              <header className="flex justify-between text-13">
                <span className='flex items-center'><img className='w-4 h-4 mr-1' src={USDTIcon}/><span className='block mt-1'>{item.prefix}</span></span>
                <span>{numberParse(item.amount, 6)}</span>
              </header>
              <footer className="flex justify-between text-11 text-[#838383] mt-[5px] pb-[11px]">
                <div>{dayjs(item.createTime).format('HH:mm:ss DD/MM/YYYY')}</div>
                <div>{t(status[item.status! as keyof typeof status])}</div>
              </footer>
            </div>
          ))
        }}
      </Lists>
    </div>
  )
}
