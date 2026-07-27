import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A curated library of work, people and ideas',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A curated library of work, people and ideas',
    primaryLinks: [
      { label: 'Gallery', href: '/image' },
      { label: 'Search', href: '/search' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Get in touch', href: '/contact' },
      secondary: { label: 'Search', href: '/search' },
    },
  },
  footer: {
    tagline: 'Chosen with care. Filed with sense.',
    description:
      'A connected library of galleries, profiles and practical writing — organised so the useful things stay easy to find.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'Gallery', href: '/image' },
          { label: 'Search', href: '/search' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    bottomNote: 'Made for clear browsing and a good second visit.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
