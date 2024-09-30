import {
   BACKEND_ERROR,
   createData,
   createError,
   getUserId,
   openDB,
   USER_NOT_FOUND,
} from 'mongoDB/general'
import { default as User } from 'mongoDB/models/user'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'

type JSON = {
   login: string
   email: string
}

/**
 * Ищем пользака по логину/почте
 * @return ПУБЛИЧНУЮ инфу о пользаке + инфу о его классе
 */
export async function POST(req: Request) {
   const { login, email } = (await req.json()) as JSON

   // Если передали почту или логин, значит нужна инфа не о себе. Иначе берём свой айди из куки
   const _id = login || email ? undefined : getUserId()
   if (!_id && !login && !email) {
      return Response.json(await createError('Нет данных для поиска'))
   }

   let group: any = null
   let user: any = null

   try {
      await openDB()
      user = await User.findOne({ $or: [{ login }, { email }, { _id }] })

      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      const groups = await Group.find({ _id: { $in: user.get('groups') } })

      const dataUser = user.toJSON()
      return Response.json(
         await createData({
            user: dataUser,
            groups,
         })
      )
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/getOne', { login, email, _id, user, group })
      return Response.json(await BACKEND_ERROR)
   }
}
