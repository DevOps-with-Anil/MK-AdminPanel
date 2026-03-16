import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'News CMS',
  description: 'Simple news CRUD with Next.js and MongoDB',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
