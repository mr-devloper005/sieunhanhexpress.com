'use client'

import { useEffect, useState } from 'react'

/*
  Rotating image strip built from the newest posts.

  Each tile crossfades through the pool on a staggered timer so the band feels
  alive without pulling focus. The server render is deterministic (tick = 0) so
  there is no hydration mismatch, and rotation is disabled for
  prefers-reduced-motion users.
*/
export function EditableHeroCollage({ images, tiles = 5 }: { images: string[]; tiles?: number }) {
  const pool = images.length ? images : ['/placeholder.svg?height=900&width=1400']
  const cellCount = Math.max(1, Math.min(tiles, pool.length || 1))
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (pool.length <= 1) return
    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setTick((value) => value + 1), 4200)
    return () => clearInterval(id)
  }, [pool.length])

  return (
    <div className="pace-no-scrollbar flex gap-3 overflow-x-auto sm:gap-4" aria-hidden="true">
      {Array.from({ length: cellCount }).map((_, cell) => {
        const activeIndex = (cell + tick) % pool.length
        return (
          <div
            key={cell}
            className={`relative aspect-[3/4] w-[150px] shrink-0 overflow-hidden rounded-[18px] bg-[var(--slot4-media-bg)] sm:w-[190px] ${
              cell % 2 === 1 ? 'sm:mt-8' : ''
            }`}
          >
            {pool.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-in-out ${i === activeIndex ? 'opacity-100' : 'opacity-0'}`}
                loading={cell === 0 && i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        )
      })}
    </div>
  )
}
