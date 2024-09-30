import { AppMiddleware } from '../store'
import { notificationHide, notificationShow } from './notificationsSlice'

const NOTIFICATION_TIMEOUT = 5000

const middleware: AppMiddleware = (api) => (next) => (action) => {
   const { dispatch } = api
   const res = next(action)

   if (notificationShow.match(action)) {
      setTimeout(() => {
         dispatch(notificationHide(action.payload))
      }, NOTIFICATION_TIMEOUT)
   }

   return res
}

export default middleware
