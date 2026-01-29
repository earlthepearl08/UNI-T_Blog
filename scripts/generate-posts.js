const fs = require('fs');
const path = require('path');

const CONTENT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/content';
const POSTS_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/posts';

// Read posts data
const posts = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'posts.json'), 'utf8'));

// Ensure posts directory exists
if (!fs.existsSync(POSTS_DIR)) {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
}

// UNI-T Product images mapping based on post tags/content (local images from official UNI-T sources)
const productImages = {
  'multimeter': '/images/products/multimeter-ut61e.jpg',
  'clamp-meter': '/images/products/clamp-meter-ut204.jpg',
  'thermal-imaging': '/images/products/thermal-imager-uti260b.jpg',
  'oscilloscope': '/images/products/oscilloscope-utd2000.png',
  'insulation-tester': '/images/products/insulation-tester-ut501a.jpg',
  'voltage-tester': '/images/products/voltage-detector-ut12s.jpg',
  'battery-tester': '/images/products/battery-tester-ut673a.jpg',
  'network-testing': '/images/products/network-tester-ut681.jpg',
  'environmental': '/images/products/environmental-ut333s.jpg',
  'hvac': '/images/products/clamp-meter-ut204.jpg',
  'automotive': '/images/products/multimeter-ut61e.jpg',
  'calibration': '/images/products/multimeter-ut61e.jpg',
  'safety': '/images/products/voltage-detector-ut12s.jpg',
  'guide': '/images/products/multimeter-ut61e.jpg',
  'faq': '/images/products/multimeter-ut61e.jpg',
  'general': '/images/products/multimeter-ut61e.jpg',
  'default': '/images/products/multimeter-ut61e.jpg'
};

// Get the best matching product image for a post
function getProductImage(post) {
  for (const tag of post.tags) {
    if (productImages[tag]) {
      return productImages[tag];
    }
  }
  // Check title for keywords
  const title = post.title.toLowerCase();
  if (title.includes('multimeter') || title.includes('dmm')) return productImages['multimeter'];
  if (title.includes('clamp')) return productImages['clamp-meter'];
  if (title.includes('thermal') || title.includes('infrared')) return productImages['thermal-imaging'];
  if (title.includes('oscilloscope')) return productImages['oscilloscope'];
  if (title.includes('insulation')) return productImages['insulation-tester'];
  if (title.includes('voltage')) return productImages['voltage-tester'];
  if (title.includes('battery')) return productImages['battery-tester'];
  if (title.includes('network') || title.includes('lan') || title.includes('cable')) return productImages['network-testing'];
  if (title.includes('environmental') || title.includes('temperature') || title.includes('humidity')) return productImages['environmental'];
  if (title.includes('hvac')) return productImages['hvac'];
  if (title.includes('automotive')) return productImages['automotive'];

  return productImages['default'];
}

// Post page template
function generatePostPage(post, allPosts) {
  // Find related posts (same category, excluding current)
  const related = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  // Clean the content - remove any meta title/description from beginning
  let cleanContent = post.content
    .replace(/<p><strong>Meta Title:?<\/strong>.*?<\/p>/gi, '')
    .replace(/<p><strong>Meta Description:?<\/strong>.*?<\/p>/gi, '')
    .replace(/<p>Meta Title:.*?<\/p>/gi, '')
    .replace(/<p>Meta Description:.*?<\/p>/gi, '');

  const productImage = getProductImage(post);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | UNI-T Philippines</title>
  <meta name="description" content="${post.excerpt.substring(0, 155).replace(/"/g, '&quot;')}">

  <!-- Open Graph -->
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.excerpt.substring(0, 155).replace(/"/g, '&quot;')}">
  <meta property="og:type" content="article">
  <meta property="og:image" content="${productImage}">
  <meta property="og:url" content="https://unit-philippines-blog.vercel.app/posts/${post.slug}.html">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${post.title}">
  <meta name="twitter:description" content="${post.excerpt.substring(0, 155).replace(/"/g, '&quot;')}">
  <meta name="twitter:image" content="${productImage}">

  <!-- Article metadata -->
  <meta property="article:published_time" content="${post.publishDate}">
  <meta property="article:author" content="${post.author}">
  <meta property="article:section" content="${post.categoryName}">
  ${post.tags.map(t => `<meta property="article:tag" content="${t}">`).join('\n  ')}

  <link rel="stylesheet" href="../css/styles.css">
  <link rel="canonical" href="https://unit-philippines-blog.vercel.app/posts/${post.slug}.html">
