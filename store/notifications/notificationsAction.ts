import { NOT_VERIFIED_USER_TEXT } from '../../helpers/constants'
import { AppThunk } from '../store'
import { notificationShow } from './notificationsSlice'

export function notVerifiedUser(): AppThunk {
   return (dispatch, getState) => {
      if (getState().user.verifying) {
         dispatch(
            notificationShow({
               message:
                  'Ваш аккаунт всё ещё на верификации. Пожалуйста дождитесь подтверждения от администратора',
               type: 'error',
            })
         )
         return
      }

      dispatch(
         notificationShow({
            message: NOT_VERIFIED_USER_TEXT,
            type: 'error',
         })
      )
   }
}

export function successfulOperation(): AppThunk {
   return (dispatch) => {
      dispatch(
         notificationShow({
            message: 'Операция успешна',
            type: 'success',
         })
      )
   }
}
