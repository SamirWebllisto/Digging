import request from '@/helpers/request'
import { Modal } from 'antd-mobile'
import axios from 'axios'
import dayjs from 'dayjs'
import { map } from 'nanostores'
import i18n from '@/locales'
import { syncUser } from '.'

export type IUser = {
  status: 'init' | 'login' | 'logout'
  data: null | Record<string, unknown>| any
  mining: boolean
  messageCount: number
  newsHasMessage: boolean
  noticeHasMessage: boolean
  showed: boolean
  money: null | {
    symbol: string
    unit: string
    exchangeRate?: number
  }
  isFirstLogin: 0 | 1
}

/**
 * 用户基本信息
 */
export const $user = map<IUser>({
  status: 'init',
  messageCount: 0,
  newsHasMessage: false,
  noticeHasMessage: false,
  data: null,
  mining: false,
  showed: false,
  money: null,
  isFirstLogin: 0,
})

$user.subscribe(async (state, key) => {
  if (key === 'money' && !state.money?.exchangeRate && state.money) {
    localStorage.setItem('money', JSON.stringify(state.money))
    if (state.money.symbol === 'USD') {
      $user.setKey('money', {
        ...state.money,
        exchangeRate: 1,
      })
      return
    }
    if (state.money.symbol) {
      const { data } = await axios.get('https://asset.ullapay.com/api/block/getSymbolsRate?symbol=' + state.money.symbol)
      $user.setKey('money', {
        ...state.money,
        exchangeRate: data.data.rate,
      })
    }
  }
})

let moneyJson = {
  symbol: 'USD',
  unit: '$',
}
try {
  const v = localStorage.getItem('money')
  if (v) {
    moneyJson = JSON.parse(v)
  }
} catch (error) {
  /* empty */
}

$user.setKey('money', moneyJson)

export async function syncMessageCount() {
  if ($user.get().status === 'login') {
    try {
      const { result } = await request.get('/newRead/allRead')
      $user.setKey('newsHasMessage', result.newAllIsRead)
      $user.setKey('noticeHasMessage', result.messageAllIsRead)
      $user.setKey('messageCount', result.messageAllIsRead || result.newAllIsRead ? 1 : 0)
    } catch (error) {
      /* empty */
    }
  }
}

let isopen = false

export async function loopMineStatus() {
  const user = $user.get()
  const isHome = location.hash === '' || location.hash === '/' || location.hash === '#/'
  if (user.status === 'login' && dayjs().valueOf() > user.data?.endTime && user.data?.endTime > 0) {
    if (!isopen && !isHome) {
      isopen = true
      try {
        // await Modal.confirm({
        //   content: i18n.t('mine.confirm.to.home'),
        //   confirmText: i18n.t('public.confirm'),
        //   cancelText: i18n.t('buyWow.cancel'),
        //   onConfirm() {
            // window.location.hash = ''
        //   },
        // })
      } catch (error) { /* empty */ }
    }

    syncUser({hideLoading: true})
    isopen = false
  }
}
