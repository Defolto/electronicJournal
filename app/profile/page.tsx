'use client'

import TasksWidget from '../../components/Widgets/TasksWidget'
import TimerWidget from '../../components/Widgets/TimerWidget'
import Hello from '../../components/features/Hello'
import ConfirmAccount from '../../components/icons/ConfirmAccount'
import Like from '../../components/icons/Like'
import Money from '../../components/icons/Money'
import MyGroup from '../../components/icons/MyGroup'
import Profile from '../../components/icons/Profile'
import { openCardGroup } from '../../store/groups/groupsActions'
import { selectMassGroups } from '../../store/groups/groupsSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { modalShow } from '../../store/modalSlice'
import { notificationShow } from '../../store/notifications/notificationsSlice'
import { sidePanelAdd } from '../../store/sidePanelSlice'

function LineStat({ money, thanks }: { money?: number; thanks?: number }) {
   return (
      <div className="flex gap-7">
         <div className="flex" title="Коины">
            <Money />
            <span className="ml-1 text-lg">{money === -1 ? 'Загрузка...' : money}</span>
         </div>
         <div className="flex" title="Лайки">
            <Like />
            <span className="ml-1 text-lg">{thanks === -1 ? 'Загрузка...' : thanks}</span>
         </div>
      </div>
   )
}

function Greeting({ name, isConfirmAccount }: { name: string; isConfirmAccount: boolean }) {
   return (
      <div className="mb-1 flex flex-row">
         <span className="text-2xl">
            <Hello />, {name}
         </span>
         {isConfirmAccount && (
            <div className="flex" title="Подтверждённый аккаунт">
               <ConfirmAccount className="my-auto ml-2 h-[22px] w-[22px] text-blue" />
            </div>
         )}
      </div>
   )
}

function ButtonHeader({
   children,
   onClick,
   title,
}: {
   children: React.ReactNode
   onClick: () => void
   title: string
}) {
   return (
      <div
         onClick={onClick}
         className="flex h-[32px] w-[32px] cursor-pointer items-center justify-center rounded-full bg-gray hover:scale-110"
         title={title}
      >
         {children}
      </div>
   )
}

export default function Home() {
   const dispatch = useAppDispatch()

   const user = useAppSelector((state) => state.user)
   const groups = useAppSelector(selectMassGroups)
   const { info, role, money, thanks } = user

   const openProfileUser = () => {
      dispatch(
         sidePanelAdd({
            name: 'MyProfile',
            className: 'w-2/3',
            id: crypto.randomUUID(),
         })
      )
   }

   const openWordle = () => {
      dispatch(modalShow({ name: 'Wordle', className: 'w-[400px]' }))
   }

   const openGroupInfo = () => {
      if (!user.groups?.length) {
         dispatch(notificationShow({ message: 'Вы не прикреплены к классу', type: 'info' }))
         return
      }

      dispatch(openCardGroup('', groups[0]))
   }

   return (
      <div className="flex h-full flex-col">
         <header className="flex flex-row justify-between">
            <div className="flex flex-col">
               <Greeting name={info.name} isConfirmAccount={role !== 'guest'} />
               <LineStat thanks={thanks} money={money} />
            </div>
            <div className="flex flex-row items-center gap-3">
               <ButtonHeader onClick={openWordle} title="Игра 5 букв">
                  5
               </ButtonHeader>
               <ButtonHeader onClick={openProfileUser} title="Мой профиль">
                  <Profile className="h-[16px] w-[16px]" />
               </ButtonHeader>
               <ButtonHeader onClick={openGroupInfo} title="Мой класс">
                  <MyGroup className="h-[20px] w-[20px] text-transparent" />
               </ButtonHeader>
            </div>
         </header>

         <div className="mt-4 flex h-full flex-row">
            <div className="box-border flex w-9/12 flex-col pr-3">Тут будут новости</div>
            <div className="box-border flex h-full w-3/12 flex-col gap-5 border-0 border-l-2 border-solid border-gray pl-3">
               <TimerWidget />
               <TasksWidget />
               {/*<EventsWidget />*/}
            </div>
         </div>
      </div>
   )
}
