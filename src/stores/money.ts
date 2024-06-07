import { map } from 'nanostores'

export type IMoney = {
  open: boolean
}
export const $money = map<IMoney>({
  open: false,
  // moneyUnit: 'USD'
})
