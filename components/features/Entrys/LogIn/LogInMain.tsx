import { useState } from 'react'
import QrLogIn from '../../QrCode/QrLogIn'
import LogInComponent from './LogInComponent'
import RecoveryComponent from './RecoveryComponent'

/**
 * Компонент, всё что связано с авторизацией
 */
export default function LogInMain() {
   const [componentName, setComponentName] = useState<'qr' | 'login' | 'recovery'>('login')

   const changeTypeLogIn = () => {
      setComponentName((prev) => (prev === 'login' ? 'qr' : 'login'))
   }

   const handleResetPassword = () => {
      setComponentName('recovery')
   }

   return (
      <div className="bg-black/25 flex h-full flex-col px-6 py-4">
         <div className="my-auto">
            {componentName === 'login' && <LogInComponent />}
            {componentName === 'qr' && <QrLogIn />}
            {componentName === 'recovery' && (
               <RecoveryComponent setComponentName={setComponentName} />
            )}
         </div>

         <div className="mx-auto flex flex-col gap-1 text-center">
            <p className="cursor-pointer hover:text-green" onClick={handleResetPassword}>
               Забыли пароль?
            </p>
            <p className="cursor-pointer hover:text-green" onClick={changeTypeLogIn}>
               Войти по {componentName === 'login' ? 'qr коду' : 'логину и паролю'}
            </p>
         </div>
      </div>
   )
}
