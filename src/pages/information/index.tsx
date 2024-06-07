import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import NavHeaderLayout from '@/layouts/header'
import { Badge } from 'antd-mobile'

import MsgList from './msg-list'
import NewsList from './news-list'
import Chat from './chat'
import Logo from '@/assets/pngs/logo.png'
import styles from './index.module.less'
import { $user, publicApi, syncMessageCount } from '@/stores'
import ReadAll from "@/assets/pngs/readAll.png";

type TabType = 'message' | 'journalism' | 'customerService'
export default function Information() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [type, setType] = useState<TabType>(searchParams.get('type') as TabType || 'message')
  const { t } = useTranslation()

  const isActive = (tab: TabType) => tab === type

  useEffect(() => {
    syncMessageCount()
    navigate('/information?type=' + type, {
      replace: true,
    })
  }, [type])

  const readAll = () => {
    return
  }

  return (
    <NavHeaderLayout
      pageName='消息界面'
      headerChildren={
        <div className="flex items-center justify-center" >
          <img src={Logo} className="w-5 h-5 mr-2" />
          <span className="font-wowRegular text-base text-[#b1b1b1] h-5">WOW EARN</span>
        </div>
      }
      right={
          type !== 'customerService' && (<span onClick={() => {publicApi('一键已读'); readAll()}} className='flex justify-end'>
          <img src={ReadAll} className='w-5 h-5'/>
        </span>)
      }
    >
      <div className={styles.tab} >
        <div
          onClick={() => { publicApi('消息界面切换消息'); setType('message') }}
          className={classNames('w-[7.4375rem] h-[3.375rem]', styles.message, { [styles.active]: isActive('message') })}>
          <Badge content={$user.get().noticeHasMessage ? Badge.dot : null}>{t('notice.message')}</Badge>
        </div>
        <div
          onClick={() => { publicApi('消息界面切换新闻'); setType('journalism') }}
          className={classNames('w-[7.4375rem] h-[2.6875rem]', styles.journalism, { [styles.active]: isActive('journalism') })}>
          <Badge content={$user.get().newsHasMessage ? Badge.dot : null}>{t('notice.news')}</Badge>
        </div>
        <div
          onClick={() => { publicApi('消息界面切换客服'); setType('customerService') }}
          className={classNames('w-[7.4375rem] h-[3.375rem]', styles.customerService, {
            [styles.active]: isActive('customerService'),
          })}>
          {t('notice.chat')}
        </div>
      </div>

      {type === 'message' && <MsgList />}
      {type === 'journalism' && <NewsList />}
      {type === 'customerService' && <Chat />}
    </NavHeaderLayout>
  )
}
