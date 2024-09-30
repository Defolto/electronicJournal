// ВАЖНО!!! Вызывать только в callback-ах или useEffect

export type SESSION_STORAGE_KEYS = 'isShortToolbar'

export function setSessionStorage(key: SESSION_STORAGE_KEYS, value: any): void {
   const jsonValue = JSON.stringify(value)
   sessionStorage.setItem(key, jsonValue)
}

export function getSessionStorage(key: SESSION_STORAGE_KEYS): any {
   const value = sessionStorage.getItem(key)
   if (!value) {
      return null
   }
   return JSON.parse(value)
}

export function removeSessionStorage(key: SESSION_STORAGE_KEYS): void {
   sessionStorage.removeItem(key)
}
