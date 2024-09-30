'use client'

import { useState } from 'react'
import LogInMain from './LogIn/LogInMain'
import SignUpMain from './SignUp/SignUpMain'

function TabEntry({
   type,
   setEntry,
   className,
}: {
   type: 'signIn' | 'signUp'
   setEntry: (value: boolean) => void
   className?: string
}) {
   return (
      <p
         className={`w-1/2 cursor-pointer py-4 text-center text-base transition-[font-size] ${className}`}
         onClick={() => setEntry(type === 'signIn')}
      >
         {type === 'signIn' ? 'Вход' : 'Регистрация'}
      </p>
   )
}

export default function Entry() {
   const [entry, setEntry] = useState<boolean>(true)

   return (
      <div className="bg-black/25 my-auto flex h-[375px] w-[350px] flex-col overflow-hidden rounded-2xl">
         <div className="flex flex-row">
            <TabEntry
               type="signIn"
               setEntry={setEntry}
               className={entry ? 'bg-black/25 rounded-tr-2xl !text-2xl' : ''}
            />
            <TabEntry
               type="signUp"
               setEntry={setEntry}
               className={!entry ? 'bg-black/25 rounded-tl-2xl !text-2xl' : ''}
            />
         </div>
         {entry ? <LogInMain /> : <SignUpMain />}
      </div>
   )
}
