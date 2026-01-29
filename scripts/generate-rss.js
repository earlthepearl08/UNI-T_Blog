const fs = require('fs');
const path = require('path');

const CONTENT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/content';
const ROOT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter';
const CATEGORIES_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/categories';

const posts = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'posts.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'categories.json'), 'utf8'));

const SITE_URL = 'https://unit-blog.vercel.app';

// Generate RSS Feed
function generateRSS() {
  const rssItems = posts.slice(0, 20).map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}.html</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}.html</guid>
      <pubDate>${new Date(post.publishDate).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt.substring(0, 200)}]]></description>
      <category>${post.categoryName}</category>
      <author>UNI-T Philippines</author>
    </item>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>UNI-T Philippines Blog</title>
    <link>${SITE_URL}</link>
    <description>Expert guides on choosing and using UNI-T test instruments for Filipino professionals.</description>
    <language>en-ph</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;
}

// Generate Sitemap
function generateSitemap() {
  const urls = [
    { loc: SITE_URL, priority: '1.0' },
    { loc: `${SITE_URL}/posts/`, priority: '0.9' },
    ...Object.keys(categories).map(cat => ({
      loc: `${SITE_URL}/categories/${cat}/`,
      priority: '0.8'
    })),
    ...posts.map(post => ({
      loc: `${SITE_URL}/posts/${post.slug}.html`,
      priority: '0.7',
      lastmod: post.publishDate
    }))
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

// Product images mapping (local images from official UNI-T sources)
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
  'default': '/images/products/multimeter-ut61e.jpg'
};

function getProductImage(post) {
  for (const tag of post.tags) {
    if (productImages[tag]) return productImages[tag];
  }
  const title = post.title.toLowerCase();
  if (title.includes('multimeter')) return productImages['multimeter'];
  if (title.includes('clamp')) return productImages['clamp-meter'];
  if (title.includes('thermal')) return productImages['thermal-imaging'];
  if (title.includes('oscilloscope')) return productImages['oscilloscope'];
  if (title.includes('insulation')) return productImages['insulation-tester'];
  if (title.includes('voltage')) return productImages['voltage-tester'];
  if (title.includes('battery')) return productImages['battery-tester'];
  if (title.includes('network') || title.includes('lan')) return productImages['network-testing'];
  if (title.includes('environmental')) return productImages['environmental'];
  return productImages['default'];
}

// Generate Category Pages
function generateCategoryPage(catSlug, catData) {
  const categoryPosts = posts.filter(p => p.category === catSlug);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${catData.name} | UNI-T Philippines</title>
  <meta name="description" content="Browse ${catData.name} articles about UNI-T test instruments.">
  <link rel="stylesheet" href="../../css/styles.css">
</head>
<body>
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

  <section class="hero" style="padding: 3rem 0;">
    <div class="container">
      <h1><span class="hero-accent">${catData.name}</span></h1>
      <p class="subtitle">${categoryPosts.length} expert articles in this category</p>
    </div>
  </section>
  <div class="accent-bar"></div>

  <section class="container">
    <div class="categories">
      <a href="/posts/" class="category-pill">All Posts</a>
      ${Object.entries(categories).map(([slug, cat]) => `
        <a href="/categories/${slug}/" class="category-pill ${slug === catSlug ? 'active' : ''}">${cat.name}</a>
      `).join('')}
    </div>

    <div class="posts-grid">
      ${categoryPosts.map(post => `
      <article class="post-card">
        <div class="post-card-image">
          <img src="${getProductImage(post)}" alt="${post.title}" loading="lazy">
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
      `).join('')}
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <a href="/" class="logo"><span class="logo-accent">UNI-T</span> Philippines</a>
          <p>Your trusted source for professional test instruments.</p>
        </div>
        <div class="footer-section">
          <h4>Categories</h4>
          <ul>
            <li><a href="/categories/equipment-guides/">Equipment Guides</a></li>
            <li><a href="/categories/safety-techniques/">Safety & Techniques</a></li>
            <li><a href="/categories/professional/">Professional</a></li>
            <li><a href="/categories/faqs/">FAQs</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
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

// Create directories and files
console.log('Generating RSS, Sitemap, and Category pages...\n');

// RSS Feed
const rss = generateRSS();
fs.writeFileSync(path.join(ROOT_DIR, 'rss.xml'), rss);
console.log('✓ Generated rss.xml');

// Sitemap
const sitemap = generateSitemap();
fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemap);
console.log('✓ Generated sitemap.xml');

// Category pages
Object.entries(categories).forEach(([slug, cat]) => {
  const catDir = path.join(CATEGORIES_DIR, slug);
  if (!fs.existsSync(catDir)) {
    fs.mkdirSync(catDir, { recursive: true });
  }
  const html = generateCategoryPage(slug, cat);
  fs.writeFileSync(path.join(catDir, 'index.html'), html);
  console.log(`✓ Generated categories/${slug}/index.html`);
});

console.log('\n✓ All files generated successfully!');
