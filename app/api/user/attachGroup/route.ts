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

      // не крепим два раза одного и того же пользака в один и тот же класс
      if (oldIdGroups.includes(groupId)) {
         return Response.json(await createError('Пользователь уже привязан к этому классу'))
      }

      // гостей не привязываем к классам
      if (user.role === 'guest') {
         return Response.json(
            await createError('Неподтверждённый аккаунт не может быть привязан к классу')
         )
      }

      // студент не может быть привязан к более чем 1 классу
      if (user.role === 'student' && oldIdGroups.length > 0) {
         return Response.json(
            await createError('Ученик не может быть привязан к более чем 1 классу')
         )
      }

      await User.updateOne({ login: userLogin }, { groups: [...oldIdGroups, groupId] })

      const newGroup = await Group.findOne({ _id: groupId })
      const users = [...newGroup.users, user.get('publicId')]
      await Group.updateOne({ _id: groupId }, { users })

      return Response.json(await createData('OK'))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/attachGroup', {
         userLogin,
         groupId,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
