import { deleteFile } from '../../../../../helpers/apiFiles'
import { ROLES } from '../../../../../helpers/constants'
import Logger from '../../../../../logger'
import {
   BACKEND_ERROR,
   ID_NOT_FOUND,
   SMALL_ROLE,
   SUBJECT_NOT_FOUND,
   checkRights,
   createData,
   getUserId,
   openDB,
} from '../../../../../mongoDB/general'
import Subject from '../../../../../mongoDB/models/subject'
import { ITheme } from '../../../../../types'

type JSON = {
   subjectHref: string
   themeHref: string
}

export async function POST(req: Request) {
   const { subjectHref, themeHref } = (await req.json()) as JSON

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

      const subject = await Subject.findOne({ href: subjectHref })
      if (!subject) {
         return Response.json(await SUBJECT_NOT_FOUND)
      }

      const newThemes = subject.themes.filter((theme: ITheme) => theme.href !== themeHref)
      await Subject.updateOne({ href: subjectHref }, { themes: newThemes })

      await deleteFile(`materials/${subjectHref}/${themeHref}.md`)

      return Response.json(await createData(themeHref))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/delete/theme', { subjectHref, themeHref })
      return Response.json(await BACKEND_ERROR)
   }
}
