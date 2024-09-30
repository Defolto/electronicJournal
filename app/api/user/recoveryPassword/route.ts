import { BACKEND_ERROR, createData, getUserId, openDB, USER_NOT_FOUND } from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { sendMail } from '../../../../components/features/Nodemailer/functions'
import Logger from '../../../../logger'

type IUser = {
   login: string
   email: string
}

/**
 * Ищем пользака и отправляем ему на почту пароль
 * @return текст для алерта
 */
export async function POST(req: Request) {
   const { login, email } = (await req.json()) as IUser
   let user = null

   try {
      await openDB()
      user = await User.findOne({
         $or: [{ login }, { email }],
      })
      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      await sendMail('RecoveryPassword', user.email, { password: user.password })
      return Response.json(await createData(`Пароль отправлен на почту ${user.email}`))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/recoveryPassword', {
         login,
         email,
         user,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
