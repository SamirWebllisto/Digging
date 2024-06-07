import NavHeaderLayout from '@/layouts/header'
import { Tabs } from 'antd-mobile'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './index.module.less'
import Buy from './buy'
import Receive from './receive'
import Send from './send'
import { publicApi } from '@/stores'

type ITabs = 'buy' | 'receive' | 'send'
export default function RechargeRecord() {
  const { t } = useTranslation()
  const [type, setType] = useState<ITabs>('buy')

  return (
    <NavHeaderLayout headerChildren="" contentClassName="flex flex-col">
      {() => (
        <>
          <Tabs activeKey={type} onChange={(type) =>{publicApi(`质押列表界面切换${type==='send'?`发送`:type==='buy'?'购买':'接收'}按钮`); setType(type as ITabs);}} style={{ '--active-line-color': 'white', '--adm-color-border': 'none', '--active-line-height': '0' } as any}>
            <Tabs.Tab className={styles.tab} title={t('recordPage.history')} key="buy" />
            <Tabs.Tab className={styles.tab} title={t('recordPage.deposit')} key="receive" />
            <Tabs.Tab className={styles.tab} title={t('recordPage.withdraw')} key="send" />
          </Tabs>

          <div className="flex-1">
            <RenderContent type={type} />
          </div>
        </>
      )}
    </NavHeaderLayout>
  )
}

const RenderContent = ({ type }: { type: ITabs }) => {
  switch (type) {
    case 'buy':
      return <Buy />

    case 'receive':
      return <Receive/>

    case 'send':
      return <Send/>

    default:
      return null
  }
}
