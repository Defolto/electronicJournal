import { MS_IN_DAY } from '../../../../helpers/constants'
import { isVerifiedUser } from '../../../../helpers/functions'
import Logger from '../../../../logger'
import {
   BACKEND_ERROR,
   closeDB,
   createData,
   createError,
   getUserId,
   ID_NOT_FOUND,
   NOT_VERIFIED_USER,
   openDB,
   USER_NOT_FOUND,
} from '../../../../mongoDB/general'
import User from '../../../../mongoDB/models/user'
import Wordle from '../../../../mongoDB/models/wordle'
import { IWordle } from '../../../../types'
import { getRandomWord } from '../functions'

export async function POST() {
   try {
      await openDB()

      const user_id = getUserId()
      if (!user_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const user = await User.findOne({ _id: user_id })
      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      const verifiedUser = isVerifiedUser(user)
      if (!verifiedUser) {
         await closeDB()
         return Response.json(await NOT_VERIFIED_USER)
      }

      const userWordle = user.get('wordle')
      const lastGame = userWordle.lastGame

      if (lastGame && new Date() <= new Date(lastGame.getTime() + MS_IN_DAY)) {
         return Response.json(await createError('С последней игры не прошло 24 часа'))
      }

      const wordleSchema: IWordle = {
         randomWord: getRandomWord(),
         rows: [],
      }

      const wordle = new Wordle(wordleSchema)
      await wordle.save()

      await User.updateOne(
         { _id: user_id },
         {
            wordle: {
               ...userWordle,
               id: wordle.get('_id'),
               lastGame: new Date().getTime(),
            },
         }
      )

      return Response.json(await createData(wordle.get('_id')))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/wordle/init', { _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
