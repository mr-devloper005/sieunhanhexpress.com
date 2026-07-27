import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Filter, Search, SearchX } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { navVisibleTasks } from '@/editable/content/nav.config'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => {
  const content = getContent(post)
  // compactRaw only trims — it does NOT strip HTML — so the raw payload could leak markup
  // into the card summary. Route every candidate through toPlainText so cards stay plain,
  // and fall back to the article body when there's no dedicated summary/description.
  return toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(content.description) ||
      compactRaw(content.excerpt) ||
      compactRaw(content.body) ||
      ''
  )
}

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  // Route from the task config (e.g. /listing/<slug>); buildPostUrl can fall
  // back to /posts for tasks missing from the enabled taskViews map, which 404s.
  const taskRoute = SITE_CONFIG.tasks.find((item) => item.key === task)?.route
  const href = `${taskRoute || `/${task || 'article'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const wide = index % 5 === 0

  return (
    <Link
      href={href}
      className={`pace-zoom group flex flex-col overflow-hidden rounded-[26px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1.5 hover:border-[var(--slot4-page-text)] ${
        wide ? 'md:col-span-2 md:flex-row' : ''
      }`}
    >
      {image ? (
        <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${wide ? 'md:w-1/2 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-page-text)] backdrop-blur-sm">
            {taskLabel}
          </span>
        </div>
      ) : null}
      <div className={`flex flex-1 flex-col p-6 ${wide ? 'md:justify-center md:p-9' : ''}`}>
        {!image ? <span className="editable-label w-fit text-[var(--slot4-accent)]">{taskLabel}</span> : null}
        <h2 className="editable-display mt-1 line-clamp-3 text-[1.5rem] leading-[1.15] transition duration-500 group-hover:text-[var(--slot4-accent)] sm:text-[1.8rem]">
          {post.title}
        </h2>
        {summary ? <p className="mt-3 line-clamp-3 text-[0.9rem] leading-[1.75] text-[var(--slot4-muted-text)]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-[0.82rem] font-semibold transition duration-500 group-hover:gap-3.5">
          Open <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  // Every enabled task stays searchable/filterable; only the navigable ones
  // are offered as browse buttons.
  const browseTasks = navVisibleTasks(SITE_CONFIG.tasks)
  const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        {/* Search-first header */}
        <header className="pace-halftone pb-14 pt-[132px] text-white sm:pb-16 sm:pt-[156px]">
          <div className={shell}>
            <p className="editable-label text-white/80">{pagesContent.search.hero.badge}</p>
            <h1 className="editable-display mt-5 max-w-3xl text-balance text-[2.6rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[3.6rem] lg:text-[4.2rem]">
              {pagesContent.search.hero.title}
            </h1>
            <p className="mt-6 max-w-2xl text-[1.02rem] leading-[1.8] text-white/90">{pagesContent.search.hero.description}</p>

            <form action="/search" className="mt-9 rounded-[26px] border border-white/25 bg-white/12 p-4 backdrop-blur-md sm:p-5">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-full bg-white px-5 py-3.5">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-[0.95rem] text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
                <label className="flex items-center gap-2.5 rounded-full bg-white px-5 py-3.5">
                  <Filter className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)]" />
                  <input
                    name="category"
                    defaultValue={category}
                    placeholder="Category"
                    className="min-w-0 flex-1 bg-transparent text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <button
                  type="submit"
                  className="rounded-full bg-[var(--slot4-page-text)] px-8 py-3.5 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </header>

        {/* Results */}
        <section className={`${shell} py-14 sm:py-16 lg:py-20`}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="editable-label text-[var(--slot4-accent)]">
                {results.length} {results.length === 1 ? 'result' : 'results'}
              </p>
              <h2 className="editable-display mt-3 text-[2rem] leading-tight sm:text-[2.7rem]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
            </div>
            <Link href="/" className="pace-underline inline-flex items-center gap-2 text-sm font-semibold">
              Back to home <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          {results.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <SearchResultCard key={post.id || post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-[28px] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <SearchX className="h-6 w-6" />
              </span>
              <h3 className="editable-display mt-6 text-[1.9rem] leading-tight">Nothing matched that</h3>
              <p className="mx-auto mt-3 max-w-md text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text)]">
                Try a shorter keyword, drop the category, or widen the content type and search again.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {browseTasks.map((item) => (
                  <Link
                    key={item.key}
                    href={item.route}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-5 py-2.5 text-sm font-medium transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
                  >
                    Browse {item.label.toLowerCase()}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
