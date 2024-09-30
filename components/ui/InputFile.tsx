import { useRef } from 'react'

type IInputFile = {
   text: string
   callback: (file: File) => void
}

export default function InputFile({ text, callback }: IInputFile) {
   const inputRef = useRef<HTMLInputElement | null>(null)
   const uuid = crypto.randomUUID()

   return (
      <>
         <label htmlFor={uuid} className="cursor-pointer">
            {text}
         </label>
         <input
            type="file"
            id={uuid}
            accept="image/*"
            ref={inputRef}
            onChange={(e) => {
               e.stopPropagation()
               if (!inputRef.current?.files) return
               callback(inputRef.current?.files[0])
            }}
            className="hidden"
         />
      </>
   )
}
