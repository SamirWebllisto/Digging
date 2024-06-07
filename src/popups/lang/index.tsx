import ListEmpty from '@/components/empty'
import request from '@/helpers/request'
import { setLang } from '@/helpers/set-lang'
import CheckIcon from '@/assets/pngs/check.png'
import { useAsyncEffect } from 'ahooks'
import { CheckList, NavBar, Loading } from 'antd-mobile'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { publicApi } from '@/stores'

type ILangProps = {
  setLangVisible: (visible: boolean) => void
}

export default function LangPopup({ setLangVisible }: ILangProps) {
  const { t } = useTranslation()
  const [langList, setLangList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState<any>(localStorage.getItem('i18nextLng') || 'en_US')


  useAsyncEffect(async () => {
    setLoading(true)
    try {
      const { result } = await request.get('/sidebar/lang/list')
      setLangList(result)
      const keys: string[] = result.map((item: any) => item.langKey)
      // console.log(getActiveLangKey(keys))
      // if (!keys.includes(localStorage.getItem('i18nextLng') as any)) {
      // setValue(getActiveLangKey(keys))
      // }
    } catch (error) {
      /* empty */
    }
    setLoading(false)
  }, [])

  return (
    <div className="h-screen flex flex-col wow-width">
      <NavBar onBack={() =>{ publicApi('语言界面的返回按钮');setLangVisible(false)}}><span className='text-base'>{t('common.language')}</span></NavBar>
      <div className="flex-1 overflow-hidden overflow-y-auto">
        {loading ? (
          <Loading />
        ) : langList.length ? (
          <CheckList
            style={{
              '--border-top': 'none',
              '--border-bottom': 'none',
              '--adm-color-border': '#626262',
              '--border-inner': 'none',
            } as any}
            activeIcon={<img src={CheckIcon} className='check-list w-[1.4375rem] h-[0.9375rem]'/>}
            value={[value]}
            onChange={async ([key]) => {
              // publicApi(`切换语言${key}`)
              await setLang(key)
              setValue(key)
            }}>
            {langList.map((item) => (
              <CheckList.Item className='m-0 my-1' key={item.langKey} value={item.langKey}>
                <span
                  className="bg-clip-text text-transparent text-15"
                  style={{ backgroundImage: 'linear-gradient(180deg,#b5b5b5,#383838)' }}>
                  {item.zhName}
                </span>
              </CheckList.Item>
            ))}
          </CheckList>
        ) : (
          <ListEmpty className='!pb-0' textStyle={{color: '#838383'}} />
        )}
      </div>
    </div>
  )
}
