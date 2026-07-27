'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Getting listed', body: 'Add a listing, confirm the operational details, and get your entry live without the back and forth.' },
      { icon: Phone, title: 'Working together', body: 'Talk through bulk publishing, regional growth and anything operational.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Need a new area or category? Tell us and we can shape the directory around it.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Pitches and submissions', body: 'Send essays, columns and long-form ideas that would sit well alongside what is already here.' },
      { icon: Mail, title: 'Partnerships', body: 'Coordinate collaborations, sponsorships and issue-level campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Questions about voice, formatting or the publishing workflow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Discuss gallery launches, features and visual campaigns.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Usage rights, commercial requests and visual partnerships.' },
      { icon: Mail, title: 'Media kits', body: 'Request decks, editorial support or feature placement.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Suggest a resource', body: 'Point us at links, boards and references that deserve a place in the library.' },
    { icon: Mail, title: 'Curation partnerships', body: 'Coordinate collection projects, reference pages and link programmes.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organising shelves, collections or connected profiles?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)
  const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

  return (
    <EditableSiteShell>
      <main>
        <header className="pace-halftone pb-16 pt-[132px] text-white sm:pb-20 sm:pt-[156px]">
          <div className={shell}>
            <p className="editable-label text-white/80">{pagesContent.contact.eyebrow}</p>
            <h1 className="editable-display mt-5 max-w-4xl text-balance text-[2.7rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[3.9rem] lg:text-[4.4rem]">
              {pagesContent.contact.title}
            </h1>
            <p className="mt-7 max-w-2xl text-[1.05rem] leading-[1.8] text-white/90">{pagesContent.contact.description}</p>
          </div>
        </header>

        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`${shell} grid gap-10 py-16 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-14 lg:py-24`}>
            <div className="min-w-0">
              <p className="editable-label text-[var(--slot4-accent)]">What we can help with</p>
              <div className="mt-6 space-y-4">
                {lanes.map((lane) => (
                  <div
                    key={lane.title}
                    className="group flex gap-5 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                      <lane.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="editable-display text-[1.35rem] leading-tight">{lane.title}</h2>
                      <p className="mt-2 text-[0.9rem] leading-[1.75] text-[var(--slot4-muted-text)]">{lane.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] p-6">
                <p className="editable-label text-[var(--slot4-muted-text)]">Prefer to browse first?</p>
                <Link href="/search" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[var(--slot4-accent)]">
                  Search the whole library <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 sm:p-9">
              <h2 className="editable-display text-[1.9rem] leading-tight sm:text-[2.3rem]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--slot4-muted-text)]">We read everything that comes in and reply to what needs a reply.</p>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
