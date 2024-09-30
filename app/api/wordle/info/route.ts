import { MS_IN_DAY, WORDLE_ROWS } from '../../../../helpers/constants'
import Logger from '../../../../logger'
import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   USER_NOT_FOUND,
   createData,
   createError,
   getUserId,
   openDB,
} from '../../../../mongoDB/general'
import User from '../../../../mongoDB/models/user'
import Wordle from '../../../../mongoDB/models/wordle'
import { getRows } from '../functions'

/**
 * Получение инфы о игре пользака
 * @return {
 *   status?: "noGame,
 *   gameState: {
 *      lastGame: Date,
 *   },
 *   texts,
 * }
 */
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

      const userWordle = user.get('wordle')
      const userWordleId = userWordle.id
      const lastGame = userWordle.lastGame

      // Если не было ни одной игры, то ставим доступное время, чтобы можно было начать игру
      // не менять на !userWordle, т.к. в случае отсутствия wordle у пользака, вернёт пустой объект
      if (!Object.keys(userWordle).length) {
         const accessLastGame = new Date()
         accessLastGame.setDate(accessLastGame.getDate() - 1)

         return Response.json(
            await createData({
               status: 'noGame',
               gameState: { lastGame: accessLastGame },
            })
         )
      }

      // Если последняя игра была удалена (определяется по пустому id)
      if (!userWordleId) {
         return Response.json(
            await createData({
               status: 'noGame',
               gameState: { lastGame: userWordle.lastGame },
            })
         )
      }

      // Если с последней игры прошло 24 часа
      if (new Date() > new Date(lastGame.getTime() + MS_IN_DAY)) {
         await Wordle.deleteOne({ _id: userWordleId })
         await User.updateOne({ _id: user_id }, { wordle: { ...userWordle, id: '', lastGame } })

         return Response.json(
            await createData({
               status: 'noGame',
               gameState: { lastGame },
            })
         )
      }

      // Если есть активная игра
      const wordle = await Wordle.findOne({ _id: userWordleId })
      if (!wordle) {
         return Response.json(await createError('Не нашли вашу игру'))
      }

      const rows = wordle.get('rows')
      const randomWord = wordle.get('randomWord')

      const win = rows.includes(randomWord)
      const gameRun = win ? false : rows.length < WORDLE_ROWS

      return Response.json(
         await createData({
            gameState: { win, gameRun, id: userWordleId, lastGame },
            texts: getRows(rows, randomWord),
         })
      )
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/wordle/info', { _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
