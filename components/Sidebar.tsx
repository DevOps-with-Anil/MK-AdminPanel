'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BookOpenText,
  FileClock,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserCircle2,
} from 'lucide-react'

const navItems = [
  { label: 'All Stories', href: '/', icon: LayoutDashboard },
  { label: 'Published', href: '/?filter=published', icon: BookOpenText },
  { label: 'Drafts', href: '/?filter=draft', icon: FileClock },
  { label: 'Categories', href: '/?filter=category', icon: FolderKanban },
  { label: 'Settings', href: '/?filter=settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const activeFilter =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('filter') : null

  return (
    <aside className="flex min-h-screen w-full max-w-[280px] flex-col border-r border-white/10 bg-[var(--panel)] text-[var(--panel-foreground)]">
      <div className="border-b border-white/10 px-6 py-7">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent)] text-sm font-bold tracking-[0.18em] text-white">
            ND
          </div>
          <div>
            <p className="text-[0.7rem] font-bold uppercase tracking-[0.28em] text-white/55">Newsroom</p>
            <h1 className="font-display text-2xl leading-none text-white">News Desk</h1>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map(({ label, href, icon: Icon }) => {
          const hrefFilter = href.includes('?') ? href.split('filter=')[1] : null
          const active = hrefFilter ? activeFilter === hrefFilter : pathname === href && !activeFilter
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? 'bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
                  : 'text-white/72 hover:bg-white/6 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-4 py-5">
        <div className="rounded-2xl bg-white/6 px-4 py-4">
          <div className="flex items-center gap-3">
            <UserCircle2 className="h-10 w-10 text-white/70" />
            <div>
              <p className="text-sm font-semibold text-white">Ayush Sharma</p>
              <p className="text-xs text-white/55">Senior Editor</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
