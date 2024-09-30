import { configureStore } from '@reduxjs/toolkit'
import { AnyAction, Middleware } from 'redux'
import { ThunkAction } from 'redux-thunk'
import groups from './groups/groupsSlice'
import modal from './modalSlice'
import notifications from './notifications/notificationsSlice'
import rootMiddleware from './rootMiddleware'
import sidePanel from './sidePanelSlice'
import timerWidget from './timerWidgetSlice'
import user from './user/userSlice'

export const store = configureStore({
   reducer: {
      user,
      sidePanel,
      notifications,
      modal,
      groups,
      timerWidget,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
         serializableCheck: false,
      }).concat(rootMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void, ExtraThunkArg = unknown> = ThunkAction<
   ReturnType,
   RootState,
   ExtraThunkArg,
   AnyAction
>
export type AppMiddleware = Middleware<AppThunk, RootState, AppDispatch>
