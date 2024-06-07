import Routers from '@/routers'
import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import '@/locales'
import { useEffect, useState } from 'react'
import { setLang } from '@/helpers/set-lang'
import i18n from '@/locales'
import { Modal } from 'antd-mobile'
import { CloseCircleOutline } from 'antd-mobile-icons'
import classNames from 'classnames'
import { useStore } from '@nanostores/react'
import { useInterval, useRequest, useAsyncEffect } from 'ahooks'
import { $user, syncMessageCount, publicApi, $wallet, loopMineStatus, startConnect, startLogin, syncUser } from './stores'
import request from './helpers/request'

dayjs.extend(Duration)

// const createRecaptcha = () => {
//   const s = document.createElement('script')
//   s.src = 'https://www.google.com/recaptcha/api.js?render=6LeJm1IpAAAAAK5uuSUFV0yGEavZiuEbz0zB3ORg'
//   document.body.appendChild(s)
// }

// createRecaptcha()

function App() {
  const user = useStore($user)
  // const [value] = useCookieState('token')

  useAsyncEffect(async () => {
    try {
      const {result} = await request({
        url: '/user/checkToken',
        hideLoading: true
      } as any)
      const localAddress = localStorage.getItem('address')
      if (result.checked) {
        console.log('diff address', localAddress, result.walletAddress)
        if (localAddress && localAddress.toLocaleUpperCase() !== result.walletAddress.toLocaleUpperCase()) {
          localStorage.removeItem('token')
          return
        }
        (window as any).validToken = 1;
        const instance = (window as any).Ulla
        if (instance) {
          instance.postMessage(JSON.stringify({
            api: 'setValidToken',
            content: '1',
          }))
        }
        const data = await startConnect()
        if (data.address.toLocaleUpperCase() !== result.walletAddress.toLocaleUpperCase()) {
          localStorage.removeItem('token')
        } else {
          syncUser()
        }
        // await startLogin(data, '0')
      }
    } catch (error) { /* empty */ }
  }, [])

  // useEffect(() => {
  //   if (value) {
  //     localStorage.setItem('token', value || '')
  //   }
  // }, [value])

  useInterval(() => {
    syncMessageCount()
  }, 1000 * 60 * 2)

  useInterval(() => {
    loopMineStatus()
  }, 1000 * 1)

  const miningVisible = () => {
    const user = $user.get()
    const wallet = $wallet.get()
    if (user.data?.guideFlag === 0) return false
    return !!(user.status === 'login' && user.data?.status === 0 && user.isFirstLogin === 0 && wallet.detail)
  }

  useEffect(() => {
    if (user?.data?.sampleFlag === 0 && user.data?.guideFlag === 1 && !user.showed && !miningVisible()) {
      Modal.show({
        bodyClassName: 'bg-transparent',
        maskClassName: '!bg-black/70',
        content: (
          <div className="flex flex-col justify-center items-center">
            <ImgNode />
            <CloseCircleOutline fontSize="24px" className="mt-3" onClick={() => {
              $user.setKey('showed', true)
              Modal.clear()
            }} />
          </div>
        ),
        actions: [],
      })

      return () => {
        Modal.clear()
      }
    }
  }, [user])

  const { loading, error, refresh } = useRequest(async () => {
    let langKey = localStorage.getItem('langKey')
    try {
      const { result } = await request.get('/sidebar/lang/list')
      const keys: string[] = result.map((item: any) => item.langKey)
      if (!keys.includes(localStorage.getItem('i18nextLng') as any)) {
        langKey = 'en_US'
      }
      const userLangs = navigator.languages.map(item => item.toLocaleUpperCase().replace('-', '_'))

      let active = ''
      for (const lang of userLangs) {
        if (active) {
          break
        }
        for (const langKey of keys) {
          const LangKey = langKey.toLocaleUpperCase()
          if (LangKey === lang) {
            active = langKey
            break
          }

          if (!active && LangKey.split('_')[0] === lang.split('_')[0]) {
            active = langKey
            break
          }
        }
      }

      if (active) {
        langKey = active
      }
    } catch (error) {
      /* empty */
    }
    setLang(langKey)
  })

  if (loading) {
    return null
  }

  if (error) {
    return <div onClick={refresh} className="text-text-text text-center pt-8">
      <p>language acquisition failed please click retry</p>
      <button className='text-white bg-slate-700 px-3 py-2 rounded mt-2' onClick={refresh}>refresh</button>
    </div>
  }

  return (
    <div className="overflow-hidden h-dscreen overflow-y-auto">
      <div className={classNames('bg-cover bg-fixed wow-width')}>
        <Routers />
      </div>
    </div>
  )
}

export default App

function ImgNode() {
  const [name, setName] = useState(i18n.language)

  return (
    <img
      src={`https://ullafile.oss-accelerate.aliyuncs.com/testPicture/${name}.png`}
      className="w-[16.25rem]"
      onError={() => setName('en_US')}
      onClick={() => {
        publicApi('立即领取体验金跳转至质押界面')
        Modal.clear()
        setTimeout(() => {
          Modal.clear()
        }, 16.7)
        $user.setKey('showed', true)
        location.hash = '#/fast?source=sample'
      }}
    />
  )
}
