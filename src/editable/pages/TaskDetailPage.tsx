import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft, ArrowUpRight, Bookmark, Building2, CheckCircle2, Download, ExternalLink, FileText,
  Globe2, Mail, MapPin, Phone, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { EditableGalleryViewer } from '@/editable/components/EditableGalleryViewer'
import { EditableShareBar } from '@/editable/components/EditableShareBar'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

/* ------------------------------------------------------------ helpers --- */

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(
    /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi,
    (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`
  )

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(
    /(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi,
    (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`
  )

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"')
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

// Plain-text lead intro, but only when it isn't just a duplicate of the body
// (some posts store the full HTML body in `summary`, which would render twice).
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}

const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback

const dateOf = (post: SitePost) => {
  const raw = post.publishedAt || post.createdAt
  if (!raw) return ''
  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

/* --------------------------------------------------------------- view --- */

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ------------------------------------------------------ shared pieces --- */

function TopBar({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  const theme = getTaskTheme(task)
  return (
    <div className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)] pt-[80px] sm:pt-[90px]">
      <div className={`${shell} flex flex-wrap items-center justify-between gap-3 py-4`}>
        <div className="flex min-w-0 items-center gap-2.5 text-[0.8rem]">
          <Link href="/" className="shrink-0 text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
            Home
          </Link>
          <span className="text-[var(--tk-line)]">/</span>
          <Link href={taskConfig?.route || '/'} className="shrink-0 font-semibold text-[var(--tk-text)] transition hover:text-[var(--tk-accent)]">
            {taskConfig?.label || theme.kicker}
          </Link>
        </div>
        <Link
          href={taskConfig?.route || '/'}
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--tk-line)] px-4 py-2 text-[0.78rem] font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All {(taskConfig?.label || 'posts').toLowerCase()}
        </Link>
      </div>
    </div>
  )
}

