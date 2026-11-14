# Wynn Real Estate

Luxury real-estate platform built with **Next.js 16 (App Router)**, **TypeScript** and **Tailwind CSS 4**, with an interactive WebGL homepage.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Other scripts: `npm run build`, `npm start`, `npm run lint`.

Copy `.env.example` to `.env.local` to set the public site URL and the CRM webhook.

## Stack

| Concern | Library |
| --- | --- |
| Framework | Next.js 16 with Cache Components (`use cache`), React 19 |
| Styling | Tailwind CSS 4 — tokens live in `src/app/globals.css` |
| Smooth scroll | Lenis, stepped from GSAP's ticker |
| Scroll choreography | GSAP + ScrollTrigger |
| Component motion | Motion (Framer Motion) |
| 3D | Three.js via `@react-three/fiber` |

## Structure

```text
src/
├── app/                  Routes, root layout, global CSS
│   └── api/leads/        POST endpoint for the consultation form
├── components/
│   ├── canvas/           WebGL scenes (client-only, dynamically imported)
│   ├── layout/           Navbar, mobile drawer, footer, providers
│   ├── sections/         Homepage sections, each self-contained
│   ├── listings/         Property card, filter bar, quick view, shared state
│   └── ui/               Primitives: MagneticButton, RevealText, GlassCard…
├── data/                 Mock listings / neighborhoods (RESO-shaped)
├── hooks/                useMousePosition, useMediaQuery, useScrollProgress…
├── lib/
│   ├── api/              Listing + lead adapters (swap mock data for MLS/CRM here)
│   ├── animations.ts     Shared easing, durations and motion variants
│   ├── filters.ts        Pure listing-search logic
│   ├── formatters.ts     Currency, area, address and status formatting
│   ├── site.ts           Brokerage name, contact details, licence
│   └── validation.ts     Lead-form validation (shared client + server)
└── types/                Property, Neighborhood, LeadForm, NavItem…
```

## Extending

- **MLS / IDX feed** — replace the function bodies in `src/lib/api/listings.ts` and map the response onto the `Property` type (field names already follow the RESO Data Dictionary). Add the feed's image host to `images.remotePatterns` in `next.config.ts`. Nothing above the adapter changes.
- **Listing pages** — add `src/app/listings/[slug]/page.tsx` and call `getPropertyBySlug`. `PropertyCard`, `PropertySpecs` and the formatters are reusable as-is.
- **Search results page** — `filterProperties` in `src/lib/filters.ts` is pure and works on the server or the client.
- **CRM** — set `CRM_WEBHOOK_URL`; `src/lib/api/leads.ts` forwards every validated lead as JSON.
- **New homepage section** — add a component under `components/sections/` and place it in `src/app/page.tsx`.
- **Client portal / saved homes** — add providers in `components/layout/Providers.tsx`.

## Deploying

### GitHub Pages (preview)

Every push to `main` runs `.github/workflows/deploy-pages.yml`, which publishes the site to <https://supertoadman.github.io/Wynn-Real-Estate/>. One-time setup: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

GitHub Pages only serves files, so that workflow builds a static export (`NEXT_PUBLIC_STATIC_EXPORT=true`), which differs from the normal build:

- **No lead endpoint.** `src/app/api` is removed before the build, and the consultation form tells visitors it isn't connected instead of sending.
- **No Cache Components.** Next can't combine them with a static export, so `next.config.ts` enables only the `"use cache"` directive through the deprecated `experimental.useCache` flag. Re-check this when upgrading Next.
- **Photos are sized by the photo CDN** through `src/lib/image-loader.ts`, because Next's image optimizer needs a server.
- **Hidden from search engines** (`noindex`, set in `src/app/layout.tsx`) while the content is placeholder.

### A Node host

For the full site, including `POST /api/leads`, deploy the normal build (`npm run build`, then `npm start`) to any host that runs Next.js, and set the variables from `.env.example`.

## Client intake form

`public/intake/index.html` is a self-contained questionnaire for the agent, served at <https://supertoadman.github.io/Wynn-Real-Estate/intake/>. It collects everything listed under "Before launch" plus what Pennsylvania's advertising rules (49 Pa. Code §§ 35.301–35.307, the Commission's team-advertising guideline) and NAR Article 12 require the site to show. Answers stay in the visitor's browser; the last screen puts them into a ready-written text or email.

That message is addressed to the phone number and email set as `SEND_TO_PHONE` and `SEND_TO_EMAIL` at the top of the page's script. To send one person's answers somewhere else, add the recipient after a `#` when sharing the link: `…/intake/#2155550123` or `…/intake/#you@example.com`.

## Before launch

Everything below is **placeholder content** and must be replaced:

- Listings, neighborhoods and market statistics in `src/data/` (fictional).
- Brokerage metrics and marketing claims in `src/data/content.ts` — performance claims must be verifiable.
- Phone, email, address and licence number in `src/lib/site.ts`.
- Listing photography (stock images hot-linked from Unsplash).

Also add rate limiting and bot protection to `POST /api/leads`.
