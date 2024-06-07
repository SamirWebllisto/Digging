import NavHeaderLayout from '@/layouts/header'
import { useParams } from 'react-router-dom'
import Logo from '@/assets/pngs/logo.png'
import { Skeleton } from 'antd-mobile'
import { useRequest } from 'ahooks'
import request from '@/helpers/request'
import dayjs from 'dayjs'

export default function NewDetail() {
  const params = useParams()
  const { data, loading} = useRequest(async () => {
    const { result } = await request.get('/newRead/getByKey', {
      params: {
        configKey: encodeURI(params.key as string)
      }
    })

    return result
  })

  return (
    <NavHeaderLayout
    pageName='新闻详情'
      defaultBackPath='/information?type=message'
      headerChildren={
        <div className="flex items-center justify-center">
          <img src={Logo} className="w-5 h-5 mr-2" />
          <span className="font-wowRegular text-base text-[#b1b1b1] h-5">WOW EARN</span>
        </div>
      }>
      {loading ? <MsgLoading /> : (
        <div className="text-right mt-4 mx-auto w-[22rem]">
          <header className='flex items-end'>
            <h3 className="text-base font-semibold text-white text-left m-0 flex-1">{data?.title}</h3>
            <time className='text-[#a5a5a5] text-xs block leading-5 ml-2'>{dayjs(data?.createTime).format('DD/MM/YYYY')}</time>
          </header>
          <div className='line-bottom my-2'></div>
          <div className='text-left' dangerouslySetInnerHTML={{__html: data?.content}}>
          </div>
        </div>
      )}
    </NavHeaderLayout>
  )
}

function MsgLoading() {
  return (
    <div className="text-right mt-4 mx-auto w-[22rem]">
      <Skeleton.Title animated />
      <Skeleton.Paragraph lineCount={5} animated />
    </div>
  )
}
