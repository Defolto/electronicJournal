'use client'
import { useEffect, useState } from 'react'
import AdminWidget from '../../../components/features/AdminWidget'
import Like from '../../../components/icons/Like'
import Money from '../../../components/icons/Money'
import Avatar from '../../../components/ui/Avatar'
import { createFetch } from '../../../helpers/createFetch'
import { openCardGroup } from '../../../store/groups/groupsActions'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { openCardParticipant } from '../../../store/user/userActions'
import { IGroup, IUser } from '../../../types'

function CardUser({
   info,
   personalization,
   money,
   thanks,
   login,
   userGroups,
}: IUser & { userGroups?: IGroup[] }) {
   const dispatch = useAppDispatch()

   const openCard = () => {
      dispatch(openCardParticipant(login))
   }

   return (
      <div
         className="box-border flex w-[300px] cursor-pointer flex-row gap-3 rounded-xl bg-secondBg p-3"
         onClick={openCard}
      >
         <Avatar size={70} avatar={personalization?.avatar} />
         <div className="flex w-full flex-col">
            <p className="w-full min-w-0 truncate text-lg font-bold leading-5">
               {info.surname} {info.name}
            </p>
            {!!userGroups?.length && (
               <p>
                  Класс:{' '}
                  {userGroups.map((userGroup) => userGroup.number + userGroup.name).join(', ')}
               </p>
            )}
            <div className="mt-1 flex gap-7">
               <div className="flex" title="Коины">
                  <Money />
                  <span className="ml-1 text-lg">{money === -1 ? 'Загрузка...' : money}</span>
               </div>
               <div className="flex" title="Лайки">
                  <Like />
                  <span className="ml-1 text-lg">{thanks === -1 ? 'Загрузка...' : thanks}</span>
               </div>
            </div>
         </div>
      </div>
   )
}

function CardGroup(props: IGroup) {
   const dispatch = useAppDispatch()

   const openCard = () => {
      dispatch(openCardGroup('', props))
   }

   const { avatar, number, name, users, leader, headman, money } = props
   const students = users.filter(
      (userPublicId) => userPublicId !== leader && userPublicId !== headman
   )

   return (
      <div
         className="box-border flex w-[300px] cursor-pointer flex-row gap-3 rounded-xl bg-secondBg p-3"
         onClick={openCard}
      >
         <Avatar size={70} avatar={avatar} />
         <div className="flex flex-col">
            <p className="text-lg font-bold leading-3">
               {number} {name}
            </p>
            <p>Учеников: {students.length}</p>
            <div className="mt-1 flex gap-7">
               <div className="flex" title="Коины">
                  <Money />
                  <span className="ml-1 text-lg">{money === -1 ? 'Загрузка...' : money}</span>
               </div>
            </div>
         </div>
      </div>
   )
}

export default function Home() {
   const dispatch = useAppDispatch()
   const [users, setUsers] = useState<IUser[]>([])
   const [groups, setGroups] = useState<IGroup[]>([])
   const isAdmin = useAppSelector((state) => state.user.role === 'admin')

   useEffect(() => {
      dispatch(createFetch({ api: 'user/getList' })).then(({ payload }) => {
         if (!payload) return

         const verifiedUsers = payload.filter((user: IUser) => user.role !== 'guest')
         setUsers(verifiedUsers)
      })

      dispatch(createFetch({ api: 'group/getList' })).then(({ payload }) => {
         if (!payload) return
         setGroups(payload)
      })
   }, [dispatch])

   const teachers = users.filter((user) => user.role === 'teacher')
   const students = users.filter((user) => user.role === 'student')

   return (
      <div className="relative flex h-full w-full flex-col gap-10">
         <div>
            <p className="text-2xl font-bold">Учителя</p>
            <div className="flex flex-row flex-wrap gap-3">
               {teachers.length
                  ? teachers.map((user) => {
                       const userGroups = groups.filter((group) => user.groups?.includes(group.id))
                       return (
                          <CardUser
                             key={'mySchool-' + user.publicId}
                             {...user}
                             userGroups={userGroups}
                          />
                       )
                    })
                  : 'Нет учителей'}
            </div>
         </div>

         <div>
            <p className="text-2xl font-bold">Ученики</p>
            <div className="flex flex-row flex-wrap gap-3">
               {students.length
                  ? students.map((user) => {
                       const userGroups = groups.filter((group) => user.groups?.includes(group.id))
                       return (
                          <CardUser
                             key={'mySchool-' + user.publicId}
                             {...user}
                             userGroups={userGroups}
                          />
                       )
                    })
                  : 'Нет учеников'}
            </div>
         </div>

         <div>
            <p className="text-2xl font-bold">Классы</p>
            <div className="flex flex-row flex-wrap gap-3">
               {groups.length
                  ? groups.map((group) => <CardGroup key={'mySchool-' + group.id} {...group} />)
                  : 'Нет классов'}
            </div>
         </div>

         {isAdmin && <AdminWidget />}
      </div>
   )
}
