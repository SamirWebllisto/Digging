import { useRef, useState, useEffect } from 'react'
import Joyride, { Step, TooltipRenderProps } from 'react-joyride'
import { useEventListener } from 'ahooks'
import { useTranslation } from 'react-i18next'
import SvgIcon from '@/components/svg-icon'
import request from '@/helpers/request'
import { syncUser } from '@/stores'

const steps = constructionSteps()

export default function Guide() {
  const [run, setRun] = useState(false)

  useEffect(() => {
    setRun(true)
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEventListener(
    'click',
    async (e) => {
      if ((e.target as HTMLDivElement)!.className === 'react-joyride__spotlight') {
        // @ts-ignore
        JoyrideRef.current?.helpers.next?.()
        if (JoyrideRef.current?.state.index === steps.length - 1) {
          await request.get('/user/readGuide')
          syncUser()
        }
      }
      console.log(JoyrideRef.current)

    },
    // {
    //   target: document.querySelector('.react-joyride__spotlight'),
    // }
  )

  const JoyrideRef = useRef<Joyride>()

  return (
    <Joyride
      // @ts-ignore
      ref={JoyrideRef}
      callback={() => {
        const arrow = (JoyrideRef.current as any)?.tooltipPopper?.arrowElement
        arrow?.querySelector('svg')?.setAttribute?.('viewBox', '0,0,32,16')
      }}
      continuous
      run={run}
      // scrollToFirstStep
      disableOverlayClose
      tooltipComponent={Tooltip}
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'var(--adm-color-primary)',
        },
      }}
    />
  )
}

function Tooltip(props: TooltipRenderProps) {
  const { t } = useTranslation()

  return (
    <div className="py-10">
      <div className="bg-[#2d2d2d] rounded-xl w-60 h-28" {...props.tooltipProps}>
        <header className="flex rounded-t-xl justify-end items-center px-4 py-1 bg-[#43966d]">
          <SvgIcon name="white-logo" className="w-4 h-4 mr-1" />
          <span className="font-bold">WOW EARN</span>
        </header>
        <div className="p-4 text-base">
          <div>
            {props.index + 1}/{props.size}
          </div>
          <div>{t(props.step.content as string)}</div>
        </div>
      </div>
    </div>
  )
}

function constructionSteps() {
  const sets: Step[] = [
    {
      content: 'guide.home',
      target: '#joyride-steps-0',
    },
    {
      content: 'guide.invite',
      target: '#joyride-steps-1',
    },
    {
      content: 'guide.speedMine',
      target: '#joyride-steps-2',
    },
    {
      content: 'guide.people',
      target: '#joyride-steps-3',
    },
    {
      content: 'guide.wallet',
      target: '.joyride-steps-4',
    },
    {
      content: 'guide.buyCoins',
      target: '.joyride-steps-5',
    },
    {
      content: 'guide.logo',
      target: '.joyride-steps-6',
    },
    {
      content: 'guide.connect',
      target: '#joyride-steps-7',
    },
    {
      content: 'guide.currency',
      target: '.joyride-steps-8',
    },
    {
      content: 'guide.startMine',
      target: '.joyride-steps-9',
    },
  ]

  return getRandomItemsFromArray(
    sets.map((item) => ({
      isFixed: true,
      spotlightClicks: false,
      disableBeacon: true,
      ...item,
    })),
    3
  )
}

function getRandomItemsFromArray(arr: any[], count: number) {
  const shuffled = arr.slice(0)
  let i = arr.length,
    temp,
    index
  const min = i - count
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random())
    temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(min)
}