function MetaLine({ post, fallback, center = false }: { post: SitePost; fallback: string; center?: boolean }) {
  const category = categoryOf(post, fallback)
  const date = dateOf(post)
  const author = asText(post.authorName) || SITE_CONFIG.name
  return (
    <div className={`mt-5 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.82rem] text-[var(--tk-muted)] ${center ? 'justify-center' : ''}`}>
      <span className="rounded-full bg-[var(--tk-accent-soft)] px-3.5 py-1.5 font-semibold text-[var(--tk-accent)]">{category}</span>
      <span className="font-medium text-[var(--tk-text)]">{author}</span>
      {date ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-line)]" />
          <span>{date}</span>
        </>
      ) : null}
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content mt-8 max-w-none text-[var(--tk-text)] ${compact ? 'text-[0.95rem] leading-[1.8]' : 'text-[1.05rem] leading-[1.85]'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[20px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-5">
          <div className="editable-label flex items-center gap-2 text-[var(--tk-muted)]">
            <Icon className="h-4 w-4 text-[var(--tk-accent)]" /> {label}
          </div>
          <p className="mt-2.5 break-words text-[0.95rem] font-medium leading-6">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-12">
      <p className="editable-label text-[var(--tk-muted)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <span key={`${image}-${index}`} className="pace-zoom relative block aspect-[4/3] overflow-hidden rounded-[18px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          </span>
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold">
        <MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}
      </div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email, bare = false }: { website?: string; phone?: string; email?: string; bare?: boolean }) {
  if (!website && !phone && !email) return null
  const buttons = (
    <div className={`flex flex-wrap gap-2.5 ${bare ? 'justify-center' : ''}`}>
      {website ? (
        <Link
          href={website}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--tk-text)]"
        >
          Website <ExternalLink className="h-4 w-4" />
        </Link>
      ) : null}
      {phone ? (
        <a
          href={`tel:${phone}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
      ) : null}
      {email ? (
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
      ) : null}
    </div>
  )
  if (bare) return <div className="mt-6">{buttons}</div>
  return (
    <div className="rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
      <p className="editable-label text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-4">{buttons}</div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full border border-[var(--tk-line)] bg-[var(--tk-raised)] px-5 py-3 text-sm">
      <span className="editable-label text-[var(--tk-muted)]">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-5">
      <div className="rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
        <p className="editable-label text-[var(--tk-muted)]">About this post</p>
        <div className="mt-4 grid gap-2.5 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2">
            <Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {taskConfig?.label || task}
          </p>
          <p className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}
          </p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-[1.3rem] leading-tight">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="editable-label text-[var(--tk-accent)]">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => (
              <RelatedCard key={item.id || item.slug} task={task} post={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
      <div className={`${shell} py-16 sm:py-20`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="editable-label text-[var(--tk-accent)]">Keep going</p>
            <h2 className="editable-display mt-3 text-[1.9rem] leading-tight sm:text-[2.6rem]">
              More {(taskConfig?.label || 'posts').toLowerCase()}
            </h2>
          </div>
          <Link href={taskConfig?.route || '/'} className="pace-underline inline-flex items-center gap-2 text-sm font-semibold">
            View all <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <RelatedCard key={item.id || item.slug} task={task} post={item} grid />
          ))}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  // Build the detail URL from the task route (e.g. /listing/<slug>) — the same
  // base the archive cards use.
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="pace-zoom group block transition duration-500 hover:-translate-y-1.5">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-[var(--tk-surface)]">
          {image ? (
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center">
              <FileText className="h-7 w-7 text-[var(--tk-muted)]" />
            </span>
          )}
        </div>
        <h3 className="editable-display mt-4 line-clamp-2 text-[1.25rem] leading-[1.18] transition duration-500 group-hover:text-[var(--tk-accent)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.85rem] leading-[1.6] text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[16px] border border-[var(--tk-line)] p-3 transition duration-500 hover:border-[var(--tk-text)]">
      {image && task !== 'sbm' ? (
        <img src={image} alt="" className="h-16 w-16 shrink-0 rounded-[12px] object-cover" loading="lazy" />
      ) : (
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[12px] bg-[var(--tk-raised)]">
          <FileText className="h-5 w-5 text-[var(--tk-muted)]" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block line-clamp-2 text-sm font-semibold leading-snug transition duration-500 group-hover:text-[var(--tk-accent)]">{post.title}</span>
        <span className="mt-1.5 block line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</span>
      </span>
    </Link>
  )
}

/* ------------------------------------ article: a quiet reading column --- */
function ArticleDetail({
  post,
  related,
  comments,
}: {
  post: SitePost
  related: SitePost[]
  comments: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  const images = getImages(post)
  const lead = leadText(post)
  return (
    <>
      <TopBar task="article" />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="editable-label text-[var(--tk-accent)]">{categoryOf(post, 'Article')}</p>
        <h1 className="editable-display mt-5 text-balance text-[2.4rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.2rem] lg:text-[3.6rem]">{post.title}</h1>
        {lead ? <p className="mt-6 text-[1.1rem] leading-[1.75] text-[var(--tk-muted)]">{lead}</p> : null}
        <MetaLine post={post} fallback="Article" />
        <div className="mt-7 border-y border-[var(--tk-line)] py-4">
          <EditableShareBar title={post.title} />
        </div>
        {images[0] ? (
          <span className="pace-zoom relative mt-10 block aspect-[16/10] overflow-hidden rounded-[26px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
            <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </span>
        ) : null}
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="More from this piece" />
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      <RelatedStrip task="article" related={related} />
    </>
  )
}

/* --------------------------------- listing: a precise directory record --- */
function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <TopBar task="listing" />
      <section className={`${shell} py-14 sm:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="min-w-0">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-raised)]">
                {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-[var(--tk-muted)]" />}
              </div>
              <div className="min-w-0">
                <h1 className="editable-display text-[2.2rem] leading-[1.05] tracking-[-0.02em] sm:text-[3rem]">{post.title}</h1>
                <MetaLine post={post} fallback="Listing" />
              </div>
            </div>
            {leadText(post) ? <p className="mt-8 max-w-2xl text-[1.05rem] leading-[1.8] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <div className="my-10 h-px bg-[var(--tk-line)]" />
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Showcase" />
          </article>
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" related={related} />
          </aside>
        </div>
      </section>
    </>
  )
}

/* ------------------------- classified: price-forward with action rail --- */
function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <TopBar task="classified" />
      <section className={`${shell} grid gap-10 py-14 sm:py-20 lg:grid-cols-[360px_minmax(0,1fr)]`}>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[26px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-7">
            <p className="editable-label text-[var(--tk-accent)]">{categoryOf(post, 'Classified')}</p>
            <h1 className="editable-display mt-4 text-[1.8rem] leading-[1.1] tracking-[-0.015em]">{post.title}</h1>
            <p className="editable-display mt-6 text-[2.6rem] leading-none text-[var(--tk-accent)]">{price || 'Open offer'}</p>
            <div className="mt-6 space-y-2.5">
              {condition ? <BadgeLine label="Condition" value={condition} /> : null}
              {location ? <BadgeLine label="Location" value={location} /> : null}
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--tk-text)]"
                >
                  <Phone className="h-4 w-4" /> Call now
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
                >
                  <Mail className="h-4 w-4" /> Email
                </a>
              ) : null}
            </div>
          </div>
        </aside>
        <article className="min-w-0">
          {images.length ? <EditableGalleryViewer images={images} title={post.title} /> : null}
          <BodyContent post={post} />
          <div className="mt-10">
            <ContactAction website={website} phone={phone} email={email} />
          </div>
        </article>
      </section>
      <RelatedStrip task="classified" related={related} />
    </>
  )
}

