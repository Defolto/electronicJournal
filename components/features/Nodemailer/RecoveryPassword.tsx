import { Text } from '@react-email/components'
import { IUser } from '../../../types'
import WrapperEmail from './WrapperEmail'

export default function RecoveryPassword({ password }: IUser) {
   return (
      <WrapperEmail>
         <Text className="mb-2 mt-4 text-center text-lg font-bold uppercase text-black">
            Ваш пароль от аккаунта
         </Text>
         <Text className="my-4 rounded text-center text-lg text-black">{password}</Text>
      </WrapperEmail>
   )
}
