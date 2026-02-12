# JesseProjects v2 Website Redesign - Session Snapshot
**Date:** 2026-02-01
**Status:** In Progress - Phase 3 (Animations and Polish)

## Project Overview
Redesigning jesseprojects.com with a horizontal carousel interface featuring 4 peer sections:
- Consulting
- Photography
- Workshop
- About

## Tech Stack
- React + Vite
- Tailwind CSS with custom color palette (acqua-*)
- Framer Motion for animations
- Hash-based routing (#consulting, #photography, etc.)

## Current State

### Completed
- [x] Project initialized with React/Vite/Tailwind
- [x] Core component structure (Carousel, Navigation, sections)
- [x] Hero carousel with crossfade transitions
- [x] Consulting section with human-focused messaging
- [x] Custom AI-generated images integrated throughout Consulting:
  - `hero-line-art.jpg` - Hero background (worker→you→exec line art)
  - `chaos-to-order.jpg` - "How I Work" section
  - `bridge-sunrise.jpg` - Services header
  - `hub-connector.jpg` - "Sound Familiar" background
  - `team-handshake.jpg` - CTA background
- [x] Removed phone number from contact
- [x] Updated LinkedIn to correct URL
- [x] Replaced Calendly with cal.com/thejessejones
- [x] External links open in new tabs
- [x] Changed "24 years" to "25+ years"

### In Progress / Pending
- [ ] Photography section - needs actual gallery data from Dreamhost API
- [ ] Workshop section - needs gallery integration (API working, needs implementation)
- [ ] About section - add profile picture, expand bio to include photography
- [ ] About contact section - rebalance (now 3 buttons, need 4th)
- [ ] Contact form - verify email sending functionality
- [ ] Customer testimonials - Notion task created for gathering
- [ ] Final polish and responsive testing
- [ ] Deploy to DreamHost

## API Endpoints (Current Site)
- Workshop data: `https://jesseprojects.com/api/workshops.php` - Returns 28 projects in 6 categories
- Photography data: Need to verify endpoint

## Image Assets Location
- `/public/images/` - Hero images
- `/public/images/consulting/` - Consulting section images
- Source images in `/srv/knowledge/Claude/Import/NightCafe Downloads/`

## Build & Preview
```bash
cd /srv/knowledge/Claude/VPS/apps/jesseprojects-v2
npm run build
cp -r public/images dist/
cd dist && python3 -m http.server 8080
# Preview: http://192.168.150.120:8080/
```

## Key Files
- `src/components/Carousel.jsx` - Hero carousel with crossfade
- `src/sections/Consulting.jsx` - Fully redesigned with images
- `src/sections/Photography.jsx` - Needs gallery implementation
- `src/sections/Workshop.jsx` - Needs gallery implementation
- `src/sections/About.jsx` - Needs profile expansion
- `src/App.jsx` - Main app with routing

## Design Decisions
- Empathy-focused consulting messaging (not ERP-heavy)
- Services: Tech Stack Clarity, Tool Selection, Integration & Training
- "Sound Familiar?" fear/response grid format
- "How I Work": Listen, Translate, Simplify, Empower

## Outstanding Questions
1. Does contact form actually send emails? (Need to check implementation)
2. DreamHost deployment - static React app should work, verify build process
3. Gallery auto-generation logic - match original site behavior

## Related Context
- Original site code: `_dreamhost-code/` folder
- NightCafe images: `/srv/knowledge/Claude/Import/NightCafe Downloads/`
- Design playground: `jesseprojects-design-playground.html`
