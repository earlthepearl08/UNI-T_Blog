# UNI-T Philippines Website Review Discussion

**Website:** https://unit-philippines-blog.vercel.app/
**Review Date:** January 29, 2026
**Participants:**
- Rico Santos (Customer Persona - Filipino Electrical Technician)
- Sarah Chen (External UX/QA Reviewer)

---

## CRITICAL BUG IDENTIFIED

### 🔧 Images Showing as Emojis

**Sarah (QA):** I need to flag a **CRITICAL** bug immediately. The homepage and dynamic post listings are showing emojis (🔧⚡📈❓) instead of actual product images.

**Root Cause Identified:**
- File: `js/main.js` lines 144-156
- The `createPostCard()` function uses an emoji map instead of `<img>` tags:
```javascript
const iconMap = {
  'equipment-guides': '🔧',
  'safety-techniques': '⚡',
  'professional': '📈',
  'faqs': '❓'
};
// Outputs emoji in post-card-image div instead of actual images
```

**Rico:** Ay nako, kaya pala! Akala ko may problema sa internet ko. Parang ang unprofessional naman na emoji lang ang makikita. Parang joke website, hindi serious business.

**Sarah:** This completely undermines the professional appearance. The static HTML pages (category pages, individual posts) show proper images because they don't use this JavaScript function. But the homepage dynamically loads posts using this function, hence the emojis.

**Priority:** P0 - Fix Immediately
**Impact:** Makes site look unprofessional and untrustworthy

---

## RICO SANTOS - CUSTOMER PERSONA REVIEW

### First Impressions

**Rico:** Okay, so pinuntahan ko yung website... Una, yung header looks clean naman. "UNI-T Philippines" with the "Official Distributor" badge - maganda, feeling ko legit ito. Pero nung nag-scroll ako pababa...

Yung mga articles cards, emoji lang ang image?! 🔧 Akala ko may loading problem. Medyo na-turn off ako kasi parang hindi serious yung website. Pero sige, binigyan ko pa ng chance.

### Content Review

**Rico:** Yung mga articles, actually informative naman! Yung "Clamp Meters vs. Multimeters" - exactly yung tanong ko before. Finally may clear explanation kung kailan gagamit ng clamp meter.

Pero may problema:
1. **Ang daming articles (44!)** - Overwhelmed ako. Saan ako magsisimula? Sana may "Start Here" or "Beginner's Guide"
2. **Yung technical terms** - True RMS, CAT ratings, etc. May explanation naman pero sana mas prominent
3. **Where's the price?** - Naghahanap ako kung magkano yung products, pero walang prices sa articles. Kailangan pa pumunta sa Kinmo store

### What Works for Me

✅ Local contact numbers - +63 977 840 7799 (feel ko legit, may makakausap)
✅ Physical address - May actual store sa Makati, hindi lang online
✅ Filipino context - Yung mga articles nagsasabi about Philippine voltage (220V), brownouts, etc.
✅ Multiple categories - Equipment Guides, Safety, FAQs - organized naman
✅ Dark mode - Maganda sa mata, lalo na pag gabi nagba-browse

### What Confuses Me

❌ **Emoji images** - Parang hindi professional, nagdududa tuloy ako
❌ **No "Best Sellers" or "Recommended for Beginners"** - Hindi ko alam kung anong bilhin
❌ **Gmail address** - e2shop.kinmo@gmail.com - bakit hindi @kinmo.com? Legit ba talaga?
❌ **No customer reviews/testimonials** - Walang feedback from other Filipinos who bought
❌ **No pricing info** - Kahit range lang sana para may idea ako

### Verdict from Rico

"6/10 - Yung content maganda, informative talaga. Pero yung presentation, lalo na yung emoji images, parang hindi ako confident bumili. Fix lang yung images at lagyan ng customer testimonials, magiging 8/10 for me."

---

## SARAH CHEN - UX/QA REVIEWER

### Visual Design Assessment

