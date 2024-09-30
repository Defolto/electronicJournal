import { deleteDir } from '../../../../../helpers/apiFiles'
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

type ISubject = {
   subjectHref: string
}

export async function POST(req: Request) {
   const { subjectHref } = (await req.json()) as ISubject
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

      await Subject.deleteOne({ href: subjectHref })

      await deleteDir(`materials/${subjectHref}`)

      return Response.json(await createData(subjectHref))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/delete/subject', {
         subjectHref,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
