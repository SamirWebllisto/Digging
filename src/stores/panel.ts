import { map } from 'nanostores'
import { useRequest } from 'ahooks'
import request from '@/helpers/request'

export type ISwitchType = 'home' | 'wallet' | 'lang' | 'money' | 'clear' | 'paper' | 'about'

export type IPanel = {
  open: boolean
  type: ISwitchType
  lang: string
  moneyUnit: string
}
export const $panel = map<IPanel>({
  open: false,
  type: 'home',
  lang: 'zh-CN',
  moneyUnit: 'USD'
})

export async function publicApi(buttonName: any) {
  console.log(buttonName)
  if(buttonName==='首页未挖矿图标点击开始挖矿'|| buttonName==='点击开始挖矿'){
  //   await request.post('/common/op', {
  //     buttonName: buttonName,
  // })
  }
}

