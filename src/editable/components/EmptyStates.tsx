import Link from 'next/link'
import { ArrowUpRight, Compass, MailCheck, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  className?: string
}

/*
  Empty states are part of the design, not a fallback. Each one keeps the same
  editorial shape: a soft blush panel, a framed icon, a serif headline and one
  clear way forward.
*/
export function EmptyState({
  title = 'Nothing published here yet',
  description = 'New posts appear here automatically as soon as this section has published content.',
  actionLabel = 'Back to home',
  actionHref = '/',
  className,
}: EmptyStateProps) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-[var(--editable-border,rgba(24,18,17,0.12))] bg-[var(--slot4-panel-bg,rgba(24,18,17,0.03))] px-6 py-14 text-center sm:px-10',
        className
      )}
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--editable-border,rgba(24,18,17,0.12))] bg-[var(--slot4-surface-bg,#fff)] text-[var(--slot4-accent,#f4553d)]">
        <SearchX className="h-6 w-6" />
      </span>
      <h2 className="editable-display mt-6 text-[1.9rem] leading-tight tracking-[-0.015em] sm:text-[2.4rem]">{title}</h2>
      <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text,rgba(24,18,17,0.65))]">{description}</p>
      <Link
        href={actionHref}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text,#181211)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream,#fff)] transition duration-500 hover:bg-[var(--slot4-accent,#f4553d)]"
      >
        {actionLabel}
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

export function TaskEmptyState({ taskLabel = 'posts', className }: { taskLabel?: string; className?: string }) {
  return (
    <EmptyState
      className={className}
      title={`No ${taskLabel} available yet`}
      description={`Published ${taskLabel} appear here automatically. The page keeps its shape even while the feed is still filling up.`}
      actionLabel="Explore the site"
      actionHref="/"
    />
  )
}

export function ContactSuccessState({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        'rounded-[28px] border border-[var(--editable-border,rgba(24,18,17,0.12))] bg-[var(--slot4-panel-bg,rgba(24,18,17,0.03))] px-6 py-14 text-center sm:px-10',
        className
      )}
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] border border-[var(--editable-border,rgba(24,18,17,0.12))] bg-[var(--slot4-surface-bg,#fff)] text-[var(--slot4-accent,#f4553d)]">
        <MailCheck className="h-6 w-6" />
      </span>
      <h2 className="editable-display mt-6 text-[1.9rem] leading-tight tracking-[-0.015em] sm:text-[2.4rem]">Message received</h2>
      <p className="mx-auto mt-4 max-w-xl text-[0.95rem] leading-[1.8] text-[var(--slot4-muted-text,rgba(24,18,17,0.65))]">
        Thanks for reaching out. Your note has been saved and routed to the right place.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text,#181211)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-cream,#fff)] transition duration-500 hover:bg-[var(--slot4-accent,#f4553d)]"
      >
        Return home
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </section>
  )
}

/** Compact inline variant for sidebars and narrow columns. */
export function InlineEmptyState({ label = 'Nothing here yet', className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-[18px] border border-dashed border-[var(--editable-border,rgba(24,18,17,0.12))] px-5 py-4 text-sm text-[var(--slot4-muted-text,rgba(24,18,17,0.65))]',
        className
      )}
    >
      <Compass className="h-4 w-4 shrink-0 text-[var(--slot4-accent,#f4553d)]" />
      {label}
    </div>
  )
}
