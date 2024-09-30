import { useEffect, useState } from 'react'
import { createFetch } from '../../../helpers/createFetch'
import { uploadGroupFile } from '../../../store/groups/groupsActions'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { modalShow } from '../../../store/modalSlice'
import { openCardParticipant } from '../../../store/user/userActions'
import { IGroup, IUser, IUserGroup } from '../../../types'
import Avatar from '../../ui/Avatar'
import InputFile from '../../ui/InputFile'

type UsersClass = {
   leader: null | IUserGroup
   headman: null | IUserGroup
   users: IUserGroup[]
}

function CardUserClass({ info, login, personalization }: Partial<IUserGroup> & { group: IGroup }) {
   const dispatch = useAppDispatch()

   if (!info) {
      return (
         <div className="flex w-[300px] flex-row gap-3 rounded-2xl bg-secondBg px-5 py-3">
            <Avatar size={50} avatar={personalization?.avatar} />
            <div>
               <p>Пользователь не указан</p>
            </div>
         </div>
      )
   }

   const { name, surname } = info

   const openCard = () => {
      dispatch(openCardParticipant(login))
   }

   return (
      <div
         className="flex w-[300px] cursor-pointer flex-row gap-3 rounded-2xl bg-secondBg px-5 py-3"
         onClick={openCard}
      >
         <Avatar size={50} avatar={personalization?.avatar} />
         <div>
            <p>
               {surname} {name}
            </p>
            <p>{login}</p>
         </div>
      </div>
   )
}

export function ProfileGroupMenu(props: IGroup) {
   const dispatch = useAppDispatch()

   const { role, publicId } = useAppSelector((state) => state.user)

   const { id, leader, headman } = props
   const isAdmin = role
   const isLeaderGroup = leader === publicId
   const isHeadmanGroup = headman === publicId

   const chooseMains = (post: 'leader' | 'headman') => {
      const onSelected = (user: IUser) => {
         dispatch(
            createFetch({
               api: 'group/selectMains',
               data: { post, publicId: user.publicId, groupId: id },
            })
         ).then(({ payload }) => {
            if (!payload) return
         })
      }

      dispatch(
         modalShow({
            name: 'ListUsers',
            className: 'w-[400px]',
            props: { onSelected },
         })
      )
   }

   const changeAvatar = (file: File) => {
      dispatch(uploadGroupFile(file, 'avatar', props))
   }

   return (
      <div className="absolute left-0 top-0 flex -translate-x-full flex-col gap-2 bg-firstBg p-3">
         {isAdmin && (
            <p className="cursor-pointer" onClick={() => chooseMains('leader')}>
               Сменить руквоводителя
            </p>
         )}
         {isAdmin && (
            <p className="cursor-pointer" onClick={() => chooseMains('headman')}>
               Сменить старосту
            </p>
         )}
         {(isLeaderGroup || isHeadmanGroup) && (
            <InputFile text="Сменить аватар" callback={changeAvatar} />
         )}
      </div>
   )
}

export default function ProfileGroup(props: IGroup) {
   const dispatch = useAppDispatch()

   const { name, number, money, status, id } = props
   const [users, setUsers] = useState<UsersClass>({
      leader: null,
      headman: null,
      users: [],
   })

   useEffect(() => {
      dispatch(createFetch({ api: 'group/getUsers', data: { id } })).then(({ payload }) => {
         if (!payload) return
         setUsers(payload)
      })
   }, [id, dispatch])

   const students = users?.users.filter(
      (user) =>
         user.publicId !== users.leader?.publicId && user.publicId !== users.headman?.publicId
   )

   return (
      <div className="relative p-3">
         <ProfileGroupMenu {...props} />
         <div className="flex flex-row gap-3">
            <Avatar size={100} avatar={props.avatar} />
            <div className="flex flex-col">
               <p className="text-3xl font-bold">
                  {number} {name}
               </p>
               <p>Слоган: {status ?? 'Не указан'}</p>
               <p>Коинов: {money}</p>
            </div>
         </div>

         <div className="my-7 flex flex-row justify-around gap-3">
            <div>
               <p className="mb-1 text-xl">Руководитель</p>
               <CardUserClass {...{ ...users?.leader, group: props }} />
            </div>
            <div>
               <p className="mb-1 text-xl">Староста</p>
               <CardUserClass {...{ ...users?.headman, group: props }} />
            </div>
         </div>

         <div>
            <p className="mb-1 text-xl">Ученики</p>
            <div className="flex flex-row flex-wrap gap-3">
               {students.length ? (
                  students.map((user) => (
                     <CardUserClass key={user.publicId} {...{ ...user, group: props }} />
                  ))
               ) : (
                  <p>Нет учеников</p>
               )}
            </div>
         </div>
      </div>
   )
}
