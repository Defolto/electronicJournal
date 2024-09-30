import { writeFile } from '../../../../../helpers/apiFiles'
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

type ThemeType = {
   title: string
   href: string
   subjectHref: string
}

export async function POST(req: Request) {
   const { title, href, subjectHref } = (await req.json()) as ThemeType

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

      const newThemes = subject.themes
      const theme: ITheme = { title, href }
      newThemes.push(theme)
      await Subject.updateOne({ href: subjectHref }, { themes: newThemes })

      // Ставим # для создания заголовка в md
      await writeFile(`materials/${subjectHref}/${href}.md`, `# ${title}`)

      return Response.json(await createData(theme))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/create/theme', {
         title,
         href,
         subjectHref,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
