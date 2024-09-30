import clsx from 'clsx'
import { UnknownAction } from 'redux'
import { useAppDispatch } from '../../store/hooks'
import { modalHide, modalShow } from '../../store/modalSlice'
import { openCardParticipant } from '../../store/user/userActions'
import { IUser } from '../../types'
import Add from '../icons/Add'
import Eye from '../icons/Eye'
import MyGroup from '../icons/MyGroup'
import Settings from './UserMenu/icons/Settings'

const WIDTH_CIRCLE = 'w-[50px]'
const ADMIN_WIDGET_HOVERED = 'hover:w-[110px]' // должен быть в два раза больше WIDTH_CIRCLE + 10px отступ

type ICircle = {
   className?: string
   icon?: JSX.Element
   title?: string
   onClick?: () => UnknownAction
}

function Circle({ className, onClick, icon, title }: ICircle) {
   const handleClick = () => {
      if (!onClick) {
         return
      }

      onClick()
   }

   return (
      <div
         className={clsx(
            'group absolute z-10 flex aspect-square cursor-pointer items-center justify-center rounded-full bg-blue transition-[transform] hover:scale-125',
            WIDTH_CIRCLE,
            className
         )}
         title={title}
         onClick={handleClick}
      >
         {icon}
      </div>
   )
}

export default function AdminWidget() {
   const dispatch = useAppDispatch()

   const CIRCLES: ICircle[] = [
      {
         className: 'left-0 top-0',
         icon: <MyGroup className="h-[25px] w-[25px] text-transparent" />,
         title: 'Связать ученика и класс',
         onClick: () =>
            dispatch(modalShow({ name: 'AttachUserWithGroup', className: 'w-[600px]' })),
      },
      {
         className: 'right-0 top-0',
         icon: <Eye className="h-[25px] w-[25px] text-white" isOpen={true} />,
         title: 'Найти ученика',
         onClick: () =>
            dispatch(
               modalShow({
                  name: 'ListUsers',
                  className: 'w-[400px]',
                  props: {
                     onSelected: (user: IUser) => {
                        dispatch(openCardParticipant(user.login))
                        dispatch(modalHide())
                     },
                  },
               })
            ),
      },
      {
         className: 'bottom-0 left-0',
         icon: <Add className="h-[25px] w-[25px]" />,
         title: 'Добавить класс',
         onClick: () => dispatch(modalShow({ name: 'CreateGroup', className: 'w-[400px]' })),
      },
      {
         className:
            'z-10 bottom-0 right-0 animate-[rotate_4s_linear_infinite] group-hover:w-[40px]',
         icon: <Settings className="h-[25px] w-[25px]" />,
      },
   ]

   return (
      <div
         className={`group absolute bottom-0 right-0 aspect-square transition-[width] ${ADMIN_WIDGET_HOVERED} ${WIDTH_CIRCLE}`}
      >
         {CIRCLES.map((item, i) => (
            <Circle key={'admin-widget-circle-' + i} {...item} />
         ))}
      </div>
   )
}
