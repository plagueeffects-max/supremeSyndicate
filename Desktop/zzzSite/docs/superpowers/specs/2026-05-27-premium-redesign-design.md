# MDF Enterprises — Premium Homepage Redesign

**Date:** 2026-05-27  
**Status:** Approved  
**Author:** Brainstorming session (cipher-cmd + Claude)

---

## 1. Project Overview

Full redesign of the MDF Enterprises website (`zzzSite`) to a super-premium, animation-heavy experience targeting four distinct buyer types simultaneously: retail walk-in customers, schools/colleges/institutions, government departments (GeM/MSME), and service buyers (installation + AMC).

**Business:** MDF Enterprises, Srinagar J&K — one-stop shop for Sports Goods, Fitness Equipment, Musical Instruments, and Awards & Trophies. Full-service: supply, installation, and after-sales service. Est. 2006.

**Core brand truth:** *One Stop. Every Need.*

---

## 2. Design Direction

### Visual Identity
- **Direction:** C — Bold Monochrome (Black + Gold Punch)
- **Base colour:** `#050505` (near-black)
- **Surface:** `#0f0f0f` / `#111` / `#1a1a1a`
- **Gold accent:** `#C89B5E` (primary) · `#D7AE75` (hover) · `#8F6B3E` (dark)
- **Text:** `#ffffff` (primary) · `#888` (secondary) · `#555` (muted)
- **Borders:** `rgba(255,255,255,0.06)` soft · `rgba(200,155,94,0.2)` gold soft
- **Typography:** Cormorant Garamond (display/editorial headings) + Inter Variable (body/UI) — both already loaded via `next/font`
- **Design language:** Authoritative. Aspirational. Clean. Not cluttered. Gold used sparingly for maximum impact.

### Animation Philosophy
Every section is animated. No static content.

| Technique | Framer Motion API | Trigger |
|---|---|---|
| Hero zoom-in reveal | `initial: {scale:1.08, opacity:0}` → `animate: {scale:1, opacity:1}` | Page load |
| Word-stagger text | `staggerChildren: 0.08` on word spans | Page load |
| Section entrance | `initial: {opacity:0, y:40}` → `whileInView` | Scroll |
| 3D tilt hover | `rotateX/Y` via `useMotionValue` + mouse delta | Hover |
| Parallax layers | `useScroll` + `useTransform` Y offset | Scroll |
| Scroll-pinned panels | CSS `position: sticky` + Framer `useScroll` progress | Scroll |
| Count-up numbers | `useInView` trigger + spring to target value | Scroll |
| Magnetic buttons | Mouse proximity → `x/y` spring offset on button | Hover |
| SVG path draw | `pathLength: 0 → 1` | Scroll |
| Infinite marquee | `animate: {x: [0, -50%]}` + `repeat: Infinity` | Auto |

### New Dependencies
```
lenis   # smooth scroll — replaces browser scroll-behavior: smooth
```
`framer-motion` v12 already installed. `lenis` is the only addition.

---

## 3. Page Architecture — 13 Sections

### Section 1 — Hero
**Headline:** "ONE STOP. EVERY NEED."  
**Layout:** Full-screen (`100dvh`). Left 50% = content. Right 50% = 4 slanted category panels.

**Left content (top → bottom):**
1. Eyebrow: `J&K's Premier Equipment Hub · Est. 2006` (gold, uppercase, tracking)
2. H1: Stacked bold uppercase — `ONE` / `STOP.` (gold) / `EVERY` (outline stroke) / `NEED.`
3. Service tags: `Sports · Fitness · Music · Awards · Installation · Service`
4. CTAs: `Explore Products` (gold fill) + `WhatsApp Us` (ghost border)
5. Stat badges row: `18+ Years` · `1000+ Institutions` · `GeM Registered` · `MSME Certified`

**Right panels:**
- 4 panels, each `skewX(-8deg)`, separated by 1px gold borders
- Real product images (`hero1Basketball.png`, `hero2Bench.png`, `hero3Guitar.png`, `hero4Trophy.png`)
- Image inside each panel un-skewed via `skewX(8deg)` + `scale(1.08)` to fill
- Hover: individual panel `scale(1.15)` + gold border glow + skew correction
- Each panel label in vertical text (Sports / Fitness / Music / Awards)

