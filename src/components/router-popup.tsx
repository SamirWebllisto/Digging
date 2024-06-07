import { useEffect } from 'react'
import { Popup, PopupProps } from 'antd-mobile'
import { useNavigate, useLocation } from 'react-router-dom'

// const basePath = location.pathname
let additionalSearch = false

/**
 * 处理安卓手机物理返回按钮事件拦截
 */
export default function RouterPopup(props: PopupProps) {
  const navigate = useNavigate()
  // const location = useLocation()
  useEffect(() => {
    const onChange = () => {
      if (props.visible) {
        props.onClose?.()
      } else if (window.location.hash.includes('popup=')) {
        navigate(-1)
        additionalSearch = false
      }
    }
    window.addEventListener('popstate', onChange)
    if (props.visible) {
      // const search = location.search
      history.pushState(null, '')
      // if (window.location.hash.includes('popup=')) {

      // } else {
      //   const newPath = basePath + '#' + location.pathname + (search ? search + '&popup=1' : '?popup=1')
      //   history.pushState(null, '', newPath)
      // }
      additionalSearch = true
    }
    console.log(props, window.location.hash)
    return () => {
      window.removeEventListener('popstate', onChange)
    }
  }, [props.visible])

  const onClose = () => {
    if (additionalSearch) {
      navigate(-1)
      additionalSearch = false
    }

    props.onClose?.()
  }

  return (
    <Popup {...props} onClose={onClose}>
      {props.children}
    </Popup>
  )
}
