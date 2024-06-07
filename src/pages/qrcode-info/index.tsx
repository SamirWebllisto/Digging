import NavHeaderLayout from '@/layouts/header'
import QrcodeView from '@/components/qrcode'
import { $user } from '@/stores'
import { constructLink } from '@/helpers/utils'

export default function Qrcode() {
  return (
    <NavHeaderLayout className='bg-transparent' headerChildren="" contentClassName='relative'>
      <QrcodeView text={constructLink($user.get().data?.invitationCode as string)}/>
    </NavHeaderLayout>
  )
}
