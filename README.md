# Randevough — Studio Grotesk Portfolio

A high-performance, dark-mode developer portfolio ported to **Astro 5** with strict TypeScript, vanilla CSS, and custom motion design.

---

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Output)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Vanilla CSS (`src/styles/global.css` — 19 numbered sections, fluid `clamp()` design tokens, custom scrollbars, and grain/vignette texture layers)
- **Motion & Interactions**:
  - CSS-driven text reveals powered by `IntersectionObserver`
  - GSAP 3 + ScrollTrigger (loaded via CDN for horizontal gallery scrub, skew, and magnetic buttons)
  - Lenis (smooth scrolling)
- **CI/CD & Hosting**: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`)

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript and Astro template type checks
npm run check

# Build production bundle to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## Deployment Flow

1. Any push to the `main` branch triggers `.github/workflows/deploy.yml`.
2. The GitHub Actions workflow uses `withastro/action` to build the static site.
3. Built files in `dist/` are automatically published to GitHub Pages via `actions/deploy-pages`.
4. The site is hosted under the repository subpath: `https://RandDevs.github.io/Portofolio/`.

> **Repository Configuration Note**: Ensure **Settings → Pages → Source** on GitHub is set to **GitHub Actions**.

---

## Architecture & Failsafe System

### 1. CSS-Driven Text Reveal Architecture
Text reveals are driven **exclusively** by `IntersectionObserver` adding the `.is-in` CSS class. They have **zero dependency** on GSAP, ScrollTrigger, pinning, or smooth scroll math. This deliberate boundary ensures that even if a third-party animation engine fails, every word remains 100% visible and readable. GSAP is reserved purely for non-essential scrubbed choreography (such as horizontal gallery movement and velocity skews).

### 2. Built-in Failsafes
To guarantee a script failure can never leave a black screen or invisible headings, the site contains four redundant failsafes:
- **Loader Failsafe**: CSS `@keyframes loaderFailsafe` automatically dismisses the loader after 5 seconds if `html.js-ready` is not added.
- **Reveal Failsafe**: CSS `@keyframes failsafeReveal` forces elements to reveal after 4 seconds if unanswered by JS.
- **Timeout Fallback**: JS `setTimeout(showAll, 4500)` forces all elements into `.is-in` state after 4.5 seconds.
- **Error Listener**: A global `window.onerror` listener instantly triggers `showAll()` if an unhandled script error occurs.

---

## Before This Is Really Live Checklist

Before launching this portfolio to production, complete the following items by replacing placeholders with real credentials and content:

- [ ] **Web3Forms Access Key**: Replace `YOUR_WEB3FORMS_ACCESS_KEY` in `src/pages/index.astro` (in the `<form data-cform>` element) with a valid key from [Web3Forms](https://web3forms.com/).
- [ ] **WhatsApp Contact Link**: Replace `https://wa.me/62XXXXXXXXXX` in `src/pages/index.astro` with your real phone number.
- [ ] **Curriculum Vitae (PDF)**: Replace the placeholder file at `public/assets/randevough-cv.pdf` with your actual resume PDF.
- [ ] **Project Screenshots & Mockups**:
  - Replace SVG wireframes (`public/assets/work-codequest.svg`, `work-parking.svg`, `work-artakarsa.svg`, `work-songunlocked.svg`) with real project screenshots or renders.
  - Replace case study detail shots (`public/assets/shot-1.svg`, `shot-2.svg`, `shot-3.svg`, `shot-4.svg`) with real interface screenshots.
- [ ] **CodeQuest Case Study Outcome Metrics**: Update the placeholder paragraph in `src/pages/work/codequest.astro` under Section 05 Outcome (`<em style="color:var(--muted)">Placeholder — replace with real numbers...</em>`) with real metrics (active users, submissions processed, completion rate).
- [ ] **Live Project Links**: Update gallery items for *Smart Parking*, *School Connect*, and *SongUnlocked* in `src/pages/index.astro` when case studies or live links are available (currently pointing at `#` with `data-hover="Soon"`).
- [ ] **Experience Years & Timeline Estimates**: Verify and update estimated timeline indicators (e.g. `Est. 2021` in hero, `Four projects — 2023 to 2026` in work header, and `ROLES` array in `src/scripts/main.ts`).
