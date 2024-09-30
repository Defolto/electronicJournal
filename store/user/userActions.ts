import { createFetch } from '../../helpers/createFetch'
import { checkFileSize } from '../../helpers/functions'
import { ICustomization, IThemeColors } from '../../types'
import { notificationShow } from '../notifications/notificationsSlice'
import { sidePanelAdd } from '../sidePanelSlice'
import { AppThunk } from '../store'
import { themeChanged, toolbarChanged, userPersonalizationChanged } from './userSlice'

function userThemeUpdated(theme: IThemeColors): AppThunk {
   return (dispatch) => {
      dispatch(themeChanged(theme))
      Object.entries(theme).forEach(([key, value]) => {
         document.body.style.setProperty(key, value)
      })
      dispatch(
         notificationShow({
            type: 'success',
            message: 'Тема применена',
         })
      )
   }
}

function userToolbarUpdated(value: boolean): AppThunk {
   return (dispatch) => {
      dispatch(toolbarChanged(value))
   }
}

export function updateUserCustomization(customization: ICustomization): AppThunk {
   return (dispatch, getState) => {
      const newCustomization = Object.assign({}, getState().user.customization ?? {}, customization)

      dispatch(
         createFetch({
            api: 'user/update',
            data: {
               data: {
                  customization: newCustomization,
               },
            },
         })
      ).then(({ payload }) => {
         if (!payload) return

         if (Object.hasOwn(customization, 'isShortToolbar')) {
            dispatch(userToolbarUpdated(!!customization.isShortToolbar))
         }
         if (Object.hasOwn(customization, 'theme') && customization.theme) {
            dispatch(userThemeUpdated(customization.theme))
         }
      })
   }
}

export function uploadUserFile(file: File, type: 'avatar' | 'background'): AppThunk {
   return (dispatch, getState) => {
      const checkSize = checkFileSize(type, file.size)
      if (checkSize !== 'ok') {
         dispatch(
            notificationShow({
               type: 'error',
               message: checkSize,
            })
         )
         return
      }

      const avatar = new FormData()

      avatar.set('file', file as Blob)
      avatar.set('type', type)

      fetch('/api/user/uploadFile', {
         method: 'POST',
         body: avatar,
      }).then(async (res) => {
         const resFetch = await res.json()
         const newPersonalization = { ...getState().user.personalization, [type]: resFetch.data }

         dispatch(userPersonalizationChanged(newPersonalization))
         dispatch(
            notificationShow({
               type: 'success',
               message: 'Файл загружен',
            })
         )
      })
   }
}

export function openCardParticipant(login: string | undefined): AppThunk {
   return (dispatch) => {
      if (!login) {
         return
      }

      const data = { login }

      dispatch(createFetch({ api: 'user/getOne', data })).then(({ payload }) => {
         if (!payload) return

         dispatch(
            sidePanelAdd({
               name: 'AlienProfile',
               props: { user: { ...payload.user }, groupsInfo: payload.groups },
               className: 'w-2/3',
               id: crypto.randomUUID(),
            })
         )
      })
   }
}
