import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { modalHide } from '../../../store/modalSlice'
import Cross from '../../icons/Cross'
import QrScanner from '../QrCode/QrScanner'
import AttachUserWithGroup from './AttachUserWithGroup'
import ConfirmUser from './ConfirmUser'
import CreateGroup from './CreateGroup'
import ListGroups from './Lists/ListGroups'
import ListUsers from './Lists/ListUsers'
import CreateMaterial from './Materials/CreateMaterial'
import DeleteMaterial from './Materials/DeleteMaterial'
import EditMaterial from './Materials/EditMaterial'
import OpenCase from './OpenCase'
import Wordle from './Wordle'

export type IComponentModal =
   | 'OpenCase'
   | 'QrScanner'
   | 'Wordle'
   | 'ConfirmUser'
   | 'CreateMaterial'
   | 'DeleteMaterial'
   | 'EditMaterial'
   | 'CreateGroup'
   | 'ListGroups'
   | 'ListUsers'
   | 'AttachUserWithGroup'

const componentsAsidePanel: Record<IComponentModal, (props: any) => JSX.Element> = {
   OpenCase: (props) => <OpenCase {...props} />,
   QrScanner: () => <QrScanner />,
   Wordle: () => <Wordle />,
   ConfirmUser: (props) => <ConfirmUser {...props} />,
   CreateMaterial: (props) => <CreateMaterial {...props} />,
   DeleteMaterial: (props) => <DeleteMaterial {...props} />,
   EditMaterial: (props) => <EditMaterial {...props} />,
   CreateGroup: (props) => <CreateGroup {...props} />,
   ListGroups: (props) => <ListGroups {...props} />,
   ListUsers: (props) => <ListUsers {...props} />,
   AttachUserWithGroup: (props) => <AttachUserWithGroup {...props} />,
}

export default function Modal() {
   const dispatch = useAppDispatch()
   const { name, props, className, canClose } = useAppSelector((state) => state.modal)

   const handleClose = () => {
      if (canClose == undefined || canClose) {
         dispatch(modalHide())
      }
   }

   if (!name) {
      return
   }

   const contentModal = componentsAsidePanel[name]

   return (
      <div
         className="bg-black/50 fixed left-0 top-0 z-10 flex h-screen w-screen"
         onClick={handleClose}
      >
         <div
            className={`relative m-auto bg-firstBg p-4 ${className}`}
            onClick={(e) => e.stopPropagation()}
         >
            {(canClose == undefined || canClose) && (
               <div onClick={handleClose}>
                  <Cross className="absolute right-3 top-3 h-[16px] w-[16px] cursor-pointer text-white" />
               </div>
            )}
            {name && contentModal(props)}
         </div>
      </div>
   )
}
