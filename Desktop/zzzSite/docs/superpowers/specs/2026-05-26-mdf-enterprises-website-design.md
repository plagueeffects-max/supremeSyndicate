# MDF Enterprises Website — Design Spec
**Date:** 2026-05-26  
**Status:** Approved

---

## 1. Project Overview

A premium, minimal three-route website for **MDF Enterprises** — a business dealing in sports equipment, fitness & wellness equipment, musical instruments, and awards & trophies. The site targets both direct consumers and institutional/B2B clients (schools, clubs, corporations).

**Primary goals:**
- Establish credibility and premium brand identity
- Drive product discovery (consumer path)
- Generate partnership/bulk-order inquiries (institutional path)
- Showcase past work and client testimonials

---

## 2. Brand Identity

| Token | Value |
|-------|-------|
| Primary | Royal Blue `#0d1f4a` |
| Accent | Gold `#C9A227` |
| Background | Deep Navy `#050e24` |
| Surface | `#0d1f4a` |
| Text primary | `#ffffff` |
| Text muted | `rgba(255,255,255,0.5)` |
| Gold muted | `rgba(201,162,39,0.7)` |

**Logo assets:**
- `mdfLogoWtext.webp` — used inside the site (navbar, about section)
- `mdfFavicon.png` — used as favicon

**Typography:**
- Display / hero: Serif (e.g., Playfair Display or DM Serif Display)
- Body / UI: Sans-serif (e.g., Inter or DM Sans)
- Letter-spacing on labels: `0.2em–0.4em`, uppercase

---

## 3. Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| UI Components | shadcn/ui + 21st.dev components |
| Language | TypeScript |
| Favicon | `mdfFavicon.png` via `app/favicon.ico` or `<link>` |

**Routing:**
```
app/
  layout.tsx          # Root layout: Navbar + Footer, font loading
  page.tsx            # / — Landing page
  products/
    page.tsx          # /products — Products page
  blog/
    page.tsx          # /blog — Blog listing
    [slug]/
      page.tsx        # /blog/[slug] — Individual post (future)
```

All animation-heavy components are `"use client"`. Static shell (Navbar, Footer) can be server components.

---

## 4. Site Architecture

### 4.1 Shared Components

**Navbar** — sticky, starts transparent over hero, transitions to solid `#0d1f4a` with backdrop blur on scroll. Contains logo (left), nav links (center), gold CTA button "Get in Touch" (right). Links: Home (`/`) · Products (`/products`) · Blog (`/blog`) · About (`/#about`) · Contact (`/#contact`). "About" and "Contact" are anchor links to sections on the home page, not separate routes.

**Footer** — dark `#050e24`, 4-column grid: Logo + tagline | Quick Links | Categories | Contact + Socials.

---

### 4.2 Route: `/` — Landing Page

Sections in scroll order:

#### Hero
- **Height:** 100vh, full-screen
- **Background:** Muted looping video (`/public/hero.mp4`). Placeholder: animated gradient (`#0d1f4a` → `#050e24`) with floating gold particle dust using Framer Motion. Video element uses `autoPlay muted loop playsInline` with a CSS gradient overlay (`linear-gradient(to top, rgba(5,14,36,0.92), rgba(5,14,36,0.1))`).
- **Layout:** Bottom-left anchored text. Text sits in lower ~35% of viewport.
- **Content:**
  - Label: `SPORTS · FITNESS · MUSIC · AWARDS` (gold, tracked, uppercase, small)
  - Headline: `Where Excellence Meets Every Domain` (large serif, white, ~5xl–7xl)
  - CTAs: Primary gold button `BROWSE PRODUCTS` → `/products`; Ghost button `PARTNER WITH US →` → `/#contact` anchor (smooth scroll to Contact section)
- **Animation:** Framer Motion — immersive zoom-in reveal on load (scale 1.08 → 1.0, opacity 0 → 1, staggered: label first, then headline, then CTAs). Hero video/bg has subtle slow scale (Ken Burns, scale 1.0 → 1.05 over 8s).
- **Scroll indicator:** Animated chevron/arrow at bottom center, fades out on scroll.

#### Categories
- **Purpose:** Introduce the four product domains visually.
- **Layout:** 4-column grid of large cards. Each card: full-bleed placeholder image (gold tinted), domain icon, domain name, short descriptor.
- **Domains:** Sports Equipment · Fitness & Wellness · Musical Instruments · Awards & Trophies
- **Animation:** Scroll-triggered stagger reveal (Framer Motion `whileInView`). Each card has 3D tilt hover (Framer Motion `whileHover` with `rotateX/rotateY` + `perspective`). Clicking a card navigates to `/products?category=<domain>`.
- **Section label:** `WHAT WE OFFER` in gold above the grid.

#### About MDF
- **Anchor id:** `about`
- **Layout:** Two-column split. Left: logo/visual image (placeholder). Right: headline, 2-sentence summary, stats row (e.g., 50+ Clients · 10+ Years · 4 Domains), "Learn Our Story →" trigger.
- **"Learn Our Story" interaction:** Opens a full-screen overlay (Framer Motion `AnimatePresence` + slide-up panel) with the full brand story, mission, values. Overlay has close button. No collapsible — overlay pattern only.
- **Animation:** Parallax on scroll — text block scrolls slightly faster than image. `whileInView` fade-in.
- **Stats row:** Numbers count up with Framer Motion when section enters viewport.

