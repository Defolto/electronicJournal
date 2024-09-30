import { useRef } from 'react'
import { createFetch } from '../../../../helpers/createFetch'
import { translit } from '../../../../helpers/functions'
import { useAppDispatch } from '../../../../store/hooks'
import { modalHide } from '../../../../store/modalSlice'
import { notificationShow } from '../../../../store/notifications/notificationsSlice'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { ICreateMaterial } from '../../Materials/Buttons/ButtonCreateMaterial'

export const RUS_LANG = {
   subject: 'предмета',
   theme: 'урока',
}

export default function CreateMaterial({ type, subjectHref, callback }: ICreateMaterial) {
   const dispatch = useAppDispatch()
   const titleRef = useRef<HTMLInputElement>(null)

   const create = () => {
      if (!titleRef.current) {
         dispatch(notificationShow({ message: 'Имя не может быть пустым', type: 'error' }))
         return
      }

      const title = titleRef.current.value
      dispatch(
         createFetch({
            api: `materials/create/${type}`,
            data: {
               title,
               href: translit(title),
               subjectHref: subjectHref ?? '', // если создаётся новый предмет, то subjectHref будет undefined
            },
         })
      ).then(({ payload }) => {
         if (!payload) return

         dispatch(
            notificationShow({
               type: 'success',
               message: 'Создание успешно',
            })
         )
         callback?.(payload)
         dispatch(modalHide())
      })
   }

   return (
      <>
         <p className="mt-1 text-center text-lg">Напишите название {RUS_LANG[type]}</p>
         <div className="m-auto mt-5 flex w-fit flex-col">
            <Input
               placeholder={`Название ${RUS_LANG[type]}`}
               type="text"
               ref={titleRef}
               view="materials"
            />
            <Button className="m-auto mt-3 bg-blue" onClick={create}>
               Создать
            </Button>
         </div>
      </>
   )
}
