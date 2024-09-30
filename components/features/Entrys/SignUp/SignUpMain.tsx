import { useState } from 'react'
import ConfirmComponent from './ConfirmComponent'
import SignUpComponent from './SignUpComponent'

/**
 * Компонент, всё что связано с регистрацией
 */
export default function SignUpMain() {
   const [isConfirmation, setIsConfirmation] = useState<boolean>(false)

   if (isConfirmation) {
      return <ConfirmComponent />
   }

   return <SignUpComponent setIsConfirmation={setIsConfirmation} />
}
