import { readFile } from '../../../../../helpers/apiFiles'

type MDFileData = {
   subjectHref: string
   themeHref: string
}

export async function POST(req: Request) {
   const { subjectHref, themeHref } = (await req.json()) as MDFileData

   const path = !!themeHref
      ? `materials/${subjectHref}/${themeHref}.md`
      : `materials/${subjectHref}/main.md`

   const file = await readFile(path)
   return Response.json({
      data: file,
   })
}
