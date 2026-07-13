export type Section = 'home' | 'blog' | 'photo' | 'links';

export const SITE = {
  name: 'Yvette',
  url: 'https://ooevet.github.io',
  github: 'https://github.com/OoEvet',
};

export const copy = {
  nav: { home: 'Home', blog: 'Blog', photo: 'Photo', links: 'Links' },
  siteDescription: "Yvette's personal website — notes, experiments, and places worth remembering.",
  home: {
    eyebrow: 'TAIPEI · NOTES & OBSERVATIONS',
    title: "Hi, I'm Yvette.",
    intro: 'I work at the intersection of research, systems, and everyday observation—collecting notes, experiments, and places worth remembering.',
    note: 'This is a growing personal index. Some things become essays; others remain a photograph or a sentence worth keeping.',
    nowTitle: 'Now',
    nowBody: 'Building this website, and learning again to look at ordinary days a little more slowly.',
    selectedTitle: 'Start here',
    selectedLinks: [
      { label: 'Read the first note', href: '/blog/hello/', meta: '2026.07' },
      { label: 'Open the photo archive', href: '/photo/', meta: 'ARCHIVE' },
      { label: 'Browse useful links', href: '/links/', meta: 'INDEX' },
    ],
  },
  blog: {
    title: 'Blog',
    subtitle: 'Thoughts in progress, and the occasional finished thing.',
    empty: 'The first post is on its way.',
    back: 'Back to blog',
  },
  photo: {
    title: 'Photo',
    subtitle: 'Some memories I want to cherish.',
    notice: 'The archive is ready. Add photographs to src/assets/photos to organize them by date, place, and coordinates.',
    slots: ['Your first photograph', 'Light and architecture', 'A moment on the way', 'Somewhere worth remembering'],
  },
  links: {
    title: 'Links',
    subtitle: 'Tools I use, places I return to, and a few signposts around the web.',
    groups: [
      {
        title: 'Elsewhere',
        items: [
          { label: 'GitHub', href: 'https://github.com/OoEvet', note: 'Code and experiments' },
        ],
      },
      {
        title: 'This website',
        items: [
          { label: 'Astro', href: 'https://astro.build', note: 'The framework behind this site' },
          { label: 'OpenStreetMap', href: 'https://www.openstreetmap.org', note: 'The future photo-map layer' },
        ],
      },
    ],
  },
  footer: 'Collected slowly, updated often.',
} as const;
