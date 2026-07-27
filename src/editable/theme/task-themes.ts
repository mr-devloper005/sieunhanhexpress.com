import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Studio Bloom task surfaces.

  Every task (archive + detail) shares one editorial identity: blush paper,
  white cards, hairline sand borders, coral signature accent, serif display
  type over a warm geometric sans. Per-task copy (kicker / note) keeps each
  section's voice while the visual language stays unified. Tokens are
  delivered as CSS variables (`--tk-*`).
*/

export type TaskTheme = {
  /** short flavour word shown as an eyebrow kicker */
  kicker: string
  /** one-line mood note for the page intro */
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Instrument Serif', 'Fraunces', 'Times New Roman', Georgia, serif"
const BODY_FONT = "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Shared palette — every task inherits this; only kicker/note differ.
const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#FDF7F4',
  surface: '#FFFFFF',
  raised: '#F6E9E3',
  text: '#181211',
  muted: '#6B5A53',
  line: '#EADCD4',
  accent: '#F4553D',
  accentSoft: '#FCE3DB',
  onAccent: '#FFFFFF',
  glow: 'rgba(244,85,61,0.10)',
  radius: '1.5rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Reading room', note: 'Considered writing, guides and practical thinking.' },
  listing: { ...base, kicker: 'Directory', note: 'Find, compare and connect with the right people.' },
  classified: { ...base, kicker: 'Noticeboard', note: 'Fresh offers and opportunities, ready to act on.' },
  image: { ...base, kicker: 'Gallery', note: 'A visual index of standout work and moments.' },
  sbm: { ...base, kicker: 'Collections', note: 'Curated links and references worth keeping.' },
  pdf: { ...base, kicker: 'Library', note: 'Downloadable guides, reports and reference material.' },
  profile: { ...base, kicker: 'People', note: 'The names, studios and teams behind the work.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

/** All `--tk-*` tokens + font overrides for a task surface, ready for `style`. */
export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    // Re-point the shared article-body accent vars so post HTML (headings,
    // links) inherits this task's accent instead of the global site accent.
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
