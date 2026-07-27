'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogIn, Menu, PenLine, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { navVisibleTasks } from '@/editable/content/nav.config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Floating pill navigation.

  A translucent capsule holds the wordmark, the inline desktop links and the
  menu toggle; a second capsule on the right carries the primary action. The
  bar sits over both the coral hero and the blush interior pages, so every
  surface it needs is self-contained. Opening the menu reveals a full-width
  editorial panel with oversized serif links and a search field.
*/
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  const navItems = useMemo(() => navVisibleTasks(SITE_CONFIG.tasks).map((task) => ({ label: task.label, href: task.route })), [])

  const menuLinks = useMemo(
    () => [{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }],
    [navItems]
  )

  // Subtle elevation once the page leaves the top of the document.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the panel on route change, and lock scroll while it is open.
  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    // Zero-height sticky rail: the bar floats over the page instead of taking
    // layout space, so colour fields can run edge-to-edge behind it. Sections
    // reserve their own clearance with top padding (see --editable-nav-space).
    <header className="pointer-events-none sticky top-0 z-50 h-0">
      <div className="pointer-events-auto mx-auto flex w-full max-w-[var(--editable-container)] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        {/* Left capsule: wordmark + desktop links + menu toggle */}
        <div
          className={`flex min-w-0 items-center gap-1 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/95 p-1.5 backdrop-blur-xl transition duration-500 ${
            scrolled ? 'shadow-[0_14px_40px_rgba(24,18,17,0.14)]' : 'shadow-[0_6px_20px_rgba(24,18,17,0.07)]'
          }`}
        >
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3 transition duration-500 hover:bg-[var(--slot4-panel-bg)]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <img src="/favicon.png?v=20260413" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="editable-display block max-w-[120px] truncate text-[1.05rem] leading-none tracking-[-0.01em] sm:max-w-[190px] sm:text-[1.2rem]">
              {SITE_CONFIG.name}
            </span>
          </Link>

          <span className="hidden h-6 w-px bg-[var(--editable-border)] lg:block" />

          <nav className="hidden items-center lg:flex">
            {navItems.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-[0.82rem] font-medium transition duration-500 ${
                  isActive(item.href)
                    ? 'bg-[var(--slot4-page-text)] text-[var(--slot4-cream)]'
                    : 'text-[var(--slot4-muted-text)] hover:bg-[var(--slot4-panel-bg)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="ml-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

        {/* Right capsule: search + primary action */}
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="hidden h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/95 text-[var(--slot4-page-text)] backdrop-blur-xl transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)] sm:flex"
          >
            <Search className="h-4 w-4" />
          </Link>
          <Link
            href={session ? '/create' : '/contact'}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-[0.82rem] font-semibold text-[var(--slot4-cream)] shadow-[0_10px_30px_rgba(24,18,17,0.18)] transition duration-500 hover:bg-[var(--slot4-accent)] sm:px-6"
          >
            {session ? <PenLine className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            <span className="whitespace-nowrap">{session ? 'Create' : globalContent.nav?.actions?.primary?.label || 'Get in touch'}</span>
          </Link>
        </div>
      </div>

      {/* Expanding editorial menu panel */}
      <div
        className={`pointer-events-auto overflow-hidden transition-[max-height,opacity] duration-700 ${
          open ? 'max-h-[85vh] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
      >
        <div className="mx-4 mb-4 max-h-[80vh] overflow-y-auto rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_30px_80px_rgba(24,18,17,0.16)] sm:mx-6 sm:p-9 lg:mx-8">
          <div className="mx-auto grid w-full max-w-[var(--editable-container)] gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="editable-label text-[var(--slot4-accent)]">Browse</p>
              <div className="mt-4 grid">
                {menuLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center justify-between border-b border-[var(--editable-border)] py-3.5 transition duration-500 ${
                      isActive(item.href) ? 'text-[var(--slot4-accent)]' : 'text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]'
                    }`}
                  >
                    <span className="editable-display text-[1.75rem] leading-none sm:text-[2.25rem]">{item.label}</span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 opacity-40 transition duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <form action="/search" className="rounded-[22px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-4">
                <label className="editable-label text-[var(--slot4-muted-text)]" htmlFor="nav-search">
                  Search the site
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                  <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  <input
                    id="nav-search"
                    name="q"
                    type="search"
                    placeholder="Topics, names, keywords"
                    className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </div>
                <button className="mt-3 w-full rounded-full bg-[var(--slot4-accent)] px-5 py-3 text-sm font-semibold text-white transition duration-500 hover:bg-[var(--slot4-page-text)]">
                  Search
                </button>
              </form>

              <div className="rounded-[22px] border border-[var(--editable-border)] p-4">
                <p className="editable-label text-[var(--slot4-muted-text)]">Your account</p>
                <div className="mt-3 grid gap-2">
                  {session ? (
                    <>
                      <p className="text-sm text-[var(--slot4-muted-text)]">
                        Signed in as <span className="font-semibold text-[var(--slot4-page-text)]">{session.name}</span>
                      </p>
                      <Link
                        href="/create"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]"
                      >
                        <PenLine className="h-4 w-4" /> Create a post
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setOpen(false)
                        }}
                        className="text-left text-sm font-semibold text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-accent)]"
                      >
                        Log out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]"
                      >
                        <LogIn className="h-4 w-4" /> Log in
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]"
                      >
                        <UserPlus className="h-4 w-4" /> Create an account
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <p className="text-sm leading-7 text-[var(--slot4-muted-text)]">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
