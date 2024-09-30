import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { ITextType } from '../../../app/api/wordle/functions'
import {
   MS_IN_DAY,
   MS_IN_HOUR,
   MS_IN_MINUTES,
   REG_EXP_RUS_WORD_CASE_INSENSITIVE,
   REWARD_5_LETTERS,
   WORDLE_COLS,
   WORDLE_ROWS,
} from '../../../helpers/constants'
import { createFetch } from '../../../helpers/createFetch'
import { addZero, calcPercent, getMass } from '../../../helpers/functions'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { notVerifiedUser } from '../../../store/notifications/notificationsAction'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import {
   selectVerifiedUser,
   userMoneyChanged,
   userWordleChanged,
} from '../../../store/user/userSlice'
import { IAskWordle, IUserWordle } from '../../../types'
import { Button } from '../../ui/Button'

type IGameState = { id: string; win: boolean; gameRun: boolean; lastGame: Date | null }

function canPlay(lastGame: Date | null): boolean {
   if (!lastGame) {
      return false
   }

   const lastGameDate = new Date(lastGame)
   lastGameDate.setDate(lastGameDate.getDate() + 1) // добавление суток

   return new Date() > lastGameDate
}

function getDifferenceTime(lastGame: Date): number {
   const lastGameDate = new Date(lastGame)
   const now = new Date()

   return MS_IN_DAY - (now.getTime() - lastGameDate.getTime())
}

function Timer({ lastGame }: { lastGame: Date | null }) {
   const [diff, setDiff] = useState<number | null>(null)

   useEffect(() => {
      if (!lastGame) {
         setDiff(() => null)
         return
      }

      const diff = getDifferenceTime(lastGame)
      setDiff(() => diff)
   }, [lastGame])

   useEffect(() => {
      if (lastGame && diff && diff > 0) {
         setTimeout(() => {
            const newDiff = getDifferenceTime(lastGame)
            setDiff(() => newDiff)
         }, 1000)
      }
   }, [diff, lastGame])

   if (!diff) {
      return <div>Загрузка...</div>
   }

   const hours = Math.floor(diff / MS_IN_HOUR)
   const minutes = Math.floor((diff - hours * MS_IN_HOUR) / MS_IN_MINUTES)
   const seconds = Math.floor((diff - hours * MS_IN_HOUR - minutes * MS_IN_MINUTES) / 1000)

   return (
      <div>
         Новая игра через {addZero(hours)}:{addZero(minutes)}:{addZero(seconds)}
      </div>
   )
}

function WordleFooter({ winGames, loseGames, recordWinGames, averageTrys }: Partial<IUserWordle>) {
   const dispatch = useAppDispatch()
   const [wordleInfo, setWordleInfo] = useState<'rules' | 'statistics'>('rules')

   const canShowStatistics = !!((winGames || loseGames) && averageTrys)

   const changeWordleInfo = (value: 'rules' | 'statistics') => {
      if (value === 'statistics') {
         if (!canShowStatistics) {
            dispatch(
               notificationShow({
                  type: 'info',
                  message: 'Нет сыгранных игр для статистики',
               })
            )
            return
         }

         setWordleInfo('statistics')
         return
      }

      setWordleInfo('rules')
   }

   return (
      <>
         <div className="my-3 flex flex-row">
            <p
               className={clsx(
                  'w-1/2 cursor-pointer text-center',
                  wordleInfo === 'rules' && 'text-green underline'
               )}
               onClick={() => changeWordleInfo('rules')}
            >
               Правила
            </p>
            <p
               className={clsx(
                  'w-1/2 cursor-pointer text-center',
                  wordleInfo === 'statistics' && 'text-green underline'
               )}
               onClick={() => changeWordleInfo('statistics')}
            >
               Статистика
            </p>
         </div>

         <div className="flex h-[110px] items-center">
            {wordleInfo === 'rules' && (
               <div className="flex flex-col gap-3">
                  <div className="flex flex-row gap-2">
                     <div className="bg-white/50 h-6 w-6" />
                     <p>- буквы нет в слове</p>
                  </div>
                  <div className="flex flex-row gap-2">
                     <div className="h-6 w-6 bg-yellow" />
                     <p>- буква есть, но неправильное место</p>
                  </div>
                  <div className="flex flex-row gap-2">
                     <div className="h-6 w-6 bg-green" />
                     <p>- буква на нужной позиции</p>
                  </div>
               </div>
            )}

            {wordleInfo === 'statistics' && canShowStatistics && (
               <div className="flex flex-col gap-1">
                  <p>
                     Успешных игр: {calcPercent(winGames ?? 0, (loseGames ?? 0) + (winGames ?? 0))}%
                  </p>
                  <p>В среднем попыток: {averageTrys}</p>
                  <p>Всего отгадано слов: {winGames}</p>
                  <p>Слов отгадано подряд: {recordWinGames ?? 0}</p>
               </div>
            )}
         </div>
      </>
   )
}

