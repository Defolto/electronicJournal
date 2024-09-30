import WrapperWidget from './WrapperWidget'

export default function EventsWidget() {
   return (
      <WrapperWidget>
         <div className="flex flex-row gap-4">
            <p className="text-xl font-bold">Ближайшие события</p>
            <p className="my-auto">03.07.2024</p>
         </div>

         <div className="my-3">
            <p>Frontend</p>
            <p className="italic">Проверочная работа по методам массивов в JS</p>
         </div>

         <p className="ml-auto cursor-pointer">Расписание →</p>
      </WrapperWidget>
   )
}
