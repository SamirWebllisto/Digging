import { encrypt } from './rsa'
// @ts-ignore
import MD5 from 'md5'
export const encryptedData = {
  //头部加密
  set(form: any) {
    //生成签名，也可以加盐
    const timestamp = Date.parse(new Date().toString())
    const data = JSON.stringify(sort_ASCII(form))
    const requestId = getUuid()
    const sign = MD5(data + requestId + timestamp)
    return {
      timestamp,
      requestId,
      sign,
    }
  },
  //参数加密
  data(obj: Record<string, any> | string, type?: string) {
    if (type == 'post') {
      const data = JSON.stringify(sort_ASCII(obj as Record<string, any>))
      return encrypt(data)
    } else {
      return encrypt(obj as string)
    }
  },
}
function getUuid() {
  const s: string[] = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((+s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23]
  const uuid = s.join('')
  return uuid
}

function sort_ASCII(obj: Record<string, any>) {
  const arr = []
  let num = 0
  for (const i in obj) {
    arr[num] = i
    num++
  }
  const sortArr = arr.sort()
  const sortObj: Record<string, any> = {}
  for (const i in sortArr) {
    sortObj[sortArr[i]] = obj[sortArr[i]] + ''
  }
  return sortObj
}
