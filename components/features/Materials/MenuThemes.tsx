'use client'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch } from '../../../store/hooks'
import { ITheme } from '../../../types'
import ButtonCreateMaterial from './Buttons/ButtonCreateMaterial'
import ButtonDeleteMaterial from './Buttons/ButtonDeleteMaterial'
import ButtonEditMaterial from './Buttons/ButtonEditMaterial'

type Props = {
   subjectHref: string
   isTeacher: boolean
}

export default function MenuThemes({ subjectHref, isTeacher }: Props) {
   const dispatch = useAppDispatch()
   const [themes, setThemes] = useState<ITheme[]>([])
   const path = usePathname()
   const chosenSubject = path.split('/')[3]

   useEffect(() => {
      dispatch(createFetch({ api: 'materials/get/', data: { subjectHref } })).then(
         ({ payload }) => {
            if (!payload) return
            setThemes(payload)
         }
      )
   }, [dispatch, subjectHref])

   const addedTheme = (newTheme: ITheme) => {
      setThemes((prev) => [...prev, newTheme])
   }

   const deletedTheme = (oldThemeHref: string) => {
      setThemes((prev) => prev.filter((s) => s.href !== oldThemeHref))
   }

   const editedTheme = (oldThemeHref: string, newTheme: ITheme) => {
      setThemes((prev) => {
         const newThemes = [...prev]
         const index = newThemes.findIndex((s) => s.href === oldThemeHref)

         if (index !== -1) {
            newThemes[index] = newTheme
         }

         return newThemes
      })
   }

   return (
      <div className="ml-10 flex w-[200px] flex-col gap-3">
         <p className="text-right text-lg font-bold">Уроки</p>
         <div className="flex flex-col items-end gap-2">
            {themes.map((item, index) => {
               return (
                  <div key={index} className="flex">
                     {isTeacher && (
                        <div className="mr-2 flex flex-row gap-1">
                           <ButtonDeleteMaterial
                              subjectHref={subjectHref}
                              themeHref={item.href}
                              callback={deletedTheme}
                           />
                           <ButtonEditMaterial
                              subjectHref={subjectHref}
                              themeHref={item.href}
                              callback={editedTheme}
                           />
                        </div>
                     )}
                     <Link
                        className={clsx(
                           'text-end text-white no-underline hover:text-green',
                           chosenSubject === item.href && '!text-green'
                        )}
                        href={`/materials/${subjectHref}/${item.href}`}
                     >
                        {item.title}
                     </Link>
                  </div>
               )
            })}
            {isTeacher && (
               <ButtonCreateMaterial type="theme" subjectHref={subjectHref} callback={addedTheme} />
            )}
         </div>
      </div>
   )
}