**Floating stats bar:**
- White card floated `-bottom-12`, full width, 4 stats with icons
- 18+ Years · 1000+ Institutions · 500+ Installs · 25+ Professionals

**Load animation sequence:**
1. Hero container: `scale(1.08) opacity(0)` → `scale(1) opacity(1)` — 800ms ease-out
2. Eyebrow: fade+slide — delay 200ms
3. H1 words: stagger 80ms each — delay 400ms
4. CTAs: fade+slide — delay 700ms
5. Badges: fade+slide — delay 900ms
6. Panels: stagger scale-in from right — delay 300ms

---

### Section 2 — Trust Marquee
**Purpose:** Instant credibility signal, zero friction.  
**Layout:** Full-width dark strip (`#0a0a0a`), 56px tall.  
**Content:** Infinite left-scroll loop of trust signals:  
`GeM Registered` · `MSME Certified` · `Est. 2006` · `1000+ Institutions` · `Pan India Delivery` · `[Brand Logo]` × 8+  
**Animation:** `animate: {x: [0, -50%]}` `repeat: Infinity` `duration: 30s` `ease: linear`. Pause on hover.

---

### Section 3 — Categories
**Purpose:** Direct product discovery for all visitor types.  
**Layout:** 4 full-width horizontal cards in a row (25% each). `min-height: 480px`.  
**Card anatomy:** Full-bleed product image · dark overlay gradient bottom · category name (Cormorant, 32px) · tagline · "Explore →" CTA.  
**Hover:** `rotateX(5deg) rotateY(8deg)` 3D tilt via `useMotionValue(0)` tracking mouse position. Image scales `1.1`. Gold border `2px` appears. Cursor changes to custom crosshair.  
**Entrance:** Stagger `delay: i * 0.1`, `y: 60 → 0`, `opacity: 0 → 1`.

Categories:
| id | label | tagline | image |
|---|---|---|---|
| sports | Sports Goods | Equip. Perform. Excel. | `sportsGoods.png` |
| fitness | Fitness & Wellness | Stronger Every Day. | `fitnessWelness.png` |
| music | Musical Instruments | Sound that Inspires. | `musicalInstruments.png` |
| awards | Awards & Trophies | Celebrate Excellence. | `awardsTrophies.png` |

---

### Section 4 — About / Origin Story
**Purpose:** Build trust, humanise the brand, establish longevity.  
**Layout:** 2-column. Left: editorial text. Right: large store image.  
**Left column:**
- Overline: `ABOUT MDF ENTERPRISES`
- H2 (Cormorant 48px): "More Than A Supplier. We're Your Partner."
- Body: 2 paragraphs on 18+ years history, J&K roots, full-service commitment
- CTA: `Know Our Story →`

**Right column:**
- Large image (`hero.png` or store photo) with `borderRadius: 16px`
- Parallax: image moves at `0.85x` scroll speed vs viewport using `useTransform`

**Count-up stats strip** below both columns (4 stats): `18` years · `1000` institutions · `500` installs · `25` brands — all count up from 0 on `useInView`.

---

### Section 5 — Who We Serve (Scroll-Pinned V3)
**Purpose:** Speak directly to all 4 buyer types without confusion.  
**Layout:** `min-height: 400vh`. Left half `position: sticky; top: 0; height: 100vh` (pinned visual). Right half: 4 panels × `100vh` each (scrolls normally).

**Pinned left (changes per panel via scroll progress):**
- Large panel number `01` → `04` (Cormorant, 120px, gold, animates between)
- Label: `FOR RETAIL` → `FOR INSTITUTIONS` → `FOR GOVERNMENT` → `FOR INSTALLATION`
- Background shifts subtly between panels (different dark tones)
- Decorative element: abstract shape or product silhouette

**Right panels (scroll through):**
Each panel is `100vh`, flex-centered content:

| # | Audience | Headline | Body | CTA |
|---|---|---|---|---|
| 01 | Retail | Walk In. Walk Out Equipped. | Visit our Srinagar showroom or browse online. Wide range, competitive pricing, immediate availability on most items. | Shop Products → |
| 02 | Institutions | Built for Schools, Colleges & Academies. | Bulk supply with institutional pricing, tender documentation support, and dedicated account management for educational bodies. | Request a Quote → |
| 03 | Government | GeM Ready. MSME Certified. | Registered on Government e-Marketplace. We support L1 procurement, DGS&D, and state government tenders with full documentation. | View GeM Profile → |
| 04 | Installation & Service | We Don't Just Sell. We Set Up. | Our in-house installation team handles complete setup — gyms, music labs, sports courts. AMC and after-sales support included. | Book Installation → |

