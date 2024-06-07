import ListEmpty from '@/components/empty'
import request from '@/helpers/request'
import { $money } from '@/stores/money'
import { useAsyncEffect } from 'ahooks'
import { CheckList, NavBar, Loading } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import CheckIcon from '@/assets/pngs/check.png'
import { $user, publicApi } from '@/stores'

export default function LangPopup() {
  const { t } = useTranslation()
  const [langList, setLangList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<any>(langList.find((item) => $user.get().money?.symbol === item.symbol))
  useAsyncEffect(async () => {
    setLoading(true)
    try {
      const { result } = await request.get('/sidebar/currency/list')
      setLangList(result)
    } catch (error) {
      /* empty */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const data = langList.find((item) => item.id === value)
    if (!data) return
    $user.setKey('money', {
      symbol: data.symbol,
      unit: data.unit,
    })
  }, [value])

  return (
    <div className="h-screen flex flex-col wow-width">
      <NavBar onBack={() => {publicApi('货币界面的返回按钮');$money.setKey('open', false)}}>
        <span className="text-base">{t('common.currency')}</span>
      </NavBar>
      <div className="flex-1 overflow-hidden overflow-y-auto">
        {loading ? (
          <Loading />
        ) : langList.length ? (
          <CheckList
            value={[value]}
            style={
              {
                '--border-top': 'none',
                '--border-bottom': 'none',
                '--adm-color-border': '#626262',
                '--border-inner': 'none',
              } as any
            }
            activeIcon={<img src={CheckIcon} className="w-[1.4375rem] h-[0.9375rem]" />}
            onChange={async ([key]) => {
              publicApi(`货币切换${key}`)
              setValue(key)
            }}>
            {langList.map((item) => (
              <CheckList.Item className="m-0 my-1" key={item.id} value={item.id}>
                <div className='flex items-center'>
                  <img className="w-[1.6875rem] h-[1.125rem] mr-[10px]" src={item.domainUrl} />
                  <span
                    className="bg-clip-text text-transparent text-[0.9375rem]"
                    style={{ backgroundImage: 'linear-gradient(180deg,#b5b5b5,#383838)' }}>
                    {item.symbol}
                  </span>
                </div>
              </CheckList.Item>
            ))}
          </CheckList>
        ) : (
          <ListEmpty />
        )}
      </div>
    </div>
  )
}
