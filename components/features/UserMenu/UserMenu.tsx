'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteCookie } from '../../../helpers/cookie'
import { isVerifiedUser } from '../../../helpers/functions'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { modalShow } from '../../../store/modalSlice'
import Burger from '../../icons/Burger'
import ConfirmAccount from '../../icons/ConfirmAccount'
import Cross from '../../icons/Cross'
import { Button } from '../../ui/Button'
import Calendar from './icons/Calendar'
import Collections from './icons/Collections'
import Exit from './icons/Exit'
import Home from './icons/Home'
import Materials from './icons/Materials'
import School from './icons/School'
import Settings from './icons/Settings'
import Shop from './icons/Shop'

type IMenuItem = {
   title: string
   icon: JSX.Element
   href: string
   onClick?: () => void
}

const MENU_ITEMS_TOP: IMenuItem[] = [
   { title: 'Главная', icon: <Home />, href: '/profile' },
   { title: 'Расписание', icon: <Calendar />, href: '/profile/calendar' },
   { title: 'Материалы', icon: <Materials />, href: '/materials' }, // без профиля, т.к. там не нужен редакс
   { title: 'Моя школа', icon: <School />, href: '/profile/school' },
   { title: 'Магазин', icon: <Shop />, href: '/profile/shop' },
   { title: 'Коллекции', icon: <Collections />, href: '/profile/collections' },
   { title: 'Настройки', icon: <Settings />, href: '/profile/settings' },
]

const MENU_ITEMS_BOTTOM: IMenuItem[] = [
   {
      title: 'Выход',
      icon: <Exit />,
      href: '/',
      onClick: () => {
         deleteCookie('user_id')
         deleteCookie('groups_id')
      },
   },
]

function UserMenuItem({
   title,
   icon,
   href,
   onClick,
   isShortToolbar,
}: IMenuItem & { isShortToolbar: boolean }) {
   const pathname = usePathname()
   const router = useRouter()

   // В материалах может быть вложенный путь
   const isMaterials = pathname.includes('materials') && href.includes('materials')

   if (onClick) {
      return (
         <div
            className="flex cursor-pointer flex-row items-center gap-2 text-white hover:text-green"
            onClick={() => {
               onClick()
               router.push(href)
            }}
         >
            {icon}
            {!isShortToolbar && <p>{title}</p>}
         </div>
      )
   }

   return (
      <Link
         href={href}
         className={clsx(
            'flex cursor-pointer flex-row items-center gap-2 text-white no-underline hover:text-green',
            (pathname === href || isMaterials) && '!text-green'
         )}
      >
         {icon}
         {!isShortToolbar && <p>{title}</p>}
      </Link>
   )
}

export default function UserMenu() {
   const dispatch = useAppDispatch()
   const user = useAppSelector((state) => state.user)
   const [isOpenedMenu, setIsOpenedMenu] = useState(false)

   const { info, verifying } = user
   const verifiedUser = isVerifiedUser(user)
   const isShortToolbar = useAppSelector((state) => state.user.customization?.isShortToolbar)

   const openConfirmUser = () => {
      dispatch(modalShow({ name: 'ConfirmUser', className: 'w-[500px]', props: { ...info } }))
   }

   const handleOpenedMenu = () => {
      setIsOpenedMenu((prev) => !prev)
   }
   return (
      <>
         <div
            className={`sm:flex ${isOpenedMenu ? 'flex' : 'hidden'} z-10 box-border h-full flex-col gap-4 bg-secondBg p-4 max-sm:fixed max-sm:w-full max-sm:items-center max-sm:text-2xl`}
         >
            <div
               className="fixed left-0 top-0 m-2 h-[25px] w-[25px] sm:hidden"
               onClick={handleOpenedMenu}
            >
               <Cross />
            </div>
            {MENU_ITEMS_TOP.map((item, index) => (
               <UserMenuItem
                  key={`user-menu-top-${index}`}
                  {...item}
                  onClick={handleOpenedMenu}
                  isShortToolbar={!!isShortToolbar}
               />
            ))}
            <div className="mt-auto flex flex-col gap-4 max-sm:items-center">
               {!verifiedUser && !verifying && (
                  <Button
                     className="animate-bounce bg-blue !px-1 text-center text-sm hover:animate-none max-sm:text-2xl"
                     onClick={openConfirmUser}
                  >
                     {isShortToolbar ? (
                        <ConfirmAccount className="m-auto h-[18px] w-[18px] text-white" />
                     ) : (
                        'Подтвердить акк'
                     )}
                  </Button>
               )}
               {MENU_ITEMS_BOTTOM.map((item, index) => (
                  <UserMenuItem
                     key={`user-menu-bottom-${index}`}
                     {...item}
                     isShortToolbar={!!isShortToolbar}
                  />
               ))}
            </div>
         </div>
         <div
            className={`sm:hidden ${isOpenedMenu ? 'hidden' : 'flex'} fixed left-0 top-0`}
            onClick={handleOpenedMenu}
         >
            <Burger />
         </div>
      </>
   )
}
