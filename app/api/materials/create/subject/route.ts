import { writeFile } from '../../../../../helpers/apiFiles'
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
import { ISubject } from '../../../../../types'

type SubjectType = {
   title: string
   href: string
}

export async function POST(req: Request) {
   const { title, href } = (await req.json()) as SubjectType

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

      const newSubject: ISubject = {
         title,
         href,
         themes: [],
         author: user_id,
      }

      const subject = new Subject(newSubject)
      await subject.save()

      // Ставим # для создания заголовка в md
      await writeFile(`materials/${href}/main.md`, `# ${title}`)

      return Response.json(await createData(subject))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/create/subject', {
         title,
         href,
         _id: getUserId(),
      })
      return Response.json(await BACKEND_ERROR)
   }
}
