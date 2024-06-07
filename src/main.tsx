import React from 'react'
import ReactDOM from 'react-dom/client'
import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import { ErrorBoundary } from 'react-error-boundary'
import NetworkError from '@/components/network-error.tsx'
import 'animate.css'
import 'antd-mobile/es/global'
import 'virtual:svg-icons-register'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider locale={enUS}>
    <React.StrictMode>
      <ErrorBoundary fallback={<NetworkError refresh={() => location.reload()} />}>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </ConfigProvider>
)

baseFontSize()
window.addEventListener('resize', baseFontSize)

function baseFontSize (){
  const base = 16 / 375

  const shouldBeWide = Math.min(414, window.innerWidth) * base

  document.documentElement.style.fontSize = shouldBeWide + 'px'
}
