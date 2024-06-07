import BigNumber from "bignumber.js"

export default function numberParse(value: number, decimal = 6) {
  if (typeof value === 'string') {
    value = +value
  }
  if (typeof value !== 'number' || isNaN(value)) {
    return decimalNumber(0, decimal)
  }
  const options = {
    currency: 'USD',
    minimumFractionDigits: decimal,
  }
  const str = decimalNumber(value, decimal).toLocaleString('en-US', options)
  const strs = str.split('.')
  const sub = Number('0.' + strs[1]) || 0
  return [strs[0], String(sub).split('.')[1]].filter(Boolean).join('.')
}

export function decimalNumber(num: number, decimal = 6) {
  const n = +('1'.padEnd(decimal + 1, '0'))
  return Math.floor(BigNumber(num).times(+n).toNumber()) / n
}
