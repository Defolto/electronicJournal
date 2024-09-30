import { Text } from '@react-email/components'
import { formatDate } from '../../../helpers/functions'
import { IUser } from '../../../types'
import WrapperEmail from './WrapperEmail'

export default function ConfirmUser({ login, info, email, id }: IUser & { id: string }) {
   const { name, surname, birthday } = info

   return (
      <WrapperEmail>
         <Text className="mb-2 mt-4 text-center text-xl font-bold uppercase">
            Запрос на подтверждение
         </Text>
         <Text>id: {id}</Text>
         <Text>Логин: {login}</Text>
         <Text>Почта: {email}</Text>
         <Text>Имя: {name}</Text>
         <Text>Фамилия: {surname}</Text>
         <Text>День рождения: {formatDate(birthday, 'date')}</Text>
      </WrapperEmail>
   )
}
