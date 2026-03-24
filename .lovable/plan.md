

# AI & Us: Digital Illustrated Book Experience

## Overview
A premium, immersive digital book web app with elegant editorial design, smooth transitions, and a modern futuristic aesthetic. The app will feel like a high-end digital magazine rather than a typical website.

## Architecture

### Data Layer
- `src/data/chapters.ts` — All 6 chapters stored as a typed array with title, subtitle, body paragraphs, and chapter number. Easy to update content later.

### Pages
1. **Cover Page (`/`)** — Full-screen hero with title "AI & Us", subtitle, intro text, gradient background with glassmorphism elements, "Start Reading" and "View Chapters" CTAs
2. **Table of Contents (`/chapters`)** — Grid of 6 chapter cards with hover animations, chapter numbers, titles, and subtitles
3. **Chapter Pages (`/chapter/:id`)** — Individual reading experience with chapter number label, large title, subtitle, hero illustration area (abstract gradient placeholders), 3 body paragraphs, prev/next navigation, progress indicator, and back-to-TOC link
4. **Closing Page** — Final CTA section with the "This book was created..." message and placeholder PDF download button

### Reusable Components
- `BookLayout` — Shared wrapper with sticky header nav, progress bar, and responsive menu
- `ChapterCard` — Used in TOC grid with hover effects
- `ChapterNavigation` — Prev/Next buttons + return to TOC
- `ProgressBar` — Sticky top bar showing reading progress (chapter X of 6)
- `HeroIllustration` — Large gradient/abstract placeholder art per chapter (each chapter gets a unique color palette)
- `BookCTA` — Reusable call-to-action button component

### Design System
- **Typography**: Large serif-style headings (using Google Fonts like Playfair Display or similar), clean sans-serif body text
- **Colors**: Dark navy/charcoal backgrounds with soft gradient accents, light mode sections for contrast
- **Glassmorphism**: Subtle frosted glass cards on the cover and TOC
- **Gradients**: Each chapter gets a unique abstract gradient hero (blues, purples, teals, warm oranges, greens, golds)
- **Spacing**: Generous whitespace, max-width prose containers for readability
- **Animations**: Fade-in on scroll, smooth page transitions, hover scale on cards, subtle parallax on cover

### Responsive Design
- Desktop: Full editorial layout with large imagery and side margins
- Tablet: Adjusted grid and spacing
- Mobile: Single column, collapsible nav, touch-friendly navigation buttons

### Navigation
- Responsive header with book title, hamburger menu on mobile
- Chapter dropdown or TOC link always accessible
- Keyboard-friendly prev/next chapter navigation

