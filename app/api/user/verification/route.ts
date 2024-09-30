import {
   BACKEND_ERROR,
   checkRights,
   createData,
   getUserId,
   ID_NOT_FOUND,
   openDB,
   SMALL_ROLE,
} from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { sendMail } from '../../../../components/features/Nodemailer/functions'
import { ROLES } from '../../../../helpers/constants'
import Logger from '../../../../logger'
import { IRole } from '../../../../types'

type JSON = {
   login: string
   role: IRole
}

/**
 * Верификация пользака
 * @mark задаётся роль и verifying=false
 * @return слово 'ok' если всё успешно
 */
export async function POST(req: Request) {
   const { login, role } = (await req.json()) as JSON

   try {
      await openDB()

      const _id = getUserId()
      if (!_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const isAdmin = await checkRights(_id, ROLES.admin)
      if (!isAdmin) {
         return Response.json(await SMALL_ROLE)
      }

      await User.updateOne({ login }, { verifying: false, role })
      const user = await User.findOne({ login })

      await sendMail('VerificationUser', user.email, {})
      return Response.json(await createData('ok'))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/verification', { login, _id: getUserId(), role })
      return Response.json(await BACKEND_ERROR)
   }
}
