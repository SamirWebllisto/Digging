import NavHeaderLayout from '@/layouts/header'
import dayjs from 'dayjs'
import InformationDetails from './details'
import { useRequest } from 'ahooks'
import request from '@/helpers/request'
import { DotLoading } from 'antd-mobile'
import { useSearchParams } from 'react-router-dom'

export default function MsgDetail() {
  const [searchParams] = useSearchParams()

  const { data, loading } = useRequest(async () => {
    const { result } = await request.get('/message/getById', {
      params: {
        id: searchParams.get('id'),
      },
    })

    return result
  })

  return (
    <NavHeaderLayout
    pageName='消息详情'
      headerChildren=""
      className="wow-width"
      right={dayjs(data?.createTime).format('HH:mm:ss DD/MM/YYYY')}
      headerTransparent>
      {loading ? <DotLoading /> : renderContent(data)}
    </NavHeaderLayout>
  )
}

function renderContent(data: any) {
  switch (data.type) {
    case 0:
      return <InformationDetails detail={data} type="RegisterGift" />
    case 1:
      return <InformationDetails detail={data} type="Mining" />
    case 2:
      return <InformationDetails detail={data} type="RedReceive" />
    case 3:
      return <InformationDetails detail={data} type="BeIncome" />
    case 4:
      return <InformationDetails detail={data} type="BeIncome" />
    case 5:
      return <InformationDetails detail={data} type="UserRegistration" />
    case 6:
      return <InformationDetails detail={data} type="RegisterGift" />
    case 7:
      return <InformationDetails detail={data} type="ExperienceGold" />
    case 8:
      return <InformationDetails detail={data} type="ExpirationReminder" />
    case 9:
      return <InformationDetails detail={data} type="InviteReward" />

    default:
      return null
  }
}
