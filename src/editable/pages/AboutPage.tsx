import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  const about = pagesContent.about
  const intro = pagesContent.home.intro
  const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

  return (
    <EditableSiteShell>
      <main>
        {/* Signature header */}
        <header className="pace-halftone pb-16 pt-[132px] text-white sm:pb-20 sm:pt-[156px]">
          <div className={shell}>
            <p className="editable-label text-white/80">{about.badge}</p>
            <h1 className="editable-display mt-5 max-w-4xl text-balance text-[2.7rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[4rem] lg:text-[4.6rem]">
              {about.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[1.05rem] leading-[1.8] text-white/90">{about.description}</p>
          </div>
        </header>

        {/* Story + values */}
        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${shell} grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24`}>
            <article className="min-w-0">
              <p className="editable-label text-[var(--slot4-accent)]">The short version</p>
              <div className="mt-6 space-y-5 text-[1.05rem] leading-[1.85] text-[var(--slot4-muted-text)]">
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <h2 className="editable-display mt-14 text-[1.9rem] leading-tight sm:text-[2.4rem]">{intro.title}</h2>
              <div className="mt-5 space-y-4 text-[0.98rem] leading-[1.85] text-[var(--slot4-muted-text)]">
                {intro.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href={intro.primaryLink.href}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
                >
                  {intro.primaryLink.label} <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href={intro.secondaryLink.href}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3.5 text-sm font-semibold transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
                >
                  {intro.secondaryLink.label}
                </Link>
              </div>
            </article>

            <aside className="min-w-0 space-y-4 lg:sticky lg:top-28 lg:self-start">
              {about.values.map((value, index) => (
                <div
                  key={value.title}
                  className="group rounded-[26px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 transition duration-500 hover:-translate-y-1"
                >
                  <span className="editable-display text-[1.3rem] leading-none text-[var(--slot4-accent)]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="editable-display mt-4 text-[1.45rem] leading-tight">{value.title}</h3>
                  <p className="mt-3 text-[0.925rem] leading-[1.8] text-[var(--slot4-muted-text)]">{value.description}</p>
                </div>
              ))}

              <div className="rounded-[26px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-7">
                <p className="editable-label text-[var(--slot4-muted-text)]">{intro.sideBadge}</p>
                <ul className="mt-4 grid gap-3">
                  {intro.sidePoints.map((point) => (
                    <li key={point} className="flex gap-3 text-[0.9rem] leading-[1.7] text-[var(--slot4-muted-text)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--slot4-accent)]" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* Closing band */}
        <section className="pace-halftone text-white">
          <div className={`${shell} flex flex-col items-start justify-between gap-6 py-16 sm:flex-row sm:items-center sm:py-20`}>
            <h2 className="editable-display max-w-2xl text-[2rem] leading-[1.08] text-white sm:text-[2.8rem]">
              Have something that belongs on {SITE_CONFIG.name}?
            </h2>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
            >
              Start a conversation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
