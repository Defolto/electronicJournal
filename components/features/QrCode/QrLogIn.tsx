'use client'
import { useRouter } from 'next/navigation'
import { QRCodeSVG } from 'qrcode.react'
import { useEffect, useRef, useState } from 'react'
import { setCookie } from '../../../helpers/cookie'
import { createSocket } from '../../../helpers/createFetch'

export default function QrLogIn() {
   const hasMounted = useRef(false)
   const [qr, setQr] = useState('')
   const router = useRouter()

   useEffect(() => {
      if (!hasMounted.current) {
         hasMounted.current = true
         const target = createSocket()
         if (!target) {
            return
         }

         target.on('qrGet', (socket: any) => {
            setQr(socket)
         })

         target.on('qrPost', (socket: any) => {
            setCookie('user_id', socket)
            router.push('/profile')
         })
         target.connect()

         target.emit('qrGet', '')
      }
   }, [router])

   return (
      <>
         <p className="mb-2 text-center text-xl">В настройках отсканируйте QR-код</p>
         <QRCodeSVG className="m-auto rounded bg-white p-3" value={qr} />
      </>
   )
}
