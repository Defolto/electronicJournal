import { Body, Container, Font, Head, Html, Tailwind, Text } from '@react-email/components'

export default function WrapperEmail({ children }: { children: React.ReactNode }) {
   return (
      <Html>
         <Head>
            <Font fontFamily="Arial,sans-serif" fallbackFontFamily="sans-serif" />
         </Head>
         <Body className="bg-white">
            <Tailwind>
               <Container className="mx-auto mt-5 max-w-[360px] border border-solid border-[#eee] px-10 pb-[100px] pt-[60px]">
                  {children}
               </Container>
               <Text className="mt-5 text-center text-sm font-bold uppercase">
                  С уважением, helpfront.ru
               </Text>
            </Tailwind>
         </Body>
      </Html>
   )
}
