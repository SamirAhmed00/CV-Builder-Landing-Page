# CV Builder — Portfolio Project

A premium, **fully bilingual (English / Arabic)** CV builder platform. ATS-friendly resume templates designed for software engineers, designers, marketers, and sales professionals.

This is a **frontend-only** portfolio project — no backend, no build step. Open `index.html` in a browser (or serve the folder) and everything works.

---

## ✨ What's inside

- **Landing page** (`index.html`) — premium SaaS-style hero, template showcase, career categories, how-it-works, live job-matching demo, features, pricing, footer
- **Template library** (`templates.html`) — 12 ATS-tested templates, filterable by career, with a preview modal
- **Builder** (`builder.html`) — live CV builder with a working form, four tabs, dynamic experience / education / projects / skills, and a print-quality live preview
- **Job analyzer** — paste a job description, get category detection, keyword extraction, missing-skill suggestions, and a recommended template
- **Dark mode** — full theme with a paper-white CV preview that stays readable
- **🌍 Bilingual EN / AR** — full UI in both languages, with RTL layout for Arabic, automatic font swap (Inter ↔ Cairo), language toggle, and a language-aware sample CV

## 🎨 Design system

Inspired by Stripe, Linear, and Framer. Premium, minimal, corporate.

| Token | Value |
|---|---|
| Primary | `#2563EB` (Blue) |
| Accent | `#7C3AED` (Purple) |
| Background (light) | `#FAFAFA` |
| Background (dark) | `#0F172A` |
| Font (EN) | Inter (400 / 500 / 600 / 700) |
| Font (AR) | Cairo (400 / 500 / 600 / 700) |
| Mono | JetBrains Mono |

All tokens live in `css/main.css` under `:root` and `[data-theme="dark"]`. Arabic-specific overrides live in `css/rtl.css` under `[dir="rtl"]`.

## 🗂️ Project structure

```
cv-builder/
├── index.html              # Landing page
├── templates.html          # Template library
├── builder.html            # CV builder + live preview
├── css/
│   ├── main.css            # Design tokens, base, layout, utilities
│   ├── components.css      # Navbar, cards, buttons, modals, forms, builder
│   └── rtl.css             # [dir="rtl"] overrides — layout flips + Arabic tweaks
├── js/
│   ├── i18n.js             # Translation system (en + ar) + language toggle
│   ├── app.js              # Theme, navbar, GSAP animations, icons, utilities
│   ├── templates.js        # Renders template cards, filters, preview modal
│   ├── analyzer.js         # Job description keyword + category detection
│   └── builder.js          # Live CV builder, template switching, download
├── data/
│   ├── templates.json      # 12 templates × 2 languages
│   ├── categories.json     # 4 career categories × 2 languages
│   └── jobs.json           # Sample job descriptions × 2 languages
└── assets/                 # Screenshots
```

## 🚀 Running locally

The project is a static site. You can open `index.html` directly, but to avoid CORS issues with `fetch()` on local JSON files, serve the folder:

```bash
# Python (any version)
python3 -m http.server 8765
# then open http://localhost:8765

# Or with Node
npx serve .
```

That's it. No `npm install`, no build, no bundler.

## 🌍 How bilingual works

The project ships in a single codebase that serves both English and Arabic.

1. **Language toggle** — A button in the navbar (top right) switches between **EN** and **AR**.
2. **Auto-detection** — On first load, the system reads `localStorage` to remember the user's choice. Falls back to `navigator.language` on the first visit.
3. **Layout flip** — Switching to Arabic sets `<html dir="rtl">` and applies `css/rtl.css` overrides:
   - Builder swaps form (right) and preview (left)
   - Two-column CVs put the sidebar on the right
   - Arrow icons flip horizontally
   - Text alignment, padding, and margins flip automatically via CSS logical properties where possible
