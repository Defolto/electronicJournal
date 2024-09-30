import { Text } from '@react-email/components'
import WrapperEmail from './WrapperEmail'

export default function ConfirmCodeEmail({ confirmCode }: { confirmCode: string }) {
   return (
      <WrapperEmail>
         <Text className="mb-2 mt-4 text-center text-xl font-bold uppercase">
            Код подтверждения
         </Text>
         <Text className="bg-black/5 my-4 rounded py-5 text-center text-4xl font-bold">
            {confirmCode}
         </Text>
         <Text className="text-center text-[#444]">
            Если вы не регистировались на helpfront, просто проигнорируйте его.
         </Text>
      </WrapperEmail>
   )
}
