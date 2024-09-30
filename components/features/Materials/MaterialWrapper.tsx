import { useEffect, useState } from 'react'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { Button } from '../../ui/Button'
import MDEditor from './MDEditor/MDEditor'
import MDPreview from './MDPreview/MDPreview'
import MenuThemes from './MenuThemes'

type Props = {
   subjectHref: string
   themeHref?: string
}

export default function MaterialWrapper({ subjectHref, themeHref }: Props) {
   const dispatch = useAppDispatch()
   const isTeacher = useAppSelector((state) => state.user.role === 'teacher')
   const [mdText, setMdText] = useState<string>('Загрузка...')
   const [isEdit, setIsEdit] = useState<boolean>(false)

   const type = !!themeHref ? 'theme' : 'subject'

   useEffect(() => {
      dispatch(
         createFetch({
            api: 'materials/get/md',
            data: { subjectHref, themeHref },
         })
      ).then(({ payload }) => {
         if (!payload) return
         setMdText(payload)
      })
   }, [subjectHref, themeHref, dispatch])

   const toggleEdit = () => {
      setIsEdit((prev) => !prev)
   }

   const mdTextChanged = (text: string) => {
      setMdText(text)
   }

   return (
      <div className="flex w-full">
         <div className="flex w-full flex-col">
            {isTeacher && !isEdit && (
               <Button className="mr-auto bg-blue" onClick={toggleEdit}>
                  Редактировать
               </Button>
            )}
            {isEdit ? (
               <MDEditor
                  mdText={mdText}
                  subjectHref={subjectHref}
                  themeHref={themeHref}
                  onClose={toggleEdit}
                  callback={mdTextChanged}
               />
            ) : (
               <MDPreview text={mdText} />
            )}
         </div>
         <MenuThemes subjectHref={subjectHref} isTeacher={isTeacher} />
      </div>
   )
}
