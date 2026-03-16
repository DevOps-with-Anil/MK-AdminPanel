export interface NewsInput {
  title: string
  category: string
  author: string
  content: string
}

export interface NewsItem extends NewsInput {
  id: string
  createdAt: string
  updatedAt: string
}
