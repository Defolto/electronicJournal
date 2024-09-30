import type { Metadata } from 'next'
import MenuSubjects from '../../components/features/Materials/MenuSubjects'
import WrapperContent from '../../components/features/WrapperContent'

export const metadata: Metadata = {
   title: 'HelpFront | Предметы',
   description: 'Предметы helpFront',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return (
      <WrapperContent>
         <div className="flex flex-row">
            <MenuSubjects />
            {children}
         </div>
      </WrapperContent>
   )
}
