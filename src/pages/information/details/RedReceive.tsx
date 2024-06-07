import { useEffect, useState } from 'react'
import { ReadProps } from '.'
import RedReceive0 from './RedReceive0'
import RedReceive1 from './RedReceive1'

export default function RedReceive(props: ReadProps) {
  const [type , setType] = useState<0|1|2|null>(null)

  useEffect(() => {
    props.read()
  }, [])

  let json = {} as Record<string, any>
  try {
    json = JSON.parse(props.detail?.content)
    if(typeof json.receiveStatus === 'number' && type === null) {
      console.log(json.receiveStatus)
      setType(json.receiveStatus as any)
    }
  } catch (error) { /* empty */ }

  return (
    type === 2 ? <RedReceive0 {...props} /> : <RedReceive1 {...props} />
  )
}
