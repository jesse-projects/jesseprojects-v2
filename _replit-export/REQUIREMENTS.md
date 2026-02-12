# JesseProjects Portfolio Website
## Requirements & Specifications

---

## Design Philosophy

### 1. Performance as a Feature
Fast page loads aren't just a technical metric—they're part of the user experience. When a visitor lands on a photography portfolio, the images should appear quickly and smoothly. We achieve this through:

- **Perceived performance over raw speed**: A blurred preview that sharpens into focus feels faster than a blank space that suddenly pops in, even if the actual load time is similar
- **Progressive disclosure**: Show something useful immediately, then enhance as resources arrive
- **Respect for bandwidth**: Not everyone has fast internet. Serve appropriately-sized images and defer non-essential resources

### 2. Accessibility is Non-Negotiable
A portfolio should be viewable by everyone, regardless of how they interact with the web:

- **Keyboard-first navigation**: Every interactive element reachable without a mouse
- **Screen reader support**: Meaningful alt text, proper heading hierarchy, ARIA labels where needed
- **Respect user preferences**: Honor reduced motion settings, ensure sufficient color contrast
- **Semantic HTML**: Use the right elements for the right purpose

### 3. Separation of Concerns: Code vs Content
The photographer should be able to update images and descriptions without touching code, and developers should be able to update features without risking content loss:

- **Code** (templates, styles, scripts) lives in version control and deploys automatically
- **Content** (photos, workshop materials, metadata) lives on the server and persists across deployments
- **Clear boundaries**: A deployment should never overwrite uploaded photos

### 4. Progressive Enhancement
The site should work at every level of browser capability:

- **No JavaScript?** Core content is still accessible
- **JavaScript available?** Add smooth transitions, dynamic filtering, enhanced galleries
- **Modern browser?** Take advantage of CSS Grid, custom properties, intersection observers

### 5. Maintainable Simplicity
Avoid unnecessary complexity:

- **Vanilla PHP** over heavy frameworks—easy to understand, easy to host
- **Native browser features** over JavaScript libraries when possible
- **Consistent patterns** that make future changes predictable

---

## Core Requirements

### Site Structure

The website serves as a comprehensive platform for a photographer to:

1. **Showcase Photography Work**
   - Organized into categories (Weddings, Portraits, Events, Lifestyle, etc.)
   - Each category displays as a card with a featured image
   - Clicking a category opens a full-screen gallery with keyboard navigation
   - Support for NSFW content with blur effects and consent modal

2. **Present Workshop Offerings**
   - Project-based workshops with materials, tools, and step-by-step instructions
   - Categorized by type (Metalwork, Woodworking, Leather, Digital, etc.)
   - Filterable gallery with URL-based deep linking

3. **Introduce the Photographer**
   - About section with professional background
   - Contact information and resume link
   - Professional, personal brand presentation

### Navigation

- **Scroll-based carousel**: Three main sections (Photography, Workshop, About) presented as full-screen slides
- **Sticky section headers**: Always know which section you're in
- **Hash-based routing**: Shareable URLs like `/#photography` or `/#workshop#metalwork`
- **Mobile hamburger menu**: Accessible navigation on smaller screens

### Visual Identity

The site uses a custom color palette ("Acqua") that conveys professionalism with creative warmth:

| Role | Color | Usage |
|------|-------|-------|
| Primary | Teal (#036564) | Headers, active states, primary buttons |
| Secondary | Dark Teal (#033649) | Navigation, footers, secondary elements |
| Accent | Orange (#F7941F) | Calls to action, highlights, focus states |
| Background | Dark Blue (#031634) | Page background, cards |
| Text | Cream (#E8DDCB) | Body text, headings |

---

## Content Management

### Folder Structure

```
photography/
  [category-name]/
    metadata.yaml       # Category info: title, description, featured image
    *.jpg, *.png        # Gallery images
    
workshops/
  [project-name]/
    metadata.yaml       # Project info: materials, tools, steps
    *.jpg, *.png        # Project images
    sizes/              # Auto-generated resized images
    originals/          # Original full-res images (for backup)
```

### Metadata Schema

Content uses YAML files with a unified schema:

**Core Fields** (all content types):
- `title` - Display name
- `summary` - Brief description
- `hero_image` - Featured image filename
- `hero_alt` - Accessibility text for featured image
- `flags.nsfw` - Mature content warning
- `flags.featured` - Highlight on homepage
- `tags` - Keywords for filtering
- `sort_order` - Custom display ordering

**Workshop-Specific**:
- `category` - Workshop type (required)
- `difficulty` - Skill level
- `estimated_time` - Time to complete
- `materials` - List of required materials
- `tools` - List of required tools
- `steps` - Step-by-step instructions

### Backwards Compatibility

The system supports legacy field names (`name`, `description`, `featured_image`) for existing content while encouraging the unified schema for new content.

---

## Performance Specifications

### Critical Rendering Path

1. **Inline critical CSS** (≤12KB) in the HTML head
2. **Defer non-critical CSS** loaded after first paint
3. **Async JavaScript** that doesn't block rendering
4. **Preload key resources** (fonts, hero images)

### Progressive Image Loading

Images use a "blur-up" technique:

1. **Tiny placeholder** (32px wide, blurred) loads instantly (~1-2KB)
2. **Full image** loads in background
3. **Smooth transition** from blur to sharp when ready
4. **No layout shift** because placeholder reserves space

### Image Processing Pipeline

Uploaded images automatically generate:
- `lqip/` - 32px blurred placeholder
- `thumb/` - 400px thumbnail
- `medium/` - 800px standard view
- `large/` - 1200px gallery view
- `xlarge/` - 2000px full-screen view

Original files are preserved in `originals/` folder for future reprocessing.

---

## Accessibility Specifications

### Keyboard Navigation

- `Tab` / `Shift+Tab` - Move between interactive elements
- `Enter` / `Space` - Activate buttons and links
- `Escape` - Close modals and galleries
- `Arrow keys` - Navigate within carousels and galleries

### Screen Reader Support

- Proper heading hierarchy (h1 → h2 → h3)
- Descriptive link text (not "click here")
- Alt text for all meaningful images
- ARIA labels for icon-only buttons
- Live regions for dynamic content updates

### Motion & Visual

- `prefers-reduced-motion` respected for animations
- Minimum 4.5:1 contrast ratio for text
- Focus indicators visible on all interactive elements
- No content conveyed by color alone

---

## Deployment Architecture

### Code Deployment Flow

```
Replit (development)
    ↓ git push
GitHub (version control)
    ↓ rsync (excludes content folders)
Dreamhost (production)
```

### What Gets Deployed

| Deployed (Code) | NOT Deployed (Content) |
|-----------------|------------------------|
| `api/` | `photography/` |
| `css/` | `workshops/` |
| `js/` | `attached_assets/` |
| `scripts/` | `_meta/` |
| `data/` | |
| `docs/` | |
| `index.php` | |
| `sw.js` | |
| Favicon files | |

### Post-Deployment

After deploying code changes, run:
```bash
php scripts/process-images.php
```
This generates any missing image sizes without touching existing processed images.

---

## Future Considerations

### Planned Automation
- N8N workflow to automatically deploy from GitHub pushes
- Automated patch notes generation from CHANGELOG.md

### Potential Features
- Client gallery password protection
- Print ordering integration
- OpenGraph meta tags for social sharing
- Event calendar integration (currently disabled)

---

## Contact

**Jesse Projects**
- Email: jesse@jesseprojects.com
- Phone: (916) 258-2297
- Resume: https://jesseprojects.com/resume
