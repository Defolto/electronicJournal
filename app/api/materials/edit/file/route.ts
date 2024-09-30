import { writeFile } from '../../../../../helpers/apiFiles'
import { ID_NOT_FOUND_TEXT, ROLES, SMALL_ROLE_TEXT } from '../../../../../helpers/constants'
import { checkRights, getUserId } from '../../../../../mongoDB/general'

type EditType = {
   subjectHref: string
   themeHref: string
   mdText: string
}

export async function POST(req: Request) {
   const user_id = getUserId()
   if (!user_id) {
      return Response.json({
         error: ID_NOT_FOUND_TEXT,
      })
   }

   const isTeacher = await checkRights(user_id, ROLES.teacher)
   if (!isTeacher) {
      return Response.json({
         error: SMALL_ROLE_TEXT,
      })
   }

   const { subjectHref, themeHref, mdText } = (await req.json()) as EditType

   const path = !!themeHref
      ? `materials/${subjectHref}/${themeHref}.md`
      : `materials/${subjectHref}/main.md`

   await writeFile(path, mdText)

   return Response.json({
      data: 'ok',
   })
}
