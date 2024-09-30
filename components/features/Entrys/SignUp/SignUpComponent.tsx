import { FormEvent, useState } from 'react'
import {
   MAX_LENGTH_LOGIN,
   MIN_LENGTH_LOGIN,
   MIN_LENGTH_PASSWORD,
   NOT_EVERYTHING_IS_FILLED,
   REG_EXP_EMAIL,
   REG_EXP_LOGIN,
   REG_EXP_RUS_WORD,
} from '../../../../helpers/constants'
import { setCookie } from '../../../../helpers/cookie'
import { createFetchWithoutRedux } from '../../../../helpers/createFetch'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'

type IDataUser = {
   name?: string
   surname?: string
   email?: string
   login?: string
   password?: string
   retryPassword?: string
}

function isValidDataUser(user: IDataUser): boolean {
   const { name, surname, retryPassword, password, email, login } = user

   if (!name || !surname || !retryPassword || !password || !email || !login) {
      alert(NOT_EVERYTHING_IS_FILLED)
      return false
   }

   if (retryPassword !== password) {
      alert('Пароли не совпадают')
      return false
   }

   if (password.length < MIN_LENGTH_PASSWORD) {
      alert(`Минимальная длинна пароля от ${MIN_LENGTH_PASSWORD} символов`)
      return false
   }

   if (!REG_EXP_RUS_WORD.test(name)) {
      alert('Неправильный формат имени')
      return false
   }

   if (!REG_EXP_RUS_WORD.test(surname)) {
      alert('Неправильный формат фамилии')
      return false
   }

   if (!REG_EXP_EMAIL.test(email)) {
      alert('Неправильный формат почты')
      return false
   }

   if (!REG_EXP_LOGIN.test(login)) {
      alert(
         `Размер логина от ${MIN_LENGTH_LOGIN} до ${MAX_LENGTH_LOGIN} с использованием латиницы, кириллицы, тире, подчёркивания и цифр`
      )
      return false
   }

   return true
}

/**
 * Компонент регистрации
 */
export default function SignUpComponent({
   setIsConfirmation,
}: {
   setIsConfirmation: (value: boolean) => void
}) {
   const [inProgress, setInProgress] = useState(false)

   // Парсинг слова, чтобы было с большой буквы и без лишних пробелов
   const handleChangeName = (e: any) => {
      const name = e.target.value
      e.target.value = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase()
   }

   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()

      const formData = new FormData(e.currentTarget)
      const user: IDataUser = {}

      // Вытягиваем все данные из формы
      for (let pair of formData.entries() as any) {
         // @ts-ignore
         user[pair[0]] = pair[1]
      }

      if (!isValidDataUser(user)) {
         return false
      }

      setInProgress(true)
      createFetchWithoutRedux('user/create', user)
         .then((res) => {
            setIsConfirmation(true)
            setCookie('interim_id', res.data)
         })
         .catch((e) => {
            alert(e)
         })
         .finally(() => setInProgress(false))
   }

   return (
      <form className="bg-black/25 flex h-full flex-col gap-3 px-6 pb-6 pt-4" onSubmit={onSubmit}>
         <div className="flex flex-row">
            <Input
               disabled={inProgress}
               view="entry"
               className="mr-2.5 !w-[140px]"
               type="text"
               placeholder="Имя"
               name="name"
               onChange={handleChangeName}
            />
            <Input
               disabled={inProgress}
               view="entry"
               className="ml-2.5 !w-[140px]"
               type="text"
               placeholder="Фамилия"
               name="surname"
               onChange={handleChangeName}
            />
         </div>
         <Input disabled={inProgress} view="entry" type="text" placeholder="Почта" name="email" />
         <Input disabled={inProgress} view="entry" type="text" placeholder="Логин" name="login" />
         <Input
            disabled={inProgress}
            view="entry"
            type="password"
            placeholder="Пароль"
            name="password"
         />
         <Input
            disabled={inProgress}
            view="entry"
            type="password"
            placeholder="Повторите пароль"
            name="retryPassword"
         />
         <Button
            disabled={inProgress}
            inProgress={inProgress}
            className="mx-auto mt-1 px-10"
            type="submit"
            view="entry"
         >
            Регистрация
         </Button>
      </form>
   )
}
