import Link from 'next/link'
import {
  ArrowUpRight, Bookmark, Building2, Compass, FileText, Image as ImageIcon, Layers, Megaphone,
  Plus, Search, Sparkles, UserRound,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { navVisibleTasks } from '@/editable/content/nav.config'
import {
  ArticleListCard, CompactIndexCard, EditorialFeatureCard, EditorialRowCard, PosterCard, RailPostCard,
  getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref,
} from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'
import { EditableSpotlightCarousel, type SpotlightItem } from '@/editable/components/EditableSpotlightCarousel'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10'

const taskIcon: Record<TaskKey, typeof FileText> = {
  article: FileText,
  listing: Building2,
  classified: Megaphone,
  image: ImageIcon,
  sbm: Bookmark,
  pdf: Layers,
  profile: UserRound,
}

const helpIcon = [Sparkles, Compass, Layers]

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

/** Merge every available feed so the homepage always has content to shape. */
function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/** Real images from the newest posts (deduped, placeholders dropped). */
function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function allPosts({ posts, timeSections }: HomeSectionProps) {
  return dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
}

/* ============================================================ 1. HERO === */

export function EditableHomeHero(props: HomeSectionProps) {
  const { primaryTask, primaryRoute } = props
  const hero = pagesContent.home.hero
  const titleLines = Array.isArray(hero.title) ? hero.title : [String(hero.title || SITE_CONFIG.name)]
  const categories = navVisibleTasks(SITE_CONFIG.tasks).slice(0, 6)

  return (
    <section>
      {/* Coral halftone field */}
      <div className="pace-halftone pb-16 pt-[132px] text-white sm:pb-20 sm:pt-[156px] lg:pb-24 lg:pt-[176px]">
        <div className={container}>
          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <p className="editable-label text-white/80">{hero.badge}</p>
              <h1 className="editable-display mt-5 text-[2.9rem] leading-[0.98] tracking-[-0.02em] text-white sm:text-[4rem] lg:text-[4.9rem]">
                {titleLines.map((line, index) => (
                  <span key={line} className="block">
                    {line}
                    {index === titleLines.length - 1 ? null : ' '}
                  </span>
                ))}
              </h1>
            </div>

            <div className="min-w-0">
              <p className="text-lg font-semibold leading-[1.55] text-white sm:text-xl">{hero.lead}</p>
              <p className="mt-4 max-w-lg text-[0.98rem] leading-[1.8] text-white/90">{hero.description}</p>

              <form action="/search" className="mt-8 flex w-full max-w-lg overflow-hidden rounded-full bg-white p-1.5 shadow-[0_18px_50px_rgba(24,18,17,0.18)]">
                <label className="flex min-w-0 flex-1 items-center gap-2.5 pl-4">
                  <Search className="h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                  <input
                    name="q"
                    placeholder={hero.searchPlaceholder}
                    aria-label="Search the site"
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                  />
                </label>
                <button className="shrink-0 rounded-full bg-[var(--slot4-accent-soft)] px-6 py-3 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-white">
                  Search
                </button>
              </form>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href={hero.primaryCta?.href || primaryRoute}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
                >
                  {hero.primaryCta?.label || `Browse ${taskLabel(primaryTask).toLowerCase()}`} <ArrowUpRight className="h-4 w-4" />
                </Link>

              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {categories.map((task) => (
                  <Link
                    key={task.key}
                    href={task.route}
                    className="rounded-full border border-white/35 bg-white/10 px-4 py-1.5 text-[0.8rem] font-medium text-white backdrop-blur-sm transition duration-500 hover:bg-white hover:text-[var(--slot4-accent)]"
                  >
                    {task.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magenta stat band */}
      <div className="bg-[var(--slot4-pink)]">
        <div className={`${container} py-10 sm:py-12`}>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-12">
            {pagesContent.home.stats.map((stat, index) => (
              <div key={stat.label} className="flex items-center gap-6 sm:gap-12">
                {index === 0 ? null : <Plus className="hidden h-4 w-4 rotate-45 text-white/70 sm:block" />}
                <p className="text-center text-white sm:text-left">
                  <span className="editable-display text-[1.7rem] leading-none sm:text-[2rem]">{stat.value}</span>
                  <span className="ml-2.5 text-[0.95rem] font-medium">{stat.label}</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-center text-xs font-medium text-white/80">{pagesContent.home.statsNote}</p>
        </div>
      </div>

      {/* Scrolling keyword rail */}
      <div className="pace-marquee-wrap overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] py-4">
        <div className="pace-marquee flex w-max items-center gap-8 pr-8">
          {[...pagesContent.home.marquee, ...pagesContent.home.marquee].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex shrink-0 items-center gap-8 text-sm font-medium text-[var(--slot4-muted-text)]">
              {item}
              <Plus className="h-3.5 w-3.5 rotate-45 text-[var(--slot4-accent)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================================================ 2. HELP + CATEGORIES === */

export function EditableStoryRail(props: HomeSectionProps) {
  const { primaryRoute } = props
  const help = pagesContent.home.help
  const audience = pagesContent.home.audience
  const categories = navVisibleTasks(SITE_CONFIG.tasks)
  const strip = latestPostImages(allPosts(props), 6)

  return (
    <section className="pace-grain bg-[var(--slot4-panel-bg)]">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="mx-auto max-w-2xl text-center">
          <p className="editable-label text-[var(--slot4-accent)]">{help.eyebrow}</p>
          <h2 className="editable-display mt-4 text-[2.4rem] leading-[1.02] tracking-[-0.015em] sm:text-[3.4rem]">{help.title}</h2>
          <p className="mt-5 text-[0.98rem] leading-[1.8] text-[var(--slot4-muted-text)]">{help.description}</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {help.items.map((item, index) => {
            const Icon = helpIcon[index % helpIcon.length]
            return (
              <article
                key={item.title}
                className="group rounded-[26px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]/70 p-7 text-center transition duration-500 hover:-translate-y-1.5 hover:bg-[var(--slot4-surface-bg)] sm:p-9"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="editable-display mt-6 text-[1.45rem] leading-tight">{item.title}</h3>
                <p className="mt-3.5 text-[0.9rem] leading-[1.8] text-[var(--slot4-muted-text)]">{item.body}</p>
              </article>
            )
          })}
        </div>

        {/* Who we help — category chips */}
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="editable-label text-[var(--slot4-accent)]">{audience.eyebrow}</p>
            <h2 className="editable-display mt-4 text-[2.2rem] leading-[1.03] tracking-[-0.015em] sm:text-[3rem]">{audience.title}</h2>
            <p className="mt-4 max-w-md text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text)]">{audience.description}</p>
            <Link
              href={primaryRoute}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)]"
            >
              See everything <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((task) => {
              const Icon = taskIcon[task.key] || FileText
              return (
                <Link
                  key={task.key}
                  href={task.route}
                  className="group flex items-center gap-4 rounded-[20px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-5 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-page-text)]"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)] transition duration-500 group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="editable-display block text-[1.2rem] leading-tight">{task.label}</span>
                    <span className="mt-0.5 block truncate text-xs text-[var(--slot4-muted-text)]">{task.description}</span>
                  </span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--slot4-soft-muted-text)] transition duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Rotating strip of the newest imagery */}
        {strip.length ? (
          <div className="mt-16">
            <div className="flex items-baseline justify-between gap-4">
              <p className="editable-label text-[var(--slot4-muted-text)]">{pagesContent.home.hero.focusLabel}</p>
              <Link href={primaryRoute} className="pace-underline text-sm font-semibold text-[var(--slot4-page-text)]">
                Open the full collection
              </Link>
            </div>
            <div className="mt-5">
              <EditableHeroCollage images={strip} tiles={6} />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ============================================= 3. FEATURED + EDITORIAL === */

export function EditableMagazineSplit(props: HomeSectionProps) {
  const { primaryTask, primaryRoute } = props
  const pool = allPosts(props)
  if (!pool.length) return null

  const [feature, ...rest] = pool
  const sidebar = rest.slice(0, 4)
  const rail = rest.slice(4, 12)

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`${container} py-16 sm:py-20 lg:py-24`}>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="editable-label text-[var(--slot4-accent)]">Latest</p>
            <h2 className="editable-display mt-3 text-[2.3rem] leading-[1.03] tracking-[-0.015em] sm:text-[3.2rem]">Just published</h2>
          </div>
          <Link href={primaryRoute} className="pace-underline inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)]">
            View all {taskLabel(primaryTask).toLowerCase()} <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label={getEditableCategory(feature)} />
          {sidebar.length ? (
            <div className="grid content-start gap-4">
              {sidebar.map((post, index) => (
                <CompactIndexCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              ))}
            </div>
          ) : null}
        </div>

        {rail.length ? (
          <div className="mt-14">
            <div className="flex items-baseline justify-between gap-4 border-t border-[var(--editable-border)] pt-8">
              <h3 className="editable-display text-[1.7rem] leading-tight sm:text-[2.1rem]">More to look through</h3>
              <Link href={primaryRoute} className="pace-underline shrink-0 text-sm font-semibold text-[var(--slot4-page-text)]">
                See all
              </Link>
            </div>
            <div className="pace-no-scrollbar mt-7 flex snap-x gap-6 overflow-x-auto pb-4">
              {rail.map((post, index) => (
                <div key={post.id || post.slug} className="w-[250px] shrink-0 snap-start sm:w-[300px]">
                  <RailPostCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}

/* ================================================== 4. SPOTLIGHT RAIL === */

export function EditableSpotlight(props: HomeSectionProps) {
  const { primaryTask, primaryRoute } = props
  const pool = allPosts(props).slice(0, 8)
  if (pool.length < 2) return null

  const items: SpotlightItem[] = pool.map((post) => ({
    id: post.id || post.slug || post.title,
    title: post.title,
    excerpt: getEditableExcerpt(post, 240),
    category: getEditableCategory(post),
    image: getEditablePostImage(post),
    href: postHref(primaryTask, post, primaryRoute),
  }))

  return (
    <EditableSpotlightCarousel
      items={items}
      eyebrow={pagesContent.home.spotlight.eyebrow}
      title={pagesContent.home.spotlight.title}
      description={pagesContent.home.spotlight.description}
    />
  )
}

/* ============================================== 5. TIME COLLECTIONS === */

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'This week', title: 'Added in the last seven days' },
  browse: { eyebrow: 'Popular', title: 'What people keep coming back to' },
  index: { eyebrow: 'Evergreen', title: 'Still worth your time' },
}

export function EditableTimeCollections(props: HomeSectionProps) {
  const { primaryTask, primaryRoute, posts, timeSections } = props

  // Use the real time windows; fall back to slicing posts so the page stays full.
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const variant = index % 3
        const surface = variant === 1 ? 'bg-[var(--slot4-panel-bg)] pace-grain' : 'bg-[var(--slot4-page-bg)]'

        return (
          <section key={section.key} className={surface}>
            <div className={`${container} py-16 sm:py-20`}>
              <div className="flex flex-wrap items-end justify-between gap-5">
                <div>
                  <p className="editable-label text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-3 text-[2rem] leading-[1.05] tracking-[-0.015em] sm:text-[2.8rem]">{copy.title}</h2>
                </div>
                <Link
                  href={section.href || primaryRoute}
                  className="pace-underline inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)]"
                >
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Each band uses a different card treatment */}
              {variant === 0 ? (
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {section.posts.slice(0, 8).map((post, cardIndex) => (
                    <PosterCard
                      key={post.id || post.slug}
                      post={post}
                      href={postHref(primaryTask, post, primaryRoute)}
                      tall={cardIndex % 4 === 0 || cardIndex % 4 === 3}
                    />
                  ))}
                </div>
              ) : null}

              {variant === 1 ? (
                <div className="mt-10 grid gap-5 xl:grid-cols-2">
                  {section.posts.slice(0, 6).map((post, cardIndex) => (
                    <ArticleListCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={cardIndex} />
                  ))}
                </div>
              ) : null}

              {variant === 2 ? (
                <div className="mt-10 border-b border-[var(--editable-border)]">
                  {section.posts.slice(0, 6).map((post, cardIndex) => (
                    <EditorialRowCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={cardIndex} />
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )
      })}
    </>
  )
}

/* ========================================================== 6. FAQ === */

export function EditableFaq() {
  const faq = pagesContent.home.faq
  return (
    <section className="relative overflow-hidden bg-[var(--slot4-surface-bg)]">
      {/* Coral side panels, echoing the hero field */}
      <div className="pace-halftone pointer-events-none absolute inset-y-0 left-0 hidden w-[9%] xl:block" />
      <div className="pace-halftone pointer-events-none absolute inset-y-0 right-0 hidden w-[9%] xl:block" />

      <div className={`${container} relative py-16 sm:py-20 lg:py-24`}>
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <p className="editable-label text-[var(--slot4-accent)]">{faq.eyebrow}</p>
            <h2 className="editable-display mt-4 text-[2.3rem] leading-[1.03] tracking-[-0.015em] sm:text-[3.2rem]">{faq.title}</h2>
            <p className="mt-5 max-w-md text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text)]">{faq.description}</p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3.5 text-sm font-semibold text-white transition duration-500 hover:bg-[var(--slot4-page-text)]"
            >
              Ask us something <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-3">
            {faq.items.map((item) => (
              <details key={item.question} className="pace-faq rounded-[22px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-6 py-5 transition duration-500 open:bg-[var(--slot4-surface-bg)]">
                <summary className="flex items-center justify-between gap-5">
                  <span className="text-[1.02rem] font-semibold leading-snug text-[var(--slot4-page-text)]">{item.question}</span>
                  <Plus className="pace-faq-icon h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                </summary>
                <p className="pace-faq-body mt-4 max-w-2xl text-[0.925rem] leading-[1.8] text-[var(--slot4-muted-text)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ========================================================== 7. CTA === */

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section id="get-app" className="pace-halftone scroll-mt-24 text-white">
      <div className={`${container} flex flex-col items-center gap-6 py-20 text-center sm:py-24`}>
        <p className="editable-label text-white/80">{cta.badge}</p>
        <h2 className="editable-display max-w-3xl text-[2.5rem] leading-[1.02] tracking-[-0.015em] text-white sm:text-[3.6rem]">{cta.title}</h2>
        <p className="max-w-xl text-[1rem] leading-[1.8] text-white/90">{cta.description}</p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link
            href={cta.primaryCta.href}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-page-text)]"
          >
            {cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href={cta.secondaryCta.href}
            className="inline-flex items-center gap-2 rounded-full border border-white/45 px-8 py-4 text-sm font-semibold text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-accent)]"
          >
            {cta.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
