import { THEME_NAMES } from './helpers/constants'

export type ICandidate = {
   login: string
   email: string
   password: string
   confirmCode: string
   info: {
      name: string
      surname: string
      birthday?: Date
   }
   personalization?: {
      avatar?: string
      background?: string
      status?: string
      border?: string
   }
   collections?: Record<string, number[]>
}

export type IRole = 'guest' | 'student' | 'admin' | 'teacher'
export type ICustomization = {
   theme?: IThemeColors
   isShortToolbar?: boolean
}

export type IUserInfo = {
   name: string
   surname: string
   birthday?: Date
   gender?: 1 | 0 // 1 - мальчик, 0 - девочка
}

export type IAchievement = {
   icon: string
   title: string
   description: string
   reward: number
}

export type IUserWordle = {
   lastGame: Date
   id: string
   winGames: number
   loseGames: number
   recordWinGames: number
   averageTrys: number
}

export type IUserPersonalization = {
   avatar?: string
   background?: string
   border?: string
   about?: string
}

export type IUser = {
   login: string
   email: string
   password: string
   publicId: string
   info: IUserInfo
   money: number
   personalization?: IUserPersonalization // Всё что касается профиля
   collections?: Record<string, number[]>
   thanks: number
   role: IRole
   customization?: ICustomization // Всё что касается всего сайта
   achievements?: string[]
   verifying: boolean
   groups?: string[] // id классов
   wordle?: IUserWordle
}

export type ITheme = {
   title: string
   href: string
}

export type ISubject = {
   title: string
   href: string
   themes: ITheme[]
   author: string
}

export type IThemeName = keyof typeof THEME_NAMES
export type IThemeColors = Record<IThemeName, string>

export type IWordle = {
   randomWord: string
   rows: string[]
}

export type IUserEvent = {
   from: string
   title: string
   text: string
}

export type IAskWordle = {
   colors: string[]
   win: boolean
   gameRun: boolean
   userWordle: IUserWordle
}

export type IGroup = {
   id: string
   name: string
   number: number
   users: string[] // ПУБЛИЧНЫЙ id всех причастных к этому классу
   leader: string // ПУБЛИЧНЫЙ id юзера
   headman: string // ПУБЛИЧНЫЙ id юзера
   avatar: string
   status: string
   money: number
}

export type IHistory = {
   to: string // ПУБЛИЧНЫЙ! id юзера
   value: number
   title: string
   text: string
   from?: string // ПУБЛИЧНЫЙ! id юзера
   date?: Date // автоматически заполняется в changeBalanceUser()
}

export type IUserGroup = {
   info: IUserInfo
   login: string
   publicId: string
   personalization?: IUserPersonalization
}

export type ITask = {
   id: string
   text: string
   deadline: Date
   status: 'pending' | 'done'
   from: {
      publicId: string
      fullName: string
   }
   to: {
      publicId: string
      fullName: string
   }
   reward: number
}
