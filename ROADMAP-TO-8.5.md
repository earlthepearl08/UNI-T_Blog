# Roadmap to 8.5/10: UNI-T Philippines Website

**Current Score:** 6/10
**Target Score:** 8.5/10
**Gap:** 2.5 points to gain

---

## AGENT REVIEWS

### Rico Santos (Customer Persona) - Full Walkthrough

**First Visit Experience:**

"Pagka-open ko ng website, maganda yung first impression. Yung hero section with the product grid - professional tignan. Pero nung nag-scroll ako pababa sa 'Latest Articles'... ay emoji na lang yung images? 🔧 Akala ko nag-bug yung browser ko."

**Page-by-Page Review:**

#### Homepage
| Element | Rico's Rating | Comment |
|---------|---------------|---------|
| Hero Section | 8/10 | "Solid! Mukhang legit na company" |
| Product Grid | 7/10 | "Maganda pero hindi ko alam kung clickable ba" |
| Featured Articles | 7/10 | "May proper images, helpful articles" |
| Latest Articles | 4/10 | "EMOJI LANG?! Hindi professional" |
| CTA Section | 7/10 | "Clear call to action, pero boring design" |
| Footer | 6/10 | "May contact info, pero Gmail pa rin??" |

#### All Posts Page (/posts/)
| Element | Rico's Rating | Comment |
|---------|---------------|---------|
| Category Pills | 7/10 | "Easy to filter, intuitive" |
| Article Cards | 7/10 | "Maganda na may proper images" |
| Search | 5/10 | "Works pero walang suggestions" |
| Pagination | N/A | "Hindi ko nakita? Endless scroll ba?" |

#### Individual Articles
| Element | Rico's Rating | Comment |
|---------|---------------|---------|
| Content Quality | 9/10 | "Super helpful! Finally may clear explanation" |
| Featured Image | 6/10 | "Small lang, sana mas malaki" |
| Related Articles | 6/10 | "Sometimes same image sa tatlong cards" |
| Share Buttons | 5/10 | "Old school pero okay" |
| No Author Info | 4/10 | "Sino sumulat nito? Credible ba?" |

#### Contact Page
| Element | Rico's Rating | Comment |
|---------|---------------|---------|
| Contact Info | 8/10 | "Complete! May mobile, landline, address" |
| Map | 7/10 | "Helpful for those visiting" |
| Gmail Address | 3/10 | "Bakit hindi @kinmo.com? Sketchy" |
| Business Hours | 8/10 | "Good to know!" |

**Rico's Top Wishlist:**
1. "Fix yung emoji images - PLEASE! Non-negotiable"
2. "Lagyan ng customer reviews - gusto kong makita kung satisfied ba yung iba"
3. "Add price range sa articles - kahit estimate lang"
4. "More beginner-friendly content - 'Start Here' section"
5. "Professional email address"

---

### Sarah Chen (UX/QA Reviewer) - Technical Assessment

#### Critical Bugs (Must Fix)

