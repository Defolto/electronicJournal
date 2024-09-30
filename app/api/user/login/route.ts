import { BACKEND_ERROR, createData, getUserId, openDB, USER_NOT_FOUND } from 'mongoDB/general'
import User from 'mongoDB/models/user'
import Logger from '../../../../logger'

type IUser = {
   login: string
   email: string
   password: string
}

/**
 * Ищем пользака по логину/почте и паролю
 * @return приватный id + id класса (на фронте сохраним в куки)
 */
export async function POST(req: Request) {
   const { login, email, password } = (await req.json()) as IUser
   let user = null

   try {
      await openDB()
      user = await User.findOne({
         $or: [{ login }, { email }],
         password,
      })

      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      return Response.json(
         await createData({
            userId: user.get('_id'),
            groupsId: user.get('groups'),
         })
      )
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/login', {
         login,
         email,
         password,
         user,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
