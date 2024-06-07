import { syncUser } from "@/stores"
import { useInterval } from "ahooks"


export default function Starting() {

  useInterval(() => syncUser(), 2000)

  return (
    <div className="w-[17.5rem] absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] flex items-center flex-col">
      <div className='font-wow font-bold text-wow-700 text-23'>Starting</div>
    </div>
  )
}
