'use client'
import { memo, useEffect, useRef } from 'react'
import { useAppSelector } from '../../store/hooks'

export const ID_TIMER_WIDGET = 'audioTimerWidget'

const AudioElement = memo(({ audioRef }: { audioRef: any }) => {
   return <audio id={ID_TIMER_WIDGET} ref={audioRef} loop={true} />
})
AudioElement.displayName = 'AudioElement'

export default function Audio() {
   const audioRef = useRef<HTMLAudioElement>()

   const { src, volume, status } = useAppSelector((state) => state.timerWidget)

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.src = `/sounds/${src}Background.mp3`
      }
   }, [src])

   useEffect(() => {
      if (!audioRef.current) {
         return
      }

      if (audioRef.current?.paused && status) {
         audioRef.current.play()
      } else {
         audioRef.current.pause()
      }
   }, [status])

   useEffect(() => {
      if (audioRef.current) {
         audioRef.current.volume = volume
      }
   }, [volume])

   return <AudioElement audioRef={audioRef} />
}
