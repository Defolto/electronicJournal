import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { selectLastSidePanel, sidePanelRemove } from '../../../store/sidePanelSlice'
import Cross from '../../icons/Cross'
import ProfileGroup from './ProfileGroup'
import AlienProfile from './ProfileUser/AlienProfile'
import MyProfile from './ProfileUser/MyProfile'

export type IComponentAsidePanel = 'AlienProfile' | 'ProfileGroup' | 'MyProfile'

const componentsAsidePanel: Record<IComponentAsidePanel, (props: any) => JSX.Element> = {
   AlienProfile: (props) => <AlienProfile {...props} />,
   MyProfile: (props) => <MyProfile {...props} />,
   ProfileGroup: (props) => <ProfileGroup {...props} />,
}

export default function SidePanel() {
   const dispatch = useAppDispatch()
   const componentSidePanel = useAppSelector(selectLastSidePanel)

   if (!componentSidePanel) {
      return
   }

   const handleClose = () => {
      dispatch(sidePanelRemove(componentSidePanel))
   }

   const { name, props, className } = componentSidePanel

   const contentModal = componentsAsidePanel[name]

   return (
      <div
         className="bg-black/50 fixed left-0 top-0 z-10 flex h-screen w-screen animate-[fadeIn_0.2s_ease-in-out_forwards]"
         onClick={handleClose}
      >
         <div
            className={`absolute right-0 top-0 h-full w-1/3 animate-[slideInLeft_0.2s_ease-in-out_forwards] bg-gray ${className}`}
            onClick={(e) => e.stopPropagation()}
         >
            <div onClick={handleClose} className="relative z-10">
               <Cross className="absolute right-3 top-3 h-[16px] w-[16px] cursor-pointer text-white" />
            </div>

            {name && contentModal(props)}
         </div>
      </div>
   )
}
