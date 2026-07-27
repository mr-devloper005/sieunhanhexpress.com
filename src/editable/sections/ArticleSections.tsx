import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, postHref } from '@/editable/cards/PostCards'

const shell = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

export function EditableArticleArchive({
  posts,
  pagination,
  category = 'all',
  basePath = '/article',
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category?: string
  basePath?: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) =>
    `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`

  return (
    <main className={dc.shell.page}>
      <header className="pace-halftone pb-14 pt-[132px] text-white sm:pb-16 sm:pt-[156px]">
        <div className={shell}>
          <p className="editable-label text-white/80">{voice.eyebrow}</p>
          <h1 className="editable-display mt-5 max-w-3xl text-balance text-[2.6rem] leading-[1.0] tracking-[-0.02em] text-white sm:text-[3.6rem]">
            {voice.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-[1.02rem] leading-[1.8] text-white/90">{voice.description}</p>

          <form action={basePath} className="mt-9 flex max-w-xl flex-col gap-3 sm:flex-row">
            <select
              name="category"
              defaultValue={category || 'all'}
              aria-label={voice.filterLabel}
              className="min-w-0 flex-1 rounded-full border border-white/35 bg-white px-5 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none"
            >
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <button className="rounded-full bg-[var(--slot4-page-text)] px-8 py-3.5 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]">
              Filter
            </button>
          </form>
        </div>
      </header>

      <section className={`${shell} py-14 sm:py-16 lg:py-20`}>
        {posts.length ? (
          <div className="grid gap-5">
            {posts.map((post, index) => (
              <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit} />
            ))}
          </div>
        ) : (
          <div className={`${dc.surface.soft} px-6 py-16 text-center`}>
            <h2 className="editable-display text-[2rem] leading-tight">No articles here yet</h2>
            <p className={`mx-auto mt-3 max-w-md text-[0.95rem] leading-[1.8] ${pal.mutedText}`}>
              Try another category, or head back to the full list.
            </p>
            <Link
              href={basePath}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
            >
              All articles <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {posts.length ? (
          <nav className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
            {pagination.hasPrevPage ? (
              <Link
                href={pageHref(page - 1)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 font-semibold transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </Link>
            ) : null}
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-6 py-3 font-semibold">
              {String(page).padStart(2, '0')} <span className="opacity-40">/</span> {String(pagination.totalPages || 1).padStart(2, '0')}
            </span>
            {pagination.hasNextPage ? (
              <Link
                href={pageHref(page + 1)}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-6 py-3 font-semibold transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)]"
              >
                Next <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <div className={`${shell} pt-[104px] sm:pt-[124px]`}>
        <Link href="/article" className="inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[var(--slot4-accent)]">
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>
      </div>

      <article className="mx-auto w-full max-w-3xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24">
        <p className="editable-label text-[var(--slot4-accent)]">{voice.eyebrow}</p>
        <h1 className="editable-display mt-5 text-balance text-[2.4rem] leading-[1.04] tracking-[-0.02em] sm:text-[3.4rem]">
          {post?.title || pagesContent.detailPages.article.fallbackTitle}
        </h1>
        <p className={`mt-8 text-[1.05rem] leading-[1.85] ${pal.mutedText}`}>
          {post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}
        </p>

        <aside className="mt-12 rounded-[26px] bg-[var(--slot4-panel-bg)] p-7">
          <p className="editable-label text-[var(--slot4-accent)]">Reading note</p>
          <p className={`mt-3 text-[0.95rem] leading-[1.8] ${pal.mutedText}`}>{voice.secondaryNote}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
          >
            Get in touch <ArrowUpRight className="h-4 w-4" />
          </Link>
        </aside>
      </article>
    </main>
  )
}
