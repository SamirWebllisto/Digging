import axios, { Axios, AxiosRequestConfig, AxiosDefaults, HeadersDefaults, AxiosHeaderValue, AxiosInterceptorManager, AxiosResponse } from 'axios'
import { Toast } from 'antd-mobile'
import Fingerprint2 from 'fingerprintjs2'
import i18n from '@/locales'
import { encryptedData } from './encryption'
import { convertObj } from './utils'
import { ToastHandler } from 'antd-mobile/es/components/toast'
import { $user, cleanWallet } from '@/stores'

export type IResult<T = any> = {
  code: number
  message: string
  msg: string
  result: T
}

// @ts-ignore
interface RequestAxiosInstance extends Axios {
  <R = IResult, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  <R = IResult, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;


  request<R = IResult, D = any>(config: AxiosRequestConfig<D>): Promise<R>;
  get<R = IResult, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<R = IResult, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  head<R = IResult, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  options<R = IResult, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  put<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  postForm<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  putForm<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;
  patchForm<R = IResult, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R>;

  defaults: Omit<AxiosDefaults, 'headers'> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue
    }
  };

  interceptors: {
    request: AxiosInterceptorManager<any>
    response: AxiosInterceptorManager<IResult>
  }
}
let murmur: string

function createFingerprint() {
  if (murmur) return murmur
  // 浏览器指纹
  Fingerprint2.get((components) => { // 参数只有回调函数时，默认浏览器指纹依据所有配置信息进行生成
    const values = components.map(component => component.value); // 配置的值的数组
    console.log(values)
    murmur = Fingerprint2.x64hash128(values.join(''), 31); // 生成浏览器指纹
  })
  return murmur
}

const urls: Record<string, string> = {
  'app.wowearn.io': 'https://appapi.wowearn.io',
  'www.ggtgame.com': 'https://www.ggtgame.com',
}

const request = axios.create({
  timeout: 50000,
  // baseURL: 'http://47.97.163.143:9001'
  // 裸金属测试链接
  baseURL: 'http://142.202.48.100:9001'
  // baseURL: (urls[window.location.hostname] ?? 'https://appapi.wowearn.io')
  // baseURL: 'http://127.0.0.1:5001'
}) as unknown as RequestAxiosInstance

request.interceptors.request.use(
  config => {
    if (!config.hideLoading) {
      loadingRequest.show()
    }
    let form: Record<string, any>
    console.log({url: config.url, params: config.params, data: config.data})
    if (config.method?.toLocaleLowerCase() === 'get') {
      form = config.params || {}
      config.params = undefined
      config.url = config.url + '?param=' + encodeURI(encryptedData.data(convertObj(form)))
    } else {
      form = config.data
      config.data = encryptedData.data(config.data, 'post')
    }
    // @ts-ignore
    config.headers = {
      // ...encryptedData.set(form),
      ...config.headers,
      lang: i18n.language,
      murmur: (window as any).deviceUniqueId || createFingerprint(),
      'Content-Type': 'application/json',
      token: localStorage.getItem('token') || ''
    }
    return config
  }
)

