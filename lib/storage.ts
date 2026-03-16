export type PostStatus = 'draft' | 'published' | 'breaking'

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  createdAt: string
  updatedAt: string
  status: PostStatus
  category: string
  tags: string[]
  featuredImage: string
  author: string
}

const STORAGE_KEY = 'cms_posts'

const normalizePost = (post: Partial<Post>): Post => ({
  id: String(post.id ?? Date.now()),
  title: post.title ?? '',
  content: post.content ?? '',
  excerpt: post.excerpt ?? '',
  createdAt: post.createdAt ?? new Date().toISOString(),
  updatedAt: post.updatedAt ?? new Date().toISOString(),
  status: post.status === 'breaking' || post.status === 'published' ? post.status : 'draft',
  category: post.category?.trim() || 'General',
  tags: Array.isArray(post.tags)
    ? post.tags.filter((tag): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [],
  featuredImage: post.featuredImage ?? '',
  author: post.author?.trim() || 'Editorial Desk',
})

export const getPosts = (): Post[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) return []

  try {
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed.map(normalizePost) : []
  } catch {
    return []
  }
}

export const getPost = (id: string): Post | null => {
  const posts = getPosts()
  return posts.find((post) => post.id === id) || null
}

export const savePost = (
  post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>
): Post => {
  const posts = getPosts()
  const timestamp = new Date().toISOString()
  const newPost = normalizePost({
    ...post,
    id: Date.now().toString(),
    createdAt: timestamp,
    updatedAt: timestamp,
  })

  posts.unshift(newPost)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  return newPost
}

export const updatePost = (id: string, updates: Partial<Post>): Post | null => {
  const posts = getPosts()
  const index = posts.findIndex((post) => post.id === id)
  if (index === -1) return null

  posts[index] = normalizePost({
    ...posts[index],
    ...updates,
    id,
    updatedAt: new Date().toISOString(),
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  return posts[index]
}

export const deletePost = (id: string): void => {
  const posts = getPosts().filter((post) => post.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}