**Scroll tracking:** `useScroll({ target: sectionRef })` + `useTransform(scrollYProgress, [0,0.25,0.5,0.75,1], ...)` to drive panel number + label transitions on the pinned left.

---

### Section 6 — Featured Products
**Purpose:** Product discovery, purchase intent signal.  
**Layout:** 3×2 grid. Dark cards.  
**Card:** Image (aspect 4:3) · Category tag (gold pill) · Product name (bold) · Short desc · `Enquire →` ghost button.  
**Hover:** `rotateX(4deg) rotateY(6deg)` 3D tilt + `scale(1.02)` + box-shadow deepen.  
**Section header:** "What We Stock" + "View All 1000+ Products →" right-aligned link.  
**Entrance:** Stagger grid reveal — each card `y: 40 → 0` with `delay: i * 0.08`.

---

### Section 7 — Brand Partners
**Purpose:** Credibility via brand names + dealer acquisition.  
**Layout:** Section heading + logo grid (5 cols × N rows) + dealer CTA strip at bottom.  
**Logo cards:** Dark bordered boxes, logo image grayscale by default → full colour + gold border on hover.  
**Dealer CTA strip** (NEW — critical for brand partner audience):
- Background: `rgba(200,155,94,0.06)` warm dark
- Text: "Interested in becoming our authorised dealer in J&K?"
- CTA: `Partner With Us →` (gold button) + WhatsApp link

---

### Section 8 — How We Work (Process)
**Purpose:** Demystify the buying/service process, reduce friction.  
**Layout:** 4-step horizontal flow.  
**Steps:** Consult → Source → Install → Support  
**Animation:** Gold horizontal line draws left-to-right via `pathLength: 0 → 1` on scroll entry. Each step node fades in as line reaches it.  
**Each step:** Step number (gold) · Icon · Headline · 1-line description.

---

### Section 9 — Installations Portfolio
**Purpose:** Social proof via real project evidence. Converts institutional and govt buyers.  
**Layout:** CSS `columns: 3` masonry (no extra library). 3 cols desktop, 2 cols tablet, 1 col mobile. `break-inside: avoid` per card.  
**Card:** Full-bleed project photo · Hover overlay slides up from bottom: "Project: [Name] · Location: [City/Institution]" in gold text.  
**Placeholder data:** Until real project photos are supplied, use 6 placeholder entries with descriptive names (e.g. "School Gym Setup · Srinagar", "Sports Complex · Jammu"). Images: `/assets/hero.png` cycled.  
**Entrance:** Each cell `scale(0.96) opacity(0)` → `scale(1) opacity(1)` staggered.  
**CTA:** "View All Projects →" below grid.

---

### Section 10 — Testimonials
**Purpose:** Peer validation from institutional clients.  
**Layout:** Two rows of auto-scrolling cards. Row 1 scrolls left, Row 2 scrolls right.  
**Card:** Quote text · Client name · Institution · Star rating (5 gold stars).  
**Animation:** Infinite marquee (`repeat: Infinity`, `ease: linear`). Pause entire rows on section hover.

---

### Section 11 — Blog / Insights
**Purpose:** SEO + authority content. Secondary conversion path.  
**Layout:** 3-col editorial grid.  
**Card:** Image · Category tag · Headline · Date · `Read →`.  
**Filter pills:** All · Sports · Fitness · Music · Awards · Government  
**Entrance:** Stagger `delay: i * 0.1`, slide up from `y: 30`.

---

### Section 12 — CTA Band
**Purpose:** Final conversion push before footer.  
**Layout:** Full-width dark section, `min-height: 360px`, flex-centered.  
**Background:** Subtle gold grid pattern + radial glow at centre.  
**Content:** 
- Headline (Cormorant 56px): "Ready to Equip Your Institution?"
- Subline: "From consultation to installation — we handle everything."
- 3 CTAs: `Explore Products` · `Get a Quote` · `WhatsApp Us`
**Animation:** Background grid parallaxes at `0.4x` speed. Headline scales `0.95 → 1.0` on entrance.

