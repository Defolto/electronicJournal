import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { addZero } from '../../helpers/functions'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { notificationShow } from '../../store/notifications/notificationsSlice'
import {
   ITimerWidget,
   changeResumeTimerWidget,
   changeSrcTimerWidget,
   changeStatusTimerWidget,
   changeVolumeTimerWidget,
} from '../../store/timerWidgetSlice'
import { ID_TIMER_WIDGET } from '../features/Audio'
import Pause from '../icons/Pause'
import Play from '../icons/Play'
import Reset from '../icons/Reset'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import WrapperWidget from './WrapperWidget'

function parseTime(time: number) {
   const hours = addZero(Math.floor(time / 3600))
   const minutes = addZero(Math.floor((time - +hours * 3600) / 60))
   const seconds = addZero(time - +minutes * 60 - +hours * 3600)

   return <p>{`${hours}:${minutes}:${seconds}`}</p>
}

export default function TimerWidget() {
   const dispatch = useAppDispatch()
   const [animation, setAnimation] = useState<boolean>(false)

   const { volume, src, status, resume } = useAppSelector((state) => state.timerWidget)

   const changeAudio = useCallback(
      (audioName: string) => {
         dispatch(changeSrcTimerWidget(audioName))
      },
      [dispatch]
   )

   const changeVolume = useCallback(
      (newVolume: number) => {
         dispatch(changeVolumeTimerWidget(newVolume))
      },
      [dispatch]
   )

   const toggleAnimation = useCallback(() => {
      setAnimation((prev) => !prev)
   }, [])

   return (
      <WrapperWidget>
         <header>
            <TimerWidgetControls status={status} resume={resume} />
            {animation && <AnimationAudio status={status} />}
         </header>

         <footer className="flex flex-col gap-2">
            <p className="text-center text-lg font-bold">Настройки</p>
            <div className="mb-3 flex gap-5">
               <div>
                  <p>Жанр:</p>
                  <select
                     className="h-[25px] text-black"
                     onChange={(e) => changeAudio(e.target.value)}
                     value={src}
                  >
                     <option value="hall">Нейтральная</option>
                     <option value="rain">Дождь</option>
                     <option value="needForSpeed">Чилл</option>
                     <option value="none">Без музыки</option>
                  </select>
               </div>

               <div>
                  <p>Громкость: {Math.round(volume * 100)}</p>
                  <Input
                     type="range"
                     min="0"
                     max="100"
                     onChange={(e) => changeVolume(+e.target.value / 100)}
                     value={volume * 100}
                  />
               </div>
            </div>

            <div className="flex flex-row gap-1">
               <Button className="bg-blue !py-1" onClick={toggleAnimation}>
                  Анимация
               </Button>
            </div>
         </footer>
      </WrapperWidget>
   )
}

const buttons = [1, 5, 10]
const TimerWidgetControls = memo(({ status, resume }: Pick<ITimerWidget, 'status' | 'resume'>) => {
   const dispatch = useAppDispatch()
   const [time, setTime] = useState<number>(0)
   // Копия времени в ссылке, чтобы в useEffect не указывать зависимость насостояние time
   const timeRef = useRef<number>(0)

   const addTime = useCallback((value: number) => {
      setTime((prev) => {
         const newTime = prev + value * 60
         timeRef.current = newTime
         return newTime
      })
   }, [])

   const toggleAudio = useCallback(() => {
      if (!time) {
         dispatch(notificationShow({ message: 'Установите таймер перед запуском', type: 'error' }))
         return
      }

      const newStatus = !status
      dispatch(changeStatusTimerWidget(newStatus))
   }, [status, time, dispatch])

   const resetTime = useCallback(() => {
      timeRef.current = 0
      setTime(0)
   }, [])

   useEffect(() => {
      if (!status) {
         return
      }

      const interval = setInterval(() => {
         if (time <= 0) {
            dispatch(changeStatusTimerWidget(false))
            clearInterval(interval)
            return
         }

         timeRef.current -= 1
         setTime((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(interval)
   }, [time, status, dispatch])

   useEffect(() => {
      const cleanup = () => {
         dispatch(
            changeResumeTimerWidget({
               lastVisibleTime: new Date(),
               lastedTime: timeRef.current,
            })
         )
      }

      if (!resume || !resume.lastVisibleTime || !resume.lastedTime) {
         return cleanup
      }

      const passedTime = new Date().getTime() - resume.lastVisibleTime.getTime()
      const newTime = Math.round(resume.lastedTime - passedTime / 1000)

      timeRef.current = newTime
      setTime(newTime)

      return cleanup
   }, [resume, dispatch, timeRef])

   return (
      <div className="flex items-center">
         <div className="flex gap-1">
            <p>Осталось:</p>
            {parseTime(time)}
         </div>
         <div className="ml-auto flex gap-2">
            {!status && (
               <>
                  <Button
                     className="flex h-[32px] w-[32px] items-center justify-center bg-blue !p-0"
                     onClick={resetTime}
                  >
                     <Reset className="h-5 w-5" />
                  </Button>
                  {buttons.map((button) => (
                     <Button
                        key={`add-timer-${button}`}
                        className="bg-blue !px-2 !py-1"
                        onClick={() => addTime(button)}
                     >
                        +{button}
                     </Button>
                  ))}
               </>
            )}
            <Button
               className="flex h-[32px] w-[32px] items-center justify-center bg-blue !p-0"
               onClick={toggleAudio}
            >
               {status ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
         </div>
      </div>
   )
})
TimerWidgetControls.displayName = 'TimerWidgetControls'

let animationController: number
let audioSource: MediaElementAudioSourceNode
let analyzer: AnalyserNode

const bar_width = 3
const songData = new Uint8Array(110)
function AnimationAudio({ status }: { status: boolean }) {
   const canvasRef = useRef<HTMLCanvasElement>(null)

   const visualizeData = useCallback(() => {
      if (!canvasRef.current) {
         return
      }

      const ctx = canvasRef.current.getContext('2d')
      if (!ctx) {
         return
      }

      const { width: canvasWidth, height: canvasHeight } = canvasRef.current
      analyzer.getByteFrequencyData(songData)
      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      for (let i = 0; i < songData.length; i++) {
         const start = i * 4
         let gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
         gradient.addColorStop(0.2, '#2392f5')
         gradient.addColorStop(0.5, '#fe0095')
         gradient.addColorStop(1.0, 'purple')
         ctx.fillStyle = gradient
         ctx.fillRect(start, canvasHeight, bar_width, -songData[i] / 2)
      }

      animationController = window.requestAnimationFrame(visualizeData)
   }, [])

   useEffect(() => {
      // Первая инициализация
      if (!audioSource) {
         const audioContext = new AudioContext()
         // элемент гарантированно найдётся
         const audioElement = document.getElementById(ID_TIMER_WIDGET) as HTMLAudioElement

         audioSource = audioContext.createMediaElementSource(audioElement)
         analyzer = audioContext.createAnalyser()
         audioSource.connect(analyzer)
         analyzer.connect(audioContext.destination)
      }

      if (status) {
         visualizeData()
      }

      return () => cancelAnimationFrame(animationController)
   }, [visualizeData, status])

   return <canvas ref={canvasRef} width={400} height={100} />
}
