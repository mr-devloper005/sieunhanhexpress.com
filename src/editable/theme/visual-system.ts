import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'studio-bloom'
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

export const visualPresets = {
  'studio-bloom': {
    label: 'Studio Bloom',
    mood: 'premium, warm, quietly confident',
    fontDirection: 'high-contrast serif display over a warm geometric sans',
    colors: {
      background: '#fdf7f4',
      foreground: '#181211',
      muted: '#6b5a53',
      primary: '#181211',
      accent: '#f4553d',
      surface: '#ffffff',
    },
    shape: 'soft 26px cards, pill controls, halftone colour fields',
  },
  'editorial-paper': {
    label: 'Editorial Paper',
    mood: 'calm magazine authority',
    fontDirection: 'serif headlines with quiet sans body',
    colors: {
      background: '#f7efe3',
      foreground: '#201711',
      muted: '#7b6253',
      primary: '#261811',
      accent: '#b76e45',
      surface: '#fffaf2',
    },
    shape: 'soft editorial cards with fine borders',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, polished',
    fontDirection: 'Cormorant Garamond headlines with Outfit body',
    colors: {
      background: '#0c0e14',
      foreground: '#f2efe8',
      muted: '#97a0b3',
      primary: '#d4a853',
      accent: '#7f1d1d',
      surface: '#1a2130',
    },
    shape: 'dark panels, gold hairlines, editorial spacing',
  },
  'brutalist-index': {
    label: 'Brutalist Index',
    mood: 'bold, raw, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: {
      background: '#f2f0e8',
      foreground: '#111111',
      muted: '#55524a',
      primary: '#111111',
      accent: '#ff4d00',
      surface: '#ffffff',
    },
    shape: 'sharp edges, thick borders, offset blocks',
  },
  'organic-journal': {
    label: 'Organic Journal',
    mood: 'warm, natural, trustworthy',
    fontDirection: 'rounded serif or humanist sans with soft captions',
    colors: {
      background: '#f4efe5',
      foreground: '#263021',
      muted: '#68705a',
      primary: '#415b32',
      accent: '#c47c51',
      surface: '#fffaf0',
    },
    shape: 'rounded cards, natural spacing, calm texture',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp mono data accents',
    colors: {
      background: '#f7f9fc',
      foreground: '#0f172a',
      muted: '#56607a',
      primary: '#4f46e5',
      accent: '#4f46e5',
      surface: '#ffffff',
    },
    shape: 'clean grids, pill filters, sharp information hierarchy',
  },
  'retro-bulletin': {
    label: 'Retro Bulletin',
    mood: 'playful, local, energetic',
    fontDirection: 'chunky headings with friendly body type',
    colors: {
      background: '#fff3c4',
      foreground: '#2b1d12',
      muted: '#7b5736',
      primary: '#2b1d12',
      accent: '#e85d2a',
      surface: '#fff8da',
    },
    shape: 'stickers, tabs, framed modules, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: {
      background: '#07101f',
      foreground: '#f8fbff',
      muted: '#a9b6c8',
      primary: '#8df0c8',
      accent: '#f2a0ff',
      surface: '#101b2d',
    },
    shape: 'dark cards, large media, glass overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset: 'studio-bloom',
  radius: {
    sm: '0.9rem',
    md: '1.4rem',
    lg: '1.65rem',
    xl: '2.25rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-500 hover:-translate-y-1.5',
    softHover: 'transition duration-500 hover:opacity-70',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'editable-label',
    heroTitle: 'editable-display text-5xl leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-[4.4rem]',
    sectionTitle: 'editable-display text-3xl leading-[1.05] tracking-[-0.015em] sm:text-5xl',
    body: 'text-base leading-[1.75]',
    caption: 'text-xs font-medium uppercase tracking-[0.2em]',
  },
  surfaces: {
    glass: 'border border-white/25 bg-white/12 backdrop-blur-md',
    paper: 'rounded-[26px] border border-[#eadcd4] bg-white',
    quiet: 'rounded-[26px] border border-[#eadcd4] bg-[#f6e9e3]',
    dark: 'rounded-[26px] bg-[#181211] text-[#fbf3ef]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10',
    sectionY: 'py-16 sm:py-20 lg:py-24',
    cardGrid: 'grid gap-7 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
