'use client'

import type { ChangeEvent, ReactNode } from 'react'
import { useRef, useState } from 'react'
import { Editor } from '@tiptap/react'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Paperclip,
  PlaySquare,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from 'lucide-react'

interface ToolbarProps {
  editor: Editor | null
}

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition ${
        active
          ? 'border-blue-600 bg-blue-50 text-blue-600'
          : 'border-transparent bg-transparent text-slate-600 hover:border-gray-300 hover:bg-white hover:text-slate-950'
      }`}
    >
      {children}
    </button>
  )
}

export default function Toolbar({ editor }: ToolbarProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const videoInputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)

  if (!editor) return null

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = (await response.json()) as {
      url?: string
      name?: string
      kind?: 'image' | 'video' | 'file'
      message?: string
    }

    if (!response.ok || !data.url || !data.kind) {
      throw new Error(data.message || 'Upload failed')
    }

    return {
      url: data.url,
      name: data.name || file.name,
      kind: data.kind,
    }
  }

  const setLink = () => {
    const url = window.prompt('Paste the link URL')
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    else editor.chain().focus().unsetLink().run()
  }

  const handleFileSelection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const uploaded = await uploadFile(file)

      if (uploaded.kind === 'image') {
        editor.chain().focus().setImage({ src: uploaded.url }).run()
      } else if (uploaded.kind === 'video') {
        editor
          .chain()
          .focus()
          .insertContent({ type: 'video', attrs: { src: uploaded.url } })
          .run()
      } else {
        editor
          .chain()
          .focus()
          .insertContent(`<p><a href="${uploaded.url}" target="_blank" rel="noopener noreferrer">${uploaded.name}</a></p>`)
          .run()
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-300 bg-gray-50 px-3 py-2">
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => void handleFileSelection(event)} />
      <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(event) => void handleFileSelection(event)} />
      <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => void handleFileSelection(event)} />
      <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1">
        <select
          aria-label="Text style"
          defaultValue="p"
          onChange={(event) => {
            const value = event.target.value
            if (value === 'p') {
              editor.chain().focus().setParagraph().run()
              return
            }
            editor.chain().focus().toggleHeading({ level: Number(value) as 1 | 2 | 3 }).run()
          }}
          className="rounded-md border-0 bg-transparent px-2 py-1.5 text-sm font-medium text-slate-700 focus:outline-none"
        >
          <option value="p">Paragraph</option>
          <option value="1">Headline</option>
          <option value="2">Section</option>
          <option value="3">Subhead</option>
        </select>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
          <Highlighter className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Quote">
          <Quote className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
        <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Add link">
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => imageInputRef.current?.click()} title="Upload image">
          <ImagePlus className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => videoInputRef.current?.click()} title="Upload video">
          <PlaySquare className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Upload file">
          <Paperclip className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <div className="ml-auto flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1">
        {uploading ? <span className="px-2 text-xs text-gray-500">Uploading...</span> : null}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo2 className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}
