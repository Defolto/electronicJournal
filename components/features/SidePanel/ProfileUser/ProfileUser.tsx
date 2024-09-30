import { IGroup, IRole, IUser, IUserEvent } from 'types'
import { ROLE_RUS } from '../../../../helpers/constants'
import { createFetch } from '../../../../helpers/createFetch'
import { formatDate, getRelativeFileSrc, isVerifiedUser } from '../../../../helpers/functions'
import { achievementsList, getIconsChallenge } from '../../../../public/achievements/list'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { modalShow } from '../../../../store/modalSlice'
import {
   notVerifiedUser,
   successfulOperation,
} from '../../../../store/notifications/notificationsAction'
import { uploadUserFile } from '../../../../store/user/userActions'
import Avatar from '../../../ui/Avatar'
import InputFile from '../../../ui/InputFile'

function ProfileUserMenu({
   login,
   role,
   verifying,
   groupsInfo,
}: {
   login: string
   role: IRole
   verifying: boolean
   groupsInfo: IGroup[]
}) {
   const dispatch = useAppDispatch()
   const user = useAppSelector((state) => state.user)

   const verifiedUser = isVerifiedUser(user)
   const { login: myLogin, role: myRole, groups } = user

   const isMyProfile = login === myLogin
   const isMyAdmin = myRole === 'admin'
   const isGuest = role === 'guest'
   const canAttachGroup = (role === 'student' && !groupsInfo?.length) || role === 'teacher'

   const changeAvatar = (file: File) => {
      if (!verifiedUser) {
         dispatch(notVerifiedUser())
         return
      }
      dispatch(uploadUserFile(file, 'avatar'))
   }

   const changeBackground = (file: File) => {
      if (!verifiedUser) {
         dispatch(notVerifiedUser())
         return
      }
      dispatch(uploadUserFile(file, 'background'))
   }

   const attachGroup = () => {
      if (!verifiedUser) {
         dispatch(notVerifiedUser())
         return
      }
      const onSelected = (group: IGroup) => {
         const { id } = group

         dispatch(
            createFetch({ api: 'user/attachGroup', data: { userLogin: login, groupId: id } })
         ).then(({ payload }) => {
            if (!payload) return
            dispatch(successfulOperation())
         })
      }

      dispatch(
         modalShow({
            name: 'ListGroups',
            className: 'w-[400px]',
            props: { onSelected },
         })
      )
   }

   const verificationUser = () => {
      const isStudent = confirm('Это будет ученик?')
      const role = isStudent ? 'student' : 'teacher'

      dispatch(createFetch({ api: 'user/verification', data: { login, role } })).then(
         ({ payload }) => {
            if (!payload) return
            dispatch(successfulOperation())
         }
      )
   }

   const untieGroup = () => {
      const onSelected = (group: IGroup) => {
         const { id } = group

         dispatch(
            createFetch({ api: 'user/untieGroup', data: { userLogin: login, groupId: id } })
         ).then(({ payload }) => {
            if (!payload) return
            dispatch(successfulOperation())
         })
      }

      dispatch(
         modalShow({
            name: 'ListGroups',
            className: 'w-[400px]',
            props: { onSelected, groupsList: groupsInfo },
         })
      )
   }

   return (
      <div className="absolute left-0 top-0 flex -translate-x-full flex-col gap-2 bg-firstBg p-3">
         {isMyProfile && <InputFile text="Сменить аватар" callback={changeAvatar} />}
         {isMyProfile && <InputFile text="Сменить обои" callback={changeBackground} />}
         {isMyAdmin && !isMyProfile && canAttachGroup && (
            <p className="cursor-pointer" onClick={attachGroup}>
               Привязать к классу
            </p>
         )}
         {isMyAdmin && !!groupsInfo?.length && (
            <p className="cursor-pointer" onClick={untieGroup}>
               Отвязать от класса
            </p>
         )}
         {isMyAdmin && isGuest && verifying && (
            <p className="cursor-pointer" onClick={verificationUser}>
               Подтвердить аккаунт
            </p>
         )}
      </div>
   )
}

