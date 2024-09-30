import {
   MAX_SIZE_FILES,
   REG_EXP_SPECIAL_SYMBOLS,
   RUS_TO_ENG_LARGE,
   RUS_TO_ENG_SMALL,
} from './constants'

export function getRandom(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

export function getMass(length: number): any[] {
   return new Array(length).fill(0)
}

export function translit(word: string) {
   let answer = ''
   const converter: any = Object.assign(RUS_TO_ENG_SMALL, RUS_TO_ENG_LARGE)

   for (let i = 0; i < word.length; i++) {
      if (!converter[word[i]]) {
         answer += word[i]
      } else {
         answer += converter[word[i]]
      }
   }

   return answer.replaceAll(REG_EXP_SPECIAL_SYMBOLS, '').replaceAll(' ', '-').toLowerCase()
}

export function formatDate(
   date: Date | null | undefined,
   options?: Intl.DateTimeFormatOptions | 'full' | 'date'
): string | undefined {
   if (!date) {
      return undefined
   }

   if (options === 'full') {
      return new Date(date).toLocaleString('ru', {
         year: 'numeric',
         month: 'numeric',
         day: 'numeric',
         hour: 'numeric',
         minute: 'numeric',
         second: 'numeric',
         hour12: false,
      })
   }

   if (options === 'date') {
      return new Date(date).toLocaleString('ru', {
         year: 'numeric',
         month: 'numeric',
         day: 'numeric',
      })
   }

   return new Date(date).toLocaleString('ru', options)
}

export function getGender(gender?: 1 | 0) {
   if (gender === undefined) {
      return undefined
   }

   return gender === 1 ? 'мужской' : 'женский'
}

export function checkFileSize(type: string, size: number) {
   const maxSize = MAX_SIZE_FILES[type]
   if (size >= maxSize) {
      return `Файл слишком большой, максимальный размер - ${maxSize / (1024 * 1024)} МБ`
   }
   return 'ok'
}

export function addZero(value: number): string {
   return value >= 10 ? '' + value : '0' + value
}

export function calcPercent(num1: number, num2: number) {
   if (num2 === 0) {
      return 100
   }
   const res = (num1 / num2) * 100
   const hasFraction = res.toString().includes('.')

   return hasFraction ? res.toFixed(2) : res
}

export function isVerifiedUser(user: any): boolean {
   return user.role !== 'guest' && user.login
}

export function getRelativeFileSrc(file: string) {
   const isDev = file.includes('public')
   return isDev ? file.split('public')[1] : file.split('www')[1]
}
