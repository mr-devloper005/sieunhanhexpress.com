'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Lock, Send } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[18px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-3.5 text-[0.95rem] leading-7 text-[var(--slot4-page-text)] outline-none transition duration-500 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:bg-[var(--slot4-surface-bg)]'

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  // The content type is no longer picked in the UI — new posts are filed under
  // the site's primary section.
  const task = (enabledTasks[0]?.key || 'article') as TaskKey
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="bg-[var(--slot4-page-bg)]">
          <section className={`${shell} grid items-center gap-10 pb-20 pt-[112px] sm:pt-[132px] lg:grid-cols-[0.85fr_1.15fr] lg:gap-16`}>
            <div className="pace-halftone flex min-h-[280px] items-center justify-center rounded-[30px] text-white">
              <Lock className="h-16 w-16 opacity-85" />
            </div>
            <div className="min-w-0">
              <p className="editable-label text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-5 max-w-xl text-[2.6rem] leading-[1.03] tracking-[-0.02em] sm:text-[3.6rem]">
                {pagesContent.create.locked.title}
              </h1>
              <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
                >
                  Log in <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3.5 text-sm font-semibold transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <header className="pace-halftone pb-14 pt-[132px] text-white sm:pb-16 sm:pt-[156px]">
          <div className={shell}>
            <p className="editable-label text-white/80">{pagesContent.create.hero.badge}</p>
            <h1 className="editable-display mt-5 max-w-3xl text-[2.6rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[3.6rem]">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-[1.02rem] leading-[1.8] text-white/90">{pagesContent.create.hero.description}</p>
          </div>
        </header>

        <section className={`${shell} py-14 sm:py-16`}>
          <form
            onSubmit={submit}
            className="mx-auto w-full max-w-3xl rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-9"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="editable-display text-[1.8rem] leading-tight sm:text-[2.2rem]">{pagesContent.create.formTitle}</h2>
              <span className="rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold text-[var(--slot4-page-text)]">{session.name}</span>
            </div>

            <div className="mt-7 grid gap-4">
              <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
              </div>
              <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
              <textarea
                className={`${fieldClass} min-h-24 resize-y`}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="Short summary"
                required
              />
              <textarea
                className={`${fieldClass} min-h-48 resize-y`}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Main content, details, notes or description"
                required
              />
            </div>

            {created ? (
              <div className="mt-6 rounded-[20px] bg-[var(--slot4-accent-soft)] p-5">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent)]" /> {pagesContent.create.successTitle}
                </p>
                <p className="mt-1.5 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-4 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
            >
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
