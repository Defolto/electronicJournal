'use client'
import MaterialWrapper from '../../../components/features/Materials/MaterialWrapper'

type Props = {
   params: {
      subject: string
   }
}

export default function Theme({ params: { subject: subjectHref } }: Props) {
   return <MaterialWrapper subjectHref={subjectHref} />
}
