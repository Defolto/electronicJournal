import {
   BACKEND_ERROR,
   createData,
   createError,
   getUserId,
   openDB,
   USER_NOT_FOUND,
} from 'mongoDB/general'
import Candidate from 'mongoDB/models/candidate'
import User from 'mongoDB/models/user'
import { IUser } from 'types'
import { DEFAULT_THEME } from '../../../../helpers/constants'
import Logger from '../../../../logger'

type IConfirmUser = {
   code: string
   id: string
}

/**
 * Ищем кандидата в БД и проверяем правильность проверочного кода, который был отправлен с фронта
 * @return приватный id + id класса
 */
export async function POST(req: Request) {
   // на функцию getUserId() не заменять, это другой id в куках!!!
   const { code, id } = (await req.json()) as IConfirmUser
   let candidate = null
   let newUser: IUser | null = null

   try {
      await openDB()

      candidate = await Candidate.findOne({ _id: id })
      if (!candidate) {
         return Response.json(await USER_NOT_FOUND)
      }

      const confirmCode = candidate.get('confirmCode')
      if (confirmCode !== code) {
         return Response.json(await createError('Неправильный проверочный код'))
      }

      newUser = {
         login: candidate.get('login'),
         email: candidate.get('email'),
         password: candidate.get('password'),
         info: {
            name: candidate.get('info').name,
            surname: candidate.get('info').surname,
         },
         money: 0,
         role: 'guest',
         thanks: 0,
         publicId: '' + new Date().getTime() + '-' + crypto.randomUUID(),
         customization: {
            isShortToolbar: false,
            theme: DEFAULT_THEME,
         },
         verifying: false,
      }

      const user = new User(newUser)
      await user.save()
      await Candidate.deleteOne({ _id: id })

      return Response.json(await createData(user.get('_id')))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/confirm', {
         code,
         id,
         candidate,
         newUser,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
