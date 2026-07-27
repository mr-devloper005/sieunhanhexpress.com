'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Building2, FileText, Globe, LayoutGrid, MapPin, Phone, Rows3, Search, SearchX, UserRound } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

/*
  Archive explorer.

  The server still owns the feed, category filter and pagination — this layer
  adds instant, no-reload refinement on top of the page's own results: type to
  filter, reorder, and switch between the gallery grid and a ruled list.

  Card treatments differ per task so no two archives look the same.
*/

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const stripHtml = (value: string) =>
  value
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

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const single = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...single].filter(Boolean).slice(0, 8)
}

const PLACEHOLDER = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || PLACEHOLDER
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) =>
  stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body))
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')
const timeOf = (post: SitePost) => new Date(post.publishedAt || post.createdAt || 0).getTime() || 0
const pad = (index: number) => String(index + 1).padStart(2, '0')

type SortKey = 'newest' | 'oldest' | 'title'

export function EditableArchiveExplorer({
  task,
  posts,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  basePath: string
  label: string
}) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = term
      ? posts.filter((post) =>
          [post.title, getSummary(post), getCategory(post, ''), (post.tags || []).join(' ')]
            .some((value) => String(value || '').toLowerCase().includes(term))
        )
      : posts.slice()
    const sorted = filtered.slice()
    if (sort === 'title') sorted.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')))
    if (sort === 'newest') sorted.sort((a, b) => timeOf(b) - timeOf(a))
    if (sort === 'oldest') sorted.sort((a, b) => timeOf(a) - timeOf(b))
    return sorted
  }, [posts, query, sort])

  const gridClass =
    task === 'image'
      ? 'columns-1 gap-6 [column-fill:_balance] sm:columns-2 xl:columns-3'
      : task === 'profile'
      ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
      : task === 'listing'
      ? 'grid gap-6 xl:grid-cols-2'
      : 'grid gap-7 sm:grid-cols-2 xl:grid-cols-3'

  return (
    <div>
      {/* Refinement toolbar */}
      <div className="flex flex-col gap-3 rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-3.5">
        <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-4 py-2.5">
          <Search className="h-4 w-4 shrink-0 text-[var(--tk-accent)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Filter these ${label.toLowerCase()}`}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--tk-muted)]"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} className="shrink-0 text-xs font-semibold text-[var(--tk-muted)] hover:text-[var(--tk-text)]">
              Clear
            </button>
          ) : null}
        </label>

        <div className="flex items-center gap-2.5">
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortKey)}
            aria-label="Sort results"
            className="h-11 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-4 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">A – Z</option>
          </select>

          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] p-1">
            <button
              type="button"
              onClick={() => setLayout('grid')}
              aria-label="Grid view"
              aria-pressed={layout === 'grid'}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition duration-500 ${
                layout === 'grid' ? 'bg-[var(--tk-text)] text-[var(--tk-surface)]' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setLayout('list')}
              aria-label="List view"
              aria-pressed={layout === 'list'}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition duration-500 ${
                layout === 'list' ? 'bg-[var(--tk-text)] text-[var(--tk-surface)]' : 'text-[var(--tk-muted)] hover:text-[var(--tk-text)]'
              }`}
            >
              <Rows3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-sm text-[var(--tk-muted)]">
        Showing <span className="font-semibold text-[var(--tk-text)]">{visible.length}</span> of {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        {query ? ` matching “${query}”` : ''}
      </p>

      {/* Results */}
      {visible.length ? (
        layout === 'list' ? (
          <div className="mt-8">
            {visible.map((post, index) => (
              <RuledRow key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />
            ))}
            <div className="border-t border-[var(--tk-line)]" />
          </div>
        ) : (
          <div className={`mt-8 ${gridClass}`}>
            {visible.map((post, index) => (
              <ArchiveCard key={post.id || post.slug} post={post} task={task} href={`${basePath}/${post.slug}`} index={index} />
            ))}
          </div>
        )
      ) : (
        <div className="mt-8 rounded-[26px] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] px-8 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
            <SearchX className="h-6 w-6" />
          </span>
          <h2 className="editable-display mt-5 text-[1.75rem] leading-tight">Nothing matches yet</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--tk-muted)]">
            {query ? 'Try a shorter keyword, or clear the filter to see everything on this page.' : `New ${label.toLowerCase()} will appear here as soon as they are published.`}
          </p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-semibold text-[var(--tk-surface)] transition duration-500 hover:bg-[var(--tk-accent)]"
            >
              Clear the filter
            </button>
          ) : (
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-semibold text-[var(--tk-surface)] transition duration-500 hover:bg-[var(--tk-accent)]"
            >
              Back to home <ArrowUpRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------- card router --- */
function ArchiveCard({ post, task, href, index }: { post: SitePost; task: TaskKey; href: string; index: number }) {
  if (task === 'image') return <GalleryCard post={post} href={href} index={index} />
  if (task === 'profile') return <PersonCard post={post} href={href} />
  if (task === 'listing') return <DirectoryCard post={post} href={href} />
  if (task === 'pdf' || task === 'sbm') return <ResourceCard post={post} href={href} index={index} task={task} />
  return <StoryCard post={post} href={href} index={index} />
}

/* image — masonry poster */
function GalleryCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const ratio = index % 5 === 0 ? 'aspect-[3/4]' : index % 3 === 0 ? 'aspect-square' : 'aspect-[4/5]'
  return (
    <Link href={href} className="pace-zoom group mb-6 block break-inside-avoid overflow-hidden rounded-[24px] bg-[var(--tk-raised)] transition duration-500 hover:-translate-y-1.5">
      <div className={`relative overflow-hidden ${ratio}`}>
        <img src={getImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(24,18,17,0.85)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <span className="editable-label text-white/75">{getCategory(post, 'Gallery')}</span>
          <h2 className="editable-display mt-1.5 line-clamp-2 text-[1.35rem] leading-[1.15] text-white">{post.title}</h2>
          <span className="mt-2.5 inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-white/85 transition duration-500 group-hover:gap-3">
            View gallery <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/* profile — portrait card */
function PersonCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--tk-text)]"
    >
      <div className="pace-zoom relative aspect-[4/5] overflow-hidden bg-[var(--tk-raised)]">
        {avatar ? (
          <img src={avatar} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center">
            <UserRound className="h-12 w-12 text-[var(--tk-muted)]" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h2 className="editable-display line-clamp-2 text-[1.35rem] leading-[1.15] transition duration-500 group-hover:text-[var(--tk-accent)]">{post.title}</h2>
        {role ? <p className="editable-label mt-1.5 text-[var(--tk-accent)]">{role}</p> : null}
        <p className="mt-2.5 line-clamp-2 flex-1 text-[0.875rem] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold transition duration-500 group-hover:gap-3">
          View profile <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* listing — horizontal record */
function DirectoryCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link
      href={href}
      className="group flex items-center gap-5 rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5 transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)] sm:p-6"
    >
      <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" loading="lazy" /> : <Building2 className="h-9 w-9 text-[var(--tk-muted)]" />}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="editable-display truncate text-[1.4rem] leading-tight transition duration-500 group-hover:text-[var(--tk-accent)]">{post.title}</h2>
        <p className="mt-1.5 line-clamp-2 text-[0.875rem] leading-[1.6] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-medium text-[var(--tk-muted)]">
          {location ? (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {location}
            </span>
          ) : null}
          {phone ? (
            <span className="inline-flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {phone}
            </span>
          ) : null}
          {website ? (
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {cleanDomain(website)}
            </span>
          ) : null}
        </div>
      </div>
      <ArrowUpRight className="h-5 w-5 shrink-0 text-[var(--tk-muted)] transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)]" />
    </Link>
  )
}

/* pdf / sbm — resource tile */
function ResourceCard({ post, href, index, task }: { post: SitePost; href: string; index: number; task: TaskKey }) {
  const website = getField(post, ['website', 'url', 'link', 'fileUrl'])
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6 transition duration-500 hover:-translate-y-1.5 hover:border-[var(--tk-text)]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          {task === 'pdf' ? <FileText className="h-5 w-5" /> : <Globe className="h-5 w-5" />}
        </span>
        <span className="editable-display text-[1.35rem] leading-none text-[var(--tk-muted)]">{pad(index)}</span>
      </div>
      <h2 className="editable-display mt-6 line-clamp-2 text-[1.4rem] leading-[1.15] transition duration-500 group-hover:text-[var(--tk-accent)]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 flex-1 text-[0.9rem] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
      {website ? <p className="mt-4 truncate text-xs font-semibold text-[var(--tk-accent)]">{cleanDomain(website)}</p> : null}
    </Link>
  )
}

/* article / classified — story tile */
function StoryCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="pace-zoom group flex flex-col transition duration-500 hover:-translate-y-1.5">
      <div className="relative aspect-[16/11] overflow-hidden rounded-[22px] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--tk-text)] backdrop-blur-sm">
          {getCategory(post, 'Post')}
        </span>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center gap-2.5">
          <span className="editable-display text-[1.1rem] leading-none text-[var(--tk-accent)]">{pad(index)}</span>
          <span className="h-px flex-1 bg-[var(--tk-line)]" />
        </div>
        <h2 className="editable-display mt-3 line-clamp-2 text-[1.5rem] leading-[1.15] transition duration-500 group-hover:text-[var(--tk-accent)]">{post.title}</h2>
        <p className="mt-2.5 line-clamp-3 flex-1 text-[0.9rem] leading-[1.7] text-[var(--tk-muted)]">{getSummary(post)}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold transition duration-500 group-hover:gap-3">
          Read more <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

/* shared ruled list row */
function RuledRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link
      href={href}
      className="group grid items-center gap-x-6 gap-y-3 border-t border-[var(--tk-line)] py-5 transition duration-500 hover:pl-2 sm:grid-cols-[52px_96px_minmax(0,1fr)_auto] sm:py-6"
    >
      <span className="editable-display hidden text-[1.25rem] leading-none text-[var(--tk-accent)] sm:block">{pad(index)}</span>
      <span className="pace-zoom relative hidden h-20 w-24 overflow-hidden rounded-[14px] bg-[var(--tk-raised)] sm:block">
        <img src={getImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      </span>
      <span className="min-w-0">
        <span className="editable-label block text-[var(--tk-muted)]">{getCategory(post, 'Post')}</span>
        <span className="editable-display mt-1 block line-clamp-2 text-[1.4rem] leading-[1.15] transition duration-500 group-hover:text-[var(--tk-accent)]">
          {post.title}
        </span>
        <span className="mt-1.5 block line-clamp-2 max-w-2xl text-[0.875rem] leading-[1.65] text-[var(--tk-muted)]">{getSummary(post)}</span>
      </span>
      <ArrowUpRight className="hidden h-5 w-5 shrink-0 text-[var(--tk-muted)] transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)] sm:block" />
    </Link>
  )
}
