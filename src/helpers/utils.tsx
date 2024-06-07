import QrcodeView from "@/components/qrcode"
import { Modal } from "antd-mobile"
import { CloseCircleOutline } from "antd-mobile-icons"

export function convertObj(data: Record<string, any>) {
  // return new URLSearchParams(data).toString()
  const _result = [];
  for (const key in data) {
    const value = data[key];
    if (value?.constructor == Array) {
      value.forEach(function (_value) {
        _result.push(key + "=" + _value);
      });
    } else {
      _result.push(key + '=' + value);
    }
  }
  return _result.join('&');
}

export function visibleQrcode(invitationCode: string) {
  Modal.show({
    bodyClassName: 'bg-transparent',
    closeOnMaskClick: true,
    content: (
      <div className="flex flex-col justify-center items-center">
        <QrcodeView text={constructLink(invitationCode)}/>
        <CloseCircleOutline fontSize="24px" className="mt-3" onClick={() => Modal.clear()} />
      </div>
    ),
    actions: [],
  })
}

export function constructLink (invitationCode?: string, showAutoConnect = true) {
  const searchParams = new URLSearchParams()

  searchParams.set('invitationCode', invitationCode || sessionStorage.getItem('invitationCode') || '')
  if (showAutoConnect) {
    searchParams.set('autoConnect', 'true')
  }

  const url = new URL(location.href)

  url.search = searchParams.toString()
  url.hash = ''
  return url.toString()
}

export function truncateString(string: string) {
  if (string.length <= 8) {
    return string;
  } else {
    return string.slice(0, 4) + "..." + string.slice(-4);
  }
}

export function delay(time = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}
