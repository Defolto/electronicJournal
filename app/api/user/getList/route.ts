import { BACKEND_ERROR, createData, getUserId, openDB } from 'mongoDB/general'
import Logger from '../../../../logger'
import User from '../../../../mongoDB/models/user'

export async function POST(req: Request) {
   try {
      await openDB()

      const users = await User.find()

      users.forEach((user) => {
         delete user.id
      })

      return Response.json(await createData(users))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/getList', { _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
