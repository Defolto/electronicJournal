import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { CODE_LENGTH, REG_EXP_NUMBER } from '../../../../helpers/constants'
import { deleteCookie, getCookie, setCookie } from '../../../../helpers/cookie'
import { createFetchWithoutRedux } from '../../../../helpers/createFetch'
import { Button } from '../../../ui/Button'
import { Input } from '../../../ui/Input'

/**
 * Компонент подтверждения почты
 */
export default function ConfirmComponent() {
   const [codeConfirm, setCodeConfirm] = useState<string>('')
   const [inProgress, setInProgress] = useState(false)
   const router = useRouter()

   const confirmCode = useCallback(
      (code: string) => {
         if (code.length !== CODE_LENGTH) {
            alert('Код введён не полностью')
            return
         }

         const id = getCookie('interim_id')
         if (!id) {
            alert('Не обнаружен временный айди. Обновитесь и повторите регистрацию заново')
            return
         }

         setInProgress(true)
         createFetchWithoutRedux('user/confirm', {
            id,
            code,
         })
            .then((res) => {
               setCookie('user_id', res.data)
               deleteCookie('interim_id')
               router.push('/profile')
            })
            .finally(() => setInProgress(false))
      },
      [router]
   )

   const onSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      confirmCode(codeConfirm)
   }

   useEffect(() => {
      if (codeConfirm.length === CODE_LENGTH) {
         confirmCode(codeConfirm)
      }
   }, [codeConfirm, confirmCode])

   return (
      <form
         className="bg-black/25 flex h-full w-full flex-col items-center justify-center"
         onSubmit={onSubmit}
      >
         <p className="mb-5 text-center text-xl font-bold text-white">Введите код с почты</p>

         <Input
            className="h-[50px] w-[140px] bg-white text-center text-3xl font-bold tracking-[10px]"
            value={codeConfirm}
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
               const code = e.target.value
               if (code.length > CODE_LENGTH || !REG_EXP_NUMBER.test(code)) {
                  return
               }

               setCodeConfirm(code)
            }}
            maxLength={CODE_LENGTH}
            disabled={inProgress}
         />

         <Button
            disabled={inProgress}
            inProgress={inProgress}
            className="mx-auto mt-2 bg-gray px-10"
            type="submit"
         >
            Подтвердить
         </Button>
      </form>
   )
}
