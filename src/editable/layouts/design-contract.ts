import type { CSSProperties } from 'react'

/*
  Studio Bloom — the site-wide visual system.

  A warm editorial palette: coral + magenta signature fields, blush paper
  surfaces, near-black ink, and hairline sand borders. Display type is a
  high-contrast serif; body type is a warm geometric sans. Everything below is
  delivered as CSS variables so every section, card, and page inherits one
  system from a single edit.
*/

export const editableRootStyle = {
  /* Paper + ink */
  '--slot4-page-bg': '#FDF7F4',
  '--slot4-page-text': '#181211',
  '--slot4-panel-bg': '#F6E9E3',
  '--slot4-surface-bg': '#FFFFFF',
  '--slot4-muted-text': '#6B5A53',
  '--slot4-soft-muted-text': '#9A867D',

  /* Signature colour */
  '--slot4-accent': '#F4553D',
  '--slot4-accent-fill': '#F4553D',
  '--slot4-accent-soft': '#FCE3DB',
  '--slot4-on-accent': '#FFFFFF',
  '--slot4-pink': '#FF63B8',
  '--slot4-pink-soft': '#FFE1F1',
  '--slot4-sand': '#F1E2DA',

  /* Dark + media */
  '--slot4-dark-bg': '#181211',
  '--slot4-dark-text': '#FBF3EF',
  '--slot4-media-bg': '#EFE2DB',
  '--slot4-cream': '#FFFDFC',
  '--slot4-warm': '#F6E9E3',
  '--slot4-lavender': '#FFE1F1',
  '--slot4-gray': '#F3EDEA',
  '--slot4-body-gradient': 'none',

  /* Shell tokens */
  '--editable-page-bg': '#FDF7F4',
  '--editable-page-text': '#181211',
  '--editable-container': '1360px',
  '--editable-border': '#EADCD4',
  '--editable-nav-bg': '#FFFFFF',
  '--editable-nav-text': '#181211',
  '--editable-nav-active': '#F4553D',
  '--editable-nav-active-text': '#FFFFFF',
  '--editable-cta-bg': '#F4553D',
  '--editable-cta-text': '#FFFFFF',
  '--editable-search-bg': '#FFFFFF',
  '--editable-footer-bg': '#F4553D',
  '--editable-footer-text': '#FFFFFF',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  pinkBg: 'bg-[var(--slot4-pink)]',
  pinkSoftBg: 'bg-[var(--slot4-pink-soft)]',
  sandBg: 'bg-[var(--slot4-sand)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/15',
  shadow: 'shadow-[0_2px_10px_rgba(24,18,17,0.04)]',
  shadowStrong: 'shadow-[0_24px_60px_rgba(24,18,17,0.10)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(24,18,17,0.05),rgba(24,18,17,0.78))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-5 sm:px-8 lg:px-10',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-7 sm:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 pace-no-scrollbar',
    minRailCard: 'w-[240px] shrink-0 snap-start sm:w-[300px]',
  },
  type: {
    eyebrow: 'editable-label text-[var(--slot4-accent)]',
    heroTitle: 'editable-display text-[2.75rem] leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-[4.4rem]',
    sectionTitle: 'editable-display text-[2.1rem] leading-[1.03] tracking-[-0.015em] sm:text-5xl',
    cardTitle: 'editable-display text-[1.6rem] leading-[1.12] tracking-[-0.01em]',
    body: 'text-[0.975rem] leading-[1.75]',
    lead: 'text-lg leading-[1.72] sm:text-xl',
  },
  surface: {
    card: `rounded-[26px] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `rounded-[26px] border ${editablePalette.border} ${editablePalette.panelBg}`,
    dark: `rounded-[26px] ${editablePalette.darkBg} ${editablePalette.darkText}`,
    glass: 'rounded-full border border-white/25 bg-white/12 backdrop-blur-md',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-on-accent)] transition duration-500 hover:bg-[var(--slot4-dark-bg)] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)] active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-page-text)] hover:text-[var(--slot4-cream)] active:scale-[0.98]',
    ghost:
      'inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:text-[var(--slot4-accent)]',
    onDark:
      'inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--slot4-page-text)] transition duration-500 hover:bg-[var(--slot4-dark-bg)] hover:text-white active:scale-[0.98]',
  },
  chip: {
    base: 'inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-2 text-[0.8rem] font-medium text-[var(--slot4-muted-text)] transition duration-500 hover:border-[var(--slot4-page-text)] hover:text-[var(--slot4-page-text)]',
    active: 'inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[0.8rem] font-medium text-[var(--slot4-cream)]',
    onColor:
      'inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/12 px-4 py-2 text-[0.8rem] font-medium text-white transition duration-500 hover:bg-white hover:text-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-[22px] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/5]',
    wide: 'aspect-[16/10]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1.5',
    fade: 'transition duration-500 hover:opacity-70',
  },
} as const

export const aiLayoutRules = [
  'Change the full site colour palette in editableRootStyle first; every section consumes those CSS variables.',
  'Keep the homepage composition in src/editable/sections/HomeSections.tsx so the whole experience can be reshaped in one file.',
  'Display type is serif, body type is sans — use the .editable-display / .editable-label helpers instead of hard-coded families.',
  'Use .pace-halftone for signature colour fields and .pace-grain for quiet blush sections.',
  'Keep dynamic post fetching intact; never replace posts with mock arrays.',
  'Use postHref() for all post links so task-specific routes keep working.',
] as const
