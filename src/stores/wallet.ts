import { map } from 'nanostores'
// @ts-ignore
// import * as WC from '@/walletconnect/main.fcbae31e.js'
import { web3Login } from '@/walletconnect/web3-login';
import { useEffect } from 'react'
import { useCookieState, useAsyncEffect } from 'ahooks'
import { $user, syncMessageCount } from '@/stores/user'
import request, { loadingRequest } from '@/helpers/request'
import i18n from '@/locales'
import { Toast } from 'antd-mobile'
import { useTranslation } from 'react-i18next'
import { delay } from '@/helpers/utils'

export type IWallet = {
  connectType: 'walletConnect' | 'metaMask' | null
  detail: IWalletData | null
  netId: INetId
}

const calls: Map<number, (data: any, err?: any) => void> = new Map()

const connectQueue: Set<{
  type: string
  callback: (data: any, err?: any) => void
}> = new Set()

export const DEFAULT_MAIN_CHAINS_BROWSER = {
  'eip155:1': 'ETH',
  'eip155:56': 'BSC',
}

export const DEFAULT_CHAINS_FULLNAME = {
  'eip155:1': 'Ethereum',
  'eip155:5': 'Ethereum',
  'eip155:10': 'Optimism',
  'tron:0x2b6653dc': 'TRONIX',
}

export const DEFAULT_MAIN_CHAINS = {
  ...DEFAULT_MAIN_CHAINS_BROWSER,
  'tron:0x2b6653dc': 'TRX',
}

export const DEFAULT_MAIN_CHAINS_SYMBOL_USDT = {
  'ETH': 'USDT',
  'BSC': 'USDTBEP20',
  'TRX': 'TRCUSDT',
}

export const DEFAULT_MAIN_CHAINS_SYMBOL_USDC = {
  'ETH': 'USDC',
  'BSC': 'USDCBEP20',
  'TRX': 'USDCTRC20',
}

export type INetId = keyof typeof DEFAULT_MAIN_CHAINS

export type IWalletData = {
  address: string
  amount: string
  tokenBalance: string
  walletName: string
  connectType: 'walletConnect' | 'metaMask'
}

const initWallet = {
  detail: null,
  netId: (window as any).tronWeb && !(window as any).ethereum ? 'tron:0x2b6653dc' : 'eip155:1',
  connectType: 'walletConnect',
} as IWallet

/**
 * 钱包信息
 */
export const $wallet = map<IWallet>({ ...initWallet })

export async function syncUser(config?: {hideLoading: boolean}) {
  const logres = await request.get('/user/detail', {
    hideLoading: config?.hideLoading || false
  } as any)
  $user.setKey('status', 'login')
  $user.setKey('data', logres.result)

  return logres.result
}

let isInit = false

export async function startWalletConnect(autoConnect = '1') {
  // @ts-ignore
  console.log('isWow', window.isWow as boolean)
  if (isInit) return
  loadingRequest.show()
  try {
    web3Login('walletconnect')
    // await delay(500)
    if (!(window as any).ethereum && !(window as any).tronWeb) {
      console.log('no ethereum')
      connectQueue.add({
        type: 'disconnect',
        callback: () => {
          logout()
        }
      })

      connectQueue.add({
        type: 'wallet',
        callback: async (data) => {
          console.log('wallet', data)
          const d = data.date || data.data
          $wallet.setKey('detail', d)
          if (d?.netId) {
            $wallet.setKey('netId', d.netId)
          }

          if ($user.get().status !== 'login') {
            try {
              await syncUser()
              syncMessageCount()
              connectQueue.add({
                type: 'disconnect',
                callback: () => {
                  logout()
                }
              })
            } catch (error) {
              $user.setKey('status', 'logout')
              $user.setKey('data', null)
            }
          }
          console.log('connectQueue', data)
        },
      })
      loadingRequest.hide()
      return
    }
    if (autoConnect === '1') {
      const c = startConnect()
      console.log('c promise', c)
      const data = await c
    //   console.log('startConnect', data)
      startLogin(data, autoConnect)
      isInit = true
    }

  } catch (error) {
    isInit = false
    console.log('login error', error)
  }
  loadingRequest.hide()
  // console.log('startWalletConnect')
  // link()

}

/**
 * 修改主链
 */
