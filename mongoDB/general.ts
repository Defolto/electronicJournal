import * as mongoose from 'mongoose'
import { cookies } from 'next/headers'
import { deleteFile, existFile, writeFile } from '../helpers/apiFiles'
import {
   BACKEND_ERROR_TEXT,
   ID_NOT_FOUND_TEXT,
   NOT_VERIFIED_USER_TEXT,
   ROLES,
   SMALL_ROLE_TEXT,
} from '../helpers/constants'
import { getRelativeFileSrc } from '../helpers/functions'
import { IHistory, IRole } from '../types'
import History from './models/history'
import User from './models/user'

const LOCAL_URL_MONGO_DB = `mongodb://127.0.0.1:27017/helpFront`
const REMOTE_URL_MONGO_DB = `mongodb://${process.env.DBUSER}:${process.env.DBPASS}@${process.env.DBHOST}/${process.env.DBNAME}?replicaSet=MongoReplica`

let activeConnects = 0

type IResponse = {
   data?: any
   error?: string
}

export function isProduction() {
   return process.env.NODE_ENV === 'production'
}

export function getStartPath(): string {
   return isProduction() ? `${process.env.HOME}/www` : `${process.cwd()}/public`
}

/**
 * Открытие соединения с БД
 */
export async function openDB(): Promise<boolean> {
   activeConnects += 1
   if (activeConnects > 2) {
      return false
   }

   const isProd = isProduction()
   await mongoose.connect(!isProd ? LOCAL_URL_MONGO_DB : REMOTE_URL_MONGO_DB)
   return true
}

/**
 * Закрытие соединения с БД
 */
export async function closeDB(): Promise<boolean> {
   if (!activeConnects) {
      return false
   }

   activeConnects -= 1
   if (activeConnects > 0) {
      return false
   }

   await mongoose.connections[0].close()
   return true
}

export async function createError(text: string): Promise<IResponse> {
   await closeDB()

   return {
      error: text,
   }
}

export async function createData(data: any): Promise<IResponse> {
   await closeDB()

   return {
      data: data,
   }
}

export function getUserId(): string | undefined {
   return cookies().get('user_id')?.value
}

export async function changeBalanceUser(history: IHistory, changedUser?: any): Promise<boolean> {
   let user

   if (changedUser) {
      user = changedUser
   } else {
      user = await User.findOne({ _id: history.to })
   }

   if (!history.from) {
      // Если from не передан, то он автоматически становится системным
      history.from = 'system'
   } else {
      const fromUser = await User.findOne({ _id: history.from })
      const newMoney = fromUser.get('money') + history.value * -1
      if (newMoney < 0) {
         return false
      }

      await User.updateOne({ _id: history.from }, { money: newMoney })
   }

   const newMoney = user.get('money') + history.value
   if (newMoney < 0) {
      return false
   }

   history.date = new Date()

   await User.updateOne({ _id: history.to }, { money: newMoney })

   const newHistory = new History(history)
   await newHistory.save()
   return true
}

export async function checkRights(user_id: string | undefined, minRole: ROLES) {
   if (!user_id) {
      return false
   }

   try {
      await openDB()
      const user = await User.findOne({ _id: user_id })
      await closeDB()

      const role: IRole = user.role
      return ROLES[role] >= minRole
   } catch (e) {
      return false
   }
}

export async function uploadFile(file: File, newFilename: string, oldFilename?: string) {
   const buffer = Buffer.from(await file.arrayBuffer())

   if (oldFilename) {
      const relativePath = getRelativeFileSrc(oldFilename)

      if (await existFile(oldFilename)) {
         await deleteFile(relativePath)
      }
   }

   await writeFile(newFilename, buffer)
}

export const USER_NOT_FOUND = createError('Пользователь не найден')
export const GROUP_NOT_FOUND = createError('Класс не найден')
export const SUBJECT_NOT_FOUND = createError('Предмет не найден')
export const ID_NOT_FOUND = createError(ID_NOT_FOUND_TEXT)
export const BACKEND_ERROR = createError(BACKEND_ERROR_TEXT)
export const SMALL_ROLE = createError(SMALL_ROLE_TEXT)
export const NOT_VERIFIED_USER = createError(NOT_VERIFIED_USER_TEXT)
