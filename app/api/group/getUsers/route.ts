import { BACKEND_ERROR, createData, getUserId, GROUP_NOT_FOUND, openDB } from 'mongoDB/general'
import User from 'mongoDB/models/user'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'
import { IUser, IUserGroup } from '../../../../types'

type IJson = {
   id: string
}

type IReturn = {
   leader: null | IUserGroup
   headman: null | IUserGroup
   users: IUserGroup[]
}

function parseUser(user: IUser): IUserGroup {
   return {
      info: user.info,
      login: user.login,
      publicId: user.publicId,
      personalization: user.personalization,
   }
}

/**
 * Получение инфы о пользователях класса
 * @return IReturn
 */
export async function POST(req: Request) {
   const { id } = (await req.json()) as IJson

   try {
      await openDB()

      const group = await Group.findOne({ _id: id })
      if (!group) {
         return Response.json(await GROUP_NOT_FOUND)
      }

      const leaderId = group.get('leader')
      const headmanId = group.get('headman')

      const leader = leaderId ? await User.findOne({ publicId: leaderId }) : null
      const headman = headmanId ? await User.findOne({ publicId: headmanId }) : null
      const users = await User.find({ publicId: { $in: group.get('users') } })

      const result: IReturn = {
         leader: leader ? parseUser(leader) : null,
         headman: headman ? parseUser(headman) : null,
         users: users.map(parseUser),
      }

      return Response.json(await createData(result))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/getUsers', { id, _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
