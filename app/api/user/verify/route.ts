import { BACKEND_ERROR, createData, getUserId, ID_NOT_FOUND, openDB } from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { sendMail } from '../../../../components/features/Nodemailer/functions'
import Logger from '../../../../logger'

type JSON = {
   name: string
   surname: string
   birthday: Date
}

/**
 * Послать запрос на подтверждение аккаунта
 * @mark обновляет инфу в БД, которую отправил пользак
 * @return слово 'ok' если всё успешно
 */
export async function POST(req: Request) {
   const { name, surname, birthday } = (await req.json()) as JSON
   const info = { name, surname, birthday }

   let user = null

   try {
      await openDB()

      const _id = getUserId()
      if (!_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      await User.updateOne({ _id }, { verifying: true, info })
      user = await User.findOne({ _id })

      await sendMail('ConfirmUser', 'EgMakc@yandex.ru', {
         id: _id,
         login: user.login,
         email: user.email,
         info,
      })
      return Response.json(await createData('ok'))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/verify', { info, _id: getUserId(), user })
      return Response.json(await BACKEND_ERROR)
   }
}
