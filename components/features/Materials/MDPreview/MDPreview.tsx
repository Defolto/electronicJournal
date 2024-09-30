'use client'
import { MdPreview } from 'md-editor-rt'
import './MDPreview.css'

export default function MDPreview({ text }: { text: string }) {
   return <MdPreview editorId="preview-only" modelValue={text} theme="dark" />
}
