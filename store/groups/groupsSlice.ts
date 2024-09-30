'use client'
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IGroup } from 'types'
import { RootState } from '../store'

const groupsAdapter = createEntityAdapter<IGroup>()
const initialState = groupsAdapter.getInitialState()

export const groupsSlice = createSlice({
   name: 'groups',
   initialState,
   reducers: {
      initGroups: (state, action: PayloadAction<IGroup[]>) => {
         groupsAdapter.upsertMany(state, action.payload)
      },
   },
})

const { selectAll } = groupsAdapter.getSelectors((state: RootState) => state.groups)

export const selectMassGroups = createSelector(selectAll, (items) => {
   return items
})

export const { initGroups } = groupsSlice.actions

export default groupsSlice.reducer