</head>
<body>
  <!-- Header -->
  <header class="header">
    <div class="container">
      <a href="/" class="logo">
        <span class="logo-accent">UNI-T</span> Philippines
      </a>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/posts/">All Posts</a>
        <a href="/categories/equipment-guides/">Guides</a>
        <a href="/categories/faqs/">FAQs</a>
        <a href="/contact.html">Contact</a>
        <a href="https://kinmo.com" target="_blank">Shop</a>
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </nav>
    </div>
  </header>

  <!-- Post Header -->
  <section class="post-header">
    <div class="content-container">
      <a href="/categories/${post.category}/" class="category">${post.categoryName}</a>
      <h1>${post.title}</h1>
      <div class="post-meta">
        <span>By ${post.author}</span>
        <span>${post.publishDate}</span>
        <span>${post.readingTime} min read</span>
      </div>
    </div>
  </section>
  <div class="accent-bar"></div>

  <!-- Featured Image -->
  <div class="post-featured-image">
    <img src="${productImage}" alt="${post.title}" loading="lazy">
  </div>

  <!-- Post Content -->
  <article class="post-content">
    <div class="content-container">
      ${cleanContent}
    </div>
  </article>

  <!-- Share Section - No emojis, professional -->
  <section class="share-section">
    <div class="content-container">
      <h4>Share This Article</h4>
      <div class="share-buttons">
        <a href="javascript:void(0)" onclick="shareOnFacebook()" class="share-btn facebook">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          Facebook
        </a>
        <a href="javascript:void(0)" onclick="shareOnTwitter()" class="share-btn twitter">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          Twitter
        </a>
        <a href="javascript:void(0)" onclick="shareOnLinkedIn()" class="share-btn linkedin">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>
        <a href="javascript:void(0)" onclick="copyLink()" class="share-btn copy">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
          Copy Link
        </a>
      </div>
    </div>
  </section>

  <!-- Tags -->
  <section class="content-container mb-4">
    <div class="tags">
      ${post.tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
  </section>

  <!-- Related Posts -->
  ${related.length > 0 ? `
  <section class="related-posts">
    <div class="container">
      <h2>Related Articles</h2>
      <div class="posts-grid">
        ${related.map(r => `
        <article class="post-card">
          <div class="post-card-image">
            <img src="${getProductImage(r)}" alt="${r.title}" loading="lazy">
          </div>
          <div class="post-card-content">
            <span class="post-card-category">${r.categoryName}</span>
            <h3 class="post-card-title">
              <a href="/posts/${r.slug}.html">${r.title}</a>
            </h3>
            <div class="post-card-meta">
              <span>${r.publishDate}</span>
              <span>${r.readingTime} min read</span>
            </div>
          </div>
        </article>
        `).join('')}
      </div>
    </div>
  </section>
  ` : ''}

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <a href="/" class="logo">
            <span class="logo-accent">UNI-T</span> Philippines
          </a>
          <p>Your trusted source for professional test instruments. Expert guides and resources for Filipino technicians, engineers, and institutions.</p>
        </div>
        <div class="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="/categories/equipment-guides/">Equipment Guides</a></li>
            <li><a href="/categories/safety-techniques/">Safety & Techniques</a></li>
            <li><a href="/categories/professional/">Professional Development</a></li>
            <li><a href="/categories/faqs/">FAQs</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/posts/">All Articles</a></li>
            <li><a href="/contact.html">Contact Us</a></li>
            <li><a href="https://kinmo.com" target="_blank">Kinmo Store</a></li>
            <li><a href="/rss.xml">RSS Feed</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+639778407799">+63 977 840 7799</a></li>
            <li><a href="tel:+639167050208">+63 916 705 0208</a></li>
            <li><a href="mailto:e2shop.kinmo@gmail.com">e2shop.kinmo@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 UNI-T Philippines. Distributed by Kinmo PW Corporation. All rights reserved.</p>
      </div>
    </div>
  </footer>

  <script>
    // Theme toggle
    function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Share functions
    function shareOnFacebook() {
      const url = encodeURIComponent(window.location.href);
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank', 'width=600,height=400');
    }
    function shareOnTwitter() {
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      window.open('https://twitter.com/intent/tweet?url=' + url + '&text=' + title, '_blank', 'width=600,height=400');
    }
    function shareOnLinkedIn() {
      const url = encodeURIComponent(window.location.href);
      window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + url, '_blank', 'width=600,height=400');
    }
    function copyLink() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  </script>
