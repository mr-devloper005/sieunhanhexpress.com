import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

/*
  The card library.

  Deliberately varied so no two areas of the site read the same:

  1. EditorialFeatureCard — full-bleed hero card with an image wash
  2. RailPostCard        — image-first portrait card for rails and grids
  3. CompactIndexCard    — quiet text-only card with an index number
  4. ArticleListCard     — horizontal split, media left / copy right
  5. EditorialRowCard    — ruled magazine row, no container chrome
  6. PosterCard          — poster-style overlay card for gallery moments

  Every card renders safely when image, summary, or category are missing.
*/

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

// Reduce any content payload — rich HTML, entity-encoded HTML, or already-plain text — to
// a clean plain-text card summary. Card excerpts must never show raw markup regardless of
// what the content API sends. Two tag-strip passes (before + after entity decode) also catch
// entity-encoded markup like &lt;p&gt;.
export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/** Two-digit index label, e.g. 01 / 07 / 12. */
function indexLabel(index: number) {
  return String(index + 1).padStart(2, '0')
}

/* ------------------------------------------------- 1. featured card --- */
export function EditorialFeatureCard({ post, href, label = 'Featured' }: { post: SitePost; href: string; label?: string }) {
  const excerpt = getEditableExcerpt(post, 180)
  return (
    <Link href={href} className={`pace-zoom group relative block min-w-0 overflow-hidden rounded-[30px] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className="relative min-h-[440px] sm:min-h-[520px] lg:min-h-[600px]">
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,17,0.05)_18%,rgba(24,18,17,0.55)_58%,rgba(24,18,17,0.88)_100%)]" />
        <div className="relative flex h-full min-h-[440px] flex-col justify-end p-6 sm:min-h-[520px] sm:p-9 lg:min-h-[600px] lg:p-11">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {label}
          </span>
          <h3 className="editable-display mt-5 max-w-2xl text-[2.1rem] leading-[1.02] tracking-[-0.015em] text-white sm:text-[2.9rem] lg:text-[3.4rem]">
            {post.title}
          </h3>
          {excerpt ? <p className="mt-4 max-w-xl text-[0.95rem] leading-[1.75] text-white/80">{excerpt}</p> : null}
          <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
            Read the story <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* ------------------------------------------ 2. image-first rail card --- */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = getEditableCategory(post)
  return (
    <Link href={href} className={`pace-zoom group block min-w-0 ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)] backdrop-blur-sm">
          {category}
        </span>
        <span className="absolute right-4 top-4 editable-display text-[1.6rem] leading-none text-white/85">{indexLabel(index)}</span>
      </div>
      <div className="pt-5">
        <h3 className={`editable-display line-clamp-2 text-[1.45rem] leading-[1.15] ${pal.panelText} transition duration-500 group-hover:text-[var(--slot4-accent)]`}>
          {post.title}
        </h3>
        <p className={`mt-2.5 line-clamp-2 text-[0.9rem] leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
      </div>
    </Link>
  )
}

/* ---------------------------------------------- 3. compact text card --- */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group flex min-w-0 items-start gap-4 rounded-[22px] border ${pal.border} ${pal.surfaceBg} p-5 transition duration-500 hover:border-[var(--slot4-page-text)] sm:p-6`}
    >
      <span className="editable-display shrink-0 text-[1.5rem] leading-none text-[var(--slot4-accent)]">{indexLabel(index)}</span>
      <div className="min-w-0 flex-1">
        <p className={`editable-label ${pal.softMutedText}`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-2 line-clamp-2 text-[1.3rem] leading-[1.18] ${pal.panelText} transition duration-500 group-hover:text-[var(--slot4-accent)]`}>
          {post.title}
        </h3>
        <p className={`mt-2 line-clamp-2 text-[0.875rem] leading-[1.65] ${pal.mutedText}`}>{getEditableExcerpt(post, 96)}</p>
      </div>
      <ArrowUpRight className={`h-4 w-4 shrink-0 ${pal.softMutedText} transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--slot4-accent)]`} />
    </Link>
  )
}

/* ------------------------------------------------ 4. horizontal card --- */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`pace-zoom group grid min-w-0 gap-5 overflow-hidden rounded-[26px] border ${pal.border} ${pal.surfaceBg} p-4 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-page-text)] sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)] sm:gap-7 sm:p-5`}
    >
      <div className={`${dc.media.frame} aspect-[16/11] sm:aspect-auto sm:min-h-[210px]`}>
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="min-w-0 self-center py-1 sm:pr-5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className={`editable-label ${pal.accentText}`}>{getEditableCategory(post)}</span>
          <span className={`h-1 w-1 rounded-full ${pal.sandBg}`} />
          <span className={`editable-label ${pal.softMutedText}`}>No. {indexLabel(index)}</span>
        </div>
        <h2 className={`editable-display mt-3 line-clamp-3 text-[1.75rem] leading-[1.1] ${pal.panelText} transition duration-500 group-hover:text-[var(--slot4-accent)] sm:text-[2.1rem]`}>
          {post.title}
        </h2>
        <p className={`mt-3.5 line-clamp-3 text-[0.95rem] leading-[1.75] ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold ${pal.panelText} transition duration-500 group-hover:gap-3.5`}>
          Continue reading <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

/* -------------------------------------------- 5. editorial ruled row --- */
export function EditorialRowCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className={`group grid min-w-0 items-baseline gap-x-6 gap-y-2 border-t ${pal.border} py-6 transition duration-500 hover:pl-2 sm:grid-cols-[56px_minmax(0,1fr)_auto] sm:py-7`}
    >
      <span className="editable-display text-[1.35rem] leading-none text-[var(--slot4-accent)]">{indexLabel(index)}</span>
      <div className="min-w-0">
        <h3 className={`editable-display text-[1.5rem] leading-[1.15] ${pal.panelText} transition duration-500 group-hover:text-[var(--slot4-accent)] sm:text-[1.9rem]`}>
          {post.title}
        </h3>
        <p className={`mt-2 line-clamp-2 max-w-2xl text-[0.9rem] leading-[1.7] ${pal.mutedText}`}>{getEditableExcerpt(post, 150)}</p>
      </div>
      <span className={`inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] ${pal.softMutedText} transition duration-500 group-hover:text-[var(--slot4-page-text)]`}>
        {getEditableCategory(post)} <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  )
}

/* ------------------------------------------------- 6. poster overlay --- */
export function PosterCard({ post, href, tall = false }: { post: SitePost; href: string; tall?: boolean }) {
  return (
    <Link href={href} className={`pace-zoom group relative block min-w-0 overflow-hidden rounded-[24px] ${pal.mediaBg} ${dc.motion.lift}`}>
      <div className={`relative ${tall ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}>
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_38%,rgba(24,18,17,0.82)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
          <span className="editable-label text-white/75">{getEditableCategory(post)}</span>
          <h3 className="editable-display mt-2 line-clamp-2 text-[1.35rem] leading-[1.15] text-white sm:text-[1.6rem]">{post.title}</h3>
          <span className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white/85 transition duration-500 group-hover:gap-3">
            View <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
