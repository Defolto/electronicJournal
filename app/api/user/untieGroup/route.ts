import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   SMALL_ROLE,
   checkRights,
   createData,
   createError,
   getUserId,
   openDB,
} from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { ROLES } from '../../../../helpers/constants'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'

type JSON = {
   userLogin: string
   groupId: string
}

/**
 * Привязать пользователя к классу
 * @return вернёт "ок", если всё хорошо
 */
export async function POST(req: Request) {
   const { userLogin, groupId } = (await req.json()) as JSON

   try {
      await openDB()

      const user_id = getUserId()
      if (!user_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const isAdmin = await checkRights(user_id, ROLES.admin)
      if (!isAdmin) {
         return Response.json(await SMALL_ROLE)
      }

      const user = await User.findOne({ login: userLogin })

      const oldIdGroups = user.get('groups') ?? []
      const publicIdUser = user.get('publicId')

      // Не открепляем пользователя, если он не привязан к этому классу
      if (!oldIdGroups.includes(groupId)) {
         return Response.json(await createError('Пользователь не привязан к этому классу'))
      }

      // Открепляем класс у пользователя
      const newGroups = oldIdGroups.filter((group: any) => group !== groupId)
      await User.updateOne({ login: userLogin }, { groups: newGroups })

      // Удаляем пользователя из класса + удаляем headman или leader, если они там были
      const group = await Group.findOne({ _id: groupId })
      const groupCopy = group.toJSON()
      if (groupCopy.headman === publicIdUser) {
         groupCopy.headman = ''
      }
      if (groupCopy.leader === publicIdUser) {
         groupCopy.leader = ''
      }
      groupCopy.users = groupCopy.users.filter((publicId: string) => publicId !== publicIdUser)
      await Group.updateOne({ _id: groupId }, { ...groupCopy })

      return Response.json(await createData('OK'))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/untieGroup', {
         userLogin,
         groupId,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