</body>
</html>`;
}

// Generate posts index page
function generatePostsIndex() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>All Articles | UNI-T Philippines</title>
  <meta name="description" content="Browse all articles about UNI-T test instruments, guides, and tutorials.">
  <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
  <header class="header">
    <div class="container">
      <a href="/" class="logo">
        <span class="logo-accent">UNI-T</span> Philippines
      </a>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/posts/" class="active">All Posts</a>
        <a href="/categories/equipment-guides/">Guides</a>
        <a href="/categories/faqs/">FAQs</a>
        <a href="/contact.html">Contact</a>
        <a href="https://kinmo.com" target="_blank">Shop</a>
        <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark mode">
          <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </nav>
    </div>
  </header>

  <section class="hero" style="padding: 3rem 0;">
    <div class="container">
      <h1>All <span class="hero-accent">Articles</span></h1>
      <p class="subtitle">${posts.length} expert guides and resources for test instrument professionals</p>
    </div>
  </section>
  <div class="accent-bar"></div>

  <section class="container">
    <div class="categories">
      <a href="/posts/" class="category-pill active">All <span class="count">${posts.length}</span></a>
      <a href="/categories/equipment-guides/" class="category-pill">Equipment Guides <span class="count">10</span></a>
      <a href="/categories/safety-techniques/" class="category-pill">Safety & Techniques <span class="count">20</span></a>
      <a href="/categories/professional/" class="category-pill">Professional <span class="count">7</span></a>
      <a href="/categories/faqs/" class="category-pill">FAQs <span class="count">7</span></a>
    </div>

    <div class="posts-grid">
      ${posts.map(post => {
        const img = getProductImage(post);
        return `
      <article class="post-card">
        <div class="post-card-image">
          <img src="${img}" alt="${post.title}" loading="lazy">
        </div>
        <div class="post-card-content">
          <span class="post-card-category">${post.categoryName}</span>
          <h3 class="post-card-title">
            <a href="/posts/${post.slug}.html">${post.title}</a>
          </h3>
          <div class="post-card-meta">
            <span>${post.publishDate}</span>
            <span>${post.readingTime} min read</span>
          </div>
        </div>
      </article>
      `;
      }).join('')}
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <a href="/" class="logo">
            <span class="logo-accent">UNI-T</span> Philippines
          </a>
          <p>Your trusted source for professional test instruments.</p>
        </div>
        <div class="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="/categories/equipment-guides/">Equipment Guides</a></li>
            <li><a href="/categories/safety-techniques/">Safety & Techniques</a></li>
            <li><a href="/categories/professional/">Professional Development</a></li>
            <li><a href="/categories/faqs/">FAQs</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/posts/">All Articles</a></li>
            <li><a href="/contact.html">Contact Us</a></li>
            <li><a href="https://kinmo.com" target="_blank">Kinmo Store</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="tel:+639778407799">+63 977 840 7799</a></li>
            <li><a href="mailto:e2shop.kinmo@gmail.com">e2shop.kinmo@gmail.com</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 UNI-T Philippines. Distributed by Kinmo PW Corporation.</p>
      </div>
    </div>
  </footer>

  <script>
    function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    }
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    }
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  </script>
</body>
</html>`;
}

// Helper for category pages
function getProductImage(post) {
  for (const tag of post.tags) {
    if (productImages[tag]) {
      return productImages[tag];
    }
  }
  const title = post.title.toLowerCase();
  if (title.includes('multimeter') || title.includes('dmm')) return productImages['multimeter'];
  if (title.includes('clamp')) return productImages['clamp-meter'];
  if (title.includes('thermal') || title.includes('infrared')) return productImages['thermal-imaging'];
  if (title.includes('oscilloscope')) return productImages['oscilloscope'];
  if (title.includes('insulation')) return productImages['insulation-tester'];
  if (title.includes('voltage')) return productImages['voltage-tester'];
  if (title.includes('battery')) return productImages['battery-tester'];
  if (title.includes('network') || title.includes('lan') || title.includes('cable')) return productImages['network-testing'];
  if (title.includes('environmental') || title.includes('temperature') || title.includes('humidity')) return productImages['environmental'];
  if (title.includes('hvac')) return productImages['hvac'];
  if (title.includes('automotive')) return productImages['automotive'];
  return productImages['default'];
}

// Generate all post pages
console.log('Generating post pages with product images...\n');

posts.forEach((post, index) => {
  const html = generatePostPage(post, posts);
  const filePath = path.join(POSTS_DIR, `${post.slug}.html`);
  fs.writeFileSync(filePath, html);
  console.log(`  [${index + 1}/${posts.length}] ${post.slug}.html`);
});

// Generate posts index
const indexHtml = generatePostsIndex();
fs.writeFileSync(path.join(POSTS_DIR, 'index.html'), indexHtml);
console.log(`\n✓ Generated posts/index.html`);

console.log(`\n✓ Successfully generated ${posts.length} post pages with product images!`);
