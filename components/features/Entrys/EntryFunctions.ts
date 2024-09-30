import { REG_EXP_EMAIL } from 'helpers/constants'

export function getLoginAndEmail(formData: FormData) {
   const data = formData.get('data')

   let email: FormDataEntryValue | null = null
   let login: FormDataEntryValue | null = null

   if (REG_EXP_EMAIL.test(data as string)) {
      email = data
   } else {
      login = data
   }

   return { email, login }
}
