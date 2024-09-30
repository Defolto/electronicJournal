import { useAppDispatch } from '../../../../store/hooks'
import { modalShow } from '../../../../store/modalSlice'
import { Button } from '../../../ui/Button'

export type ICreateMaterial = {
   type: 'subject' | 'theme'
   subjectHref?: string
   callback?: (data: any) => void
}

export default function ButtonCreateMaterial(props: ICreateMaterial) {
   const dispatch = useAppDispatch()
   const create = async () => {
      dispatch(modalShow({ name: 'CreateMaterial', className: 'w-1/5', props: { ...props } }))
   }

   return (
      <Button
         className={`bg-blue !py-1 text-center ${props.type === 'subject' ? 'mr-auto' : 'ml-auto'}`}
         onClick={create}
      >
         Добавить
      </Button>
   )
}
