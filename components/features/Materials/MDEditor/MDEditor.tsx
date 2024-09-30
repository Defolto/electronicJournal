import { MdEditor as Editor, StaticTextDefaultValue, ToolbarNames, config } from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
import { useState } from 'react'
import { createFetch } from '../../../../helpers/createFetch'
import { useAppDispatch } from '../../../../store/hooks'
import { Button } from '../../../ui/Button'
import './MDEditor.css'

const ru: StaticTextDefaultValue = {
   toolbarTips: {
      bold: 'Жирный',
      underline: 'Подчёркнутый',
      italic: 'Курсив',
      strikeThrough: 'Зачёркнутый',
      title: 'Заголовок',
      sub: 'Нижний индекс',
      sup: 'Верхний индекс',
      quote: 'Цитата',
      unorderedList: 'Неупорядоченный список',
      orderedList: 'Упорядоченный список',
      task: 'Список задач',
      codeRow: 'Встроенный код',
      code: 'Блочный код',
      link: 'Ссылка',
      image: 'Изображение',
      table: 'Таблица',
      mermaid: 'Диаграмма',
      katex: 'Формула',
      revoke: 'Отмена',
      next: 'Вернуть',
      save: 'Сохранить',
      prettier: 'Форматировать',
      pageFullscreen: 'На всю страницу',
      fullscreen: 'На весь экран',
      preview: 'Превью',
      previewOnly: 'Только превью',
      htmlPreview: 'Превью html',
      catalog: 'Каталог',
      github: 'Исходный код',
   },
   titleItem: {
      h1: 'Заголовок 1-го ур.',
      h2: 'Заголовок 2-го ур.',
      h3: 'Заголовок 3-го ур.',
      h4: 'Заголовок 4-го ур.',
      h5: 'Заголовок 5-го ур.',
      h6: 'Заголовок 6-го ур.',
   },
   imgTitleItem: {
      link: 'Добавить ссылку на изображение',
      upload: 'Загрузить изображение',
      clip2upload: 'Из буфера обмена',
   },
   linkModalTips: {
      linkTitle: 'Добавить ссылку',
      imageTitle: 'Добавить изображение',
      descLabel: 'Описание:',
      descLabelPlaceHolder: 'Введите описание...',
      urlLabel: 'Ссылка:',
      urlLabelPlaceHolder: 'Введите ссылку...',
      buttonOK: 'ОК',
   },
   clipModalTips: {
      title: 'Обрезать изображение',
      buttonUpload: 'Загрузить',
   },
   copyCode: {
      text: 'Скопировать',
      successTips: 'Скопировано!',
      failTips: 'Не удалось скопировать!',
   },
   mermaid: {
      flow: 'Цепная',
      sequence: 'Последовательная',
      gantt: 'Временная',
      class: 'Структурная',
      state: 'Статусная',
      pie: 'Круговая',
      relationship: 'Реляционная',
      journey: 'Путешествия',
   },
   katex: {
      inline: 'Встроенная',
      block: 'Блочная',
   },
   footer: {
      markdownTotal: 'Кол-во символов',
      scrollAuto: 'Автопрокрутка',
   },
}

config({
   editorConfig: {
      languageUserDefined: { ru },
   },
})

const toolbar: ToolbarNames[] = [
   '=',
   'pageFullscreen',
   'fullscreen',
   'preview',
   'previewOnly',
   'htmlPreview',
   'catalog',
   'github',
]

type Props = {
   mdText: string
   subjectHref: string
   themeHref?: string
   callback?: (newText: string) => void
   onClose: () => void
}

export default function MDEditor({ mdText, onClose, subjectHref, themeHref, callback }: Props) {
   const dispatch = useAppDispatch()

   const [modelValue, setModelValue] = useState<string>(mdText ? mdText : '# Привет редактор!')

   const handleSave = async () => {
      dispatch(
         createFetch({
            api: 'materials/edit/file',
            data: {
               subjectHref,
               themeHref: themeHref ?? 'main',
               mdText: modelValue,
            },
         })
      ).then(({ payload }) => {
         if (!payload) return

         callback?.(modelValue)
         onClose()
      })
   }

   return (
      <>
         <div className="mb-4 flex flex-row gap-3">
            <Button className="bg-blue" onClick={handleSave}>
               Сохранить
            </Button>
            <Button className="bg-blue" onClick={onClose}>
               Отменить
            </Button>
         </div>

         <Editor
            modelValue={modelValue}
            language="ru"
            codeTheme="github"
            toolbarsExclude={toolbar}
            noUploadImg={true}
            autoDetectCode={true}
            theme="dark"
            onChange={setModelValue}
            onSave={handleSave}
         />
      </>
   )
}
