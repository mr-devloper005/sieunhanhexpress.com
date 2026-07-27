'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, Check, Link2, Printer } from 'lucide-react'

/*
  Reading utilities for detail pages: a thin progress rail pinned under the
  header, plus copy-link / print / back-to-top actions. Everything is
  client-side and degrades to plain buttons when APIs are unavailable.
*/
export function EditableShareBar({ title }: { title?: string }) {
  const [copied, setCopied] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard unavailable — leave the button in its default state */
    }
  }

  const button =
    'inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2.5 text-[0.8rem] font-semibold text-[var(--tk-text)] transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]'

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-[3px] bg-transparent">
        <div className="h-full bg-[var(--tk-accent)] transition-[width] duration-150" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={copy} className={button} aria-label={`Copy link to ${title || 'this page'}`}>
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? 'Link copied' : 'Copy link'}
        </button>
        <button type="button" onClick={() => window.print()} className={button}>
          <Printer className="h-4 w-4" /> Print
        </button>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={button}>
          <ArrowUp className="h-4 w-4" /> Top
        </button>
      </div>
    </>
  )
}
