# JesseProjects.com Redesign - Overnight Execution Plan

**Created:** 2026/02/01
**Target Completion:** 2026/02/01 0800 PST
**Resume Token Refresh:** 0400 PST

---

## Executive Summary

Redesign of jesseprojects.com with **4 peer sections** in a horizontal-scroll carousel interface:
1. **Consulting** (construction tech/ERP focus - NEW)
2. **Photography** (existing galleries)
3. **Workshop** (existing dynamic project galleries with YAML metadata)
4. **About** (bio, contact)

**Core Positioning (from LinkedIn):**
> "I help construction teams make safer technology decisions by translating between how work happens and how tools work."

**Philosophy:**
> "Solution statements end discussion. Problem statements start it."
> "If you can't write the problem down clearly, no tool will fix it."

---

## Design Direction

### Visual Identity - "Acqua" Palette

| Element | Specification |
|---------|---------------|
| **Primary Colors** | Teal (#036564), Deep Blue (#031634), Orange Accent (#F7941F), Cream (#E8DDCB) |
| **Dark Mode** | Auto-detect system preference, toggle available, default for night visitors |
| **Typography** | System fonts (Segoe UI/Roboto) + monospace accents for tech content |
| **Style** | Professional, construction-adjacent, data-forward |
| **Animations** | ScrollMagic scroll-triggered reveals, Splitting.js text effects |

### Tech Stack

- **Framework:** React (Vite) with static export
- **Styling:** Tailwind CSS + CSS variables for theming
- **Animations:**
  - ScrollMagic (scroll-triggered effects)
  - Splitting.js (text entrance animations)
  - Framer Motion (React component animations)
  - Muuri (optional - for workshop grid layouts)
- **Build:** Static export, serve via Traefik on VPS
- **Workshop Backend:** Keep PHP API on Dreamhost, CORS-enabled for React frontend

---

## Information Architecture

```
jesseprojects.com (React SPA with horizontal carousel navigation)
│
├── HERO CAROUSEL (full-viewport, auto-cycling)
│   ├── Slide 1: Consulting
│   ├── Slide 2: Photography
│   ├── Slide 3: Workshop
│   └── Slide 4: About
│
├── #consulting (scrolls to Consulting section)
│   ├── Hero: "Construction companies lose thousands to bad ERP data. I fix that."
│   ├── Problem/Solution framing
│   ├── Services overview (3 pillars with pricing)
│   └── CTA: "Let's Talk About Your Data" → Calendly
│
├── #photography (scrolls to Photography section)
│   ├── Category cards (Wedding, Portrait, Event, etc.)
│   └── Gallery view with PhotoSwipe lightbox
│
├── #workshop (scrolls to Workshop section)
│   ├── Filter buttons by category (dynamic from YAML)
│   ├── Project cards grouped by category
│   ├── Modal for project details
│   └── Image gallery with lightbox
│   └── **YAML metadata system preserved** (category, title, hero_image, materials, tools, steps)
│
└── #about (scrolls to About section)
    ├── Bio: 24 years construction tech
    ├── ERP expertise visualization
    ├── Philosophy section
    └── Contact form + links
```

### Workshop Content Model (Preserved from Existing)

```yaml
# workshops/[project-name]/project.yaml
category: "Signage"           # Required - used for filtering
title: "Project Title"        # Optional - defaults to folder name
hero_image: "photo.jpg"       # Optional - auto-detected if not set
short_description: "..."      # Optional - shown on cards
difficulty: "Intermediate"    # Optional
estimated_time: "4-6 hours"   # Optional
materials:                    # Optional - for future filtering
  - "Wood"
  - "Gilding Paste"
tools:                        # Optional - for future filtering
  - "CNC Machine"
nsfw: false                   # Optional - content warning
steps:                        # Optional - if present, shows step-by-step
  - title: "Step 1"
    description: "..."
    image: "step1.jpg"
```

---

## Content Strategy

### Home Page Hero

**Primary Headline:**
"Construction companies lose thousands to bad ERP data. I fix that."

**Subhead:**
"Custom reports, integrations, and dashboards that give you exact numbers—not 'close enough.'"

**CTA:**
"Let's Talk About Your Data" → Calendly

### Problem/Solution Section

**Problems I Solve:**
1. "I can't get the report I need from Foundation/Vista/Spectrum"
2. "Our systems don't talk to each other"
3. "The data in our ERP doesn't match reality"
4. "We're manually entering the same data in 3 places"

**My Approach:**
1. Start with the problem, not the tool
2. Map workflows before buying software
3. Build integrations that respect your source of truth
4. Create solutions your team can actually run

### Services Section

**Service Card Structure:**
```
[Icon]
[Service Name]
[Price Range]
[Timeline]
[What You Get]
[Example Deliverable]
```

### About Page

**Key Messages:**
- 24 years in construction technology
- Not a vendor—a working operator
- "The person who makes tools actually work together"
- Field credibility + executive translation + technical implementation

**ERP Expertise Display:**
| System | Depth |
|--------|-------|
| Foundation | Deep |
| Vista (Viewpoint) | Strong |
| Spectrum | Strong |
| CMiC | Working |

---

## Phase Breakdown

### Phase 1: Foundation (0-2 hours)
**Status:** In Progress

- [ ] Initialize Vite + React project in `/srv/knowledge/Claude/VPS/apps/jesseprojects-v2/src/`
- [ ] Configure Tailwind with Acqua palette theme
- [ ] Set up dark mode (system detection + toggle)
- [ ] Create component library structure
- [ ] Install dependencies (ScrollMagic, Splitting.js, Framer Motion)
- [ ] Create base layout with horizontal carousel navigation
- [ ] Set up React Router with hash-based routing (#consulting, #photography, #workshop, #about)

**Checkpoint:** Project runs locally, carousel navigates between 4 sections, dark mode works

### Phase 2: Core Sections (2-5 hours)
**Status:** Pending

**Consulting Section:**
- [ ] Hero with animated text (Splitting.js)
- [ ] Problem/Solution cards
- [ ] Services overview grid (3 pillars)
- [ ] CTA → Calendly

**Photography Section:**
- [ ] Category card grid
- [ ] Gallery view (can defer full implementation, placeholder OK)

**Workshop Section (CRITICAL - port existing functionality):**
- [ ] Fetch from existing Dreamhost API (`jesseprojects.com/api/workshops.php`) via CORS
- [ ] Filter buttons by category (dynamic)
- [ ] Project cards grouped by category
- [ ] Modal for project details
- [ ] Image gallery with lightbox (Framer Motion or simple implementation)

**About Section:**
- [ ] Bio section
- [ ] ERP expertise cards (Foundation, Vista, Spectrum, CMiC)
- [ ] Philosophy quotes
- [ ] Contact form + links

**Checkpoint:** All 4 sections render, workshop data loads from Dreamhost API

### Phase 3: Carousel & Animations (5-6 hours)
**Status:** Pending

- [ ] Hero carousel (AccessibleCarousel port to React)
- [ ] Carousel ↔ content section sync (ScrollManager behavior)
- [ ] ScrollMagic scroll-triggered reveals
- [ ] Splitting.js text entrance animations
- [ ] Page transitions with Framer Motion
- [ ] Mobile responsive polish
- [ ] Touch swipe for carousel
- [ ] Keyboard navigation (arrows, space for pause)

**Checkpoint:** Full carousel functionality, animations smooth, mobile works

### Phase 4: Deployment (6-7 hours)
**Status:** Pending

**Option A: Replace Dreamhost site entirely**
- [ ] Build static export
- [ ] SFTP deploy to Dreamhost (keep API files, replace frontend)

**Option B: Deploy to VPS, proxy API**
- [ ] Build static export
- [ ] SSH to VPS
- [ ] Create Docker container (nginx serving static)
- [ ] Configure Traefik routing
- [ ] Proxy `/api/*` requests to Dreamhost

**Decision Point:** Choose based on complexity and content management needs

**Checkpoint:** Live at jesseprojects.com

### Phase 5: Polish & Expansion (7+ hours, if tokens remain)
**Status:** Optional

- [ ] Case study page template for consulting
- [ ] Portfolio project detail pages
- [ ] Analytics (Plausible)
- [ ] SEO meta tags
- [ ] Open Graph images
- [ ] Performance audit (Lighthouse)

---

## Token Exhaustion Recovery

If tokens exhaust before completion:

### State Files
1. `CHECKPOINT.md` - Last completed phase and next steps
2. `src/` - All code written so far
3. `OVERNIGHT-PLAN.md` - This file (reference for resuming)

### Resume Instructions (for 0400 session)
```bash
# 1. Check current state
cat /srv/knowledge/Claude/VPS/apps/jesseprojects-v2/CHECKPOINT.md

# 2. Resume from last checkpoint
# The CHECKPOINT.md file contains:
# - Last completed phase
# - Next immediate tasks
# - Any blockers encountered
```

### Handoff Format
```markdown
## CHECKPOINT

**Last Phase Completed:** Phase X
**Time:** YYYY/MM/DD HH:MM

**Completed:**
- [x] Task 1
- [x] Task 2

**Next Steps:**
1. Immediate next task
2. Following task

**Blockers/Notes:**
- Any issues encountered
- Decisions made
```

---

## Copy Bank

### Headlines
- "Construction companies lose thousands to bad ERP data. I fix that."
- "Exact numbers. Fast turnaround. Construction expertise."
- "I help construction teams make safer technology decisions."
- "Your ERP has the answers. I help you find them."

### Value Props
- "Not 'close enough'—exact matching standard"
- "24 years of construction technology experience"
- "The person who makes tools actually work together"
- "Success means the client can run it without you"

### CTAs
- "Let's Talk About Your Data"
- "Schedule a Free Consultation"
- "Get Your First Report"

### Philosophy Quotes
- "Solution statements end discussion. Problem statements start it."
- "If you can't write the problem down clearly, no tool will fix it."
- "Real systems beat perfect diagrams."
- "If the field won't use it, it's broken."

---

## Assets Needed

### From Existing
- Favicon assets (from jesseprojects-resume)
- Blueprint grid texture (from jesseprojects-resume)

### To Create
- Hero background (construction/data theme)
- Service icons (or use animated icons)
- ERP logos (Foundation, Vista, Spectrum, CMiC)

### External
- Calendly embed URL
- LinkedIn profile link
- Email (jesse@jesseprojects.com)

---

## Deployment Details

**VPS:** srv1175263 @ 31.220.57.14
**Domain:** jesseprojects.com (Cloudflare DNS)
**Reverse Proxy:** Traefik

**Traefik Labels:**
```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.jesseprojects.rule=Host(`jesseprojects.com`) || Host(`www.jesseprojects.com`)
  - traefik.http.routers.jesseprojects.entrypoints=websecure
  - traefik.http.routers.jesseprojects.tls.certresolver=mytlschallenge
  - traefik.http.services.jesseprojects.loadbalancer.server.port=80
```

---

## Success Criteria

**Minimum Viable (by 0800):**
- [ ] 4-section carousel navigation working (Consulting, Photography, Workshop, About)
- [ ] Consulting section complete with hero, services overview, CTA
- [ ] Workshop section fetches from Dreamhost API, displays project cards
- [ ] Dark mode working (system detection)
- [ ] Mobile responsive
- [ ] Deployed and live

**Stretch Goals:**
- [ ] Full carousel animations (slide transitions, pause on scroll)
- [ ] Splitting.js text animations on hero
- [ ] Workshop modal with lightbox
- [ ] Photography gallery functional
- [ ] ScrollMagic reveal animations

---

## Notes for Overnight Execution

1. **Prioritize shipping over perfection** - Get something live, polish later
2. **Checkpoint frequently** - Write CHECKPOINT.md after each phase
3. **Test on mobile** - Construction folks often check on phones
4. **Dark mode first** - It's the default for late-night coders who might visit

---

## Related Files

- `/srv/knowledge/Claude/Reference/consulting.md` - Service catalog, pricing
- `/srv/knowledge/Claude/Reference/career.md` - Bio, experience
- `/srv/knowledge/Claude/VPS/infrastructure.md` - Deployment reference
- `/srv/knowledge/Claude/Personal/jesseprojects-resume/` - Existing assets
