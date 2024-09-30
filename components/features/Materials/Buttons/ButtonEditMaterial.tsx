import { useAppDispatch } from '../../../../store/hooks'
import { modalShow } from '../../../../store/modalSlice'
import Edit from '../../../icons/Edit'

type Props = {
   subjectHref: string
   themeHref?: string
   callback?: (data: any, data2: any) => void
}

export default function ButtonEditMaterial({ subjectHref, themeHref, callback }: Props) {
   const dispatch = useAppDispatch()
   const type = !!themeHref ? 'theme' : 'subject'

   const editName = () => {
      dispatch(
         modalShow({
            name: 'EditMaterial',
            props: { type, subjectHref, themeHref, callback },
            className: 'w-1/5',
            canClose: false,
         })
      )
   }

   return (
      <div className="w-fit cursor-pointer" onClick={editName}>
         <Edit className="w-[18px]" />
      </div>
   )
}
