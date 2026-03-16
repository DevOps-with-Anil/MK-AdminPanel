'use client'

import Link from 'next/link'
import { Eye, PencilLine, Trash2 } from 'lucide-react'
import { deletePost, Post } from '@/lib/storage'

interface ArticleRowProps {
  post: Post
  onDelete: (id: string) => void
}

const statusClassName: Record<Post['status'], string> = {
  published: 'status-badge status-published',
  draft: 'status-badge status-draft',
  breaking: 'status-badge status-breaking',
}

const statusLabel: Record<Post['status'], string> = {
  published: 'Published',
  draft: 'Draft',
  breaking: 'Breaking',
}

export default function ArticleRow({ post, onDelete }: ArticleRowProps) {
  const lastModified = new Date(post.updatedAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const handleDelete = () => {
    if (!window.confirm('Delete this story from the newsroom?')) return
    deletePost(post.id)
    onDelete(post.id)
  }

  return (
    <tr className="border-b border-[var(--border)] last:border-b-0">
      <td className="px-5 py-4">
        <div className="min-w-[220px]">
          <Link href={`/editor/${post.id}`} className="font-display text-xl text-slate-950 transition hover:text-[var(--accent)]">
            {post.title || 'Untitled Story'}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
            {post.excerpt || 'No summary provided for this article yet.'}
          </p>
        </div>
      </td>
      <td className="px-5 py-4 text-sm font-medium text-slate-700">{post.category}</td>
      <td className="px-5 py-4">
        <span className={statusClassName[post.status]}>{statusLabel[post.status]}</span>
      </td>
      <td className="px-5 py-4 text-sm text-slate-700">{post.author}</td>
      <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">{lastModified}</td>
      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/editor/${post.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-slate-700 transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
            aria-label="Edit story"
          >
            <PencilLine className="h-4 w-4" />
          </Link>
          <Link
            href={`/preview/${post.id}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-slate-700 transition hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
            aria-label="Preview story"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-white text-slate-700 transition hover:border-[var(--danger)] hover:text-[var(--danger)]"
            aria-label="Delete story"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