// Серый - мимо,
// Жёлтый - есть буква, но не на том месте
// Зелёный - угадал
export default function Wordle() {
   const dispatch = useAppDispatch()
   const userWordle = useAppSelector((state) => state.user.wordle)
   const verifiedUser = useAppSelector(selectVerifiedUser)

   const [texts, setTexts] = useState<ITextType[][]>([[]])
   const [gameState, setGameState] = useState<IGameState>({
      id: '',
      win: false,
      gameRun: false,
      lastGame: null,
   })

   const startGame = () => {
      if (!verifiedUser) {
         dispatch(notVerifiedUser())
         return
      }

      dispatch(createFetch({ api: 'wordle/init' })).then(({ payload }) => {
         if (!payload) return

         setGameState((prev) => {
            return { ...prev, gameRun: true, id: payload, lastGame: new Date() }
         })
      })
   }

   const checkWord = useCallback(
      async (indexRow: number, items: ITextType[][]) => {
         let res
         try {
            res = await dispatch(
               createFetch({
                  api: 'wordle/ask',
                  data: {
                     word: items[indexRow].reduce(
                        (word, item) => word + item.letter.toLowerCase(),
                        ''
                     ),
                     id: gameState.id,
                  },
               })
            )
         } catch (e: any) {}

         // Если не пришёл ответ, значит покажется нотифка, а в catch удалим введённую букву
         if (!res?.payload) {
            throw new Error()
         }

         const { colors, win, gameRun, userWordle } = res.payload as IAskWordle
         if (!gameRun) {
            dispatch(
               notificationShow({
                  message: win
                     ? `Победа! Ты получаешь ${REWARD_5_LETTERS} коинов!`
                     : 'Увы, но ты проиграл',
                  type: win ? 'success' : 'error',
               })
            )

            if (win) {
               dispatch(userMoneyChanged(REWARD_5_LETTERS))
            }

            dispatch(userWordleChanged(userWordle))
            setGameState((prev) => ({ ...prev, gameRun, win }))
         }

         colors.forEach((color, index) => {
            items[indexRow][index].color = color
         })

         return items
      },
      [gameState, dispatch]
   )

   useEffect(() => {
      const handleKeydown = (event: KeyboardEvent) => {
         if (!gameState.gameRun) {
            return
         }

         const { key } = event
         // Если ввели какую-то хрень
         if (!REG_EXP_RUS_WORD_CASE_INSENSITIVE.test(key) && key !== 'Backspace') {
            return
         }

         let items = texts.slice()
         const indexRow = items.length - 1

         if (REG_EXP_RUS_WORD_CASE_INSENSITIVE.test(key)) {
            items[indexRow].push({ color: '', letter: key })
         }

         if (key == 'Backspace') {
            items[indexRow].pop()
         }

         // Слово написано полностью
         if (items[indexRow].length === WORDLE_COLS) {
            checkWord(indexRow, items)
               .then((value) => {
                  const newItems = value.slice()
                  newItems.push([])

                  setTexts(() => newItems)
               })
               .catch(() => {
                  // TODO: обойтись без catch, но тогда без setTexts от куда-то меняется texts
                  const newItems = items.slice()
                  const indexRow = newItems.length - 1
                  newItems[indexRow].pop()

                  setTexts(() => newItems)
               })
         } else {
            setTexts(() => items)
         }
      }

      window.addEventListener('keydown', handleKeydown)

      return () => {
         window.removeEventListener('keydown', handleKeydown)
      }
   }, [texts, checkWord, dispatch, gameState])

   useEffect(() => {
      dispatch(createFetch({ api: 'wordle/info' })).then(({ payload }) => {
         if (!payload) return

         if (payload.status === 'noGame') {
            setGameState((prev) => {
               return { ...prev, ...payload.gameState }
            })
            return
         }

         setGameState((prev) => {
            return { ...prev, ...payload.gameState }
         })

         setTexts(() => payload.texts)
      })
   }, [dispatch])

   return (
      <>
         <div className={`flex flex-row items-center gap-${texts.length == 0 ? '4' : '1'}`}>
            <p className="text-2xl">5БУКВ</p>
            {!gameState.gameRun && canPlay(gameState.lastGame) ? (
               <Button className="bg-blue !py-1" onClick={startGame}>
                  Начать
               </Button>
            ) : (
               <Timer lastGame={gameState.lastGame} />
            )}
         </div>
         <p className="leading-5">Отгадайте ежедневное слово и получите гарантированную награду</p>

         <div className="mt-6 flex flex-col items-center">
            {getMass(WORDLE_ROWS).map((_, row) => (
               <div className="flex w-full" key={row}>
                  {getMass(WORDLE_COLS).map((_, col) => {
                     const hasItem = row < texts.length && col < texts[row].length
                     const isCurrentRow = texts.length - 1 === row
                     const isLastCol = isCurrentRow && texts[row]?.length === col
                     const needShowLine = isLastCol && gameState.gameRun

                     return (
                        <div
                           className={clsx(
                              'm-0.5 flex aspect-square w-full items-center justify-center border-2 border-white text-2xl uppercase text-black',
                              hasItem && texts[row][col].color,
                              isCurrentRow && '!text-white'
                           )}
                           key={col}
                        >
                           <span
                              className={needShowLine ? 'animate-[blink_1s_linear_infinite]' : ''}
                           >
                              {hasItem ? texts[row][col].letter : needShowLine ? '|' : ''}
                           </span>
                        </div>
                     )
                  })}
               </div>
            ))}
         </div>

         <WordleFooter {...userWordle} />
      </>
   )
}
