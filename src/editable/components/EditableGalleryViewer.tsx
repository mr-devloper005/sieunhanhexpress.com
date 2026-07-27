'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react'

/*
  Gallery viewer for image-led detail pages: one large frame, a thumbnail
  strip, and an optional full-screen lightbox with keyboard-free controls.
*/
export function EditableGalleryViewer({ images, title }: { images: string[]; title?: string }) {
  const gallery = images.filter(Boolean)
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  if (!gallery.length) return null

  const total = gallery.length
  const active = gallery[Math.min(index, total - 1)]
  const go = (step: number) => setIndex((value) => (value + step + total) % total)

  return (
    <div>
      <div className="relative overflow-hidden rounded-[26px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
          <img src={active} alt={title || ''} className="h-full w-full object-cover" />
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open full size"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/92 text-[var(--tk-text)] backdrop-blur-sm transition duration-500 hover:bg-[var(--tk-text)] hover:text-white"
        >
          <Expand className="h-4 w-4" />
        </button>

        {total > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[var(--tk-text)] backdrop-blur-sm transition duration-500 hover:bg-[var(--tk-text)] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-[var(--tk-text)] backdrop-blur-sm transition duration-500 hover:bg-[var(--tk-text)] hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/92 px-3 py-1.5 text-[0.72rem] font-semibold text-[var(--tk-text)] backdrop-blur-sm">
              {index + 1} / {total}
            </span>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="pace-no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {gallery.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-[14px] border-2 transition duration-500 ${
                i === index ? 'border-[var(--tk-accent)]' : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(24,18,17,0.94)] p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white hover:text-[var(--tk-text)]"
          >
            <X className="h-5 w-5" />
          </button>
          <img src={active} alt={title || ''} className="max-h-[86vh] max-w-full rounded-[20px] object-contain" onClick={(event) => event.stopPropagation()} />
        </div>
      ) : null}
    </div>
  )
}
