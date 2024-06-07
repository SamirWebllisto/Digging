import NavHeaderLayout from '@/layouts/header'
import { Button, CapsuleTabs, Toast } from 'antd-mobile'
import { useState } from 'react'
import copy from 'copy-to-clipboard'
import { useTranslation } from 'react-i18next'
import CopyIcon from '@/assets/pngs/copy.png'
import ShareIcon from '@/assets/pngs/share1.png'
import { useRequest } from 'ahooks'
import request from '@/helpers/request'
import { $user } from '@/stores'
import InputBg from '@/assets/pngs/invite-input.png'
import Icon3 from './icons/level-3.png'
import Icon2 from './icons/level-2.png'
import Icon6 from './icons/level-3-dis.png'
import Icon5 from './icons/level-2-dis.png'
import Icon4 from './icons/level-1-dis.png'
import Icon1 from './icons/level-1.png'
import { useNavigate } from 'react-router-dom'
import { useShare } from '@/hooks/use-share'
import { constructLink } from '@/helpers/utils'
import { publicApi } from '@/stores'

const levelIcon = {
  1: Icon3,
  2: Icon2,
  3: Icon1,
  4: Icon6,
  5: Icon5,
  6: Icon4,
}

type ITabs = 'f' | 't'
export default function Team() {
  const navigate = useNavigate()
  const share = useShare()
  const [type, setType] = useState<ITabs>('f')
  const { t } = useTranslation()

  const { data } = useRequest(
    async () => {
      console.log(type)
      const { result } = await request.get(type === 'f' ? '/team/inviteList' : '/team/teamList')
      return result
    },
    {
      refreshDeps: [type],
    }
  )

  console.log(data)

  return (
    <NavHeaderLayout pageName='我的团队' headerChildren={<span className='text-base text-white font-normal'>{t('invite.myTeam')}</span>} contentClassName="px-4">
      <div className='mt-10'></div>
      <CapsuleTabs activeKey={type} onChange={(val) =>{setType(val as ITabs);publicApi(`我的团队界面点击${val==='f'?`我的邀请`:`团队列表`}`);} } className="switch-card my-3">
        <CapsuleTabs.Tab
          title={
            <div className="flex justify-center items-center text-15 text-[#b9b9b9]">
              <span>{t('mining.myInvitation')}</span>
            </div>
          }
          key="f"
        />
        <CapsuleTabs.Tab
          title={
            <div className="flex justify-center items-center text-15 text-[#b9b9b9]">
              <span>{t('mining.teamsList')}</span>
            </div>
          }
          key="t"
        />
      </CapsuleTabs>

      {type === 'f' ? (
        <div className="text-[#a6a6a6] text-sm mt-1 mb-5">
          {t('mining.inviteTeamTip').replace('$1', data?.inviteCount || 0).replace('$2', data?.activeCount || 0)}
        </div>
      ) : (
        <div className="text-[#a6a6a6] text-sm mt-1 mb-5">
          {t('invite.myTeamExplanation')
            .replace('$2', data?.teamCount || 0)
            .replace('$4', data?.activeCount || 0)}
        </div>
      )}

      {type === 'f' ? (
        <div className="min-h-[200px] mb-5">
          {data?.inviteTeamVos?.map((item: any) => (
            <div className="flex mb-4 items-center" key={item.walletAddress}>
              <img
                className="w-10 h-10 mr-2 rounded-full"
                src={levelIcon[(+item.userLevel + (item.status == 0 ? 3 : 0)) as keyof typeof levelIcon]}
              />
              <span className="text-sm text-[#a6a6a6]">{item.walletAddress}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-[200px] mb-5">
          {data?.inviteTeamVos?.map((item: any) => (
            <div className="flex mb-4 items-center" key={item.walletAddress}>
              <img
                className="w-10 h-10 mr-2 rounded-full"
                src={levelIcon[(+item.userLevel + (item.status == 0 ? 3 : 0)) as keyof typeof levelIcon]}
              />
              <span className="text-sm text-[#a6a6a6]">{item.walletAddress}</span>
            </div>
          ))}
        </div>
      )}

      <div
        className="h-10"
        style={{ backgroundImage: `url(${InputBg})`, backgroundSize: '100% 100%', padding: '4px 15px' }}>
        <div className="content flex items-center"  onClick={() =>{
          publicApi('我的团队复制邀请链接')
          copy(constructLink($user.get().data?.invitationCode as string, false))
          Toast.show(t('public.copySuccess'))
        }}>
          <span className="text-[#a6a6a6] text-xs">{t('mining.inviteLink')}</span>
          <div className="flex-1 text-left mx-2 text-[#d0d0d0] text-13 leading-[16px]">
            {constructLink($user.get().data?.invitationCode as string, false)}
          </div>
          <img className="w-3 h-3 inline" src={CopyIcon} />
        </div>
      </div>
      <Button
        onClick={()=>{share(); publicApi('我的团队邀请好友分享按钮')}}
        className=" h-7 rounded-2xl text-sm p-0 m-auto bg-white/5 border-none flex mt-5 px-2"
        style={{ backgroundImage: 'linear-gradient(112deg, #B5B5B5 15%, #383838 100%)' }}>
        <div className=" h-7 flex justify-center items-center">
          <img src={ShareIcon} className="w-[0.875rem] mr-1" />
          {t('mining.inviteTeamTip3')}
        </div>
      </Button>
    </NavHeaderLayout>
  )
}
