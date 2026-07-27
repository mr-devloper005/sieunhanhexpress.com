import Link from 'next/link'
import { ArrowLeft, ArrowRight, ChevronDown } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArchiveExplorer } from '@/editable/components/EditableArchiveExplorer'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return (
    <TaskArchiveView
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      basePath={basePath || taskConfig?.route || `/${task}`}
    />
  )
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const theme = getTaskTheme(task)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const totalPages = pagination.totalPages || 1

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {/* Signature colour header, running edge-to-edge behind the floating nav */}
        <header className="pace-halftone pb-14 pt-[124px] text-white sm:pb-16 sm:pt-[148px]">
          <div className="mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10">
            <Link href="/" className="inline-flex items-center gap-2 text-[0.8rem] font-semibold text-white/80 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Home
            </Link>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div className="min-w-0">
                <p className="editable-label text-white/80">{theme.kicker}</p>
                <h1 className="editable-display mt-4 max-w-3xl text-balance text-[2.6rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[3.6rem] lg:text-[4.2rem]">
                  {voice?.headline || `Browse ${label}`}
                </h1>
              </div>
              <div className="min-w-0">
                <p className="max-w-lg text-[1rem] leading-[1.8] text-white/90">{voice?.description || theme.note}</p>
                {voice?.chips?.length ? (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {voice.chips.map((chip) => (
                      <span key={chip} className="rounded-full border border-white/35 bg-white/12 px-4 py-1.5 text-[0.78rem] font-medium text-white backdrop-blur-sm">
                        {chip}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Server-side category filter */}
            <div className="mt-12 flex flex-col gap-4 border-t border-white/25 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/85">
                <span className="font-semibold text-white">{pagination.total || posts.length}</span> {(pagination.total || posts.length) === 1 ? 'post' : 'posts'}
                <span className="mx-2 opacity-50">·</span>
                {categoryLabel}
                <span className="mx-2 opacity-50">·</span>
                Page {page} of {totalPages}
              </p>
              <form action={basePath} className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    name="category"
                    defaultValue={category}
                    aria-label={voice?.filterLabel || 'Filter category'}
                    className="h-11 appearance-none rounded-full border border-white/35 bg-white/15 pl-5 pr-11 text-sm font-medium text-white outline-none backdrop-blur-sm transition focus:border-white [&>option]:text-[var(--tk-text)]"
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
                </div>
                <button className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-semibold text-[var(--tk-text)] transition duration-500 hover:bg-[var(--tk-text)] hover:text-white">
                  Apply
                </button>
              </form>
            </div>
          </div>
        </header>

        {/* Results */}
        <section className="mx-auto w-full max-w-[var(--editable-container)] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
          <EditableArchiveExplorer task={task} posts={posts} basePath={basePath} label={label} />

          {posts.length ? (
            <nav className="mt-16 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? (
                <Link
                  href={pageHref(basePath, category, page - 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous
                </Link>
              ) : null}

              <span className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent-soft)] px-6 py-3 font-semibold text-[var(--tk-text)]">
                {String(page).padStart(2, '0')} <span className="opacity-40">/</span> {String(totalPages).padStart(2, '0')}
              </span>

              {pagination.hasNextPage ? (
                <Link
                  href={pageHref(basePath, category, page + 1)}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-6 py-3 font-semibold transition duration-500 hover:bg-[var(--tk-text)] hover:text-[var(--tk-surface)]"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </Link>
              ) : null}
            </nav>
          ) : null}
        </section>

        {/* Closing note */}
        <section className="border-t border-[var(--tk-line)] bg-[var(--tk-raised)]">
          <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-start justify-between gap-6 px-5 py-14 sm:flex-row sm:items-center sm:px-8 lg:px-10">
            <div>
              <p className="editable-label text-[var(--tk-accent)]">{theme.kicker}</p>
              <h2 className="editable-display mt-3 max-w-xl text-[1.8rem] leading-tight sm:text-[2.4rem]">{voice?.secondaryNote || theme.note}</h2>
            </div>
            <Link
              href="/contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--tk-text)] px-7 py-3.5 text-sm font-semibold text-[var(--tk-surface)] transition duration-500 hover:bg-[var(--tk-accent)]"
            >
              Get in touch <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