function BigNumber({ value, title }: { value: number; title: string }) {
   return (
      <div className="flex flex-col text-center">
         <p className="text-3xl font-bold">{value}</p>
         <p className="text-lg">{title}</p>
      </div>
   )
}

function UserEvent({ from, title, text }: IUserEvent) {
   return (
      <div className="box-border w-[calc(50%-12px)] bg-gray p-3">
         <p>От: {from}</p>
         <p>{title}</p>
         <p>{text}</p>
      </div>
   )
}

function AchievementCard({ name }: { name: string }) {
   const achievement = achievementsList.find((item) => item.icon === name)

   if (!achievement) {
      return
   }

   const { title, icon, reward, description } = achievement

   return (
      <div className="group relative h-[40px] w-[40px]" key={`profileUser-iconsChallenge-${icon}`}>
         {getIconsChallenge(icon)}
         <div className="absolute -top-2 left-[20px] hidden w-[200px] -translate-x-1/2 -translate-y-full bg-gray px-4 py-2 shadow-lg group-hover:block">
            <p className="text-xl font-bold">{title}</p>
            <p className="text-sm">{description}</p>
            <p className="text-sm">Награда: {reward}</p>
         </div>
      </div>
   )
}

export default function ProfileUser({
   info,
   login,
   achievements,
   role,
   groupsInfo,
   personalization,
   verifying,
}: IUser & { groupsInfo: IGroup[] }) {
   const groupsName = groupsInfo.map((item) => item.number + item.name)

   return (
      <div
         className="relative h-full bg-cover"
         style={{
            backgroundImage:
               personalization?.background &&
               `url(${getRelativeFileSrc(personalization.background)})`,
         }}
      >
         <ProfileUserMenu login={login} role={role} verifying={verifying} groupsInfo={groupsInfo} />
         <div className="bg-black/50 mx-auto flex h-full w-2/3 flex-col gap-6 px-4 pt-4">
            <div className="flex gap-5">
               <Avatar size={150} avatar={personalization?.avatar} />
               <div>
                  <p className="text-2xl font-bold">
                     {info.name} {info.surname} ({login})
                  </p>
                  <p>День рождения: {formatDate(info.birthday, 'date') ?? 'Не указан'}</p>
                  <div className="flex flex-row gap-3">
                     <p>Класс: {groupsName.length ? `${groupsName.join(', ')}` : 'не указан'}</p>
                     <p>Роль: {ROLE_RUS[role]}</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-row gap-5">
               <BigNumber value={0} title="Средняя оценка" />
               <BigNumber value={0} title="Готовых задач" />
               <BigNumber value={0} title="Место в классе" />
               <BigNumber value={0} title="Полученых лайков" />
            </div>

            <div>
               <p className="mb-1 text-xl">
                  Ачивки {achievements?.length ?? 0} из {achievementsList.length}
               </p>
               <div className="flex flex-row flex-wrap gap-3">
                  {achievements?.length
                     ? achievements.map((item) => (
                          <AchievementCard key={`profileUser-achievements-${item}`} name={item} />
                       ))
                     : 'Ачивок пока что нет'}
               </div>
            </div>

            <div>
               <p className="mb-1 text-xl">Лента</p>
               <div className="flex flex-row flex-wrap gap-3">
                  Событий нет
                  {/*<UserEvent from="Егоров М.А." text="Спасибо за помощь" title="Поощрение" />*/}
                  {/*<UserEvent from="Егоров М.А." text="Спасибо за помощь" title="Поощрение" />*/}
                  {/*<UserEvent from="Егоров М.А." text="Спасибо за помощь" title="Поощрение" />*/}
               </div>
            </div>
         </div>
      </div>
   )
}
