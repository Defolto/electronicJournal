import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
   COLLECTION_LENGTH,
   EPIC_LAST_COUNT,
   LEGENDARY_LAST_COUNT,
   RARE_LAST_COUNT,
} from '../../../helpers/constants'
import { createFetch } from '../../../helpers/createFetch'
import { getMass } from '../../../helpers/functions'
import { ICollection } from '../../../public/collections/list'
import { useAppDispatch } from '../../../store/hooks'
import { modalHide } from '../../../store/modalSlice'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import { Button } from '../../ui/Button'
import { getRandomCart, usFirst } from './helpers'

type State = {
   id: number
}

function getRarity(number: number): string {
   let classBorderRarity = 'border-solid border-2'

   if (number < LEGENDARY_LAST_COUNT) return classBorderRarity + ' border-red'
   if (number < EPIC_LAST_COUNT) return classBorderRarity + ' border-blue'
   if (number < RARE_LAST_COUNT) return classBorderRarity + ' border-green'
   if (number < COLLECTION_LENGTH) return classBorderRarity + ' border-gray'

   return classBorderRarity
}

export default function OpenCase({ collection }: { collection: ICollection }) {
   const dispatch = useAppDispatch()

   const [isOpenCase, setIsOpenCase] = useState<boolean>(false)
   const [caseItems, setCaseItems] = useState<number[]>([])

   const winItem = useRef<number>(0)
   const caseUI = useRef<HTMLDivElement>(null)

   const genRandomItems = () => {
      const caseItems: number[] = []
      for (let i = 0; i < COLLECTION_LENGTH * 5; i++) {
         if (i == 39) {
            caseItems.push(winItem.current)
            continue
         }
         caseItems.push(getRandomCart())
      }
      return caseItems
   }

   const buyCase = async () => {
      const res = await dispatch(createFetch({ api: 'shop/buyCase' }))
      if (!res.payload) return

      winItem.current = res.payload
      setCaseItems(genRandomItems())
      setIsOpenCase(!isOpenCase)
   }

   const fastScroll = () => {
      dispatch(modalHide())
      dispatch(
         notificationShow({
            type: 'info',
            message: `Ты получил ${usFirst(collection)} ${winItem.current}`,
         })
      )
   }

   useEffect(() => {
      let interval: NodeJS.Timeout
      if (isOpenCase && caseUI.current) {
         const caseOpen: HTMLDivElement = caseUI.current
         caseOpen.scrollLeft = 100
         let pixelSpeed = 22
         interval = setInterval(() => {
            const sliderX = caseOpen.scrollLeft
            caseOpen.scrollLeft = sliderX + pixelSpeed
            pixelSpeed -= 0.03
            if (pixelSpeed < 0) {
               clearInterval(interval)
               setTimeout(() => {
                  dispatch(modalHide())
                  dispatch(
                     notificationShow({
                        type: 'info',
                        message: `Ты получил ${usFirst(collection)} ${winItem.current}`,
                     })
                  )
               }, 2000)
            }
         }, 10)
      }
      return () => {
         clearInterval(interval)
      }
   }, [caseItems, collection, dispatch, isOpenCase])

   return (
      <>
         {!isOpenCase ? (
            <div>
               <Button className="mx-auto bg-blue" onClick={buyCase}>
                  Купить и открыть кейс
               </Button>
               <div className="mt-3 flex flex-row flex-wrap gap-3">
                  {getMass(COLLECTION_LENGTH).map((_, i) => (
                     <Image
                        className={getRarity(i)}
                        src={`/collections/${collection}/${i + 1}.jpeg`}
                        key={i}
                        alt="Картинка"
                        width={70}
                        height={70}
                     />
                  ))}
               </div>
            </div>
         ) : (
            <>
               <div className="flex overflow-hidden bg-black" ref={caseUI}>
                  <div className="absolute left-[25vw] top-0 h-[264px] w-[3px] bg-white"></div>
                  {caseItems.map((v, i) => (
                     <div key={i} className={`caseItem m-1 min-w-[200px]`}>
                        <Image
                           src={`/collections/${collection}/${v}.jpeg`}
                           key={i}
                           alt={`${collection}-${v}`}
                           width={200}
                           height={200}
                           className={`${getRarity(v)} rounded`}
                        />
                        <p className="text-center">
                           {usFirst(collection)} {v}
                        </p>
                     </div>
                  ))}
               </div>
               <Button className="mx-auto mt-4 bg-blue" onClick={fastScroll}>
                  Быстрая прокрутка
               </Button>
            </>
         )}
      </>
   )
}
