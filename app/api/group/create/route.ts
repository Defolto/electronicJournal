import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   SMALL_ROLE,
   checkRights,
   closeDB,
   createData,
   getUserId,
   openDB,
} from 'mongoDB/general'
import Group from 'mongoDB/models/group'
import { ROLES } from '../../../../helpers/constants'
import Logger from '../../../../logger'
import { IGroup } from '../../../../types'

type IJson = {
   name: string
   number: number
}

/**
 * Создание класса
 * @mark создавать классы может только админ
 * @return вернёт инфу о новом классе
 */
export async function POST(req: Request) {
   const { name, number } = (await req.json()) as IJson

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

      const newGroup: Partial<IGroup> = {
         name,
         number,
         users: [],
         leader: '',
         headman: '',
         money: 0,
         avatar: '',
         status: '',
      }

      const group = new Group(newGroup)
      await group.save()

      await closeDB()
      return Response.json(await createData(newGroup))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/create', { name, number, _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
