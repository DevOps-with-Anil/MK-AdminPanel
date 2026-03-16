import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/mongodb'
import { NewsInput } from '@/lib/news'

export const runtime = 'nodejs'

const COLLECTION = 'news'

function validatePayload(body: Partial<NewsInput>) {
  if (!body.title?.trim()) return 'Title is required'
  if (!body.category?.trim()) return 'Category is required'
  if (!body.author?.trim()) return 'Author is required'
  if (!body.content?.trim()) return 'Content is required'
  return null
}

function serializeNewsItem(item: {
  _id: { toString(): string }
  title: string
  category: string
  author: string
  content: string
  createdAt: Date
  updatedAt: Date
}) {
  return {
    id: item._id.toString(),
    title: item.title,
    category: item.category,
    author: item.author,
    content: item.content,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  }
}

export async function GET() {
  try {
    const db = await getDatabase()
    const items = await db.collection(COLLECTION).find().sort({ updatedAt: -1 }).toArray()
    return NextResponse.json(items.map((item) => serializeNewsItem(item as never)))
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to load news' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<NewsInput>
    const validationError = validatePayload(body)

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    const now = new Date()
    const payload = {
      title: body.title!.trim(),
      category: body.category!.trim(),
      author: body.author!.trim(),
      content: body.content!.trim(),
      createdAt: now,
      updatedAt: now,
    }

    const db = await getDatabase()
    const result = await db.collection(COLLECTION).insertOne(payload)

    return NextResponse.json(
      serializeNewsItem({
        _id: result.insertedId,
        ...payload,
      }),
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to create news' },
      { status: 500 }
    )
  }
}
