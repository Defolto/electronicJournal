'use client'
import MaterialWrapper from '../../../../components/features/Materials/MaterialWrapper'

type Props = {
   params: {
      subject: string
      theme: string
   }
}

export default function Theme({ params: { subject: subjectHref, theme: themeHref } }: Props) {
   return <MaterialWrapper subjectHref={subjectHref} themeHref={themeHref} />
}
