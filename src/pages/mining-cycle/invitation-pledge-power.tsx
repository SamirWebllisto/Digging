
import NavHeaderLayout from '@/layouts/header'
import Lists from '@/components/lists'
import request from '@/helpers/request'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'

export type RecordItem = {
  id: string
  dateGroup: string
  countIncome: string
}


export default function InvitationPledgePower() {
  const { t } = useTranslation()

  return (
    <NavHeaderLayout className='pt-4' contentClassName='px-4' pageName='质押邀请算力收益'  headerChildren={<span className="text-white font-normal text-base">{t('invitation.pledge.power')}</span>}>
      <div className="h-full invitation-record">
        <div className="content">
          <div className="flex flex-col text-center pt-4">
            <div className="h-12 px-2">
              <div className="text-wow-50 flex text-sm" style={{ backgroundColor: 'rgba(0,0,0,.3)', padding: '12px 10px' }}>
                <div className='w-1/2'>{t('public.time')}</div>
                <div className='w-1/2'>{t('up.amount')}</div>
              </div>
            </div>

            <div className="text-wow-100 text-xs px-5">
              <Lists
                request={async (params) => {
                  const { result } = await request.get('/user/getInfiniteInviteList', {
                    params,
                  })

                  return result
                }}>
                {(records) =>
                  records?.map((item: RecordItem) => {
                    return (
                      <div key={item.id} className="h-12 flex items-center border-b border-wow-30/20">
                        <div className='w-1/2'>{dayjs(item.dateGroup).format('DD/MM/YYYY')}</div>
                        <div className='w-1/2'>{item.countIncome}</div>
                      </div>
                    )
                  })
                }
              </Lists>
            </div>
          </div>
        </div>
      </div>
    </NavHeaderLayout>
  )
}
