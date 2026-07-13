# Yvette — Personal website

An English personal website built with [Astro](https://astro.build) and hosted
for free on GitHub Pages.

Production URL: <https://ooevet.github.io>

## Current features

- Responsive Home, Blog, Photo, and Links pages.
- Minimal editorial design based on warm paper tones, soft ambient light, and
  monospace metadata.
- English-only content and routes.
- Markdown blog posts managed through a typed Astro Content Collection.
- A sample article and statically generated article route.
- A prepared photo archive layout with honest placeholders for future photos.
- Site metadata, canonical URLs, Open Graph text metadata, and accessible
  navigation states.
- Fully static output with no application server required.
- Automatic GitHub Pages deployment after every push to `main`.

## Project structure

```text
src/
├── components/pages/     Page-level components
├── content/posts/        Markdown blog posts
├── layouts/              Shared HTML shell and navigation
├── lib/site.ts           Site copy, links, and global settings
├── pages/                Astro routes
└── styles/global.css     Visual design and responsive styles

.github/workflows/deploy.yml  GitHub Pages deployment
astro.config.mjs              Astro and production URL settings
```

## Local development

Install dependencies once:

```sh
npm install
```

Start a local preview in the background:

```sh
npm run astro -- dev --background
```

Astro prints the local URL when the server starts, usually
`http://localhost:4321`. If that port is occupied, it selects the next
available port.

Useful server commands:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

Create a production build:

```sh
npm run build
```

The generated static website is written to `dist/`.

## Editing content

### Site copy and links

Edit `src/lib/site.ts` to change the name, introduction, navigation copy,
homepage sections, and external links.

### Blog posts

Add a Markdown file under `src/content/posts/`:

```md
---
title: Post title
description: A short summary.
date: 2026-07-13
path: post-url
tags:
  - note
draft: false
---

Post content goes here.
```

The post will appear at `/blog/post-url/` after the next build.

### Photos

The Photo page currently uses visual placeholders. Future photographs should
be stored under `src/assets/photos/` and connected to structured metadata such
as date, location, coordinates, caption, and alt text.

`image.png` is a local design reference and is intentionally excluded from Git.

## Deployment

The repository is configured for GitHub Pages through GitHub Actions:

```text
local changes → git commit → git push → Astro build → GitHub Pages
```

One-time repository setting:

1. Open **Settings → Pages** on GitHub.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.

After that, every push to `main` automatically updates
<https://ooevet.github.io>.
