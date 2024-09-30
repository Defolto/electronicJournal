import { REWARD_5_LETTERS, WORDLE_ROWS } from '../../../../helpers/constants'
import { isVerifiedUser } from '../../../../helpers/functions'
import Logger from '../../../../logger'
import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   NOT_VERIFIED_USER,
   USER_NOT_FOUND,
   changeBalanceUser,
   createData,
   createError,
   getUserId,
   openDB,
} from '../../../../mongoDB/general'
import User from '../../../../mongoDB/models/user'
import Wordle from '../../../../mongoDB/models/wordle'
import { IAskWordle, IHistory, IWordle } from '../../../../types'
import { getColorsText, isWordInList } from '../functions'

type JSON = {
   word: string
   id: string
}

/**
 * Проверка слова, которое пришло с фронта
 * @return IAskWordle - инфа о введённом слове + стата игры
 */
export async function POST(req: Request) {
   const { word, id } = (await req.json()) as JSON

   try {
      await openDB()

      if (!isWordInList(word)) {
         return Response.json(await createError('Такого слова нет'))
      }

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
         return Response.json(await NOT_VERIFIED_USER)
      }

      const wordle: IWordle | null = await Wordle.findOne({ _id: id })
      if (!wordle) {
         return Response.json(await createError('Игра не найдена'))
      }

      if (wordle.rows.length > WORDLE_ROWS) {
         return Response.json(await createError('Игра закончилась'))
      }

      // добавляем новое слово в БД
      const rows = wordle.rows
      rows.push(word)
      await Wordle.updateOne({ _id: id }, { rows })

      // получаем статистику о игре после нового слова + инфу о новом слове
      const oldRandomWord = wordle.randomWord
      const colors = getColorsText(oldRandomWord, word)
      const win = oldRandomWord === word
      const gameRun = win ? false : wordle.rows.length < WORDLE_ROWS

      if (win) {
         const newHistory: IHistory = {
            to: user_id,
            value: REWARD_5_LETTERS,
            title: '5 букв',
            text: 'Приз за отгаданное слово',
         }
         const isBalanceChanged = await changeBalanceUser(newHistory, user)
         if (!isBalanceChanged) {
            return Response.json(await createError('Ошибка с балансом'))
         }
      }

      // подсчёт итогов, если игра закончилась
      const userWordle = user.get('wordle')
      if (!gameRun) {
         if (win) {
            userWordle.winGames = (userWordle.winGames ?? 0) + 1
            userWordle.recordWinGames = (userWordle.recordWinGames ?? 0) + 1

            const generalGames = (userWordle.winGames ?? 0) + (userWordle.loseGames ?? 0)
            userWordle.averageTrys = ((userWordle.averageTrys ?? 0) + rows.length) / generalGames

            // если дробное число, то округляем до десятых
            if (userWordle.averageTrys.toString().includes('.')) {
               userWordle.averageTrys = userWordle.averageTrys.toFixed(1)
            }
         } else {
            userWordle.loseGames = (userWordle.loseGames ?? 0) + 1
            userWordle.recordWinGames = 0
         }

         await User.updateOne({ _id: user_id }, { wordle: { ...userWordle } })
      }

      const toReturn: IAskWordle = {
         colors,
         win,
         gameRun,
         userWordle,
      }

      return Response.json(await createData(toReturn))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/wordle/ask', { word, id, _id: getUserId() })
      return Response.json(await BACKEND_ERROR)
   }
}
