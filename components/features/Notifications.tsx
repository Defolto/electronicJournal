import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { notificationHide, notificationHideAll } from '../../store/notifications/notificationsSlice'
import Cross from '../icons/Cross'

const MAX_NOTIFICATIONS = 3

export default function Notifications() {
   const dispatch = useAppDispatch()
   const { list, position } = useAppSelector((state) => state.notifications)

   const hideAll = () => dispatch(notificationHideAll())

   return (
      <div
         className={clsx(
            'fixed bottom-0 right-0 z-20 flex flex-col gap-2 p-2',
            position === 'top-left' && 'left-0 top-0',
            position === 'top-right' && 'right-0 top-0',
            position === 'bottom-left' && 'bottom-0 left-0',
            position === 'bottom-right' && 'bottom-0 right-0'
         )}
      >
         {list
            .toReversed()
            .slice(0, MAX_NOTIFICATIONS)
            .map((notification) => {
               return (
                  <div
                     className={clsx(
                        'relative w-[350px] animate-[slideInLeft_0.1s_ease-in-out_forwards] rounded-md bg-secondBg p-4 shadow-md',
                        notification.type === 'error' && '!bg-red',
                        notification.type === 'success' && '!bg-green !text-black',
                        notification.type === 'info' && '!bg-blue'
                     )}
                     key={notification.message}
                  >
                     <div
                        className="absolute right-1.5 top-1.5 h-3 w-3 cursor-pointer"
                        onClick={() => dispatch(notificationHide(notification))}
                     >
                        <Cross className="h-full w-full" />
                     </div>

                     {notification.message}
                  </div>
               )
            })}
         {list.length > MAX_NOTIFICATIONS && (
            <div
               className="cursor-pointer rounded-md bg-secondBg px-4 py-2 text-center"
               onClick={hideAll}
            >
               Закрыть все
            </div>
         )}
      </div>
   )
}
