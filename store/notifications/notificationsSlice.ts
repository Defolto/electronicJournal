'use client'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

type INotification = {
   message: string
   type?: 'error' | 'success' | 'info'
}

export type INotifications = {
   list: INotification[]
   position: 'top-left' | 'bottom-right' | 'bottom-left' | 'top-right'
}

const initData: INotifications = { list: [], position: 'bottom-right' }
const initialState: INotifications = initData

export const notificationsSlice = createSlice({
   name: 'notifications',
   initialState,
   reducers: {
      notificationShow: (state, action: PayloadAction<INotification>) => {
         const doubleNotification = state.list.find((n) => n.message === action.payload.message)
         if (doubleNotification) {
            return
         }

         state.list.push(action.payload)
      },

      notificationHide: (state, action: PayloadAction<INotification>) => {
         const index = state.list.findIndex(
            (item: INotification) => item.message === action.payload.message
         )

         if (index == -1) {
            return
         }

         state.list.splice(index, 1)
      },
      notificationHideAll: (state) => {
         state.list = []
      },
   },
})

export const { notificationShow, notificationHide, notificationHideAll } =
   notificationsSlice.actions

export default notificationsSlice.reducer
