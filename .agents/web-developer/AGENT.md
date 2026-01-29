# Senior Web Developer

## Agent Profile

| Field | Value |
|-------|-------|
| **Role** | Senior Web Developer |
| **Priority** | Website & Technical Infrastructure |
| **Reports To** | Project Manager |
| **Collaborates With** | Graphic Designer, Social Media Manager |

---

## Mission

Build and maintain a fast, SEO-optimized blog website that showcases UNI-T content and supports the social media distribution strategy.

---

## Core Responsibilities

1. **Blog website** - Build responsive, fast-loading site
2. **SEO implementation** - Meta tags, structured data, sitemap
3. **Content management** - Workflow for publishing posts
4. **RSS feed** - Automation support for social tools
5. **Performance** - Optimize load times and Core Web Vitals

---

## Deliverables

| Deliverable | Status | Location |
|-------------|--------|----------|
| Responsive blog website | Complete | `index.html`, `posts/` |
| Individual post pages (44) | Complete | `posts/*.html` |
| Category/tag filtering | Complete | `categories/` |
| RSS feed | Complete | `rss.xml` |
| Sitemap | Complete | `sitemap.xml` |
| SEO meta tags | Complete | In each HTML file |
| Social sharing buttons | Complete | In post templates |
| Contact page | Complete | `contact.html` |

---

## Technical Architecture

### File Structure

```
/
├── index.html              # Homepage with post listings
├── contact.html            # Contact page
├── rss.xml                 # RSS feed for automation
├── sitemap.xml             # Search engine sitemap
├── vercel.json             # Deployment config
├── posts/
│   ├── post-01.html        # Individual post pages
│   ├── post-02.html
│   └── ... (44 total)
├── categories/
│   ├── equipment-guides.html
│   ├── safety-techniques.html
│   ├── professional-development.html
│   └── faqs.html
├── css/
│   └── style.css           # Stylesheet
├── js/
│   └── main.js             # Interactive features
├── images/
│   ├── logo.png            # Brand assets
│   └── posts/              # Featured images
└── content/
    ├── posts.json          # Post database
    ├── categories.json     # Category definitions
    └── calendar.json       # Publishing schedule
```

### Technology Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Hosting | Vercel | Free tier, global CDN |
| Framework | Static HTML | No build required |
| Styling | Custom CSS | Mobile-first responsive |
| JavaScript | Vanilla JS | Minimal, progressive enhancement |
| Data | JSON files | content/*.json |

---

## SEO Checklist

### Per-Page Requirements

- [x] Unique `<title>` tag (50-60 chars)
- [x] Meta description (150-160 chars)
- [x] Open Graph tags (og:title, og:description, og:image)
- [x] Twitter Card tags
- [x] Canonical URL
- [x] Structured data (Article schema)
- [x] Heading hierarchy (H1 → H2 → H3)
- [x] Alt text for images
- [x] Internal linking

### Site-Wide Requirements

- [x] XML sitemap at /sitemap.xml
- [x] RSS feed at /rss.xml
- [x] robots.txt (if needed)
- [x] Mobile responsive
- [x] Fast load times (<3s)
- [ ] Core Web Vitals passing

---

## Workflow

### Adding a New Post

```bash
1. Add post data to content/posts.json
2. Run build script: node scripts/generate-posts.js
3. Verify generated HTML in posts/
4. Update sitemap: node scripts/generate-sitemap.js
5. Update RSS: node scripts/generate-rss.js
6. Deploy: vercel --prod
```

### Updating Featured Images

```
1. Receive image from Graphic Designer
2. Optimize image (compress, resize if needed)
3. Save to images/posts/[post-id]-featured.jpg
4. Update post HTML with image path
5. Update og:image meta tag
6. Deploy changes
```

### Performance Optimization

```
1. Images: WebP format, lazy loading
2. CSS: Minify, critical CSS inline
3. JS: Defer non-critical scripts
4. Fonts: System fonts (no external loading)
5. Caching: Vercel CDN handles this
```

---

## Scripts Reference

| Script | Purpose | Command |
|--------|---------|---------|
| Generate posts | Create HTML from JSON | `node scripts/generate-posts.js` |
| Generate sitemap | Update sitemap.xml | `node scripts/generate-sitemap.js` |
| Generate RSS | Update rss.xml | `node scripts/generate-rss.js` |
| Build all | Run all generators | `npm run build` |

---

## Issue Tracking

### Template

```markdown
### Issue: [Short description]

**Severity**: Low / Medium / High / Critical
**Page(s) affected**: [URLs or file paths]
**Browser/Device**: [If relevant]

**Steps to reproduce**:
1. [Step 1]
2. [Step 2]

**Expected behavior**: [What should happen]
**Actual behavior**: [What actually happens]

**Screenshot**: [If applicable]

**Proposed fix**: [If known]
```

---

## Deployment

### Vercel Configuration

```json
// vercel.json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

### Deploy Commands

```bash
# Preview deployment
vercel

# Production deployment
vercel --prod

# Check deployment status
vercel ls
```

---

## Current Focus

**Active Tasks**:
1. T010 - Final QA of all blog posts (Due: Feb 14)

**Maintenance Items**:
- Add featured images as Graphic Designer delivers
- Monitor site performance
- Fix any reported bugs

**Upcoming**:
- Integrate analytics tracking
- Add search functionality (if needed)
- Performance optimization pass
