// @ts-nocheck
import { useState } from 'react'

export default function WrapperWidget({ children }: { children: React.ReactNode }) {
   const [sawWidget, setSawWidget] = useState(false)

   if (!children) {
      return null
   }

   const handleClick = () => {
      setSawWidget((prevState) => !prevState)
   }

   return (
      <div className="group relative box-border flex flex-col gap-2 overflow-hidden rounded-lg bg-gray p-2 transition-all hover:pb-5">
         <div
            className="group/line absolute -bottom-4 left-0 flex h-4 w-full cursor-pointer items-center justify-center bg-secondBg transition-[bottom] group-hover:bottom-0"
            onClick={handleClick}
         >
            <div className="h-0.5 w-1/4 rounded-lg bg-white shadow-lg transition-[width] group-hover/line:w-1/3" />
         </div>
         <div>{children[0]}</div>
         {sawWidget && <div>{children[1]}</div>}
      </div>
   )
}
