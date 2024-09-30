import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { createFetch } from '../../../../helpers/createFetch'
import { useAppDispatch } from '../../../../store/hooks'
import { IUser } from '../../../../types'

type IListProps = { onSelected: (user: IUser) => void; className?: string }

export default function ListUsers({ onSelected, className }: IListProps) {
   const dispatch = useAppDispatch()
   const [users, setUsers] = useState<IUser[]>([])

   useEffect(() => {
      dispatch(createFetch({ api: 'user/getList' })).then(({ payload }) => {
         if (!payload) return
         setUsers(payload)
      })
   }, [dispatch])

   return (
      <div className={clsx('flex flex-col', className)}>
         <p className="mt-1 text-center text-lg">Выберите пользователя</p>
         <div className="flex max-h-[200px] flex-col overflow-y-auto">
            {users?.map((item) => (
               <div
                  key={'group-' + item.login}
                  className="cursor-pointer p-2 hover:bg-secondBg"
                  onClick={() => onSelected(item)}
               >
                  {item.info.surname} {item.info.name} ({item.login})
               </div>
            ))}
         </div>
      </div>
   )
}
