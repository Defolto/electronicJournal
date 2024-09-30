'use client'
import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { IComponentModal } from '../components/features/Modal/Modal'

export type IModal = {
   name: IComponentModal | null
   props?: Record<string, any>
   className?: string
   canClose?: boolean
}

const initData: IModal = { name: null }
const initialState: IModal = initData

export const modalSlice = createSlice({
   name: 'modal',
   initialState,
   reducers: {
      modalShow: (state, action: PayloadAction<IModal>) => {
         state.name = action.payload.name
         state.props = action.payload.props
         state.className = action.payload.className
         state.canClose = action.payload.canClose
      },

      modalHide: (state) => {
         state.name = null
         state.props = {}
         state.className = ''
         state.canClose = true;
      },
   },
})

export const { modalShow, modalHide } = modalSlice.actions

export default modalSlice.reducer
