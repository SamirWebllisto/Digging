
import jsQR from 'jsqr'
import { useRef, useEffect } from 'react'

let timer: any = null
export default function QrcodeScan({close, getResult}: {close: () => void, getResult: (result: string) => void}) {
  const canvas = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let address: string
    const video = document.createElement("video")
    const media = navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
      video.srcObject = stream;
      video.setAttribute("playsinline", 'true');
      video.play();
      requestAnimationFrame(tick);
      return stream
    })

    function tick() {
      cancelAnimationFrame(timer)
      if (address) return
      const canvasElement = canvas.current!
      const ctx = canvasElement?.getContext("2d")
      if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
        canvasElement.hidden = false;

        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        if (code) {
          address = code.data
          getResult?.(address)
          close()
          return
        }
      }
      timer = requestAnimationFrame(tick);
    }

    return () => {
      video.pause()
      video.srcObject = null
      video.remove()
      media.then((stream: MediaStream) => {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
    }
  }, [canvas])

  return (
    <div className='flex h-dscreen'>
      <canvas className='w-full m-auto block' ref={canvas} hidden></canvas>
    </div>
  )
}
