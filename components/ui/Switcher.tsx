import './Switcher.css'

export default function Switcher({
   onChange,
   checked,
}: {
   onChange: (value: boolean) => void
   checked: boolean
}) {
   const handle = (e: any) => {
      onChange(e.target.checked)
   }

   return (
      <label className="switch">
         <input type="checkbox" onChange={handle} checked={checked} />
         <span className="slider round"></span>
      </label>
   )
}
