'use client'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface ITimerWidget {
   src: string
   volume: number
   status: boolean
   resume?: {
      lastedTime: number
      lastVisibleTime?: Date
   }
}

const initData: ITimerWidget = { src: 'needForSpeed', volume: 1, status: false }
const initialState: ITimerWidget = initData

export const timerWidgetSlice = createSlice({
   name: 'timerWidget',
   initialState,
   reducers: {
      changeSrcTimerWidget: (state, action: PayloadAction<string>) => {
         state.src = action.payload
         state.status = false
      },
      changeVolumeTimerWidget: (state, action: PayloadAction<number>) => {
         state.volume = action.payload
      },
      changeStatusTimerWidget: (state, action: PayloadAction<boolean>) => {
         state.status = action.payload
      },
      changeResumeTimerWidget: (state, action: PayloadAction<ITimerWidget['resume']>) => {
         state.resume = action.payload
      },
   },
})

export const {
   changeSrcTimerWidget,
   changeResumeTimerWidget,
   changeVolumeTimerWidget,
   changeStatusTimerWidget,
} = timerWidgetSlice.actions

export default timerWidgetSlice.reducer
