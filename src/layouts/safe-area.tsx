/**
 * @module 处理安全区问题
 */
import { SafeArea } from 'antd-mobile'
import { ReactNode } from 'react'

type ISafeAreaLayoutProps = {
  children: ReactNode
}
export default function SafeAreaLayout(props: ISafeAreaLayoutProps) {
  return (
    <>
      <SafeArea position="top" />
      {props.children}
      <SafeArea position="bottom" />
    </>
  )
}
