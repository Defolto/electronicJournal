import { IRole, IThemeColors } from 'types'

export const MIN_LENGTH_LOGIN = 5
export const MAX_LENGTH_LOGIN = 15
// https://regexper.com для проверок регулярки
export const REG_EXP_LOGIN = new RegExp(
   `^[a-zA-Z0-9а-яА-Я-_ ]{${MIN_LENGTH_LOGIN},${MAX_LENGTH_LOGIN}}$`
)
export const REG_EXP_EMAIL = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
export const MIN_LENGTH_PASSWORD = 6
export const REG_EXP_RUS_WORD_CASE_INSENSITIVE = /[А-я][а-яё]*$/
export const REG_EXP_RUS_WORD = /^[А-Я][а-яё]*$/
export const REG_EXP_NUMBER = /^[0-9]*$/
export const REG_EXP_SPECIAL_SYMBOLS =
   /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~\u2028\u2029\u00A0\u1680\u180E\u2000-\u200A\u202F\u205F\u3000]/g
export const CODE_LENGTH = 4
export const ROLE_RUS: Record<IRole, string> = {
   admin: 'администратор',
   guest: 'гость',
   student: 'ученик',
   teacher: 'учитель',
}
export const THEME_NAMES = {
   '--first-bg-color': 'Основной фон',
   '--second-bg-color': 'Второстепенный фон',
   '--red-color': 'Цвет выделения 1',
   '--blue-color': 'Цвет выделения 2',
   '--green-color': 'Цвет выделения 3',
   '--white-color': 'Яркий цвет',
   '--black-color': 'Тёмный цвет',
   '--gray-color': 'Обычный цвет',
   '--yellow-color': 'Жёлтый цвет',
}

export const DEFAULT_THEME: IThemeColors = {
   '--first-bg-color': '#383C47',
   '--second-bg-color': '#272B34',
   '--red-color': '#FF4342',
   '--blue-color': '#3472FB',
   '--white-color': '#FEFEFE',
   '--green-color': '#2FFB78',
   '--gray-color': '#5D6C89',
   '--black-color': '#000000',
   '--yellow-color': '#FFD700',
}

export enum ROLES {
   guest,
   student,
   teacher,
   admin,
}

export const COLLECTION_LENGTH = 30
export const LEGENDARY_LAST_COUNT = 2
export const EPIC_LAST_COUNT = 6
export const RARE_LAST_COUNT = 14
export const RARITY_WEIGHTS = {
   legendary: {
      minRarity: 0,
      maxRarity: 0.05,
      minCount: 0,
      maxCount: LEGENDARY_LAST_COUNT,
   },
   epic: {
      minRarity: 0.06,
      maxRarity: 0.15,
      minCount: LEGENDARY_LAST_COUNT,
      maxCount: EPIC_LAST_COUNT,
   },
   rare: {
      minRarity: 0.16,
      maxRarity: 0.3,
      minCount: EPIC_LAST_COUNT,
      maxCount: RARE_LAST_COUNT,
   },
   common: {
      minRarity: 0.31,
      maxRarity: 0.6,
      minCount: RARE_LAST_COUNT,
      maxCount: COLLECTION_LENGTH,
   },
}

export const MAX_SIZE_FILES: Record<string, number> = {
   avatar: 3 * 1024 * 1024, // 3MB
   background: 10 * 1024 * 1024, // 10MB
}

export const WORDLE_ROWS = 6
export const WORDLE_COLS = 5

export const RUS_TO_ENG_SMALL = {
   а: 'a',
   б: 'b',
   в: 'v',
   г: 'g',
   д: 'd',
   е: 'e',
   ё: 'e',
   ж: 'zh',
   з: 'z',
   и: 'i',
   й: 'y',
   к: 'k',
   л: 'l',
   м: 'm',
   н: 'n',
   о: 'o',
   п: 'p',
   р: 'r',
   с: 's',
   т: 't',
   у: 'u',
   ф: 'f',
   х: 'h',
   ц: 'c',
   ч: 'ch',
   ш: 'sh',
   щ: 'sch',
   ь: '',
   ы: 'y',
   ъ: '',
   э: 'e',
   ю: 'yu',
   я: 'ya',
}

export const RUS_TO_ENG_LARGE = Object.entries(RUS_TO_ENG_SMALL).reduce((obj, [key, value]) => {
   // @ts-ignore странная ошибка TS
   obj[key.toUpperCase()] = value.charAt(0).toUpperCase() + value.slice(1)
   return obj
}, {})

export const MS_IN_DAY = 86_400_000
export const MS_IN_HOUR = 3_600_000
export const MS_IN_MINUTES = 60_000

export const REWARD_5_LETTERS = 100
export const NOT_VERIFIED_USER_TEXT = 'Заблокированно демо пользователям'
export const NOT_EVERYTHING_IS_FILLED = 'Не все данные заполнены'
export const BACKEND_ERROR_TEXT = 'Общая ошибка сервера'
export const ID_NOT_FOUND_TEXT = 'Id пользователя не передан'
export const SMALL_ROLE_TEXT = 'Недостаточно прав'
