import {
   BACKEND_ERROR,
   createData,
   createError,
   getUserId,
   ID_NOT_FOUND,
   NOT_VERIFIED_USER,
   openDB,
   USER_NOT_FOUND,
} from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { isVerifiedUser } from '../../../../helpers/functions'
import Logger from '../../../../logger'

type IData = {
   data: Record<string, any>
}

const EXCLUDE_FIELD = [
   'publicId',
   'money',
   'collections',
   'thanks',
   'role',
   'achievements',
   'verifying',
   'group',
   'wordle',
]

/**
 * передаём объект с полями для замены в БД
 * @return "ok" если всё прошло успешно
 */
export async function POST(req: Request) {
   const { data } = (await req.json()) as IData

   try {
      await openDB()

      const _id = getUserId()
      if (!_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const user = await User.findOne({ _id })
      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      const verifiedUser = isVerifiedUser(user)
      if (!verifiedUser) {
         return Response.json(await NOT_VERIFIED_USER)
      }

      for (const key in data) {
         if (EXCLUDE_FIELD.includes(key)) {
            return Response.json(
               await createError('Передано поле, которое нельзя менять через этот api: ' + key)
            )
         }
      }

      await User.updateOne({ _id }, { ...data })

      return Response.json(await createData(data))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/update', { data, _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
