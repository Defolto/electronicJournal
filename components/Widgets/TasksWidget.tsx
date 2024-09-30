import { formatDate } from '../../helpers/functions'
import { ITask } from '../../types'
import Scroll from '../features/Scroll'
import CheckMark from '../icons/CheckMark'
import Cross from '../icons/Cross'
import { Button } from '../ui/Button'
import WrapperWidget from './WrapperWidget'

const tasks: ITask[] = [
   {
      id: '1',
      text: 'Изучить метод map и рассказать на уроке метод map и рассказать на уроке метод map и рассказать на уроке',
      deadline: new Date(),
      status: 'pending',
      from: {
         publicId: '1',
         fullName: 'Максим Егоров',
      },
      to: {
         publicId: '2',
         fullName: 'Скворцова Анастасия',
      },
      reward: 150,
   },
]

const mass = tasks.concat(tasks).concat(tasks).concat(tasks).concat(tasks).concat(tasks)

export default function TasksWidget() {
   return (
      <WrapperWidget>
         <div className="flex flex-row gap-1">
            <p>Активные задачи: 3</p>
         </div>

         <Scroll className="my-3 flex h-[200px] flex-col gap-7">
            <>
               {mass.map((task) => (
                  <Task key={task.id} {...task} />
               ))}
            </>
         </Scroll>
      </WrapperWidget>
   )
}

function Task({ from, text, reward, deadline }: ITask) {
   return (
      <div className="pr-3">
         <div className="flex items-end justify-between">
            <p className="font-bold">От: {from.fullName}</p>
            <p className="text-sm">До: {formatDate(deadline, 'date')}</p>
         </div>
         <p className="italic leading-5">{text}</p>

         <div className="mt-2 flex flex-row">
            <p>Награда: {reward}</p>
            <div className="ml-auto flex flex-row items-end gap-3">
               <Button className="bg-green !py-1" title="Подтвердить">
                  <CheckMark className="h-4 w-4 text-black" />
               </Button>
               <Button className="bg-red !py-1" title="Отказаться">
                  <Cross className="h-4 w-4" />
               </Button>
            </div>
         </div>
      </div>
   )
}