| ID | Bug | Severity | Location | Impact |
|----|-----|----------|----------|--------|
| BUG-001 | Emojis instead of images | CRITICAL | js/main.js:144-156 | Destroys credibility |
| BUG-002 | Missing /content/*.json files | HIGH | js/main.js:51-56 | JS falls back silently |
| BUG-003 | onerror image fallbacks | MEDIUM | index.html:153 | Hacky, unreliable |
| BUG-004 | No favicon | LOW | All pages | Minor branding gap |

#### UX Issues

| ID | Issue | Severity | Recommendation |
|----|-------|----------|----------------|
| UX-001 | 44 articles, no starting point | HIGH | Add "Start Here" or "Popular" section |
| UX-002 | No breadcrumbs | MEDIUM | Add breadcrumb navigation |
| UX-003 | No "Back to top" button | MEDIUM | Add floating back-to-top |
| UX-004 | Search has no suggestions | MEDIUM | Add autocomplete |
| UX-005 | No loading indicators | LOW | Add skeleton loading |

#### Design Issues

| ID | Issue | Severity | Recommendation |
|----|-------|----------|----------------|
| DES-001 | mix-blend-mode issues in light mode | MEDIUM | Adjust for theme |
| DES-002 | CTA section is plain | LOW | Add subtle pattern/texture |
| DES-003 | No custom favicon | LOW | Create branded favicon |
| DES-004 | Article images too small | LOW | Increase featured image size |

#### Trust & Credibility Issues

| ID | Issue | Severity | Recommendation |
|----|-------|----------|----------------|
| TRUST-001 | Gmail email address | HIGH | Get @kinmo.com email |
| TRUST-002 | No customer testimonials | HIGH | Add testimonial section |
| TRUST-003 | No author bylines | MEDIUM | Add author info to articles |
| TRUST-004 | No certifications displayed | MEDIUM | Show UNI-T partnership badge |
| TRUST-005 | No "Trusted By" logos | LOW | Add institutional clients |

---

## SCORING BREAKDOWN

### Current Scores (6/10 Overall)

| Category | Current | Target | Gap |
|----------|---------|--------|-----|
| Visual Design | 5.5/10 | 8.5/10 | +3.0 |
| Content Quality | 8/10 | 9/10 | +1.0 |
| Trustworthiness | 5.5/10 | 8.5/10 | +3.0 |
| Usability | 5.5/10 | 8.5/10 | +3.0 |
| Technical Quality | 4/10 | 8/10 | +4.0 |
| **Average** | **6/10** | **8.5/10** | **+2.5** |

---

## IMPROVEMENT ROADMAP

### Phase 1: Critical Fixes (0 → 7/10)
**Impact: +1.0 points**

#### 1.1 Fix Emoji Bug in main.js [CRITICAL]
```javascript
// Replace emoji iconMap with actual images
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
      ...
  `;
}
```

#### 1.2 Add Favicon
```html
<link rel="icon" type="image/svg+xml" href="/images/brand/favicon.svg">
<link rel="apple-touch-icon" href="/images/brand/apple-touch-icon.png">
```

#### 1.3 Fix onerror Fallbacks
- Create proper `/images/featured/` directory
- Add graceful image placeholders

---

### Phase 2: Trust Building (7/10 → 7.5/10)
**Impact: +0.5 points**

#### 2.1 Add Testimonials Section to Homepage
```html
<section class="testimonials">
  <div class="container">
    <h2>What Our Customers Say</h2>
    <div class="testimonials-grid">
      <div class="testimonial-card">
        <p>"Finally found a reliable source for UNI-T products..."</p>
        <div class="testimonial-author">
          <strong>Engr. Juan dela Cruz</strong>
          <span>Industrial Electrician, Laguna</span>
        </div>
      </div>
      <!-- More testimonials -->
    </div>
  </div>
</section>
```

#### 2.2 Add Author Bylines to Articles
```html
<div class="post-author">
  <img src="/images/authors/kinmo-team.jpg" alt="Kinmo Technical Team">
  <div>
    <strong>Kinmo Technical Team</strong>
    <span>UNI-T Product Specialists</span>
  </div>
</div>
```

#### 2.3 Display Certifications/Partnership
- Add UNI-T Official Distributor badge (more prominent)
- Show ISO certification if available
- Add "Trusted By" section with institutional clients

---

### Phase 3: UX Improvements (7.5/10 → 8/10)
**Impact: +0.5 points**

#### 3.1 Add "Start Here" Section for New Visitors
```html
<section class="start-here">
  <div class="container">
    <h2>New to Test Instruments?</h2>
    <p>Start with these beginner-friendly guides:</p>
    <div class="start-here-cards">
      <a href="..." class="start-card">
        <span class="start-number">1</span>
        <h3>Choosing Your First Multimeter</h3>
      </a>
      <!-- 2-3 more cards -->
    </div>
  </div>
</section>
```

#### 3.2 Add Breadcrumbs to Article Pages
```html
<nav class="breadcrumbs">
  <a href="/">Home</a> /
  <a href="/categories/equipment-guides/">Equipment Guides</a> /
  <span>Current Article Title</span>
</nav>
```

#### 3.3 Add "Back to Top" Button
```html
<button id="backToTop" class="back-to-top" aria-label="Back to top">
  <svg>...</svg>
</button>
```

#### 3.4 Improve Search with Suggestions
- Add search autocomplete
- Show "No results" state with suggestions
- Add recent searches

---

### Phase 4: Visual Polish (8/10 → 8.5/10)
**Impact: +0.5 points**

#### 4.1 Improve CTA Section Design
```css
.cta-section {
  background: linear-gradient(135deg, var(--uni-black) 0%, #2d1a1a 100%);
  position: relative;
}
.cta-section::before {
  content: '';
  position: absolute;
  /* Add subtle pattern overlay */
}
```

#### 4.2 Enhance Article Featured Images
- Increase size from 300px to 400px height
- Add subtle shadow/glow effect
- Ensure consistent aspect ratios

#### 4.3 Add Micro-Interactions
- Button hover animations
- Card entrance animations (subtle)
- Smooth scroll behavior

#### 4.4 Fix Light Mode Image Contrast
```css
[data-theme="light"] .post-card-image {
  background: linear-gradient(145deg, #f5f5f5 0%, #e8e8e8 100%);
}
[data-theme="light"] .post-card-image img {
  mix-blend-mode: normal;
  filter: none;
}
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Critical (Must Complete)
- [ ] Fix emoji bug in js/main.js
- [ ] Create and add favicon
- [ ] Create /images/featured/ directory with proper images
- [ ] Remove hacky onerror fallbacks

### Phase 2: Trust Building
- [ ] Add testimonials section to homepage
- [ ] Add author bylines to all articles
- [ ] Make distributor badge more prominent
- [ ] Consider professional email (future)

### Phase 3: UX Improvements
- [ ] Add "Start Here" section
- [ ] Add breadcrumbs to article pages
- [ ] Add "Back to Top" button
- [ ] Improve search functionality

### Phase 4: Visual Polish
- [ ] Enhance CTA section design
- [ ] Improve article featured images
- [ ] Add subtle animations
- [ ] Fix light mode image issues

---

## EXPECTED OUTCOME

### After Phase 1
- **Score: 7/10**
- Images display correctly
- Professional appearance restored

### After Phase 2
- **Score: 7.5/10**
- Increased trust signals
- Content feels authoritative

### After Phase 3
- **Score: 8/10**
- Better user navigation
- Improved findability

### After Phase 4
- **Score: 8.5/10**
- Polished, premium feel
- Competitive with industry leaders

---

## QUICK WINS (Implement Today)

1. **Fix main.js emoji bug** → Instant +0.5 points
2. **Add favicon** → Instant professionalism
3. **Add testimonials placeholder** → Builds trust
4. **Add breadcrumbs** → Better navigation

---

## FINAL VERDICT

**Rico:** "Pag naayos yung images at may testimonials na, I would trust this site enough to buy. 8.5/10 achievable!"

**Sarah:** "The foundation is solid. Content is excellent. Fix the technical bugs and add proper trust signals, and this becomes a professional B2B resource site. 8.5/10 is realistic with focused effort."

---

*Document prepared by: Customer Persona Agent (Rico) & UX/QA Reviewer Agent (Sarah)*
*Date: January 29, 2026*
