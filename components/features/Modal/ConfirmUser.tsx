import { useRef, useState } from 'react'
import { NOT_EVERYTHING_IS_FILLED } from '../../../helpers/constants'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch } from '../../../store/hooks'
import { modalHide } from '../../../store/modalSlice'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import { verifyingUserChanged } from '../../../store/user/userSlice'
import { IUserInfo } from '../../../types'
import { Button } from '../../ui/Button'
import { Input } from '../../ui/Input'

export default function ConfirmUser({ name, surname, birthday }: IUserInfo) {
   const dispatch = useAppDispatch()
   const [inProgress, setInProgress] = useState(false)

   const birthdayRef = useRef<HTMLInputElement>(null)
   const surnameRef = useRef<HTMLInputElement>(null)
   const nameRef = useRef<HTMLInputElement>(null)

   const sendData = () => {
      const name = nameRef.current?.value
      const surname = surnameRef.current?.value
      const birthday = birthdayRef.current?.value

      if (!name || !surname || !birthday) {
         dispatch(notificationShow({ message: NOT_EVERYTHING_IS_FILLED, type: 'error' }))
         return
      }

      setInProgress(true)
      dispatch(createFetch({ api: 'user/verify', data: { name, surname, birthday } }))
         .then(({ payload }) => {
            if (!payload) return

            dispatch(verifyingUserChanged(true))
            dispatch(modalHide())
            dispatch(notificationShow({ message: 'Заявка успешно отправлена', type: 'success' }))
         })
         .finally(() => setInProgress(false))
   }

   return (
      <>
         <p className="mb-2 text-center text-2xl font-bold">Подтверждение данных</p>
         <p className="mb-8 text-center">
            Отправив заявку, вы подтверждаете, что введённые ниже данные являются достоверными.
            После подтверждения, вы не сможете изменить эти данные.
         </p>
         <div className="flex flex-col gap-2">
            <div>
               <strong>Имя</strong>:
               <Input
                  view="confirmUser"
                  type="text"
                  defaultValue={name}
                  ref={nameRef}
                  disabled={inProgress}
               />
            </div>
            <div>
               <strong>Фамилия</strong>:
               <Input
                  view="confirmUser"
                  type="text"
                  defaultValue={surname}
                  ref={surnameRef}
                  disabled={inProgress}
               />
            </div>
            <div>
               <strong>Дата рождения</strong>:
               <Input view="confirmUser" type="date" ref={birthdayRef} disabled={inProgress} />
            </div>
         </div>

         <Button
            className="mx-auto mt-4 bg-blue"
            onClick={sendData}
            inProgress={inProgress}
            disabled={inProgress}
         >
            Отправить заявку
         </Button>
         <p className="mt-1 text-center text-xs">Заявка обрабатывается от 10 минут до 2 суток</p>
      </>
   )
}
