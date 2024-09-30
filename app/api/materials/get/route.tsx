import Logger from '../../../../logger'
import { BACKEND_ERROR, createData, createError, openDB } from '../../../../mongoDB/general'
import Subject from '../../../../mongoDB/models/subject'
import { ISubject } from '../../../../types'

type SubjectData = {
   subjectHref?: string
}

export async function POST(req: Request) {
   const { subjectHref } = (await req.json()) as SubjectData
   try {
      await openDB()
      const subjects: ISubject[] = await Subject.find()

      if (!subjectHref) {
         return Response.json(await createData(subjects))
      }

      const subject = subjects.find((value: ISubject) => value.href === subjectHref)
      if (!subject) {
         return Response.json(await createError('Предмет не найден'))
      }

      return Response.json(await createData(subject.themes))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/get/route.tsx', { subjectHref })
      return Response.json(await BACKEND_ERROR)
   }
}
