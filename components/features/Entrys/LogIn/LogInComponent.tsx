import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import { setCookie } from '../../../../helpers/cookie'
import { createFetchWithoutRedux } from '../../../../helpers/createFetch'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'
import { getLoginAndEmail } from '../EntryFunctions'

/**
 * Компонент авторизации
 */
export default function LogInComponent({}: {}) {
   const [inProgress, setInProgress] = useState(false)
   const router = useRouter()

   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const password = formData.get('password')
      const { email, login } = getLoginAndEmail(formData)

      setInProgress(true)
      createFetchWithoutRedux('user/login', { login, email, password })
         .then((res) => {
            setCookie('user_id', res.data.userId)
            setCookie('groups_id', res.data.groupsId)
            router.push('/profile')
         })
         .catch((e) => {
            alert(e)
         })
         .finally(() => setInProgress(false))
   }

   return (
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
         <Input
            disabled={inProgress}
            view="entry"
            type="text"
            name="data"
            placeholder="Почта или логин"
         />
         <Input
            disabled={inProgress}
            view="entry"
            type="password"
            name="password"
            placeholder="Пароль"
         />
         <Button
            disabled={inProgress}
            view="entry"
            className="mx-auto px-10"
            type="submit"
            inProgress={inProgress}
         >
            Войти
         </Button>
      </form>
   )
}