#### Portfolio
- **Purpose:** Past work showcase — completed projects, installations, bulk orders for institutions.
- **Layout:** Asymmetric masonry grid. First item spans 2 columns (large), remaining items 1 column each. All placeholders initially.
- **Card content:** Project image, client name, category tag, brief description.
- **Animation:** `whileInView` stagger reveal. `whileHover` 3D tilt + image zoom (scale 1.05 inside card, overflow hidden). Gold border appears on hover.

#### Testimonials
- **Layout:** Auto-scrolling horizontal marquee (two rows, opposite directions). Each card: quote, client name, organisation, role.
- **Animation:** Framer Motion infinite x-translation. Pauses on hover. Gradient fade masks on left/right edges.

#### CTA Band
- **Layout:** Full-width section, gold gradient background (`#C9A227` → `#a07d10`), dark text.
- **Content:** Bold headline `Ready to Partner with MDF?`, two buttons: "Get in Touch" (smooth scrolls to Contact section below) + "Browse Products" (→ `/products`).
- **Animation:** Background gradient shifts slowly on mount.

#### Contact / Inquiry
- **Anchor id:** `contact` — this is the landing target for "PARTNER WITH US" CTA and navbar Contact link.
- **Layout:** Dark section (`#050e24`). Two-column: left side has address, phone, email, social links. Right side has a minimal inquiry form (Name, Organisation, Message, Submit).
- **Form:** UI only for now. Submit button shows a success toast. No backend wiring in this build (out of scope).
- **Animation:** `whileInView` fade-in. Form fields animate in with slight stagger.

---

### 4.3 Route: `/products` — Products Page

#### Products Hero Banner
- **Height:** ~40vh, shorter than home hero.
- **Background:** Dark with subtle gold grain texture or gradient.
- **Content:** `OUR PRODUCTS` label, page title, one-line subtitle.

#### Category Filter Pills
- Horizontal scrollable row of pills: All · Sports · Fitness · Music · Awards
- Active pill: gold background, dark text. Inactive: outlined.
- Selecting a pill filters the grid with Framer Motion `layout` animation (items animate in/out smoothly).

#### Products Grid
- 3-column responsive grid (2-col on tablet, 1-col on mobile).
- Each product card: placeholder image, product name, category tag, short description, "Enquire" button.
- **Animation:** `whileHover` 3D tilt + elevation shadow. Framer Motion `layout` for filter transitions (items don't jump — they animate to new positions).
- Products data: static JSON array initially (`/data/products.ts`), easy to swap for a CMS later.

---

### 4.4 Route: `/blog` — Blog Page

#### Blog Header
- Minimal: `INSIGHTS & UPDATES` label, `Blog` title, subtitle.
- Dark background matching brand.

#### Editorial Grid
- 3-column card grid (2-col tablet, 1-col mobile).
- Each card: placeholder hero image, category tag (gold), title, 2-line excerpt, date, read time.
- **Animation:** `whileInView` stagger reveal on scroll (cards animate in from below with opacity).
- Blog data: static MDX or JSON array in `/data/blog.ts` initially.
- Cards link to `/blog/[slug]` — individual post page (scaffolded but empty for now, shows "Coming Soon").

---

## 5. Animation System Summary

| Animation | Trigger | Component |
|-----------|---------|-----------|
| Zoom-in reveal | Page load | Hero text + CTA |
| Ken Burns | Page load | Hero background |
| Stagger fade-up | `whileInView` | Categories, Portfolio, Blog cards |
| 3D tilt hover | `whileHover` | Category cards, Product cards, Portfolio cards |
| Parallax scroll | Scroll position | Hero text, About section image |
| Marquee | Auto / pause on hover | Testimonials |
| Count-up numbers | `whileInView` | About stats row |
| Layout animation | Filter click | Products grid |
| Overlay slide-up | Button click | About "Learn Our Story" |
| Navbar transition | Scroll | Navbar background |

All animations respect `prefers-reduced-motion` — wrap in a check and serve static fallbacks.

---

## 6. Responsive Breakpoints

| Breakpoint | Behaviour |
|------------|-----------|
| `< 640px` | Single column everywhere. Hero headline ~3xl. Nav collapses to hamburger. |
| `640–1024px` | 2-column grids. Reduced parallax intensity. |
| `> 1024px` | Full layout as designed. |

---

## 7. Data Layer (Initial)

All content is static TypeScript arrays. No CMS or database required for launch.

```
/data/
  products.ts     # { id, name, category, description, image }[]
  blog.ts         # { slug, title, excerpt, category, date, readTime, image }[]
  testimonials.ts # { quote, name, role, organisation }[]
  portfolio.ts    # { title, client, category, description, image }[]
```

Images: `/public/placeholder/` directory with placeholder images. Real images drop-in as `src` values replace.

---

## 8. Assets

| File | Usage |
|------|-------|
| `mdfFavicon.png` | `<link rel="icon">` in root layout |
| `mdfLogoWtext.webp` | Navbar logo + About section |
| `public/hero.mp4` | Hero video (placeholder gradient until file added) |
| `public/placeholder/` | All placeholder images |

---

## 9. Out of Scope (for this build)

- CMS integration
- E-commerce / cart / checkout
- User authentication
- Contact form backend (form UI built, submission wired to placeholder)
- Individual blog post pages beyond scaffold
- Search functionality