export function changeChain(netId: INetId) {
  $wallet.setKey('netId', netId)
  return sendMessage({
    message: 'selectChain',
    data: netId,
  })
}

/**
 * 修改主链，有重新登录的逻辑
 */
export async function reChangeChain(netId: INetId) {
  $wallet.setKey('netId', netId)
  relink()
}

export const startLogin = async (json: IWalletData, autoConnect = '1') => {
  const searchParams = new URLSearchParams(window.location.search)
  let info = (window as any).appinfo || {}
  if (typeof info === 'string') {
    try {
      info = JSON.parse(info)
    } catch (error) {
      info = {}
    }
  }
  try {
    const netId = $wallet.get().netId
    const res = await request.post('/user/loginThird', {
      address: json.address,
      net: DEFAULT_MAIN_CHAINS[netId],
      netId,
      ...info,
      walletUid: info?.uid || '',
      walletName: (window as any).isWow == 1 ? 'UllaWallet' : undefined,
      invitationCode: searchParams.get('invitationCode') || sessionStorage.getItem('invitationCode') || '',
    })
    $user.setKey('isFirstLogin', +res.result.isFirstLogin as 0 | 1)
    localStorage.setItem('token', res.result.token)
    localStorage.setItem('address', json.address)
    // document.cookie = 'token='+res.result.token+';'
    $user.setKey('showed', false)
    if (autoConnect === '0') {
      const personalSign = (await startPersonalSign(res.result.openId)) as any
      console.log('personalSign', personalSign)
      if (personalSign === false) {
        throw 'personalSign error'
      }
      if (typeof personalSign === 'object') {
        const { signature } = personalSign
        await startPostSign(signature, res.result.openId)
      }
    }

    const user = await syncUser()
    syncMessageCount()
    return user
  } catch (error) {
    $user.setKey('status', 'logout')
    $user.setKey('data', null)
    console.log(error)
    if ((error as any)?.code === 20035) {
      setTimeout(() => Toast.show(i18n.t('login.error')))
    }
    return false
  }
}

export function useWalletConnect() {
  const { t } = useTranslation()

  const [value, setValue] = useCookieState('autoConnect', {
    defaultValue: '0',
    path: '/',
    expires: (() => new Date(+new Date() + 1000 * 60 * 60))(),
  })

  const onMessage = (evt: MessageEvent) => {
    let data: IWalletData | null = null
    console.log(data)
    try {
      const d = JSON.parse(evt.data)
      console.log('parsedata', d)

      for (const item of connectQueue.values()) {
        if (item.type === d.message) {
          item.callback(d)
          connectQueue.delete(item)
        }
      }

      data = d.date
      if (data) {
        data!.walletName = d.walletConnectName
      }

      if (d.callId) {
        const call = calls.get(d.callId)
        if (call) {
          call(d.data)
          calls.delete(d.callId)
        }
      }

      if (d.message === 'wallet') {
        const _d = d.data || d.date
        console.log('connectQueue', _d)
        $wallet.setKey('detail', _d)
        setValue('1')
        if (_d?.netId) {
          $wallet.setKey('netId', _d.netId)
        }
      }

      if (d.message === 'rejectError' || d.message === 'connectError' || d.message === 'transferError') {
        // Toast.show(t('comm.operate.fail.save'))
        Toast.show(typeof d.data === 'string' ?  (d.data || t('comm.operate.fail.save')) : t('comm.operate.fail.save'))
        for (const fn of calls.values()) {
          fn?.(d, true)
        }
      }

      //walletconnect的转账回调
      if (d.message === 'walletconnectTranfer' || d.message === 'ethereumTransfer') {
        if (d.result) {
          console.log(d)
          //转账成功
        } else {
          Toast.show(t('depositPage.depositFailed'))
        }
      }
    } catch (error) {
      /* empty */
    }
  }

  useEffect(() => {
    // if ($user.get().status === 'init') {
    //   syncUser({
    //     hideLoading: true
    //   })
    //   .then(() => {
    //     console.log('startWalletConnect=1')
    //     startWalletConnect('1')
    //   })
    //   .catch(() => {
    //     console.log('startWalletConnect=0')
    //     startWalletConnect('0')
    //   })
    // }

    startWalletConnect('0')

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])
}

