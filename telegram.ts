import { isProduction } from './mongoDB/general'

export function getAdmins() {
   return [1579871159, 1024450100]
}

export function sendError(message: string) {
   const isProd = isProduction()
   if (!isProd) {
      return
   }

   getAdmins().forEach((admin) => {
      const url = 'text'

      const options = {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'User-Agent': 'insomnia/9.3.3' },
         body: `{"chat_id":${admin},"text":"${message} #helpfrontError"}`,
      }
      fetch(url, options).then()
   })
}
