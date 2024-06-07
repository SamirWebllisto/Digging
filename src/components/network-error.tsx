import { createErrorBlock } from 'antd-mobile'
import { FileWrongOutline } from 'antd-mobile-icons'
import { useTranslation } from 'react-i18next'

const ErrorBlock = createErrorBlock({
  default: <FileWrongOutline className="text-gray-400 text-6xl mx-auto" />,
})

export default function NetworkError({ refresh }: { refresh?: () => void }) {
  const { t } = useTranslation()
  return (
    <div onClick={refresh} className="flex justify-center">
      <ErrorBlock status="default" title={t('res.msg.login.disabled')} description={t('wallet.connectingTimeout')} />
    </div>
  )
}
