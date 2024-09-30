'use client'
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IComponentAsidePanel } from '../components/features/SidePanel/SidePanel'
import { RootState } from './store'

export type ISidePanel = {
   id: string
   name: IComponentAsidePanel
   props?: Record<string, any>
   className?: string
}

const sidePanelAdapter = createEntityAdapter<ISidePanel>()
const initialState = sidePanelAdapter.getInitialState()

export const sidePanelSlice = createSlice({
   name: 'sidePanel',
   initialState,
   reducers: {
      sidePanelAdd: (state, action: PayloadAction<ISidePanel>) => {
         sidePanelAdapter.upsertOne(state, action.payload)
      },

      sidePanelRemove: (state, action: PayloadAction<ISidePanel>) => {
         sidePanelAdapter.removeOne(state, action.payload.id)
      },

      sidePanelClear: (state) => {
         const currentIds = state.ids as string[]
         sidePanelAdapter.removeMany(state, currentIds)
      },
   },
})

const { selectAll } = sidePanelAdapter.getSelectors((state: RootState) => state.sidePanel)

export const selectLastSidePanel = createSelector(selectAll, (items) => {
   if (items.length > 0) {
      return items.slice(-1)[0]
   }

   return null
})

export const { sidePanelAdd, sidePanelRemove, sidePanelClear } = sidePanelSlice.actions

export default sidePanelSlice.reducer
