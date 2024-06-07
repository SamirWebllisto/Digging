import { Badge } from 'antd-mobile'
import BG from './icons/item-bg.png'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'
import classNames from 'classnames'
import Lists from '@/components/lists'
import request from '@/helpers/request'
import { useNavigate } from 'react-router-dom'
import { publicApi } from '@/stores'

const icons = import.meta.glob('./msg-icons/*.png', { as: 'url', eager: true })

const iconMapping: Record<string, {icon: number, title: string}> = {
  0: {
    icon: 3,
    title: 'msg_016',
  },
  1: {
    icon: 2,
    title: 'webmsg_014',
  },
  2: {
    icon: 0,
    title: 'notice.redEnvelope',
  },
  3: {
    icon: 4,
    title: 'msg_014',
  },
  4: {
    icon: 4,
    title: 'msg_014',
  },
  5: {
    icon: 12,
    title: 'msg_016',
  },
  6: {
    icon: 3,
    title: 'msg_016',
  },
  7: {
    icon: 5,
    title: 'msg_015',
  },
  8: {
    icon: 9,
    title: 'webmsg_030',
  },
  9: {
    icon: 10,
    title: 'msg_013',
  },
}

export default function MsgList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // const [visible, setVisible] = useState(false)
  // const [detail, setDetail] = useState<any>(null)

  return (
    <>
      <div className="mx-4 mt-4">
        <Lists
          request={async (params) => {
            const { result } = await request.get('/message/queryByPage', {
              params,
            })

            return result
          }}>
          {(records) =>
            records?.map((item: any) => {
              let json = {} as Record<string, string>
              try {
                json = JSON.parse(item.content) || {}
              } catch (error) { /* empty */ }

              const info = iconMapping[item.type] || {}
              let title = t(info?.title)

              if (item.type === 8) {
                title = (json.name || '') + ' ' + title
                title = title.replace('$1', '1')

              }
              return (
                <div key={item.id} className={classNames('w-full', styles.msgitem)}>
                  <Badge content={item.readFlag ? null : Badge.dot} style={{ '--right': '1rem', '--top': '0.5rem' }}>
                    <div
                      onClick={() => {
                        publicApi(`点击消息${item.id}跳转消息详情`)
                        navigate('/msg-detail?id=' + item.id)
                        // setDetail(item)
                        // setVisible(true)
                      }}
                      className="h-20 bg-no-repeat pl-2 mt-1"
                      style={{ backgroundImage: `url(${BG})`, backgroundSize: '100% 100%' }}>
                      <div className="h-[2.875rem] flex items-center pt-6">
                        <img className="w-10 mx-2" src={icons[`./msg-icons/${info?.icon}.png`]} />
                        <span className="text-17 font-medium text-white line-clamp-2 max-w-[13rem]">
                          {title}
                        </span>
                      </div>
                    </div>
                  </Badge>
                </div>
              )
            })
          }
        </Lists>
      </div>
    </>
  )
}