#### What's Working Well
✅ **Color scheme** - Red (#E31E24), black, white palette is strong and on-brand
✅ **Dark mode** - Well-implemented with good contrast ratios
✅ **Typography** - System fonts ensure good performance and readability
✅ **Card hover effects** - Subtle lift animation feels polished
✅ **Sticky header** - Proper implementation, doesn't jump

#### Critical Issues

| Severity | Issue | Location | Impact |
|----------|-------|----------|--------|
| CRITICAL | Emoji placeholders instead of images | Homepage, JS-rendered posts | Destroys professional credibility |
| HIGH | mix-blend-mode makes some images nearly invisible | Category pages in light mode | Products hard to see |
| MEDIUM | Inconsistent image styling | Static vs dynamic pages | Confusing visual language |
| LOW | No favicon | All pages | Minor branding gap |

### UX Assessment

#### Navigation
✅ Clear main navigation
✅ Category pills work well
❌ No breadcrumbs on article pages
❌ No "Back to top" button on long articles
❌ Search exists but is not prominent

#### Information Architecture
✅ Logical category groupings
❌ 44 articles but no curated starting point
❌ No "Most Popular" or "Editor's Picks"
❌ Related articles at bottom of posts need better curation

#### User Flows
**Task: Find the right multimeter for home use**
1. Land on homepage → See emoji cards (confusing) → Click "Browse Articles"
2. Go to All Posts → 44 articles, overwhelmed → Filter by Equipment Guides
3. Find "Practical Guide to Choosing the Right Digital Multimeter" → Good content!
4. Want to buy → Click Shop link → Goes to external Kinmo site

**Pain Points Identified:**
- Step 1 is broken due to emoji bug
- Step 2 has too much cognitive load
- No clear recommendation or CTA at end of articles

### Technical QA Findings

#### JavaScript Console
```
⚠️ 404 - /content/posts.json (if not present)
⚠️ 404 - /content/categories.json (if not present)
```
The JS tries to fetch JSON files that may not exist, falling back silently.

#### Image Loading Issues
1. `mix-blend-mode: multiply` makes white-background images work on dark backgrounds but can cause issues in light mode
2. `onerror` handlers fall back to generic images when featured images are missing
3. No lazy loading indicator/skeleton for slow connections

#### Accessibility
- ✅ Semantic HTML (article, section, nav)
- ✅ Alt text on images
- ❌ No skip-to-content link
- ❌ Focus states could be more visible
- ❌ Some color contrast issues with muted text

#### Performance
- ✅ Images use loading="lazy"
- ✅ No heavy frameworks
- ❌ No image optimization (WebP)
- ❌ CSS could be minified

### Recommendations by Priority

#### P0 - Fix Immediately
1. **Fix the emoji bug in main.js** - Replace emoji placeholders with actual `<img>` tags using post.image or post.featuredImage property

#### P1 - High Priority
2. **Add curated entry points** - "Start Here" section, "Most Popular" posts
3. **Fix light mode image visibility** - Adjust mix-blend-mode for light theme
4. **Add customer testimonials** - Social proof is critical for trust

#### P2 - Medium Priority
5. **Add breadcrumbs** - Improve navigation clarity
6. **Implement skeleton loading** - Better perceived performance
7. **Add "Back to top" button** - Better UX for long articles
8. **Get professional email** - @kinmo.com or @unit-philippines.com

#### P3 - Nice to Have
9. **Add favicon** - Brand consistency
10. **Implement search suggestions** - Help users find content faster
11. **Add price ranges in articles** - Help with purchase decisions
12. **Create comparison tables** - Visual decision aids

---

## JOINT RECOMMENDATIONS

### Rico & Sarah Agree On:

1. **The emoji bug is killing credibility** - Both agree this is the #1 issue
2. **Content quality is actually good** - The articles are informative and well-written
3. **Trust signals need work** - Gmail address, no testimonials, no certifications displayed
4. **Navigation needs a starting point** - New visitors are overwhelmed by 44 articles

### Where They Differ:

| Aspect | Rico's View | Sarah's View |
|--------|-------------|--------------|
| Dark mode | "Maganda, easy on eyes" | "Good but light mode has contrast issues" |
| Article length | "Okay lang, detailed" | "Could use better visual breaks" |
| Categories | "Organized naman" | "Need better hierarchy/sub-categories" |
| Mobile | "Works on my phone" | "Needs more testing, some tap targets small" |

---

## IMMEDIATE ACTION ITEMS

### Bug Fix Required - main.js

```javascript
// CURRENT (BROKEN):
function createPostCard(post, featured = false) {
  const iconMap = {
    'equipment-guides': '🔧',
    // ...
  };
  return `
    <article class="post-card">
      <div class="post-card-image">
        ${iconMap[post.category] || '📰'}  // <-- OUTPUTS EMOJI
      </div>
      // ...
  `;
}

// SHOULD BE:
function createPostCard(post, featured = false) {
  const defaultImages = {
    'equipment-guides': '/images/products/multimeter-ut61e.jpg',
    'safety-techniques': '/images/products/voltage-detector-ut12s.jpg',
    'professional': '/images/products/clamp-meter-ut204.jpg',
    'faqs': '/images/products/oscilloscope-utd2000.png'
  };

  const imageSrc = post.image || defaultImages[post.category] || '/images/products/multimeter-ut61e.jpg';

  return `
    <article class="post-card">
      <div class="post-card-image">
        <img src="${imageSrc}" alt="${post.title}" loading="lazy">
      </div>
      // ...
  `;
}
```

---

## FINAL SCORES

| Criteria | Rico's Score | Sarah's Score | Average |
|----------|--------------|---------------|---------|
| Visual Design | 5/10 | 6/10 | 5.5/10 |
| Content Quality | 8/10 | 8/10 | 8/10 |
| Trustworthiness | 5/10 | 6/10 | 5.5/10 |
| Usability | 6/10 | 5/10 | 5.5/10 |
| Technical Quality | 4/10 | 4/10 | 4/10 |
| **Overall** | **6/10** | **6/10** | **6/10** |

**Consensus:** The website has solid content but is undermined by the critical emoji bug and several UX issues. Fixing the image display issue alone would likely raise scores by 1-2 points. Adding proper trust signals (testimonials, professional email) would further improve credibility.

---

*Review conducted by: Customer Persona Agent (Rico) & UX/QA Reviewer Agent (Sarah)*
*Date: January 29, 2026*
