import { getRandom, getRelativeFileSrc } from '../../helpers/functions'

const colors = ['bg-green', 'bg-blue', 'bg-red', 'bg-yellow']

type AvatarProps = {
   size: number
   avatar?: string
}

function AvatarDefault({ size }: { size: number }) {
   const background = colors[getRandom(0, colors.length - 1)]

   return (
      <div
         className={`rounded-full ${background}`}
         style={{ width: size, height: size, minHeight: size, minWidth: size }}
      />
   )
}

export default function Avatar({ avatar, size }: AvatarProps) {
   if (!avatar) {
      return <AvatarDefault size={size} />
   }

   const src = getRelativeFileSrc(avatar)

   return (
      <img
         src={src}
         style={{ width: size, height: size, minHeight: size, minWidth: size }}
         className="rounded-full object-cover"
      />
   )
}
