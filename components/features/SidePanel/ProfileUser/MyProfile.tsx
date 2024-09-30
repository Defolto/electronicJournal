import { selectMassGroups } from '../../../../store/groups/groupsSlice'
import { useAppSelector } from '../../../../store/hooks'
import ProfileUser from './ProfileUser'

export default function MyProfile() {
   const user = useAppSelector((state) => state.user)
   const groups = useAppSelector(selectMassGroups)

   // @ts-ignore проработать потом типизацию
   return <ProfileUser {...user} groupsInfo={groups} />
}
