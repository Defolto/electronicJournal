import { BACKEND_ERROR, createData, getUserId, openDB } from 'mongoDB/general'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'

/**
 * Получение списка классов классе
 */
export async function POST() {
   try {
      await openDB()

      const groups = await Group.find()

      return Response.json(await createData(groups))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/getList', { _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
