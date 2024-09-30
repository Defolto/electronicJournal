"use client"
import {useEffect, useRef, useState} from "react";
import {Html5Qrcode} from "html5-qrcode";
import { getCookie } from '../../../helpers/cookie'
import { modalHide } from '../../../store/modalSlice'
import { useAppDispatch } from '../../../store/hooks'
import { notificationShow } from '../../../store/notifications/notificationsSlice'
import { createSocket } from '../../../helpers/createFetch'

export default function Page(){
   const dispatch = useAppDispatch()
   const [isEnabled, setEnabled] = useState(true);
   const [qrMessage, setQrMessage] = useState("");
   const hasMounted = useRef(false);
   const socket = useRef<any>()
   useEffect(() => {
      if (!hasMounted.current) {
         hasMounted.current = true;

         const target = createSocket()
         if (!target){
            return
         }

         target.connect()
         socket.current = target
      }


   }, []);

   const sendMessage = (uuid: string) => {
      const userID = getCookie('user_id');
      socket.current.emit("qrPost", { uuid, userID})
   }

   useEffect(() => {
      const config = { fps: 10, qrbox: { width: 200, height: 200 } };

      const html5QrCode = new Html5Qrcode("qrCodeContainer");

      const qrScanerStop = () => {
         if (html5QrCode && html5QrCode.isScanning) {
            html5QrCode
               .stop()
               .catch((err) => {
                  dispatch(modalHide())
                  dispatch(notificationShow({type: "error", message: "Непредвиденная ошибка"}))
               });
         }
      };

      const qrCodeSuccess = (decodedText: any) => {
         sendMessage(decodedText)
         setEnabled(false);
         dispatch(modalHide())
         dispatch(notificationShow({type: "success", message: "Пользователь успешно авторизован"}))
      };

      if (isEnabled) {
         html5QrCode.start({facingMode: "environment"}, config, qrCodeSuccess, ()=>{});
         setQrMessage("");
      } else {
         qrScanerStop();
      }

      return () => {
         qrScanerStop();
      };
   }, [dispatch, isEnabled]);

   return (
      <div className="m-auto">
         <div id="qrCodeContainer" />
         {qrMessage && <div className="qr-message">{qrMessage}</div>}
      </div>
   );
}