4. **Font swap** — Arabic pages load Cairo from Google Fonts. The base font stack falls back to Cairo for any CJK / Arabic glyphs in Inter.
5. **Sample data follows the language** — On first load (no saved CV), the builder shows an English sample (Alex Morgan) or an Arabic sample (أحمد العلوي) depending on the active language.
6. **Smart re-sample on toggle** — If the user has the untouched sample loaded and toggles the language, the sample swaps to the new language. Custom CVs are preserved.
7. **Job analyzer works in both languages** — The skill dictionary is universal (English tech terms), but the UI labels and category names are localized. Detected keywords are kept in English because Arabic JDs typically use English tool names.

### Adding a new language

The translation table is a single object in `js/i18n.js`. To add Spanish, for example:

1. In `js/i18n.js`, add a new top-level key `es:` to the `STRINGS` object mirroring the structure of `en:` and `ar:`.
2. Add `'es'` to the `RTL_LANGS` set if it's an RTL language (Spanish is LTR).
3. Update data files: add a `"es"` field next to every existing `"en"` and `"ar"` field in `data/templates.json`, `data/categories.json`, `data/jobs.json`.
4. Add `'Spanish'` (or similar) to the `toggle.switchTo` key for the new language.

The `I18n.t(key)` and `I18n.pick(value)` functions handle the rest.

## 🧩 Features in detail

### 1. Template explorer
12 templates across 4 career tracks. Each template has a unique layout, accent color, and ATS score. Click any card to open the preview modal; "Use template" jumps straight into the builder with that template pre-selected.

### 2. Career categories
- **Software Engineering** — Backend, Frontend, Full Stack, Mobile, DevOps
- **Design** — UI/UX, Product, Graphic
- **Marketing** — Media Buyer, Performance, Digital
- **Sales** — Sales Rep, BDR, Account Executive

Each category links to a filtered view of the template library.

### 3. Job description analyzer
Pure-frontend keyword detection. The dictionary is curated per category in `analyzer.js`. Paste a job description and you'll see:
- Detected category (with confidence bars)
- Recommended template
- Matched keywords (green)
- Missing keywords to consider (red)
- One-click handoff to the builder

### 4. CV builder
- Live preview on every keystroke
- Four tabs: Personal, Experience, Education, Skills & Projects
- Add / remove experience and project entries
- Skill chips with Enter / comma to add, Backspace to remove
- Switch templates without losing your content
- State persists in `localStorage` between sessions
- **Download** exports a print-ready, self-contained HTML file (uses Cairo font in Arabic mode)
- **Print to PDF** uses the browser's native print dialog with print-only CSS

### 5. Dark mode
Toggle in the navbar. The CV paper itself stays white — recruiters always read resumes on white.

### 6. Animations
GSAP for the hero timeline, floating CV previews, and subtle scroll reveals. IntersectionObserver backs the reveal-on-scroll for reliability across capture contexts. Respects `prefers-reduced-motion`.

## 📦 Data model

Data fields are localized objects:

```json
{
  "id": "tech-resume",
  "name": { "en": "Tech Resume", "ar": "السيرة التقنية" },
  "category": "software",
  "style": { "en": "Technical", "ar": "تقني" },
  "description": {
    "en": "A clean, skills-forward layout for engineers...",
    "ar": "قالب نظيف يركز على المهارات الهندسية..."
  },
  "roles": {
    "en": ["Backend Developer", "Full Stack Developer"],
    "ar": ["مطوّر باك إند", "مطوّر Full Stack"]
  },
  "atsScore": 96,
  "color": "#2563EB",
  "accent": "#0F172A"
}
```

`I18n.pick(value)` resolves the right language at render time. Adding a template is one JSON entry — cards, modal, and selector pick it up automatically.

## ♿ Accessibility

- Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>`)
- `aria-label` on icon-only buttons
- `prefers-reduced-motion` respected
- Keyboard navigation for template grid (Enter / Space to open preview)
- Focus rings on all interactive elements
- Color contrast meets WCAG AA in both themes
- `lang` and `dir` attributes update on language change (helps screen readers)

## 🛣️ What was deliberately not done

- No fake photos or stock imagery (per spec)
- No "skill percentage bars" (per spec)
- No colorful childish templates (per spec) — every template stays in a professional palette
- No backend — everything is in `localStorage` and `data/*.json`

## 📄 License

Portfolio project. Use it however you like.
