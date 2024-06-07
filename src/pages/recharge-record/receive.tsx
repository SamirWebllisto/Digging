import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import request from '@/helpers/request'
import Lists from '@/components/lists'
import BG from './bg_record.png'
import USDTIcon from './usdt.png'
import { publicApi } from '@/stores'

import { status } from './send'
import numberParse from '@/helpers/number'

export default function Receive() {
  const { t } = useTranslation()

  return (
    <div
      className="mx-4 h-[27.5625rem] p-[1.4375rem] mt-6 overflow-hidden overflow-y-auto"
      style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%' }}>
      <Lists
        request={async (params) => {
          const { result } = await request.get('/order/queryByPage', {
            params: { ...params, orderType: 1 },
          })
          return result
        }}>
        {(records, loading) => {
          console.log(records)
          return records?.map((item: any, index: number) => (
            <div key={index} className="mt-3 border-b-[0.5px] last:border-b-0 font-wowRegular border-[#636262]">
              <header className="flex justify-between text-[13px]">
                <span className="flex items-center">
                  <img className="w-4 h-4 mr-1" src={USDTIcon} />
                  <span className="block mt-1">{item.prefix}</span>
                </span>
                <span>{numberParse(item.amount, 6)} </span>
              </header>
              <footer className="flex justify-between text-[11px] text-[#838383] mt-[5px] pb-[11px]">
                <div>{dayjs(item.createTime).format('HH:mm:ss DD/MM/YYYY')}</div>
                <div>{t(status[item.status! as keyof typeof status])}</div>
              </footer>
            </div>
          ))
        }
        }
      </Lists>
    </div>
  )
}
