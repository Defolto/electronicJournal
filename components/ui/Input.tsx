import clsx from 'clsx'
import { forwardRef, useState } from 'react'
import Eye from '../icons/Eye'

type Props = {
   view?: 'entry' | 'confirmUser' | 'materials'
} & React.InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, Props>(
   ({ className, view, type, ...props }, ref) => {
      const [localType, setLocalType] = useState<string | undefined>(type)

      const showPassword = () => {
         setLocalType(localType === 'password' ? 'text' : 'password')
      }

      return (
         <label className="relative">
            <input
               className={clsx(
                  className,
                  'border-0 text-black outline-0',
                  view === 'entry' && 'box-border w-[300px] rounded-md px-2 py-1 text-lg',
                  view === 'confirmUser' && 'box-border w-[200px] rounded-md px-2 py-1 text-lg',
                  view === 'materials' && 'box-border w-[300px] rounded-md px-2 py-1 text-lg'
               )}
               ref={ref}
               type={localType}
               {...props}
            />
            {type === 'password' && (
               <span
                  className="absolute right-0 top-0 flex h-full cursor-pointer"
                  onClick={showPassword}
               >
                  <Eye className="my-auto mr-1 text-black" isOpen={localType === 'password'} />
               </span>
            )}
         </label>
      )
   }
)

Input.displayName = 'Input'
