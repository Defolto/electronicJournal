import { useAppDispatch } from '../../../../store/hooks'
import { modalShow } from '../../../../store/modalSlice'
import Delete from '../../../icons/Delete'

type Params = {
   subjectHref: string
   themeHref?: string
   callback?: (data: any) => void
}

export default function ButtonDeleteMaterial({ subjectHref, themeHref, callback }: Params) {
   const dispatch = useAppDispatch()
   const type = !!themeHref ? 'theme' : 'subject'

   const deleteMaterial = async () => {
      dispatch(
         modalShow({
            name: 'DeleteMaterial',
            className: 'w-1/5',
            props: { type, subjectHref, themeHref, callback },
         })
      )
   }

   return (
      <div className="cursor-pointer" onClick={deleteMaterial}>
         <Delete />
      </div>
   )
}
