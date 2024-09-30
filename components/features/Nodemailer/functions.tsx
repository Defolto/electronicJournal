import { render } from '@react-email/components'
import nodemailer from 'nodemailer'
import ConfirmCodeEmail from './ConfirmCodeEmail'
import ConfirmUser from './ConfirmUser'
import RecoveryPassword from './RecoveryPassword'
import VerificationUser from './VerificationUser'

type MailProps = {
   from: string
   to: string
   subject: string
   html: string
}

export type IComponentEmail =
   | 'ConfirmCodeEmail'
   | 'ConfirmUser'
   | 'RecoveryPassword'
   | 'VerificationUser'

const componentsEmail: Record<IComponentEmail, (props: any) => JSX.Element> = {
   ConfirmCodeEmail: (props) => <ConfirmCodeEmail {...props} />,
   ConfirmUser: (props) => <ConfirmUser {...props} />,
   RecoveryPassword: (props) => <RecoveryPassword {...props} />,
   VerificationUser: (props) => <VerificationUser {...props} />,
}

const subjectsEmail: Record<IComponentEmail, string> = {
   ConfirmCodeEmail: 'Код подтверждения',
   ConfirmUser: 'Подтверждение регистрации',
   RecoveryPassword: 'Восстановление пароля',
   VerificationUser: 'Верификация пользователя',
}

export async function sendMail(
   type: IComponentEmail,
   toEmail: string,
   props: Record<string, any>
): Promise<void> {
   const transporter = nodemailer.createTransport({
      port: 25,
      secure: false,
      auth: {
         user: 'register@helpfront.ru',
      },
   })

   const emailHtml = render(componentsEmail[type](props))

   const options: MailProps = {
      from: 'register@helpfront.ru',
      to: toEmail,
      subject: subjectsEmail[type],
      html: emailHtml,
   }

   await transporter.sendMail(options)
}
