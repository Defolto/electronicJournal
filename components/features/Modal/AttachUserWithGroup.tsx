import { useState } from 'react'
import { createFetch } from '../../../helpers/createFetch'
import { useAppDispatch } from '../../../store/hooks'
import { successfulOperation } from '../../../store/notifications/notificationsAction'
import { IGroup, IUser } from '../../../types'
import { Button } from '../../ui/Button'
import ListGroups from './Lists/ListGroups'
import ListUsers from './Lists/ListUsers'

export default function AttachUserWithGroup() {
   const dispatch = useAppDispatch()
   const [selectedUser, setSelectedUser] = useState<IUser | null>(null)
   const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null)

   const attach = () => {
      if (!selectedUser || !selectedGroup) {
         return
      }

      dispatch(
         createFetch({
            api: 'user/attachGroup',
            data: { userLogin: selectedUser.login, groupId: selectedGroup.id },
         })
      ).then(({ payload }) => {
         if (!payload) return
         dispatch(successfulOperation())
      })
   }

   return (
      <div className="flex flex-col">
         <div className="flex flex-row gap-2">
            <ListUsers className="w-1/2" onSelected={setSelectedUser} />
            <ListGroups className="w-1/2" onSelected={setSelectedGroup} />
         </div>
         <div className="mt-4 flex flex-row justify-center gap-2 border-t-2 pt-4">
            <p className="w-full text-center">{selectedUser ? selectedUser.login : 'Не выбран'}</p>
            <Button className="mx-auto bg-blue" onClick={attach}>
               Связать
            </Button>
            <p className="w-full text-center">
               {selectedGroup ? selectedGroup.number + selectedGroup.name : 'Не выбрана'}
            </p>
         </div>
      </div>
   )
}
