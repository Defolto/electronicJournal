import { getRandom } from '../../../helpers/functions'
import dict from '../../../public/dictionary.json'

export function getRandomWord() {
   const randomWord = dict.words[getRandom(0, dict.words.length)]
   return randomWord.toLowerCase()
}

export function getYellow(randomWord: string, targetWord: string) {
   return targetWord.split('').map((value, index) => randomWord.includes(value))
}

export function getGreen(randomWord: string, targetWord: string) {
   return targetWord.split('').map((value, index) => value === randomWord[index])
}

export function isWordInList(word: string) {
   return dict.words.includes(word[0].toUpperCase() + word.slice(1))
}

export function getColors(yellow: boolean[], green: boolean[]) {
   return yellow.map((value, index) => {
      if (value && green[index]) {
         return 'bg-green'
      }
      if (value) {
         return 'bg-yellow'
      }

      return 'bg-white/50'
   })
}

export function getColorsText(randomWord: string, word: string) {
   const green = getGreen(randomWord, word)
   const yellow = getYellow(randomWord, word)
   return getColors(yellow, green)
}

export type ITextType = { color: string; letter: string }
export function getRows(words: string[], randomWord: string): ITextType[][] {
   const rows: ITextType[][] = []

   words.forEach((word) => {
      const row: ITextType[] = []
      const colors = getColorsText(randomWord, word)

      word.split('').forEach((letter, j) => {
         row.push({ color: colors[j], letter })
      })

      rows.push(row)
   })

   // В конце всегда должен быть пустой массив для нового слова
   rows.push([])

   return rows
}
