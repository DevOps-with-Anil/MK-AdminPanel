'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Toolbar from './Toolbar'
import { Video } from './extensions/Video'

interface EditorProps {
  content?: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function Editor({ content = '', onChange, placeholder }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      Video,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: currentEditor }) => onChange(currentEditor.getHTML()),
    editorProps: {
      attributes: {
        class: 'min-h-[320px] max-w-none px-4 py-4 focus:outline-none',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const currentHtml = editor.getHTML()
    if (content !== currentHtml) {
      editor.commands.setContent(content || '<p></p>', { emitUpdate: false })
    }
  }, [content, editor])

  return (
    <section className="overflow-hidden rounded-md border border-gray-300 bg-white">
      <Toolbar editor={editor} />
      <div className="relative">
        {editor && editor.isEmpty && placeholder ? (
          <p className="pointer-events-none absolute left-4 top-4 z-10 text-base text-gray-400">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </section>
  )
}
