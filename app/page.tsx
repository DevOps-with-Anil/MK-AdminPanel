'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { NewsItem } from '@/lib/news'

export default function HomePage() {
  const router = useRouter()
  const [items, setItems] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadNews = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await fetch('/api/news', { cache: 'no-store' })
      const data = (await response.json()) as NewsItem[]

      if (!response.ok) {
        throw new Error('Failed to load news')
      }

      setItems(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadNews()
  }, [])

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this news item?')
    if (!confirmed) return

    try {
      const response = await fetch(`/api/news/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('Delete failed')
      }
      setItems((current) => current.filter((item) => item.id !== id))
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">News</h1>
            <p className="mt-1 text-sm text-gray-500">Simple CRUD with MongoDB API</p>
          </div>
          <Link
            href="/editor"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Add News
          </Link>
        </div>

        {error ? (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-700">
                <th className="border-b border-gray-200 px-4 py-3">Title</th>
                <th className="border-b border-gray-200 px-4 py-3">Category</th>
                <th className="border-b border-gray-200 px-4 py-3">Author</th>
                <th className="border-b border-gray-200 px-4 py-3">Updated</th>
                <th className="border-b border-gray-200 px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>
                    Loading news...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-500" colSpan={5}>
                    No news found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="text-sm text-gray-700">
                    <td className="border-b border-gray-200 px-4 py-3">{item.title}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{item.category}</td>
                    <td className="border-b border-gray-200 px-4 py-3">{item.author}</td>
                    <td className="border-b border-gray-200 px-4 py-3">
                      {new Date(item.updatedAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="border-b border-gray-200 px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => router.push(`/editor/${item.id}`)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(item.id)}
                          className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
