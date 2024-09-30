import { useRef } from 'react'
import { createFetch } from '../../../../helpers/createFetch'
import { translit } from '../../../../helpers/functions'
import { useAppDispatch } from '../../../../store/hooks'
import { modalHide } from '../../../../store/modalSlice'
import { notificationShow } from '../../../../store/notifications/notificationsSlice'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { RUS_LANG } from './CreateMaterial'

type Props = {
   type: 'subject' | 'theme'
   subjectHref: string
   themeHref?: string
   callback?: (data: any, data2: any) => void
}

export default function EditMaterial({ type, subjectHref, themeHref, callback }: Props) {
   const dispatch = useAppDispatch()
   const nameRef = useRef<HTMLInputElement>(null)

   const edit = async () => {
      if (!nameRef.current) {
         dispatch(notificationShow({ message: 'Имя не может быть пустым', type: 'error' }))
         return
      }

      const name = nameRef.current.value

      await dispatch(
         createFetch({
            api: `materials/edit/${type}`,
            data: {
               subjectHref,
               themeHref,
               newName: name,
               newHref: translit(name),
            },
         })
      ).then(({ payload }) => {
         if (!payload) return

         dispatch(
            notificationShow({
               type: 'success',
               message: 'Редактирование успешно',
            })
         )

         // Если передана theme, значит редактировали тему
         callback?.(themeHref ?? subjectHref, payload)
         dispatch(modalHide())
      })
   }

   // TODO: в defaultValue передавать текущее название. Обойтись без новых пропсов в компоненте
   return (
      <>
         <p className="mt-1 text-center text-lg">Напишите новое название {RUS_LANG[type]}</p>
         <div className="m-auto mt-5 flex w-fit flex-col">
            <Input
               placeholder={`Название ${RUS_LANG[type]}`}
               view="materials"
               type="text"
               ref={nameRef}
            />
            <Button className="m-auto mt-3 bg-blue" onClick={edit}>
               Изменить
            </Button>
         </div>
      </>
   )
}
