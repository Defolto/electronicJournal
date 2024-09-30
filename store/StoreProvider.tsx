'use client'

import React from 'react'
import { Provider } from 'react-redux'
import Modal from '../components/features/Modal/Modal'
import Notifications from '../components/features/Notifications'
import PreJoin from '../components/features/PreJoin'
import SidePanel from '../components/features/SidePanel/SidePanel'
import { store } from './store'

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
   return (
      <Provider store={store}>
         <SidePanel />
         <Notifications />
         <Modal />
         <PreJoin />
         {children}
      </Provider>
   )
}
