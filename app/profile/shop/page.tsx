'use client'
import { ICollection } from '../../../public/collections/list'
import { useAppDispatch } from '../../../store/hooks'
import { modalShow } from '../../../store/modalSlice'

export default function Home() {
   const dispatch = useAppDispatch()
   const buyCase = (collection: ICollection) => {
      dispatch(
         modalShow({ name: 'OpenCase', props: { collection }, className: 'w-1/2', canClose: false })
      )
   }

   return <p>В разработке</p>

   // return (
   //    <div className="flex flex-row gap-4">
   //       {LIST_COLLECTIONS.map((collection) => {
   //          return (
   //             <div
   //                key={collection}
   //                className="border-gray-300 w-[200px] border-2 border-solid p-4"
   //             >
   //                <p>{usFirst(collection)}</p>
   //                <Image
   //                   width={165}
   //                   height={165}
   //                   alt="элемент коллекции"
   //                   src={`/collections/${collection}/2.jpeg`}
   //                />
   //                <Button className="mx-auto mt-3 bg-gray" onClick={() => buyCase(collection)}>
   //                   Купить
   //                </Button>
   //             </div>
   //          )
   //       })}
   //    </div>
   // )
}
