# Cogn8 Systems — React + Framer Motion Migration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Cogn8 Systems marketing site from vanilla HTML/CSS/JS to Vite + React + TypeScript + Framer Motion while preserving all copy, styling, and functionality, adding premium animations and full SEO/GEO/AEO.

**Architecture:** Single-page React app built with Vite. CSS custom properties preserved from original design. Framer Motion handles all animations (scroll-triggered reveals, 3D hover, hero zoom, parallax). JSON-LD schema injected via React helmet pattern.

**Tech Stack:** Vite 5, React 18, TypeScript, Framer Motion 11, Tailwind CSS 3, Vitest, @testing-library/react

---

## File Map

| File | Responsibility |
|---|---|
| `package.json` | Dependencies + scripts |
| `vite.config.ts` | Vite build config |
| `tsconfig.json` | TypeScript config |
| `tailwind.config.js` | Brand color extensions |
| `postcss.config.js` | PostCSS + Autoprefixer |
| `index.html` | Vite entry shell |
| `src/main.tsx` | React root mount |
| `src/App.tsx` | Root component, schema injection |
| `src/index.css` | CSS vars + Tailwind base + all original styles |
| `src/animations/variants.ts` | All Framer Motion variants (centralized) |
| `src/hooks/useCardTilt.ts` | 3D hover tilt hook |
| `src/lib/analytics.ts` | Plausible event helper |
| `src/lib/schema.ts` | JSON-LD schema builder |
| `src/components/Nav.tsx` | Sticky nav, mobile menu, scroll-aware |
| `src/components/Hero.tsx` | Hero with zoom-in + parallax bg |
| `src/components/Engage.tsx` | How we engage, 3D hover cards |
| `src/components/CurrentWork.tsx` | IDmgmt featured + snapshots |
| `src/components/HowWeBuild.tsx` | 4 principles, 3D hover |
| `src/components/About.tsx` | About + bio card |
| `src/components/Contact.tsx` | Contact form with honeypot + validation |
| `src/components/Footer.tsx` | Footer |
| `public/favicon.svg` | Cog mark (moved from root) |
| `public/robots.txt` | Crawl rules (moved from root) |
| `public/sitemap.xml` | Sitemap (moved from root) |
| `public/privacy.html` | Privacy notice (moved from root) |
| `public/llms.txt` | AI crawler manifest (new) |
| `src/tests/Nav.test.tsx` | Nav toggle + aria tests |
| `src/tests/Contact.test.tsx` | Form validation + success message |
| `src/tests/Schema.test.tsx` | JSON-LD node verification |
| `src/tests/Analytics.test.tsx` | Plausible event tracking |

---

### Task 1: Config files

- [ ] Create `package.json`
- [ ] Create `vite.config.ts`
- [ ] Create `tsconfig.json`
- [ ] Create `tailwind.config.js`
- [ ] Create `postcss.config.js`
- [ ] Run `npm install`
- [ ] Commit: `chore: scaffold vite+react+ts+framer-motion project`

### Task 2: Move public assets + create llms.txt

- [ ] Move `favicon.svg`, `robots.txt`, `sitemap.xml`, `privacy.html` to `public/`
- [ ] Create `public/llms.txt`
- [ ] Commit: `chore: move static assets to public/`

### Task 3: Base styles + animation system

- [ ] Create `src/index.css` (all CSS vars + Tailwind layers + original styles)
- [ ] Create `src/animations/variants.ts` (all motion variants)
- [ ] Create `src/hooks/useCardTilt.ts` (3D perspective tilt hook)
- [ ] Commit: `feat: base styles, animation variants, tilt hook`

### Task 4: Lib utilities

- [ ] Create `src/lib/analytics.ts`
- [ ] Create `src/lib/schema.ts`
- [ ] Commit: `feat: analytics + schema utilities`

### Task 5: Components

- [ ] Create all 8 components (Nav, Hero, Engage, CurrentWork, HowWeBuild, About, Contact, Footer)
- [ ] Create `src/main.tsx` and `src/App.tsx`
- [ ] Create `index.html` Vite entry
- [ ] Commit: `feat: all React components with Framer Motion animations`

### Task 6: Tests

- [ ] Create `src/tests/Nav.test.tsx`
- [ ] Create `src/tests/Contact.test.tsx`
- [ ] Create `src/tests/Schema.test.tsx`
- [ ] Create `src/tests/Analytics.test.tsx`
- [ ] Run `npm test`
- [ ] Commit: `test: nav, contact form, schema, analytics`

### Task 7: SEO + GEO + AEO

- [ ] Verify JSON-LD in DOM (Organization, Person, FAQ)
- [ ] Verify meta tags
- [ ] Verify `llms.txt` content
- [ ] Commit: `feat: SEO/GEO/AEO — schema, meta, llms.txt`
