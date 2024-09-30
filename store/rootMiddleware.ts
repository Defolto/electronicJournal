import { Middleware } from '@reduxjs/toolkit'
import notificationsMiddleware from './notifications/notificationsMiddleware'

const rootMiddleware: Middleware[] = [notificationsMiddleware]
export default rootMiddleware
