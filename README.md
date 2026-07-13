# Yvette — Personal website

An English personal website built with [Astro](https://astro.build) and hosted
for free on GitHub Pages.

Production URL: <https://ooevet.github.io>

## Current features

- Responsive Home, Blog, Photo, and Links pages.
- Minimal editorial design based on warm paper tones, soft ambient light, and
  monospace metadata.
- English-only content and routes.
- Markdown blog posts and photographs managed through typed Astro Content Collections.
- A sample article and statically generated article route.
- A responsive photo archive with automatic EXIF metadata and optimized images.
- Site metadata, canonical URLs, Open Graph text metadata, and accessible
  navigation states.
- Fully static output with no application server required.
- Automatic GitHub Pages deployment after every push to `main`.

## Project structure

```text
src/
├── components/pages/     Page-level components
├── content/posts/        Markdown blog posts
├── content/photos/       Markdown photograph entries
├── assets/photos/        Original photograph files
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

Do not edit `package-lock.json` manually. npm updates it automatically when
dependencies change. Most routine website updates only involve `site.ts`, a
Markdown post, or the global stylesheet.

### Content quick reference

| What to update | File or directory |
| --- | --- |
| Homepage introduction and Now section | `src/lib/site.ts` |
| Navigation labels and external links | `src/lib/site.ts` |
| Add or edit blog posts | `src/content/posts/*.md` |
| Add or edit photographs | `src/content/photos/*.md` |
| Colors, typography, spacing, and responsive design | `src/styles/global.css` |
| Page structure | `src/components/pages/*.astro` |

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

Original photographs are stored under `src/assets/photos/`. Every published
photo must have a matching Markdown entry under `src/content/photos/`. Astro
validates the Markdown metadata, imports the referenced image, and optimizes it
during the production build.

The build reads the original EXIF metadata and displays available values for:

- original capture date;
- camera make and model;
- lens model;
- focal length;
- aperture;
- shutter speed;
- ISO.

To add a photograph:

1. Copy the JPG or JPEG file into `src/assets/photos/`.
2. Create a Markdown entry in `src/content/photos/`:

```md
---
title: Photograph title
image: ../../assets/photos/PHOTO.JPG
location: Kangaroo Island
alt: A useful description of the photograph.
caption: An optional visible caption.
tags:
  - travel
featured: false
draft: false
---
```

The `image` and `alt` fields are required. The build fails if the image does not
exist or required metadata is missing. Set `draft: true` to keep an entry out of
the published gallery. The gallery sorts published photos by EXIF capture time,
newest first, and hides metadata fields that are missing.

EXIF values remain automatic; do not duplicate camera settings in Markdown.
GPS coordinates are intentionally not extracted or published. Use a reliable
location when available, do not invent coordinates, and always provide
meaningful alt text.

`image.png` is a local design reference and is intentionally excluded from Git.

## Routine update workflow

1. Edit the relevant file and save it.
2. Start the local website if you want to preview the change:

   ```sh
   npm run astro -- dev --background
   ```

3. Open the local URL printed by Astro. It is usually
   `http://localhost:4321`, but Astro uses the next available port when needed.
4. Stop the local website after checking the result:

   ```sh
   npm run astro -- dev stop
   ```

5. Commit and push the update:

   ```sh
   git add .
   git commit -m "content: update website"
   git push
   ```

GitHub Actions will rebuild and publish the website automatically. Check the
repository's **Actions** tab if an update does not appear after a few minutes.

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
