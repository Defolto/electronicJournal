import Entry from 'components/features/Entrys/Entry'
import MainAnimation from 'components/features/MainAnimation/MainAnimation'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
   const user_id = cookies().get('user_id')

   if (user_id) {
      redirect('/profile')
   }

   return (
      <main className="flex flex-col items-center">
         <section className="flex h-screen w-full max-w-screen-2xl justify-around">
            <MainAnimation />
            <div className="my-auto max-md:hidden">
               <h1 className="text-4xl font-bold text-black">
                  Электронный журнал нового поколения
               </h1>
               <h2 className="text-xl font-light text-white">Стильно, удобно, ахуенно</h2>
            </div>
            <Entry />
         </section>
      </main>
   )
}
