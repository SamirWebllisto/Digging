import ListEmpty from '@/components/empty'
import { useTranslation } from 'react-i18next'
import { truncateString } from '@/helpers/utils'
import dayjs from 'dayjs'
import BG from './icons/bg-i.png'
import numberParse from '@/helpers/number'

export default function Record({ list }: { list: Record<string, any>[] }) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl px-4" style={{margin: '24px 16px 0 16px', backgroundImage: `url(${BG})`, backgroundSize: '100% 100%'}}>
      <div className="content pb-2">
        <header className="flex justify-between pt-3 pb-2 border-b-[0.5px] border-[#D8D8D8]/20 text-[#bfbfbf]">
          <span className="w-1/3 text-center invitation-text-fill text-13"  >{t('invite.messageReferral')}(USDT)</span>
          <span className="w-1/3 text-center invitation-text-fill text-13 ">{t('public.adress')}</span>
          <span className="w-1/3 text-center invitation-text-fill text-13 ">{t('public.time')}</span>
        </header>

        <div className='max-h-[40vh] overflow-hidden overflow-y-auto text-13 text-[#bfbfbf]'>
          {list.length ? (
            list.map((item, index) => (
              <div className="h-10 flex items-center pb-2 border-b-[0.5px] border-[#D8D8D8]/20 text-[#bfbfbf]" key={index}>
                <span className="w-1/3 text-center invitation-text-fill">{+item.income > 0.0001 ? numberParse(+item.income || 0, 4) :item.income==='0'? '':0 }</span>
                <span className="w-1/3 text-center invitation-text-fill">
                  {truncateString(item.walletAddress || '')}
                </span>
                <span className="w-1/3 text-center invitation-text-fill">{dayjs(item.createTime).format('HH:mm:ss DD-MM')}</span>
              </div>
            ))
          ) : (
            <ListEmpty className='!pb-3' textStyle={{color: '#838383'}} />
          )}
        </div>
      </div>
    </div>
  )
}
