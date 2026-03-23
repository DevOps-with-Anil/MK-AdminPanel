import React from "react"
import type { Metadata } from 'next'
import { Outfit, Geist_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
import '../globals.css'
import { Providers } from '@/app/providers/AuthProvider'
import { AdminProvider } from "@/contexts/AdminContext"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { I18nProvider } from '@/i18n/provider';


const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'MK Project | Enterprise Admin Management',
  description: 'Enterprise multi-tenant admin panel with role-based access control, subscription plans, and modular permissions for MK Project',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <AdminProvider>
        <AdminLayout>
          <I18nProvider>
            {children} {/* <-- page content will render here, layout persists */}
          </I18nProvider>
        </AdminLayout>
      </AdminProvider>
    </Providers>
  )
}
