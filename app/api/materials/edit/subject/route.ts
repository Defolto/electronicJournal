import { renameDir } from '../../../../../helpers/apiFiles'
import { ROLES } from '../../../../../helpers/constants'
import Logger from '../../../../../logger'
import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   SMALL_ROLE,
   checkRights,
   createData,
   getUserId,
   openDB,
} from '../../../../../mongoDB/general'
import Subject from '../../../../../mongoDB/models/subject'

type Json = {
   subjectHref: string
   newName: string
   newHref: string
}

export async function POST(req: Request) {
   const { subjectHref, newName, newHref } = (await req.json()) as Json
   try {
      await openDB()

      const user_id = getUserId()
      if (!user_id) {
         return Response.json(await ID_NOT_FOUND)
      }

      const isTeacher = await checkRights(user_id, ROLES.teacher)
      if (!isTeacher) {
         return Response.json(await SMALL_ROLE)
      }

      await Subject.updateOne({ href: subjectHref }, { title: newName, href: newHref })
      const newSubject = await Subject.findOne({ href: newHref })

      await renameDir(`materials/${subjectHref}`, `materials/${newHref}`)

      return Response.json(await createData(newSubject))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/edit/subject', { subjectHref, newName, newHref })
      return Response.json(await BACKEND_ERROR)
   }
}
