/**
 * Создание фетч запроса
 */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { ALL_API } from 'app/api/names'
import { io } from 'socket.io-client'
import { notificationShow } from '../store/notifications/notificationsSlice'
import { BACKEND_ERROR_TEXT } from './constants'

export type IDataFetch = {
   data?: any
   error?: string
   notification?: string
}

type IFetch = {
   api: ALL_API
   data?: Record<string, any>
}

export const createFetch = createAsyncThunk<any, IFetch, { rejectValue: string }>(
   'fetch',
   async function (dataFetch, { dispatch, getState, rejectWithValue }) {
      const { api, data } = dataFetch

      const res = await fetch(`/api/${api}`, {
         headers: {
            'Content-Type': 'application/json',
         },
         method: 'POST',
         body: JSON.stringify({
            ...data,
         }),
      })

      if (res.status !== 200) {
         dispatch(notificationShow({ message: BACKEND_ERROR_TEXT, type: 'error' }))
         return null
      }

      const resFetch = (await res.json()) as IDataFetch
      if (resFetch.error) {
         dispatch(notificationShow({ message: resFetch.error, type: 'error' }))
         return null
      }

      if (resFetch.notification) {
         dispatch(notificationShow({ message: resFetch.notification, type: 'info' }))
      }

      return resFetch.data
   }
)

export async function createFetchWithoutRedux(
   api: ALL_API,
   data: Record<string, any>
): Promise<IDataFetch> {
   return fetch(`/api/${api}`, {
      headers: {
         'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
         ...data,
      }),
   }).then(async (res) => {
      if (res.status !== 200) {
         throw new Error('Общая ошибка сервера')
      }

      const data = (await res.json()) as IDataFetch
      if (data.error) {
         throw new Error(data.error)
      }

      return data
   })
}

export function createSocket() {
   return io({ autoConnect: false, withCredentials: false, transports: ['websocket'] })
}
