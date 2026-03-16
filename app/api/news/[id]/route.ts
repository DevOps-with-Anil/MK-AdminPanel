import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/mongodb'
import { NewsInput } from '@/lib/news'

export const runtime = 'nodejs'

const COLLECTION = 'news'

function isValidObjectId(id: string) {
  return ObjectId.isValid(id)
}

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

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid news id' }, { status: 400 })
    }

    const db = await getDatabase()
    const item = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })

    if (!item) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 })
    }

    return NextResponse.json(serializeNewsItem(item as never))
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to load news item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid news id' }, { status: 400 })
    }

    const body = (await request.json()) as Partial<NewsInput>
    const validationError = validatePayload(body)

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection(COLLECTION).findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: body.title!.trim(),
          category: body.category!.trim(),
          author: body.author!.trim(),
          content: body.content!.trim(),
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 })
    }

    return NextResponse.json(serializeNewsItem(result as never))
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to update news item' },
      { status: 500 }
    )
  }
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params

    if (!isValidObjectId(id)) {
      return NextResponse.json({ message: 'Invalid news id' }, { status: 400 })
    }

    const db = await getDatabase()
    const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'News not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to delete news item' },
      { status: 500 }
    )
  }
}
