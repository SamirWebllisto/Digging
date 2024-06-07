import dayjs from 'dayjs'
import { Badge } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import request from '@/helpers/request'
import Lists from '@/components/lists'
import { publicApi } from '@/stores'

export default function NewsList() {
  const navigate = useNavigate()
  return (
    <div className="w-[21rem] mx-auto">
      <Lists
        request={async (params) => {
          const { result } = await request.get('/newRead/queryByPage', {
            params,
          })

          return result
        }}>
        {(records) =>
          records?.map((item: any, index: number) => (
            <div
              className={index==0?"text-right mt-3 ":"text-right mt-8"}
              key={index}
              onClick={() => {
                publicApi(`点击新闻${item.newConfigKey || item.configKey}跳转新闻详情`)
                navigate('/news-detail/' + (item.newConfigKey || item.configKey))}}>
              <Badge content={item.isRead ? null : Badge.dot}>
                <img src={item.logUrl} className="w-[21.5625rem]  h-[12rem]"/>
              </Badge>
              <h3 className="text-base font-semibold text-white text-left mt-[0.5rem] mb-[0.5rem]">{item.title}</h3>
              <time className="text-[#a5a5a5] text-xs">{dayjs(item.createTime).format('DD-MM-YYYY')}</time>
              <div className="line-bottom"></div>
            </div>
          ))
        }
      </Lists>
    </div>
  )
}
