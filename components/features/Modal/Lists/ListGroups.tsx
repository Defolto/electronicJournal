import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { createFetch } from '../../../../helpers/createFetch'
import { useAppDispatch } from '../../../../store/hooks'
import { IGroup } from '../../../../types'

type IListProps = { onSelected: (group: IGroup) => void; className?: string; groupsList?: IGroup[] }

export default function ListGroups({ onSelected, className, groupsList }: IListProps) {
   const dispatch = useAppDispatch()
   const [groups, setGroups] = useState<IGroup[]>([])

   useEffect(() => {
      if (groupsList) {
         setGroups(groupsList)
         return
      }

      dispatch(createFetch({ api: 'group/getList' })).then(({ payload }) => {
         if (!payload) return
         setGroups(payload)
      })
   }, [dispatch, groupsList])

   return (
      <div className={clsx('flex flex-col', className)}>
         <p className="mt-1 text-center text-lg">Выберите класс</p>
         <div className="flex max-h-[200px] flex-col overflow-y-auto">
            {groups?.map((item) => (
               <div
                  key={'group-' + item.id}
                  className="cursor-pointer p-2 hover:bg-secondBg"
                  onClick={() => onSelected(item)}
               >
                  {item.number} {item.name}
               </div>
            ))}
         </div>
      </div>
   )
}
