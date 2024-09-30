import {
   BACKEND_ERROR,
   createData,
   createError,
   getStartPath,
   getUserId,
   GROUP_NOT_FOUND,
   ID_NOT_FOUND,
   openDB,
   uploadFile,
   USER_NOT_FOUND,
} from 'mongoDB/general'
import User from 'mongoDB/models/user'
import { checkFileSize } from '../../../../helpers/functions'
import Logger from '../../../../logger'
import Group from '../../../../mongoDB/models/group'

/**
 * загрузка файлов в папку пользователя
 * @return полный путь до нового названия файла
 */
export async function POST(req: Request) {
   const data = await req.formData()
   const file = data.get('file') as File
   const groupId = data.get('id') as string
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

      const group = await Group.findOne({ _id: groupId })
      if (!group) {
         return Response.json(await GROUP_NOT_FOUND)
      }

      const user = await User.findOne({ _id })
      if (!user) {
         return Response.json(await USER_NOT_FOUND)
      }

      const isLeaderGroup = group.leader === user.publicId
      const isHeadmanGroup = group.headman === user.publicId
      if (!isLeaderGroup && !isHeadmanGroup) {
         return Response.json(await createError('Нет прав на установку аватара для этого класса'))
      }

      format = file.name.split('.').slice(-1)[0]
      filename = `group-${groupId}/${type}-${new Date().getTime()}.${format}`
      dirPath = getStartPath()
      newFilename = `${dirPath}/${filename}`

      await uploadFile(file, filename, group.avatar)
      await Group.updateOne({ _id: groupId }, { avatar: newFilename })

      return Response.json(await createData(newFilename))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/group/uploadFile', {
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