request.interceptors.response.use(
  response => {
    const res = response as unknown as AxiosResponse<IResult, any>
    if (!(res.config as any).hideLoading) {
      loadingRequest.hide()
    }
    const data = res.data
    const url = res?.config?.url
    if (data.code === 20048 && url === '/user/loginThird') {
      Toast.show(i18n.t('login.device.error'))
    }
    if (data.code === 35007) {
      Toast.show(i18n.t('not.invite.auth'))
    }
    if (data.code === 4004) {
      Toast.show(i18n.t('login.wallet.error'))
    }
    if (data.code === 40022) {
      Toast.show(i18n.t('error_40022'))
    }
    if (data.code === 20041) {
      Toast.show(i18n.t('errors.code_20041'))
    }
    if (data.code === 1003) {
      Toast.show(i18n.t('errors.code_1003'))
    }
    if (data.code === 4002) {
      Toast.show(i18n.t('errors.code_4002'))
    }
    if (data.code === 40023) {
      Toast.show(i18n.t('error_40023'))
    }
    if (data.code === 20045) {
      Toast.show(i18n.t('errors.code_20045'))
    }
    if (data.code === 20047) {
      Toast.show(i18n.t('errors.code_20047'))
    }
    if (data.code === 20048) {
      Toast.show(i18n.t('errors.code_20048'))
    }
    if (data.code === 20049) {
      Toast.show(i18n.t('errors.code_20049'))
    }
    if (data.code === 20050) {
      Toast.show(i18n.t('errors.code_20050'))
    }
    if (data.code === 35005) {
      Toast.show(i18n.t('errors.code_35005'))
    }
    if (data.code === 35006) {
      Toast.show(i18n.t('errors.code_35006'))
    }
    if (data.code === 35007) {
      Toast.show(i18n.t('errors.code_35007'))
    }
    if (data.code === 35008) {
      Toast.show(i18n.t('errors.code_35008'))
    }
    if (data.code === 35009) {
      Toast.show(i18n.t('errors.code_35009'))
    }
    if (data.code === 1009) {
      Toast.show(i18n.t('errors.code_1009'))
    }

    if (data.code === 5201) {
      Toast.show(i18n.t('activity.turntableBlanceTip'))
    }
    if (data.code === 5205) {
      Toast.show(i18n.t('errors.code_5205'))
    }
    if (data.code === 20048 && url === '/user/loginThird') {
      Toast.show(i18n.t('login.device.error'))
    }
    if (data.code === 20047 && url === '/user/loginThird') {
      Toast.show(i18n.t('login.ip.error'))
    }

    if (data.code !== 200 && url !== '/common/op') {
      if (data.code === 401 ) {
        window.location.hash = ''
        cleanWallet()
        $user.setKey('data', null)
        $user.setKey('status', 'logout')
        if (!(res.config as any).hideLoading) {
          // Toast.show(i18n.t('comm.operate.fail.save'))
            Toast.show(i18n.t('comm.operate.fail.save')+data.code.toString())
        }
      }
      if (data.code !== 401) {
        if (!(res.config as any).hideLoading) {
            Toast.show(i18n.t('comm.operate.fail.save')+data.code.toString())
            // Toast.show(i18n.t('comm.operate.fail.save'))
        }
      }

      setTimeout(() => {
        // if(data.code===35005){
        //   Toast.show(i18n.t('not.mining.auth'))
        // }
        // if(data.code===35006){
        //   Toast.show(i18n.t('not.gratuity.auth'))
        // }
        // if(data.code===35007){
        //   Toast.show(i18n.t('not.invite.auth'))
        // }
        if (data.code === 4004) {
          Toast.show(i18n.t('login.wallet.error'))
        }
        if (data.code === 40022) {
          Toast.show(i18n.t('error_40022'))
        }
        if (data.code === 20041) {
          Toast.show(i18n.t('errors.code_20041'))
        }
        if (data.code === 1003) {
          Toast.show(i18n.t('errors.code_1003'))
        }
        if (data.code === 4002) {
          Toast.show(i18n.t('errors.code_4002'))
        }
        if (data.code === 40023) {
          Toast.show(i18n.t('error_40023'))
        }
        if (data.code === 20045) {
          Toast.show(i18n.t('errors.code_20045'))
        }
        if (data.code === 20047) {
          Toast.show(i18n.t('errors.code_20047'))
        }
        if (data.code === 20003) {
          Toast.show(i18n.t('common.loginTips'))
        }
        if (data.code === 20048) {
          Toast.show(i18n.t('errors.code_20048'))
        }
        if (data.code === 20049) {
          Toast.show(i18n.t('errors.code_20049'))
        }
        if (data.code === 20050) {
          Toast.show(i18n.t('errors.code_20050'))
        }
        if (data.code === 35005) {
          Toast.show(i18n.t('errors.code_35005'))
        }
        if (data.code === 35006) {
          Toast.show(i18n.t('errors.code_35006'))
        }
        if (data.code === 35007) {
          Toast.show(i18n.t('errors.code_35007'))
        }
        if (data.code === 35008) {
          Toast.show(i18n.t('errors.code_35008'))
        }
        if (data.code === 35009) {
          Toast.show(i18n.t('errors.code_35009'))
        }
        if (data.code === 1009) {
          Toast.show(i18n.t('errors.code_1009'))
        }
        if (data.code === 5202) {
          Toast.show(i18n.t('errors.code_5202'))
        }
        if (data.code === 5203) {
          Toast.show(i18n.t('errors.code_5203'))
        }
        if (data.code === 5204) {
          Toast.show(i18n.t('errors.code_5204'))
        }
        if (data.code === 5205) {
          Toast.show(i18n.t('errors.code_5205'))
        }
        if (data.code === 5206) {
          Toast.show(i18n.t('errors.code_5206'))
        }
        if (data.code === 40019) {
          Toast.show(i18n.t('errors.code_40019'))
        }
        if (data.code === 20035) {
          Toast.show(i18n.t('errors.code_20035'))
        }
        if (data.code === 20036) {
          Toast.show(i18n.t('errors.code_20036'))
        }

        if (data.code === 5201) {
          Toast.show(i18n.t('activity.turntableBlanceTip'))
        }
      }, 16)
      return Promise.reject(data)
    }

    return data
  },
  error => {
    if (!(error?.config as any).hideLoading) {
      loadingRequest.hide()
    }
    if (error?.response?.status === 401 && error?.config?.url !== '/common/op') {
      window.location.hash = ''
      cleanWallet()
      $user.setKey('data', null)
      $user.setKey('status', 'logout')
      if (!(error?.config as any).hideLoading) {
        Toast.show(i18n.t('login.error'))
      }
    }
    if (error?.response?.status !== 401 && error?.config?.url !== '/common/op') {
      // Toast.show(error.msg || error.message || i18n.t('comm.operate.fail.save'))
      if (!(error?.config as any).hideLoading) {
        Toast.show(i18n.t('errors.network_error'))
          // Toast.show(i18n.t('comm.operate.fail.save')+error?.response?.status.toString())
      }
    }
    return Promise.reject(error)
  }
)

export default request

export class loadingRequest {
  static timer: any
  static count = 0

  static loadingInstance: ToastHandler

  static el = document.getElementById('custom-loading')

  static show() {
    if (this.count === 0 && this.el) {
      this.el.style.visibility = 'visible'
      this.el.style.opacity = '1'
      // this.loadingInstance = Toast.show({
      //   duration: 0,
      //   icon: 'loading',
      // })
    }
    this.count++
  }

  static hideAll() {
    this.count = 0
    this.hide()
  }

  static hide() {
    if (this.timer) clearTimeout(this.timer)
    if (this.count <= 1 && this.el) {
      this.count = 0
      this.el.style.visibility = 'hidden'
      this.el.style.opacity = '0'
      // this.loadingInstance?.close()
      return
    }
    this.timer = setTimeout(() => {
      this.count--
      this.hide()
    }, 5000)
    this.count--
  }
}
