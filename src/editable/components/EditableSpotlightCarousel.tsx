'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'

export type SpotlightItem = {
  id: string
  title: string
  excerpt: string
  category: string
  image: string
  href: string
}

/*
  Spotlight carousel: a large framed image on the left, the post's own words on
  the right, and a pair of circular controls. Fully client-driven so the reader
  can move through the collection without a page load.
*/
export function EditableSpotlightCarousel({
  items,
  eyebrow = 'From the archive',
  title = 'Worth a closer look',
  description,
}: {
  items: SpotlightItem[]
  eyebrow?: string
  title?: string
  description?: string
}) {
  const [index, setIndex] = useState(0)
  if (!items.length) return null

  const total = items.length
  const active = items[Math.min(index, total - 1)]
  const go = (step: number) => setIndex((value) => (value + step + total) % total)

  return (
    <section className="bg-[var(--slot4-surface-bg)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
          {/* Media */}
          <div className="relative overflow-hidden rounded-[28px] bg-[var(--slot4-media-bg)]">
            <div className="aspect-square w-full">
              {items.map((item, i) => (
                <img
                  key={item.id}
                  src={item.image}
                  alt=""
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? 'opacity-100' : 'opacity-0'}`}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              ))}
            </div>
            <span className="absolute left-5 top-5 rounded-full bg-white/92 px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)] backdrop-blur-sm">
              {active.category}
            </span>
          </div>

          {/* Copy */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="editable-label text-[var(--slot4-accent)]">{eyebrow}</p>
                <h2 className="editable-display mt-3 text-[2.1rem] leading-[1.03] tracking-[-0.015em] sm:text-[3rem]">{title}</h2>
              </div>
              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--editable-border)] text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {description ? <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text)]">{description}</p> : null}

            <blockquote className="mt-8 border-l-2 border-[var(--slot4-accent)] pl-6">
              <p className="editable-display text-[1.55rem] leading-[1.35] tracking-[-0.01em] sm:text-[1.85rem]">{active.title}</p>
              {active.excerpt ? (
                <p className="mt-4 max-w-2xl text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text)]">{active.excerpt}</p>
              ) : null}
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Link
                href={active.href}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
              >
                Open this one <ArrowUpRight className="h-4 w-4" />
              </Link>
              <span className="text-sm text-[var(--slot4-soft-muted-text)]">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
            </div>

            {/* Progress ticks */}
            <div className="mt-6 flex flex-wrap gap-1.5">
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show item ${i + 1}`}
                  className={`h-1 rounded-full transition-all duration-500 ${
                    i === index ? 'w-10 bg-[var(--slot4-accent)]' : 'w-5 bg-[var(--editable-border)] hover:bg-[var(--slot4-soft-muted-text)]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
