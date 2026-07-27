import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'A dependable place to find work, people and ideas',
      description:
        'Browse galleries, profiles and practical writing in one calm, well-made library built for people running businesses.',
      openGraphTitle: 'A dependable place to find work, people and ideas',
      openGraphDescription:
        'Galleries, profiles and practical writing, gathered in one calm library and kept easy to move through.',
      keywords: ['visual library', 'profiles', 'creative directory', 'business resources', 'content discovery'],
    },
    hero: {
      badge: 'Fresh work, every week',
      title: ['A dependable library', 'that helps you decide.'],
      description:
        'Every gallery, profile and guide here is chosen because it is genuinely useful when you are weighing a decision — no two businesses look the same, and the library is built to respect that.',
      lead: 'No noise, no filler, no copy-paste pages.',
      primaryCta: { label: 'Start browsing', href: '/image' },
      secondaryCta: { label: 'Search the library', href: '/search' },
      searchPlaceholder: 'Search galleries, people, topics',
      focusLabel: 'In focus',
      ratingLabel: 'Rated by readers',
      ratingValue: '4.9',
      featureCardBadge: 'latest cover rotation',
      featureCardTitle: 'The newest posts set the tone of the homepage.',
      featureCardDescription:
        'Recent galleries and profiles stay at the centre of the experience, so the front page always reflects what was just published.',
    },
    marquee: [
      'Updated every week',
      'Curated, never auto-filled',
      'Built for people who decide',
      'Clear pages, no clutter',
      'Real work, real names',
    ],
    stats: [
      { value: '99%', label: 'of readers come back' },
      { value: '1,500+', label: 'posts kept in order' },
      { value: '36%', label: 'arrive by recommendation' },
    ],
    statsNote: 'Figures from our most recent audience review',
    help: {
      eyebrow: 'How this works',
      title: 'How we help',
      description:
        'The library is grounded, practical and shaped around the realities of running something of your own. You get what is useful — not what a textbook says should be useful.',
      items: [
        {
          title: 'Peace of mind',
          body: 'When you need a sense check or a second opinion, browse work that has already been vetted and see how others handled the same call.',
        },
        {
          title: 'Save the hours',
          body: 'Skip the open-tab spiral. Everything is filed by type and topic, so a ten-minute look answers what an afternoon of searching would not.',
        },
        {
          title: 'Depth on demand',
          body: 'Some weeks you need a quick reference; some weeks you need the long version. Both live here, and both are kept current.',
        },
      ],
    },
    audience: {
      eyebrow: 'Who this is for',
      title: 'Who we help',
      description: 'Owners, operators and small teams who would rather look once and look properly.',
    },
    spotlight: {
      eyebrow: 'From the archive',
      title: 'Worth a closer look',
      description: 'A rotating pick from the collection — move through it at your own pace.',
    },
    faq: {
      eyebrow: 'Questions we are often asked',
      title: 'Helpful answers before you dig in.',
      description: 'A few quick answers for owners, operators and anyone considering where to start.',
      items: [
        {
          question: 'What is this site for?',
          answer:
            'It is a curated library of galleries, profiles and practical writing. Everything is published in full on the site and organised so you can find it again later.',
        },
        {
          question: 'How often is new work added?',
          answer:
            'New posts land regularly and the homepage reorders itself around the most recent ones, so the front page is always a fair reflection of the collection.',
        },
        {
          question: 'Can I search across everything at once?',
          answer:
            'Yes. The search page covers every section — galleries, profiles and written pieces — and you can narrow results by content type or category.',
        },
        {
          question: 'Can I contribute my own work?',
          answer:
            'Create an account and the publishing workspace opens up. You can prepare a post with images, a summary, links and full body content before submitting it.',
        },
        {
          question: 'How do I get in touch?',
          answer:
            'Use the contact page. Tell us what you are trying to publish, fix or launch and it gets routed to the right place rather than a generic inbox.',
        },
      ],
    },
    intro: {
      badge: 'About this library',
      title: 'Built for looking properly, not scrolling endlessly.',
      paragraphs: [
        'This site brings galleries, profiles and written pieces together so you can move naturally between them instead of hunting across disconnected pages.',
        'Everything is filed the same way, described the same way, and linked the same way — which means the thing you found once is still findable a month later.',
        'Start anywhere. A gallery leads to the person behind it, a profile leads to their work, and a written piece leads to both.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'A front page shaped by what was actually published most recently.',
        'Galleries, profiles and writing kept in one connected system.',
        'Search across every section at once, or narrow to one.',
        'Light, fast pages that stay readable on any screen.',
      ],
      primaryLink: { label: 'Browse the gallery', href: '/image' },
      secondaryLink: { label: 'Search the library', href: '/search' },
    },
    cta: {
      badge: 'Start here',
      title: 'Got something worth sharing?',
      description:
        'Add your work, share a gallery, or send over a piece you think belongs here. It takes a few minutes and reaches people who are actually looking.',
      primaryCta: { label: 'Create a post', href: '/create' },
      secondaryCta: { label: 'Talk to us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'The newest posts in this section.',
    },
  },
  about: {
    badge: 'Our story',
    title: 'A calmer, clearer way to find good work.',
    description: `${slot4BrandConfig.siteName} exists to make browsing, reading and finding people feel like one considered experience rather than three separate chores.`,
    paragraphs: [
      'Instead of splitting everything across disconnected pages, we keep related work easy to move through and easy to understand at a glance.',
      'Whether you arrive at a gallery, a profile or a written piece, you can keep going without losing your place or your patience.',
      'The result is a library that rewards a second visit — and a third.',
    ],
    values: [
      {
        title: 'Considered over crowded',
        description: 'We favour clarity, pacing and structure so you can look, read and decide without wading through noise.',
      },
      {
        title: 'Everything connected',
        description: 'Galleries, profiles and written pieces link to each other, so discovery keeps its momentum across the whole site.',
      },
      {
        title: 'Straightforward and steady',
        description: 'Clean navigation and honest page structure, so useful things surface faster and stay where you left them.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'A real conversation, not a ticket number.',
    description:
      'Tell us what you are trying to publish, fix or launch. It gets routed through the right lane instead of being pushed into the same generic support bucket as everything else.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search across galleries, profiles, topics and categories in one place.',
    },
    hero: {
      badge: 'Search everything',
      title: 'Find the work, the person or the answer.',
      description: 'Use keywords, categories and content types to pull results from every active section of the site.',
      placeholder: 'Search by keyword, topic, category or title',
    },
    resultsTitle: 'Latest across the library',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new work for the site.',
    },
    locked: {
      badge: 'Contributor access',
      title: 'Log in to publish your work.',
      description: 'Use your account to open the publishing workspace and prepare a post for any active section of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare a post for any section.',
      description: 'Choose the content type, add the details, and build a clean post with images, links, a summary and full body content.',
    },
    formTitle: 'Post details',
    submitLabel: 'Submit for review',
    successTitle: 'Submitted. Thanks for sending it over.',
  },
  auth: {
    login: {
      metadataDescription: 'Log in to your account on this site.',
      badge: 'Member access',
      title: 'Welcome back.',
      description: 'Log in to keep browsing, manage what you have submitted and start something new.',
      formTitle: 'Log in',
      submitLabel: 'Continue',
      noAccount: 'No account matched those details. Create one first, then log in.',
      success: 'Logged in. Taking you back...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create an account on this site.',
      badge: 'Get access',
      title: 'Create an account and start publishing.',
      description: 'An account opens the publishing workspace so you can save details and submit work through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created. Taking you through...',
      loginCta: 'Log in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related reading',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'More from the gallery',
      fallbackTitle: 'Gallery details',
    },
    profile: {
      relatedTitle: 'You might also like',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