---

### Section 13 — Contact + Footer
**Contact form:**
- Fields: Name · Institution / Organisation · Category (dropdown: Sports/Fitness/Music/Awards/Installation/Other) · Message
- Submit → constructs WhatsApp deep-link (`https://wa.me/917006252334?text=...`) and opens in new tab. Email fallback via `mailto:` as secondary.
- Floating WhatsApp button (bottom-right, always visible, `+91 70062 52334`)

**Footer:**
- Logo + tagline "One Stop. Every Need."
- 4 nav columns: Products · Company · Services · Contact
- Credential badges: GeM · MSME · Est. 2006
- Address: Srinagar, J&K
- Copyright

---

## 4. Component Architecture

### New / Rewritten Components
```
components/
  ui/
    MagneticButton.tsx        # magnetic hover via useMotionValue
    TiltCard.tsx              # rewrite — 3D tilt with spring
    CountUp.tsx               # already exists, keep
    AnimatedSection.tsx       # already exists, enhance
    InfiniteMarquee.tsx       # new — replaces ad-hoc marquee
  home/
    Hero.tsx                  # full rewrite
    TrustMarquee.tsx          # new
    Categories.tsx            # full rewrite
    About.tsx                 # full rewrite
    WhoWeServe.tsx            # new — scroll-pinned V3
    FeaturedProducts.tsx      # rewrite
    BrandPartners.tsx         # rewrite (was Brands.tsx)
    Process.tsx               # rewrite
    Portfolio.tsx             # rewrite
    Testimonials.tsx          # rewrite
    BlogPreview.tsx           # rewrite
    CtaBand.tsx               # rewrite
    Contact.tsx               # rewrite
  layout/
    Navbar.tsx                # rewrite — transparent→solid on scroll, dark
    Footer.tsx                # rewrite — dark, credential badges
providers/
  LenisProvider.tsx           # new — smooth scroll wrapper
```

### Keep Unchanged
```
lib/utils.ts
app/globals.css   # extend with new tokens
app/layout.tsx    # add LenisProvider
app/products/     # separate work
app/blog/         # separate work
```

### Delete (superseded by new sections)
```
components/home/Clients.tsx     # absorbed into Testimonials
components/home/Services.tsx    # absorbed into About + Who We Serve
components/home/Brands.tsx      # renamed → BrandPartners.tsx (full rewrite)
```

---

## 5. Data Layer
All content stays in static data files (no CMS needed now):
```
lib/data/
  products.ts        # exists — keep
  testimonials.ts    # exists — keep
  portfolio.ts       # new — installation project entries
  brands.ts          # new — brand logo entries
  process.ts         # new — 4 process steps
```

---

## 6. New Global CSS Tokens (additions to globals.css)
```css
--color-bg-dark: #050505;
--color-surface-1: #0f0f0f;
--color-surface-2: #111111;
--color-surface-3: #1a1a1a;
--color-border-dark: rgba(255,255,255,0.06);
--color-border-gold: rgba(200,155,94,0.2);
--shadow-gold: 0 0 30px rgba(200,155,94,0.12);
```

---

## 7. Responsive Breakpoints
| Section | Mobile (< 768px) | Tablet (768–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Hero | Stacked — content top, single panel image bottom | 2 panels right | 4 slanted panels |
| Categories | Single col scroll | 2×2 grid | 4-col row |
| Who We Serve | Normal scroll (de-pin) | Normal scroll | Scroll-pinned |
| Products | 1 col | 2 col | 3 col |
| Portfolio | 1 col | 2 col | 3 col masonry |

---

## 8. Performance Constraints
- All Framer Motion animations use `will-change: transform` only on active elements
- Images: Next.js `<Image>` with `sizes` prop on all instances
- Scroll-pinned section: use CSS sticky not JS scroll hijacking
- `lenis` wraps only the root; does not conflict with Next.js App Router
- No animation runs until `useInView` fires (no wasted GPU on off-screen elements)

---

## 9. Out of Scope (separate phases)
- `/products` page redesign
- `/blog` page redesign
- Individual blog post pages
- CMS integration
- E-commerce / cart
- Authentication
