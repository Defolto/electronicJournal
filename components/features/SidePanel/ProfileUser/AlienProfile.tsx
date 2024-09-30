import { IGroup, IUser } from 'types'
import ProfileUser from './ProfileUser'

export default function AlienProfile({ groupsInfo, user }: { groupsInfo: IGroup[]; user: IUser }) {
   return <ProfileUser {...user} groupsInfo={groupsInfo} />
}
