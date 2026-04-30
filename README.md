# AI & Us: A Short Visual Book on the Human Future

**By Daisy Laflamme**

An immersive, editorial-grade digital book exploring how artificial intelligence is reshaping work, identity, relationships, and the human future. Built as a premium reading experience with cinematic concept art, realistic page-turn animations, and a KDP-ready PDF export.

## Summary

*AI & Us* is a six-chapter visual essay on what it means to live, work, and grow alongside intelligent machines. Each chapter pairs short, reflective prose with original concept art and a calm, magazine-style layout — designed to feel less like a website and more like a hand-bound book.

The project is both a digital reading experience and a print-ready artifact: readers can flip through the chapters online or download a 6×9 KDP-formatted PDF for self-publishing.

## Description

The app is structured as a linear book:

1. **Cover** — minimalist hero with title, subtitle, and author.
2. **Table of Contents** — six chapter cards with cinematic preview art.
3. **Chapters 1–6** — single-column reading pages with hero illustration, title, subtitle, and body prose constrained to a comfortable 60–70 character line length.
4. **Closing page** — author credit and PDF download.

Key features:

- **Realistic page-turn animation** — 3D curl with shadow depth and perspective, driven by Framer Motion. Swipe on mobile, click or arrow keys on desktop. Falls back to a fade transition on low-performance devices or when `prefers-reduced-motion` is set.
- **PDF export** — client-side generation with jsPDF + html2canvas. Outputs a print-ready 6×9 inch layout on an 8pt grid, with each chapter constrained to a single page.
- **Editorial typography** — Playfair Display for headings, carefully tuned measure and rhythm for long-form reading.
- **Premium visual direction** — glassmorphism, muted cinematic concept art, Apple/Stripe-level polish.
- **Centralized content** — all chapter copy, metadata, and imagery live in `src/data/chapters.ts` for easy editing.

## Tech Stack

- **Framework:** React 18 + Vite 5
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v3 with a semantic HSL design token system
- **UI primitives:** shadcn/ui (Radix UI under the hood)
- **Routing:** React Router
- **Animation:** Framer Motion (3D page-turn engine)
- **PDF generation:** jsPDF + html2canvas
- **Data fetching / state:** TanStack Query
- **Icons:** lucide-react
- **Testing:** Vitest + Playwright
- **Tooling:** ESLint, PostCSS, Bun

## Project Structure

```
src/
├── App.tsx                       # Routes + animated page wrapper
├── data/chapters.ts              # All chapter content & metadata
├── pages/
│   ├── CoverPage.tsx
│   ├── TableOfContents.tsx
│   ├── ChapterPage.tsx
│   └── ClosingPage.tsx
├── components/book/
│   ├── PageTurn.tsx              # 3D page-curl animation
│   ├── BookLayout.tsx
│   ├── ChapterCard.tsx
│   ├── ChapterNavigation.tsx
│   ├── HeroIllustration.tsx
│   └── ProgressBar.tsx
└── lib/
    ├── generatePdf.ts            # KDP 6×9 PDF export engine
    ├── pageOrder.ts              # Linear book navigation
    └── usePerformanceMode.ts     # Reduced-motion / low-perf fallback
```

## Getting Started

```bash
bun install
bun run dev
```

Open the preview URL printed in the terminal to start reading.

## Author

Written and designed by **Daisy Laflamme**.
