import { getRandom } from 'helpers/functions'
import { BACKEND_ERROR, createData, createError, getUserId, openDB } from 'mongoDB/general'
import Candidate from 'mongoDB/models/candidate'
import { ICandidate } from 'types'
import { sendMail } from '../../../../components/features/Nodemailer/functions'
import Logger from '../../../../logger'
import User from '../../../../mongoDB/models/user'

type IUserCreated = {
   name: string
   surname: string
   email: string
   login: string
   password: string
}

function createCode(size: number) {
   let code = ''
   for (let i = 0; i < size; i++) {
      code += getRandom(0, 9)
   }

   return code
}

/**
 * Получаем данные и создаём КАНДИДАТА, чтобы не засорять коллекцию пользаков
 * @mark после user/confirm кандидат будет удалён и создастся нормальный пользак
 * @return приватный id кандидата (на фронте сохраним в куки)
 */
export async function POST(req: Request) {
   const { name, email, surname, password, login } = (await req.json()) as IUserCreated
   let userCheck = null
   let candidate: ICandidate | null = null

   try {
      await openDB()

      userCheck = await User.findOne({ $or: [{ login }, { email }] })

      if (userCheck) {
         const reasonError = userCheck.get('login') === login ? 'таким логином' : 'такой почтой'
         return Response.json(
            await createError(`Ошибка! Пользователь с ${reasonError} уже существует`)
         )
      }

      const confirmCode = createCode(4)
      candidate = {
         login,
         email,
         password,
         confirmCode,
         info: {
            name,
            surname,
         },
      }

      const newUser = new Candidate(candidate)
      await newUser.save()

      await sendMail('ConfirmCodeEmail', email, { confirmCode })

      return Response.json(await createData(newUser.get('_id')))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/create', {
         name,
         email,
         surname,
         password,
         login,
         userCheck,
         candidate,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
