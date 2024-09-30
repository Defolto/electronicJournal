import { BACKEND_ERROR, createData, getUserId, GROUP_NOT_FOUND, openDB } from 'mongoDB/general'
import Group from 'mongoDB/models/group'
import Logger from '../../../../logger'

type IJson = {
   id: string
}

/**
 * Получение инфы о классе
 * @return вернёт инфу о классе
 */
export async function POST(req: Request) {
   const { id } = (await req.json()) as IJson

   try {
      await openDB()

      const group = await Group.findOne({ _id: id })
      if (!group) {
         return Response.json(await GROUP_NOT_FOUND)
      }

      return Response.json(await createData(group))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/getInfo', { id, _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