/* -------------------------------------- image: a gallery-led canvas --- */
function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <>
      <TopBar task="image" />
      <section className={`${shell} py-14 sm:py-20`}>
        <div className="max-w-3xl">
          <p className="editable-label text-[var(--tk-accent)]">{categoryOf(post, 'Gallery')}</p>
          <h1 className="editable-display mt-5 text-balance text-[2.4rem] leading-[1.03] tracking-[-0.02em] sm:text-[3.4rem]">{post.title}</h1>
          <MetaLine post={post} fallback="Gallery" />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="min-w-0">
            <EditableGalleryViewer images={gallery} title={post.title} />
          </div>
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            {leadText(post) ? <p className="text-[1.05rem] leading-[1.8] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
            <BodyContent post={post} compact />
            <div className="mt-8 border-t border-[var(--tk-line)] pt-6">
              <EditableShareBar title={post.title} />
            </div>
          </aside>
        </div>
      </section>
      <RelatedStrip task="image" related={related} />
    </>
  )
}

/* ------------------------------------- bookmark: one curated resource --- */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <TopBar task="sbm" />
      <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Bookmark className="h-6 w-6" />
        </span>
        <p className="editable-label mt-6 text-[var(--tk-accent)]">{categoryOf(post, 'Resource')}</p>
        <h1 className="editable-display mt-4 text-[2.3rem] leading-[1.05] tracking-[-0.02em] sm:text-[3.2rem]">{post.title}</h1>
        <MetaLine post={post} fallback="Resource" />
        {leadText(post) ? <p className="mt-6 text-[1.05rem] leading-[1.8] text-[var(--tk-muted)]">{leadText(post)}</p> : null}
        {website ? (
          <Link
            href={website}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3.5 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--tk-text)]"
          >
            Open resource <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
        <BodyContent post={post} />
      </article>
      <RelatedStrip task="sbm" related={related} />
    </>
  )
}

/* ------------------------------------------- pdf: document workspace --- */
function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <TopBar task="pdf" />
      <section className={`${shell} py-14 sm:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px]">
          <article className="min-w-0">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                <FileText className="h-8 w-8" />
              </span>
              <div className="min-w-0">
                <p className="editable-label text-[var(--tk-accent)]">{categoryOf(post, 'Document')}</p>
                <h1 className="editable-display mt-3 text-[2rem] leading-[1.06] tracking-[-0.015em] sm:text-[2.8rem]">{post.title}</h1>
              </div>
            </div>
            <MetaLine post={post} fallback="Document" />
            <BodyContent post={post} />
            {fileUrl ? (
              <div className="mt-12 overflow-hidden rounded-[24px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--tk-line)] p-4">
                  <span className="text-sm font-semibold">Document preview</span>
                  <Link
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-4 py-2 text-xs font-semibold text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--tk-text)]"
                  >
                    Download <Download className="h-4 w-4" />
                  </Link>
                </div>
                <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-[var(--tk-raised)]" />
              </div>
            ) : null}
          </article>
          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            {fileUrl ? (
              <div className="rounded-[22px] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
                <p className="text-sm font-semibold">Get this document</p>
                <p className="mt-2 text-sm leading-6 text-[var(--tk-muted)]">Open or download the full file in a new tab.</p>
                <Link
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold text-[var(--tk-on-accent)] transition duration-500 hover:bg-[var(--tk-text)]"
                >
                  Download <Download className="h-4 w-4" />
                </Link>
              </div>
            ) : null}
            <RelatedPanel task="pdf" related={related} />
          </aside>
        </div>
      </section>
    </>
  )
}

/* ------------------------------- profile: identity-first with a rail --- */
function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const location = getField(post, ['location', 'city', 'address'])
  return (
    <>
      <TopBar task="profile" />
      <section className={`${shell} py-14 sm:py-20`}>
        <div className="grid gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-[26px] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
              <div className="relative aspect-[4/5] bg-[var(--tk-raised)]">
                {images[0] ? (
                  <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <UserRound className="h-16 w-16 text-[var(--tk-muted)]" />
                  </span>
                )}
              </div>
              <div className="p-6 text-center">
                <h1 className="editable-display text-[1.7rem] leading-tight">{post.title}</h1>
                {role ? <p className="editable-label mt-2 text-[var(--tk-accent)]">{role}</p> : null}
                {location ? <p className="mt-2 text-sm text-[var(--tk-muted)]">{location}</p> : null}
                <ContactAction website={website} email={email} bare />
              </div>
            </div>
          </aside>

          <article className="min-w-0">
            <p className="editable-label text-[var(--tk-accent)]">{categoryOf(post, 'Profile')}</p>
            {leadText(post) ? (
              <p className="editable-display mt-5 text-[1.7rem] leading-[1.35] tracking-[-0.01em] sm:text-[2.1rem]">{leadText(post)}</p>
            ) : null}
            <MetaLine post={post} fallback="Profile" />
            <div className="mt-7 border-y border-[var(--tk-line)] py-4">
              <EditableShareBar title={post.title} />
            </div>
            <BodyContent post={post} />
            <ImageStrip images={images.slice(1)} label="Selected work" />
          </article>
        </div>
      </section>
      <RelatedStrip task="profile" related={related} />
    </>
  )
}
