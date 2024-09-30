'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getCookie } from '../../../helpers/cookie'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { ISubject } from '../../../types'
import ButtonCreateMaterial from './Buttons/ButtonCreateMaterial'
import ButtonDeleteMaterial from './Buttons/ButtonDeleteMaterial'
import ButtonEditMaterial from './Buttons/ButtonEditMaterial'

export default function MenuSubjects() {
   const dispatch = useAppDispatch()
   const isTeacher = useAppSelector((state) => state.user.role === 'teacher')
   const path = usePathname()
   const chosenSubject = path.split('/')[2]

   const [subjects, setSubjects] = useState<ISubject[]>([])

   useEffect(() => {
      dispatch(createFetch({ api: 'materials/get/' })).then(({ payload }) => {
         if (!payload) return
         setSubjects(payload)
      })
   }, [dispatch])

   const addedSubject = (newSubject: ISubject) => {
      setSubjects((prev) => [...prev, newSubject])
   }

   const deletedSubject = (oldSubjectHref: string) => {
      setSubjects((prev) => prev.filter((s) => s.href !== oldSubjectHref))
   }

   const editedSubject = (oldSubjectHref: string, newSubject: ISubject) => {
      setSubjects((prev) => {
         const newSubjects = [...prev]
         const index = newSubjects.findIndex((s) => s.href === oldSubjectHref)

         if (index !== -1) {
            newSubjects[index] = newSubject
         }

         return newSubjects
      })
   }

   const myId = getCookie('user_id')
   return (
      <div className="mr-10 flex w-[150px] flex-col gap-3">
         <p className="text-lg font-bold">Предметы</p>
         <div className="flex flex-col gap-2">
            {subjects.map((item, index) => (
               <div key={index} className="flex">
                  <Link
                     className={clsx(
                        'text-white no-underline hover:text-green',
                        chosenSubject === item.href && '!text-green'
                     )}
                     href={`/materials/${item.href}`}
                  >
                     {item.title}
                  </Link>
                  {item.author === myId && (
                     <div className="ml-2 flex flex-row gap-1">
                        <ButtonEditMaterial subjectHref={item.href} callback={editedSubject} />
                        <ButtonDeleteMaterial subjectHref={item.href} callback={deletedSubject} />
                     </div>
                  )}
               </div>
            ))}
         </div>
         {isTeacher && <ButtonCreateMaterial type="subject" callback={addedSubject} />}
      </div>
   )
}
