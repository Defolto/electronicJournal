import { Text } from '@react-email/components'
import WrapperEmail from './WrapperEmail'

export default function VerificationUser() {
   return (
      <WrapperEmail>
         <Text className="mb-2 mt-4 text-center text-xl font-bold">
            Ваш аккаунт был подтвержден.
         </Text>
         <Text className="text-center">
            Теперь вам доступен весь функционал электронного журнала
         </Text>
      </WrapperEmail>
   )
}
