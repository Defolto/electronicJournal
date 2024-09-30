'use client'

import { DEFAULT_THEME, ROLE_RUS, THEME_NAMES } from 'helpers/constants'
import { useCallback, useEffect, useState } from 'react'
import Copy from '../../../components/icons/Copy'
import { Button } from '../../../components/ui/Button'
import Switcher from '../../../components/ui/Switcher'
import { formatDate, getGender } from '../../../helpers/functions'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { modalShow } from '../../../store/modalSlice'
import { notVerifiedUser } from '../../../store/notifications/notificationsAction'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import { updateUserCustomization } from '../../../store/user/userActions'
import { IThemeColors, IThemeName } from '../../../types'

function InputColor({
   name,
   setLocalTheme,
   color,
}: {
   name: IThemeName
   setLocalTheme: (value: any) => any
   color: string
}) {
   const [localColor, setLocalColor] = useState<string>(color)

   useEffect(() => {
      setLocalColor(color)
   }, [color, setLocalColor])

   useEffect(() => {
      const body = document.querySelector('body')

      if (!body) {
         return
      }

      const colorVariable = getComputedStyle(body).getPropertyValue(name)
      setLocalColor(colorVariable)
   }, [setLocalColor, name])

   const changeColor = (name: string, newColor: string) => {
      document.querySelector('body')?.style.setProperty(name, newColor)
      setLocalColor(newColor)
      setLocalTheme((prev: IThemeColors) => {
         return {
            ...prev,
            [name]: newColor,
         }
      })
   }

   return (
      <div className="flex flex-col items-center justify-center gap-2">
         <input
            type="color"
            value={localColor}
            onChange={(e) => changeColor(name, e.target.value)}
         />
         <p>{THEME_NAMES[name]}</p>
      </div>
   )
}

function SectionUserSettings({ children, title, onlyPc = false, onlyAndroid = false }: { children: React.ReactNode; title: string; onlyPc?: boolean; onlyAndroid?: boolean }) {
   return (
      <div className={`mt-6 flex flex-col ${onlyPc && 'max-sm:hidden'} ${onlyAndroid && 'sm:hidden'}`}>
         <p className="text-xl font-bold">{title}</p>
         {children}
      </div>
   )
}

export default function Home() {
   const dispatch = useAppDispatch()
   const { customization, info, role, login, publicId, email, verifying } = useAppSelector(
      (state) => state.user
   )
   const [localTheme, setLocalTheme] = useState<IThemeColors>(customization?.theme ?? DEFAULT_THEME)
   const createDate = new Date(+publicId.split('-')[0]) // в айди хранится дата создания
   const verifiedUser = role !== 'guest' && !verifying && login

   useEffect(() => {
      setLocalTheme(customization?.theme ?? DEFAULT_THEME)
   }, [setLocalTheme, customization])

   const changeToolbar = useCallback(
      (value: boolean) => {
         dispatch(updateUserCustomization({ isShortToolbar: value }))
      },
      [dispatch]
   )

   const updateTheme = (theme: IThemeColors) => {
      if (!verifiedUser) {
         dispatch(notVerifiedUser())
         return
      }

      if (JSON.stringify(theme) === JSON.stringify(customization?.theme)) {
         dispatch(
            notificationShow({
               type: 'error',
               message: 'Темы одинаковые' + Math.random(),
            })
         )
         return
      }

      dispatch(updateUserCustomization({ theme }))
   }

   const openQrCodeScanner = () => {
      dispatch(modalShow({ name: 'QrScanner', className: 'w-9/12' }))
   }

   const copyPublicId = () => {
      navigator.clipboard.writeText(publicId)
   }

   return (
      <div className="flex flex-col">
         <p className="text-2xl font-bold">
            {info.surname} {info.name} ({login})
         </p>
         <div className="flex flex-row gap-2">
            Мой id:
            <div
               className="flex cursor-pointer flex-row gap-1 hover:text-green max-sm:w-1/2"
               title="Копировать"
               onClick={copyPublicId}
            >
               <p className='max-sm:truncate'>{publicId}</p> <Copy className="my-auto max-sm:hidden" />
            </div>
         </div>
         <div className="flex flex-row gap-2">Почта: {email}</div>

         <SectionUserSettings title="Общая информация">
            <div className="flex flex-row gap-6">
               <div className="flex w-1/2 flex-col">
                  <p>Пол: {getGender(info.gender) ?? 'не указано'}</p>
                  <p>День рождения: {formatDate(info.birthday, 'date') ?? 'не указано'}</p>
               </div>
               <div className="flex w-1/2 flex-col">
                  <p>Роль: {ROLE_RUS[role]}</p>
                  <p>Дата регистрации: {formatDate(createDate, 'date')}</p>
               </div>
            </div>
         </SectionUserSettings>

         <SectionUserSettings title="Действия">
            <div className="flex flex-row gap-3 opacity-10" title="В разработке">
               <Button className="!bg-blue">Смена пароля</Button>
               <Button className="!bg-blue">Смена почты</Button>
               <Button className="!bg-blue">Смена логина</Button>
            </div>
            <div className="mt-3 flex flex-row gap-1 max-sm:hidden">
               <p>Короткий тулбар</p>
               <Switcher onChange={changeToolbar} checked={!!customization?.isShortToolbar} />
            </div>
         </SectionUserSettings>

         <SectionUserSettings title="Темизация" onlyPc={true}>
            <div className="my-auto flex flex-row gap-3">
               {Object.keys(THEME_NAMES).map((name) => (
                  <InputColor
                     name={name as IThemeName}
                     color={localTheme[name as IThemeName]}
                     key={`theme_${name}`}
                     setLocalTheme={setLocalTheme}
                  />
               ))}
               <div className="flex flex-col gap-1">
                  <Button
                     className="items-center justify-center !bg-blue"
                     onClick={() => updateTheme(DEFAULT_THEME)}
                  >
                     Сбросить тему
                  </Button>
                  <Button className="!bg-green text-black" onClick={() => updateTheme(localTheme)}>
                     Сохранить изменения
                  </Button>
               </div>
            </div>
         </SectionUserSettings>
         <SectionUserSettings title="Вход по QR коду" onlyAndroid={true}>
            <Button className="w-fit bg-blue" onClick={openQrCodeScanner}>
               Войти по qr коду
            </Button>
         </SectionUserSettings>
      </div>
   )
}
