import { createFetch } from '../../helpers/createFetch'
import { checkFileSize } from '../../helpers/functions'
import { IGroup } from '../../types'
import { notificationShow } from '../notifications/notificationsSlice'
import { sidePanelAdd } from '../sidePanelSlice'
import { AppThunk } from '../store'

export function openCardGroup(id: string | undefined, group: IGroup | undefined): AppThunk {
   return (dispatch) => {
      if (!id && !group) {
         return
      }

      // Если передали всю инфу о классе
      if (group) {
         dispatch(
            sidePanelAdd({
               name: 'ProfileGroup',
               props: { ...group },
               className: 'w-1/3',
               id: crypto.randomUUID(),
            })
         )
         return
      }

      const data = { id }

      dispatch(createFetch({ api: 'group/getInfo', data })).then(({ payload }) => {
         if (!payload) return

         dispatch(
            sidePanelAdd({
               name: 'ProfileGroup',
               props: { ...payload },
               className: 'w-1/3',
               id: crypto.randomUUID(),
            })
         )
      })
   }
}

export function uploadGroupFile(
   file: File,
   type: 'avatar' | 'background',
   group: IGroup
): AppThunk {
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
      avatar.set('id', group.id)

      fetch('/api/group/uploadFile', {
         method: 'POST',
         body: avatar,
      }).then((res) => {
         dispatch(
            notificationShow({
               type: 'success',
               message: 'Файл загружен',
            })
         )
      })
   }
}
