export default function Scroll({
   children,
   className,
}: {
   children: JSX.Element
   className?: string
}) {
   return <div className={`overflow-y-auto ${className}`}>{children}</div>
}
