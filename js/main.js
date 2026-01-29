// UNI-T Blog - Main JavaScript

let allPosts = [];
let categories = {};
const POSTS_PER_PAGE = 9;
let currentPage = 1;
let currentCategory = 'all';
let searchQuery = '';

// Dark Mode Toggle
function initTheme() {
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
  // Default to light mode for new visitors - let them opt into dark mode
  // Professional test equipment sites typically use light backgrounds
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize theme immediately to prevent flash
initTheme();

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
  // Setup theme toggle button
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  await loadData();
  renderCategories();
  renderFeaturedPosts();
  renderPosts();
  setupSearch();
});

// Load posts and categories data
async function loadData() {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch('/content/posts.json'),
      fetch('/content/categories.json')
    ]);
    allPosts = await postsRes.json();
    categories = await categoriesRes.json();
  } catch (error) {
    console.error('Error loading data:', error);
    // Fallback for static hosting - data might be embedded
  }
}

// Render category pills
function renderCategories() {
  const container = document.getElementById('categories');
  if (!container) return;

  const categoryHTML = Object.values(categories).map(cat => `
    <a href="/categories/${cat.slug}/" class="category-pill" data-category="${cat.slug}">
      ${cat.name} <span class="count">${cat.count}</span>
    </a>
  `).join('');

  container.innerHTML = `
    <a href="/posts/" class="category-pill ${currentCategory === 'all' ? 'active' : ''}" data-category="all">
      All Posts <span class="count">${allPosts.length}</span>
    </a>
    ${categoryHTML}
  `;

  // Add click handlers
  container.querySelectorAll('.category-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      currentCategory = pill.dataset.category;
      currentPage = 1;

      container.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      renderPosts();
    });
  });
}

// Render featured posts
function renderFeaturedPosts() {
  const container = document.getElementById('featuredPosts');
  if (!container) return;

  const featured = allPosts.filter(p => p.featured).slice(0, 3);
  container.innerHTML = featured.map(post => createPostCard(post, true)).join('');
}

// Render posts with filtering and pagination
function renderPosts() {
  const container = document.getElementById('allPosts');
  if (!container) return;

  let filtered = allPosts;

  // Filter by category
  if (currentCategory !== 'all') {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  // Filter by search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.excerpt.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }

  // Pagination
  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const paged = filtered.slice(start, start + POSTS_PER_PAGE);

  // Render posts
  if (paged.length === 0) {
    container.innerHTML = '<p class="text-center">No posts found matching your criteria.</p>';
  } else {
    container.innerHTML = paged.map(post => createPostCard(post)).join('');
  }

  // Render pagination
  renderPagination(totalPages);
}

// Create post card HTML
function createPostCard(post, featured = false) {
  // Default images by category (transparent PNGs)
  const defaultImages = {
    'equipment-guides': '/images/products/multimeter-ut61e.png',
    'safety-techniques': '/images/products/voltage-detector-ut12s.png',
    'professional': '/images/products/clamp-meter-ut204.png',
    'faqs': '/images/products/oscilloscope-utd2000.png'
  };

  // Use post image if available, otherwise use category default
  const imageSrc = post.image || defaultImages[post.category] || '/images/products/multimeter-ut61e.png';

  return `
    <article class="post-card">
      <div class="post-card-image">
        <img src="${imageSrc}" alt="${post.title}" loading="lazy">
      </div>
      <div class="post-card-content">
        <span class="post-card-category">${post.categoryName}</span>
        ${featured ? '<span class="featured-badge">Featured</span>' : ''}
        <h3 class="post-card-title">
          <a href="/posts/${post.slug}.html">${post.title}</a>
        </h3>
        <p class="post-card-excerpt">${cleanExcerpt(post.excerpt)}</p>
        <div class="post-card-meta">
          <span>${post.publishDate}</span>
          <span class="post-card-reading-time">${post.readingTime} min read</span>
        </div>
      </div>
    </article>
  `;
}

// Clean excerpt by removing meta tags
function cleanExcerpt(excerpt) {
  return excerpt
    .replace(/Meta Title:.*?(?=\s|$)/gi, '')
    .replace(/Meta Description:.*?(?=\s|$)/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 150) + '...';
}

// Render pagination
function renderPagination(totalPages) {
  const container = document.getElementById('pagination');
  if (!container || totalPages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

  let html = '';

  if (currentPage > 1) {
    html += `<a href="#" data-page="${currentPage - 1}">&laquo; Prev</a>`;
  }

  for (let i = 1; i <= totalPages; i++) {
    if (i === currentPage) {
      html += `<span class="active">${i}</span>`;
    } else {
      html += `<a href="#" data-page="${i}">${i}</a>`;
    }
  }

  if (currentPage < totalPages) {
    html += `<a href="#" data-page="${currentPage + 1}">Next &raquo;</a>`;
  }

  container.innerHTML = html;

  // Add click handlers
  container.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = parseInt(link.dataset.page);
      renderPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

// Setup search
function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value;
      currentPage = 1;
      renderPosts();
    }, 300);
  });
}

// Share functions for post pages
function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank', 'width=600,height=400');
}

function shareOnLinkedIn() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'width=600,height=400');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    alert('Link copied to clipboard!');
  });
}
