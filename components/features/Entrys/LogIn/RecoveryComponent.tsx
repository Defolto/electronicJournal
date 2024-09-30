import { FormEvent, useState } from 'react'
import { createFetchWithoutRedux } from '../../../../helpers/createFetch'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { getLoginAndEmail } from '../EntryFunctions'

/**
 * Компонент сброса пароля
 */
export default function RecoveryComponent({
   setComponentName,
}: {
   setComponentName: (componentName: 'login') => void
}) {
   const [inProgress, setInProgress] = useState(false)

   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const { email, login } = getLoginAndEmail(formData)

      setInProgress(true)
      createFetchWithoutRedux('user/recoveryPassword', { login, email })
         .then((res) => {
            alert(res.data)
            setComponentName('login')
         })
         .catch((e) => {
            alert(e)
         })
         .finally(() => setInProgress(false))
   }

   return (
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
         <p>Введите почту или логин от аккаунта</p>
         <Input
            disabled={inProgress}
            view="entry"
            type="text"
            name="data"
            placeholder="Почта или логин"
         />
         <Button
            disabled={inProgress}
            view="entry"
            className="mx-auto px-10"
            type="submit"
            inProgress={inProgress}
         >
            Отправить пароль
         </Button>
      </form>
   )
}
