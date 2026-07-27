'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Check, Mail } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { navVisibleTasks } from '@/editable/content/nav.config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

/*
  Signature footer: a full-bleed coral halftone field carrying the newsletter
  capsule, the link columns, an oversized wordmark lockup and the legal row.
*/
export function EditableFooter() {
  const taskLinks = navVisibleTasks(SITE_CONFIG.tasks)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubscribed(true)
    event.currentTarget.reset()
  }

  const siteLinks: Array<[string, string]> = [
    ['About', '/about'],
    ['Contact', '/contact'],
    ['Search', '/search'],
    ...((session ? [['Create', '/create']] : [['Log in', '/login'], ['Sign up', '/signup']]) as Array<[string, string]>),
  ]

  return (
    <footer className="pace-halftone mt-auto text-white">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        {/* Newsletter + quick actions */}
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <form onSubmit={subscribe} className="flex w-full flex-col gap-2 sm:flex-row">
            <label className="sr-only" htmlFor="footer-subscribe">
              Email address
            </label>
            <input
              id="footer-subscribe"
              name="email"
              type="email"
              required
              placeholder="Stay in the loop"
              className="min-w-0 flex-1 rounded-full border border-white/25 bg-white px-6 py-4 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-white"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
            >
              {subscribed ? <Check className="h-4 w-4" /> : null}
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </form>

          <div className="flex flex-wrap gap-2.5 lg:justify-end">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/12 px-6 py-4 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-accent)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white" /> Explore the archive
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-6 py-4 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:bg-white"
            >
              <Mail className="h-4 w-4" /> Get in touch
            </Link>
          </div>
        </div>

        {subscribed ? (
          <p className="mt-3 text-sm text-white/85">Thanks — you are on the list. New posts land in your inbox.</p>
        ) : null}

        {/* Link columns */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <div className="mt-4 grid gap-2.5">
              <Link href="/" className="w-fit text-sm text-white/80 transition hover:text-white">
                Home
              </Link>
              {taskLinks.map((task) => (
                <Link key={task.key} href={task.route} className="w-fit text-sm text-white/80 transition hover:text-white">
                  {task.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Site</h3>
            <div className="mt-4 grid gap-2.5">
              {siteLinks.map(([label, href]) => (
                <Link key={href} href={href} className="w-fit text-sm text-white/80 transition hover:text-white">
                  {label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="w-fit text-left text-sm text-white/80 transition hover:text-white">
                  Log out
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">About</h3>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/80">
              {globalContent.footer?.description || SITE_CONFIG.description}
            </p>
            <Link
              href="/about"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition hover:gap-2.5"
            >
              Read more <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Oversized wordmark lockup */}
        <div className="mt-16 flex flex-col items-center gap-4 sm:mt-20 sm:flex-row sm:justify-between">
          <Link href="/" className="group flex items-center gap-4 rounded-full border border-white/40 px-6 py-4 transition duration-500 hover:bg-white/10 sm:px-10 sm:py-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
              <img src="/favicon.png?v=20260413" alt="" className="h-full w-full object-contain" />
            </span>
            <span className="editable-display max-w-[62vw] truncate text-[2rem] leading-none tracking-[0.02em] text-white sm:max-w-none sm:text-[3.25rem]">
              {SITE_CONFIG.name}
            </span>
          </Link>
          <p className="editable-label max-w-xs text-center text-white/70 sm:text-right">
            {globalContent.footer?.tagline || SITE_CONFIG.tagline}
          </p>
        </div>
      </div>

      <div className="border-t border-white/25">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-white/75 sm:flex-row sm:px-8 lg:px-10">
          <p>
            © {year} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-center sm:text-right">{globalContent.footer?.bottomNote || 'Built for clean discovery.'}</p>
        </div>
      </div>
    </footer>
  )
}
