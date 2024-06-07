import request from '@/helpers/request'
import { syncMessageCount } from '@/stores'

import RegisterGift from './RegisterGift'
import Mining from './Mining'
import RedReceive from './RedReceive'
import BeIncome from './BeIncome'
import ExperienceGold from './ExperienceGold'
import InviteRegistration from './InviteRegistration'
import UserRegistration from './UserRegistration'
import ExpirationReminder from './ExpirationReminder'
import InviteReward from './InviteReward'
import FriendRecharge from './FriendRecharge'
import FirstRecharge from './FirstRecharge'

const Modes = {
  RegisterGift,
  Mining,
  RedReceive,
  BeIncome,
  ExperienceGold,
  InviteRegistration,
  UserRegistration,
  ExpirationReminder,
  InviteReward,
  FriendRecharge,
  FirstRecharge,
}

export type ReadProps = {
  read: () => Promise<void>
  detail?: Record<string, any>
}

type InformationDetailsProps = {
  detail?: Record<string, any>,
  type:
    | 'ExperienceGold'
    | 'InviteRegistration'
    | 'UserRegistration'
    | 'BeIncome'
    | 'ExpirationReminder'
    | 'RedReceive'
    | 'InviteReward'
    | 'Mining'
    | 'FriendRecharge'
    | 'FirstRecharge'
    | 'RegisterGift'
}
export default function InformationDetails({ type, detail }: InformationDetailsProps) {
  try {
    const Elelent = Modes[type]

    const read: ReadProps['read'] = async () => {
      if (!detail?.readFlag) {
        await request.get('/message/updateRead', {
          params: {
            id: detail?.id,
          }
        })
        syncMessageCount()
      }
    }

    return (
      <Elelent detail={detail!} read={read} />
    )
  } catch (error) {
    return null
  }
}
