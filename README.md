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

`public/intake/index.html` is a self-contained questionnaire for the agent, served at <https://supertoadman.github.io/Wynn-Real-Estate/intake/>. It collects everything listed under "Before launch" plus what Pennsylvania's advertising rules (49 Pa. Code §§ 35.301–35.307, the Commission's team-advertising guideline) and NAR Article 12 require the site to show. Typing is limited to facts only the agent knows; everything else is a tap.

Answers stay in the visitor's browser until the last screen, where "Send my answers" posts them to [FormSubmit](https://formsubmit.co), a third-party relay that emails them to `SEND_TO_EMAIL` (set, with `SEND_TO_PHONE`, at the top of the page's script). FormSubmit emails that address an activation link the first time a site submits; nothing is delivered until it is clicked. If a send fails, the screen offers a ready-written text or email instead.

To send one person's answers somewhere else, add the recipient after a `#` when sharing the link: `…/intake/#2155550123` or `…/intake/#you@example.com`.

## Before launch

**Real, from the broker's intake answers (November 2026):** the brokerage name, broker, license number, phones, email, office address and hours in `src/lib/site.ts`, and the services, credentials and copy in `src/data/content.ts` and the section components. Copy is limited to what she confirmed; claims she did not confirm (off-market sales, film and video marketing, sales figures) were removed.

**Still sample content, labelled as such on the site while `SAMPLE_DATA` in `src/data/sample.ts` is true:**

- Listings in `src/data/properties.ts` (fictional). She has current listings on Bright MLS; they need an IDX feed or manual entry, with photos she has the rights to.
- Neighborhoods and market statistics in `src/data/neighborhoods.ts` (fictional). The towns she works in and her main county were left blank.
- Photography (stock images hot-linked from Unsplash), including the service panels.

**To confirm or collect:**

- The exact business name on the brokerage's Pennsylvania license (left blank; she says "Wynn Real Estate" is it). 49 Pa. Code § 35.305(a) requires advertising under that name.
- Her year of first licensure. The site says "20+" years from her "21 to 30 years" answer.
- Facebook and Instagram addresses, her second language besides Russian, headshot and logo files, whether she owns a domain, and client permission before quoting any reviews.
- Have the broker review the site before launch.

**Before going public:** remove the `noindex` in `src/app/layout.tsx`, connect the consultation form (she wants enquiries texted to her), and add rate limiting and bot protection to `POST /api/leads`.
