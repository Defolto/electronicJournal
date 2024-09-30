import {
   BACKEND_ERROR,
   GROUP_NOT_FOUND,
   ID_NOT_FOUND,
   SMALL_ROLE,
   checkRights,
   createData,
   createError,
   getUserId,
   openDB,
} from 'mongoDB/general'
import { ROLES } from '../../../../helpers/constants'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'

type IJson = {
   post: 'headman' | 'leader'
   publicId: string
   groupId: string
}

/**
 * Присвоение классу руководителя или старосты
 * @return "ок" если всё успешно
 */
export async function POST(req: Request) {
   const { post, publicId, groupId } = (await req.json()) as IJson

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

      const group = await Group.findOne({ _id: groupId })
      if (!group) {
         return Response.json(await GROUP_NOT_FOUND)
      }

      const hasUserInGroup = group?.users.includes(publicId)
      if (!hasUserInGroup) {
         return Response.json(await createError('Пользователь не привязан к данному классу'))
      }

      await Group.updateOne({ _id: groupId }, { [post]: publicId })

      return Response.json(await createData('ok'))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/selectMains', {
         post,
         publicId,
         groupId,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
