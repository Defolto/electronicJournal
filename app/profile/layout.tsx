import type { Metadata } from 'next'
import WrapperContent from '../../components/features/WrapperContent'

export const metadata: Metadata = {
   title: 'HelpFront | Профиль',
   description: 'профиль helpFront',
}

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode
}>) {
   return <WrapperContent>{children}</WrapperContent>
}