export async function relink() {
  sendMessage({
    message: 'disconnect',
  })

  changeChain($wallet.get().netId)
  setTimeout(async () => {
    await sendMessage({
      message: 'checkBrowserWallet',
    })
  }, 300)
}

export function link() {
  loadingRequest.show()
  unlink()

  setTimeout(() => {
    changeChain($wallet.get().netId)

    setTimeout(() => {
      sendMessage({
        message: 'checkBrowserWallet',
      })
      loadingRequest.hide()
    }, 300)
  }, 300)
}

export async function openWalletConnect() {
  const data = await startConnect($wallet.get().netId)

  startLogin(data, '0')
  // setTimeout(() => {
  //   sendMessage({
  //     message: 'ullaOpen',
  //     data: $wallet.get().netId,
  //   })
  // }, 300)
}

export const cleanWallet = () => {
  const type = $wallet.get().connectType
  $wallet.set({ ...initWallet, connectType: type })
}

export const logout = async () => {
  const data = $wallet.get().detail as IWalletData
  if (data) {
    await request.post('/user/logout')
    cleanWallet()
    $user.setKey('status', 'logout')
    $user.setKey('data', null)
    if (window.location.hash !== '/') {
      window.location.hash = '/'
      // navigate('/')
    }
    localStorage.clear()
    sessionStorage.clear()
    Toast.show(i18n.t('common.disconnectReloginTip'))
  }
}

export async function unlink() {
  sendMessage({
    message: 'disconnect',
  })
  logout()
}

export function transfer(data: { toAddress: string; amount: number; tokenAddr?: string }) {
  return new Promise((resolve) => {
    const type = $wallet.get().connectType === 'metaMask' ? $wallet.get().netId === 'tron:0x2b6653dc' ? 'tronlinkTransfer' : 'ethereumTransfer' : 'walletconnectTranfer'
    connectQueue.add({
      type,
      callback: (data) => {
        console.log(data)
        resolve(data)
      },
    })
    return sendMessage({
      message: type,
      params: { toAddress: data.toAddress, amount: data.amount, tokenAddr: data.tokenAddr, contractAddress: data.tokenAddr },
      //   params: {"toAddress": data.toAddress,"amount": 0.000001,"tokenAddr": ''},
    })
  })
}

export function getBalance(net: string, contractAddress: string, address: string) {
  return sendMessage({
    message: 'getBalance',
    data: {
      net,
      contractAddress,
      address,
    },
  })
}

function sendMessage(msg: Record<string, unknown>) {
  return new Promise((resolve, reject) => {
    const callId = Date.now()
    calls.set(callId, (res, err?: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
    console.log({
      ...msg,
      callId,
    })
    window.postMessage(
      {
        ...msg,
        callId,
      },
      '*'
    )
  })
}

export async function sendBag(vals: any) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    loadingRequest.show()
    try {
      const net = $wallet.get().netId

      changeChain('eip155:1916' as any)
      await delay(300)
      await startConnect()

      let data: any
      try {
        data = await startTransfer({
          amount: +vals.amount,
          toAddress: vals.address,
        })
      } catch (error) {
        console.log('startTransfer', error)
        reject(error)
      }
      resolve(data?.result)
      changeChain(net)
      await startConnect()
    } catch (error) { /* empty */ }
    loadingRequest.hide()
  })
}

/**
 * 点击右上角登录
 */

export function startConnect(net?: INetId): Promise<IWalletData> {
  connectQueue.clear()
  const useNetId = net || $wallet.get().netId
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    sendMessage({
      message: 'selectChain',
      data: useNetId,
    })
    connectQueue.add({
      type: 'connectError',
      callback: async (data) => {
        reject(data)
      },
    })
    connectQueue.add({
      type: 'ullaClose',
      callback: async (data) => {
        reject(data)
      },
    })
    connectQueue.add({
      type: 'wallet',
      callback: async (data) => {
        // sendMessage({
        //   message: 'ullaClose',
        // })
        console.log('connectQueue', data)
        const d = data.date || data.data
        $wallet.setKey('detail', d)
        if (d?.netId) {
          $wallet.setKey('netId', d.netId)
        }
        if (data && Object.keys(DEFAULT_MAIN_CHAINS).includes(useNetId)) {
          console.log(data)
          // runLogin(data)
        }
        resolve(d)
      },
    })
    connectQueue.add({
      type: 'checkBrowserWallet',
      callback: ({ data }) => {
        console.log('checkBrowserWallet', data)
        if (data) {
          console.log('checkBrowserWallet', 'success')
          $wallet.setKey('connectType', 'metaMask')
          if (data.ethereum && useNetId !== 'tron:0x2b6653dc') {
            sendMessage({
              message: 'ethereumConnect',
              data: useNetId,
            })
          } else if (data.tronWeb && useNetId === 'tron:0x2b6653dc') {
            sendMessage({
              message: 'tronlinkConnect',
              data: useNetId,
            })
          } else {
            $wallet.setKey('connectType', 'walletConnect')
            sendMessage({
              message: 'ullaOpen',
              data: useNetId,
            })
            // resolve()
          }
        }
      },
    })
    await delay(300)
    await sendMessage({
      message: 'checkBrowserWallet',
    })
  })
}

