import { RARITY_WEIGHTS } from '../../../helpers/constants'
import { getRandom } from '../../../helpers/functions'

export function getRandomRarity() {
   const randomValue = Math.random()
   for (const [key, value] of Object.entries(RARITY_WEIGHTS)) {
      if (randomValue < value.minRarity && value.maxRarity > randomValue) {
         return key
      }
   }
   return 'common'
}

export function getRandomCart() {
   const randomRarity = getRandomRarity()
   // @ts-ignore хз как пофиксить
   return getRandom(RARITY_WEIGHTS[randomRarity].minCount, RARITY_WEIGHTS[randomRarity].maxCount)
}

export function usFirst(str: string) {
   if (!str) return str

   return str[0].toUpperCase() + str.slice(1)
}
