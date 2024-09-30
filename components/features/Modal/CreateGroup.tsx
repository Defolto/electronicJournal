import { useRef } from 'react'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch } from '../../../store/hooks'
import { modalHide } from '../../../store/modalSlice'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export default function CreateGroup() {
   const dispatch = useAppDispatch()
   const nameRef = useRef<HTMLInputElement>(null)
   const numberRef = useRef<HTMLInputElement>(null)

   const createGroup = () => {
      const name = nameRef.current?.value
      const number = numberRef.current?.value

      if (!name && !number) {
         return
      }

      dispatch(createFetch({ api: 'group/create', data: { name, number } })).then(({ payload }) => {
         if (!payload) return

         dispatch(notificationShow({ message: 'Класс создан', type: 'success' }))
         dispatch(modalHide())
      })
   }

   return (
      <div className="flex flex-col">
         <p className="mt-1 text-center text-lg">Создание нового класса</p>
         <div className="mx-auto mt-5 flex flex-col gap-3">
            <Input placeholder="Название" view="materials" type="text" ref={nameRef} />
            <Input placeholder="Номер" view="materials" type="number" ref={numberRef} />
            <Button className="mx-auto bg-blue" onClick={createGroup}>
               Создать
            </Button>
         </div>
      </div>
   )
}
