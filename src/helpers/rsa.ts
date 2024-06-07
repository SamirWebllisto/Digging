/* 产引入jsencrypt实现数据RSA加密 */
// @ts-ignore
import JSEncrypt from 'jsencrypt' // 处理长文本数据时报错 jsencrypt.js Message too long for RSA
/* 产引入encryptlong实现数据RSA加密 */
// @ts-ignore
import Encrypt from 'encryptlong' // encryptlong是基于jsencrypt扩展的长文本分段加解密功能。
const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCZFW5LyHaR0kkr8GtvyMCptXbfOPX86hRZyVEqxXqpp+wsGNIUWLw6FJDFtWlgQpvc7xngilEOPzOfbpgjEEVaAM5dDfmwbSd1pfc2AfjXQErYSeWLEiiMN22RgLqZMTeb6894PdH+VahT9CwNafM9hSgdhiiJxIN67roQ12ujiQIDAQAB'
// 加密
// export function encrypt(txt) {
//     const encryptor = new JSEncrypt()
//     encryptor.setPublicKey(publicKey) // 设置公钥
//     if (!encryptor.encrypt(txt)) {
//         const encryptors = new Encrypt()
//         encryptors.setPublicKey(publicKey) // 设置公钥
//         return encryptors.encryptLong(txt)
//     }
//     return encryptor.encrypt(txt) // 对数据进行加密
// }
export function encrypt(txt: string) {
    const encryptor = new Encrypt()
    encryptor.setPublicKey(publicKey) // 设置公钥
    return encryptor.encryptLong(encodeURI(txt))
}
