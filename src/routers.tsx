/**
 * @module 路由声明模块
 */

import { Suspense, lazy, useEffect } from 'react'
import { Route, Routes, HashRouter, Outlet, useLocation, Navigate } from 'react-router-dom'
import { DotLoading, Toast } from 'antd-mobile'
import { $wallet, useWalletConnect } from '@/stores/wallet'
import ErrorBoundary from '@/components/error-boundary'
import SafeAreaLayout from './layouts/safe-area'
import PanelLayout from './layouts/panel'
import { useStore } from '@nanostores/react'
import { useTranslation } from 'react-i18next'
import { $user } from './stores'
const Index = lazy(() => import('@/pages/index'))
const Fast = lazy(() => import('@/pages/fast'))
const Wallet = lazy(() => import('@/pages/wallet'))
const LuckyWheel = lazy(() => import('@/pages/lucky-wheel'))
const LuckyBox = lazy(() => import('@/pages/lucky-box'))
const LuckyBoxRecord = lazy(() => import('@/pages/lucky-box/record'))
const LuckyWheelRecord = lazy(() => import('@/pages/lucky-wheel/record'))
const Invitation = lazy(() => import('@/pages/invitation'))
const SendRedBag = lazy(() => import('@/pages/send-red-bag'))
const SendRedBagRecord = lazy(() => import('@/pages/send-red-bag/record'))
const Qrcode = lazy(() => import('@/pages/qrcode-info'))
const QrcodeAddress = lazy(() => import('@/pages/qrcode-info/address'))
const RechargeRecord = lazy(() => import('@/pages/recharge-record'))
const MiningCycle = lazy(() => import('@/pages/mining-cycle'))
const InvitationPower = lazy(() => import('@/pages/mining-cycle/invitation-power'))
const InvitationPledgePower = lazy(() => import('@/pages/mining-cycle/invitation-pledge-power'))
const Receive = lazy(() => import('@/pages/receive'))
const ReceiveConfirm = lazy(() => import('@/pages/receive/confirm'))
const Send = lazy(() => import('@/pages/send'))
const Team = lazy(() => import('@/pages/team'))
const Information = lazy(() => import('@/pages/information'))
const NewDetail = lazy(() => import('@/pages/information/news-detail'))
const MsgDetail = lazy(() => import('@/pages/information/msg-detail'))

export default function AppRoutes() {
  useWalletConnect()

  return (
    <Suspense fallback={<Loading />}>
      <HashRouter>
        <Routes>
          <Route path="/" element={<PanelLayoutRoute />} errorElement={<ErrorBoundary />}>
            <Route path="" element={<Index />} errorElement={<ErrorBoundary />} />
            <Route
              path="fast"
              element={
                <RequireAuth>
                  <Fast />
                </RequireAuth>
              }
              errorElement={<ErrorBoundary />}
            />
            <Route
              path="wallet"
              element={
                <RequireAuth>
                  <Wallet />
                </RequireAuth>
              }
              errorElement={<ErrorBoundary />}
            />
          </Route>
          <Route
            path="/lucky-wheel"
            element={
              <RequireAuth>
                <LuckyWheel />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/lucky-box"
            element={
              <RequireAuth>
                <LuckyBox />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/lucky-box-record"
            element={
              <RequireAuth>
                <LuckyBoxRecord />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/lucky-wheel-record"
            element={
              <RequireAuth>
                <LuckyWheelRecord />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/invitation"
            element={
              <RequireAuth>
                <Invitation />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/send-red-bag"
            element={
              <RequireAuth>
                <SendRedBag />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/send-red-bag/record"
            element={
              <RequireAuth>
                <SendRedBagRecord />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/qrcode"
            element={
              <RequireAuth>
                <Qrcode />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/qrcode-address"
            element={
              <RequireAuth>
                <QrcodeAddress />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/recharge-record"
            element={
              <RequireAuth>
                <RechargeRecord />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/mining-cycle"
            element={
              <RequireAuth>
                <MiningCycle />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/receive"
            element={
              <RequireAuth>
                <Receive />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/receive-confirm"
            element={
              <RequireAuth>
                <ReceiveConfirm />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/send"
            element={
              <RequireAuth>
                <Send />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/team"
            element={
              <RequireAuth>
                <Team />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/information"
            element={
              <RequireAuth>
              <Information />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
          <Route
            path="/news-detail/:key"
            element={
              <RequireAuth>
              <NewDetail />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />

          <Route
            path="/invitation-pledge-power"
            element={
              <RequireAuth>
                <InvitationPledgePower />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />

          <Route
            path="/invitation-power"
            element={
              <RequireAuth>
                <InvitationPower />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />

          <Route
            path="/msg-detail"
            element={
              <RequireAuth>
              <MsgDetail />
              </RequireAuth>
            }
            errorElement={<ErrorBoundary />}
          />
        </Routes>
      </HashRouter>
    </Suspense>
  )
}

function Loading() {
  return (
    <div className="min-h-screen w-full flex">
      <DotLoading className="m-auto" color="primary" />
    </div>
  )
}

function PanelLayoutRoute() {
  return (
    <SafeAreaLayout>
      <PanelLayout>
        <Outlet />
      </PanelLayout>
    </SafeAreaLayout>
  )
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const wallet = useStore($wallet)
  const user = useStore($user)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    const url = new URL(window.location.href)
    const code = url.searchParams.get('invitationCode')
    if (code) {
      sessionStorage.setItem('invitationCode', code || '')
    }
  }, [])

  if (user.status === 'init') {
    return <Loading />
  }

  if (!wallet.detail) {
    Toast.show(t('common.loginTips'))
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return children
}
