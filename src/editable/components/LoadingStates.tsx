import { cn } from '@/lib/utils'

type LoadingStateProps = {
  label?: string
  className?: string
}

/*
  Skeletons mirror the real layouts — pill controls, rounded media frames and
  ruled rows — so the shift from loading to loaded is barely noticeable.
*/
function PulseBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-[18px] bg-[var(--slot4-panel-bg,rgba(24,18,17,0.07))]', className)} />
}

export function PageLoadingState({ label = 'Loading page', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto w-full max-w-[var(--editable-container,1360px)] px-5 py-16 sm:px-8 lg:px-10', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <p className="editable-label text-[var(--slot4-accent,#f4553d)]">{label}</p>
      <PulseBlock className="mt-6 h-14 w-4/5 max-w-3xl rounded-[22px]" />
      <PulseBlock className="mt-4 h-5 w-2/3 max-w-2xl rounded-full" />
      <div className="mt-4 flex gap-2.5">
        <PulseBlock className="h-10 w-32 rounded-full" />
        <PulseBlock className="h-10 w-28 rounded-full" />
      </div>
      <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item}>
            <PulseBlock className="aspect-[4/5] w-full rounded-[22px]" />
            <PulseBlock className="mt-5 h-6 w-4/5 rounded-full" />
            <PulseBlock className="mt-3 h-4 w-3/5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardGridLoadingState({ count = 6, className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('grid gap-7 sm:grid-cols-2 lg:grid-cols-3', className)} aria-live="polite" aria-busy="true">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>
          <PulseBlock className={cn('w-full rounded-[22px]', index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/5]')} />
          <PulseBlock className="mt-5 h-6 w-5/6 rounded-full" />
          <PulseBlock className="mt-3 h-4 w-2/3 rounded-full" />
          <PulseBlock className="mt-5 h-9 w-32 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function DetailLoadingState({ label = 'Loading detail', className }: LoadingStateProps) {
  return (
    <div
      className={cn('mx-auto grid w-full max-w-[var(--editable-container,1360px)] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-10', className)}
      aria-live="polite"
      aria-busy="true"
    >
      <PulseBlock className="aspect-[16/10] w-full rounded-[26px]" />
      <div>
        <p className="editable-label text-[var(--slot4-accent,#f4553d)]">{label}</p>
        <PulseBlock className="mt-6 h-12 w-4/5 rounded-[20px]" />
        <PulseBlock className="mt-5 h-4 w-full rounded-full" />
        <PulseBlock className="mt-3 h-4 w-5/6 rounded-full" />
        <PulseBlock className="mt-3 h-4 w-2/3 rounded-full" />
        <PulseBlock className="mt-7 h-11 w-40 rounded-full" />
      </div>
    </div>
  )
}

/** Ruled-row skeleton for list layouts. */
export function ListLoadingState({ count = 5, label = 'Loading list', className }: LoadingStateProps & { count?: number }) {
  return (
    <div className={cn('w-full', className)} aria-live="polite" aria-busy="true">
      <p className="editable-label text-[var(--slot4-accent,#f4553d)]">{label}</p>
      <div className="mt-5">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-5 border-t border-[var(--editable-border,rgba(24,18,17,0.12))] py-5">
            <PulseBlock className="h-20 w-24 shrink-0 rounded-[14px]" />
            <div className="min-w-0 flex-1">
              <PulseBlock className="h-5 w-3/5 rounded-full" />
              <PulseBlock className="mt-3 h-4 w-4/5 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
