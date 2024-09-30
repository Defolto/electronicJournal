'use client'
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DEFAULT_THEME } from '../../helpers/constants'
import { isVerifiedUser } from '../../helpers/functions'
import { IThemeName, IUser, IUserInfo, IUserPersonalization, IUserWordle } from '../../types'
import { RootState } from '../store'

const initialState: Omit<IUser, 'password'> = {
   login: '',
   info: {
      name: '',
      surname: '',
   },
   money: -1,
   thanks: -1,
   role: 'guest',
   publicId: '',
   email: '',
   verifying: false,
}

export const userSlice = createSlice({
   name: 'account',
   initialState,
   reducers: {
      initUser: (state, action: PayloadAction<IUser>) => {
         Object.assign(state, action.payload)

         // Если у пользака до сих пор нет темы
         if (state.customization && !state.customization.theme) {
            state.customization.theme = DEFAULT_THEME
         } else {
            // @ts-ignore
            Object.entries(state.customization.theme).forEach(([key, value]) => {
               document.body.style.setProperty(key, value)
            })
         }
      },
      toolbarChanged: (state, action: PayloadAction<boolean>) => {
         const customization = state.customization ?? {}
         customization.isShortToolbar = action.payload

         state.customization = customization
      },
      themeChanged: (state, action: PayloadAction<Record<IThemeName, string>>) => {
         const customization = state.customization ?? {}
         customization.theme = action.payload

         state.customization = customization
      },
      verifyingUserChanged: (state, action: PayloadAction<boolean>) => {
         state.verifying = action.payload
      },
      userInfoChanged: (state, action: PayloadAction<IUserInfo>) => {
         state.info = action.payload
      },
      userWordleChanged: (state, action: PayloadAction<IUserWordle>) => {
         state.wordle = action.payload
      },
      userMoneyChanged: (state, action: PayloadAction<number>) => {
         state.money = action.payload
      },
      userPersonalizationChanged: (state, action: PayloadAction<IUserPersonalization>) => {
         state.personalization = action.payload
      },
   },
})

export const selectVerifiedUser = createSelector(
   (state: RootState) => state.user,
   (item) => isVerifiedUser(item)
)

export const {
   initUser,
   userWordleChanged,
   userInfoChanged,
   toolbarChanged,
   themeChanged,
   verifyingUserChanged,
   userMoneyChanged,
   userPersonalizationChanged,
} = userSlice.actions

export default userSlice.reducer
