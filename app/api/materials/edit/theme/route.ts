import { renameFile } from '../../../../../helpers/apiFiles'
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

type Json = {
   subjectHref: string
   themeHref: string
   newName: string
   newHref: string
}

export async function POST(req: Request) {
   const { subjectHref, themeHref, newName, newHref } = (await req.json()) as Json
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

      const copyThemes = subject.themes
      const neededTheme = copyThemes.find((value: ITheme) => value.href === themeHref)

      if (neededTheme) {
         neededTheme.title = newName
         neededTheme.href = newHref
      }
      await Subject.updateOne({ href: subjectHref }, { themes: copyThemes })

      await renameFile(
         `materials/${subjectHref}/${themeHref}.md`,
         `materials/${subjectHref}/${newHref}.md`
      )

      return Response.json(await createData({ title: newName, href: newHref }))
   } catch (e) {
      Logger.getInstance().fatal(e, 'api/materials/edit/theme', {
         subjectHref,
         themeHref,
         newName,
         newHref,
      })
      return Response.json(await BACKEND_ERROR)
   }
}
