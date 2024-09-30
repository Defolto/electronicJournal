import {
   BACKEND_ERROR,
   createData,
   createError,
   getStartPath,
   getUserId,
   ID_NOT_FOUND,
   NOT_VERIFIED_USER,
   openDB,
   uploadFile,
   USER_NOT_FOUND,
} from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { checkFileSize, isVerifiedUser } from '../../../../helpers/functions'
import Logger from '../../../../logger'

/**
 * загрузка файлов в папку пользователя
 * @return полный путь до нового названия файла
 */
export async function POST(req: Request) {
   const data = await req.formData()
   const file = data.get('file') as File
   const type = data.get('type') as 'avatar' | 'background'

   let format = null
   let filename = null
   let dirPath = null
   let newFilename = null

   try {
      await openDB()

      const _id = getUserId()
      if (!_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const checkSize = checkFileSize(type, file.size)
      if (checkSize !== 'ok') {
         return Response.json(await createError(checkSize))
      }

      const user = await User.findOne({ _id })
      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      const verifiedUser = isVerifiedUser(user)
      if (!verifiedUser) {
         return Response.json(await NOT_VERIFIED_USER)
      }

      format = file.name.split('.').slice(-1)[0]
      filename = `user-${user.publicId}/${type}-${new Date().getTime()}.${format}`
      dirPath = getStartPath()
      newFilename = `${dirPath}/${filename}`

      await uploadFile(file, filename, user.personalization[type])
      await User.updateOne(
         { _id },
         { personalization: { ...user.personalization, [type]: newFilename } }
      )

      return Response.json(await createData(newFilename))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/user/uploadFile', {
         type,
         file,
         format,
         filename,
         dirPath,
         newFilename,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