/**
 * 开始转账
 */
export function startTransfer(data: { toAddress: string; amount: number; tokenAddr?: string, }) {
  const fromAddress = $wallet.get().detail?.address
  console.log('startTransfer', { toAddress: data.toAddress, amount: data.amount, tokenAddr: data.tokenAddr, fromAddress })
  return new Promise((resolve, reject) => {
    const type = $wallet.get().connectType === 'metaMask' ? $wallet.get().netId === 'tron:0x2b6653dc' ? 'tronlinkTransfer' : 'ethereumTransfer' : 'walletconnectTranfer'
    connectQueue.add({
      type,
      callback: (data: string) => {
        console.log(data)
        resolve(data)
      },
    })
    connectQueue.add({
      type: 'rejectError',
      callback: (data) => {
        reject(data)
      },
    })
    connectQueue.add({
      type: 'transferError',
      callback: (data) => {
        reject({...data, message: 'rejectError'})
      },
    })
    return sendMessage({
      message: type,
      params: { toAddress: data.toAddress, amount: data.amount, tokenAddr: data.tokenAddr, fromAddress },
    })
  })
}

export function startDisconnect() {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    // connectQueue.add({
    //   type: 'disconnect',
    //   callback: (data) => {
    //     cleanWallet()
    //     resolve(data)
    //   },
    // })
    sendMessage({
      message: 'disconnect',
    })
    await logout()
    resolve(true)
  })
}

export function startChangeChain(net: INetId) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    sendMessage({
      message: 'selectChain',
      data: net,
    })
    connectQueue.add({
      type: 'connectError',
      callback: async (data) => {
        reject(data)
      },
    })
    await delay(300)
    await startConnect()
    resolve(true)
  })
}

// let hasStartPersonalSign = false

export async function startPersonalSign(msg: string) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
  //   if (hasStartPersonalSign) return
  // hasStartPersonalSign = true
  const wallet = $wallet.get()
  const connectType = wallet.connectType

  connectQueue.add({
    type: 'signError',
    callback: () => {
      reject(false)
    }
  })
  let result
  try {
    if (connectType === 'metaMask') {
      console.log('personalSign', wallet)
      if (wallet?.netId !== 'tron:0x2b6653dc') {
        result = await sendMessage({
          message: 'personalSign',
          data: { chainId: wallet.netId, msg },
        })
      } else {
        result = await sendMessage({
          message: 'tronlinkSignMessage',
          data: { chainId: wallet.netId, msg },
        })
        console.log('tronlinkSignMessageRedult', result)
      }
    }

    // if (connectType === 'walletConnect') {
    //   result = await sendMessage({
    //     message: 'WCPersonalSign',
    //     data: {
    //       chainId: wallet.netId,
    //       address: wallet.detail?.address,
    //       msg,
    //     },
    //   })
    // }
  } catch (error) {
    console.log('tronlinkSignMessageError', error)
    /* empty */
  }
  // hasStartPersonalSign = false
  resolve(result)
  })
}

export async function startPostSign(signature: string, msg: string) {
  // const wallet = $wallet.get()
  // try {
  //   return await request.post('/verifySignature', {
  //     address: wallet.detail?.address,
  //     signature,
  //     message: msg
  //   }, {
  //     baseURL: 'http://47.57.190.27:7111'
  //   })
  // } catch (error) {
  //   return false
  // }
}
