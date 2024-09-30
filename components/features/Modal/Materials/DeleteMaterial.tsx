import { createFetch } from '../../../../helpers/createFetch'
import { useAppDispatch } from '../../../../store/hooks'
import { modalHide } from '../../../../store/modalSlice'
import { notificationShow } from '../../../../store/notifications/notificationsSlice'
import { Button } from '../../../ui/Button'

type Props = {
   type: 'subject' | 'theme'
   subjectHref: string
   themeHref: string
   callback?: (data: any) => void
}

const RUS_LANG = {
   subject: 'предмет',
   theme: 'урок',
}

export default function DeleteMaterial({ type, subjectHref, themeHref, callback }: Props) {
   const dispatch = useAppDispatch()

   const deleteMaterial = () => {
      dispatch(
         createFetch({ api: `materials/delete/${type}`, data: { subjectHref, themeHref } })
      ).then(({ payload }) => {
         if (!payload) return

         dispatch(
            notificationShow({
               type: 'success',
               message: 'Удаление успешно',
            })
         )

         callback?.(payload)
         dispatch(modalHide())
      })
   }

   const hideModal = () => {
      dispatch(modalHide())
   }

   return (
      <div className="flex flex-col">
         <p className="mt-1 text-center text-lg">Вы уверены удалить {RUS_LANG[type]}?</p>
         <div className="mx-auto my-3 flex gap-3">
            <Button className="bg-red" onClick={deleteMaterial}>
               Да
            </Button>
            <Button className="bg-green text-black" onClick={hideModal}>
               Нет
            </Button>
         </div>
      </div>
   )
}
