import clsx from 'clsx'
import { forwardRef } from 'react'

type Props = {
   view?: 'confirmUser'
} & React.SelectHTMLAttributes<HTMLSelectElement>

export const Select = forwardRef<HTMLSelectElement, Props>(({ className, view, ...props }, ref) => {
   return (
      <select
         className={clsx(
            className,
            'border-0 text-black outline-0',
            view === 'confirmUser' && 'box-border w-[200px] rounded-md px-2 py-1 text-lg'
         )}
         ref={ref}
         {...props}
      ></select>
   )
})

Select.displayName = 'Select'
