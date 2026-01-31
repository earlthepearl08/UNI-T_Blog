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

  // Setup event delegation for dynamic content (fixes memory leak)
  setupEventDelegation();

  // Show loading spinners
  showLoadingSpinners();

  await loadData();
  renderCategories();
  renderFeaturedPosts();
  renderPosts();
  setupSearch();
});

// Show loading spinners in content containers
function showLoadingSpinners() {
  const spinnerHTML = `
    <div class="loading-overlay">
      <div class="spinner"></div>
    </div>
  `;

  const featuredContainer = document.getElementById('featuredPosts');
  const allPostsContainer = document.getElementById('allPosts');

  if (featuredContainer && !allPosts.length) {
    featuredContainer.innerHTML = spinnerHTML;
  }
  if (allPostsContainer && !allPosts.length) {
    allPostsContainer.innerHTML = spinnerHTML;
  }
}

// Setup event delegation to prevent memory leaks
function setupEventDelegation() {
  // Category pills - delegate to container
  const categoriesContainer = document.getElementById('categories');
  if (categoriesContainer) {
    categoriesContainer.addEventListener('click', (e) => {
      const pill = e.target.closest('.category-pill');
      if (!pill) return;

      e.preventDefault();
      currentCategory = pill.dataset.category;
      currentPage = 1;

      categoriesContainer.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      renderPosts();
    });
  }

  // Pagination - delegate to container
  const paginationContainer = document.getElementById('pagination');
  if (paginationContainer) {
    paginationContainer.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-page]');
      if (!link) return;

      e.preventDefault();
      currentPage = parseInt(link.dataset.page);
      renderPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Load posts and categories data with proper error handling
async function loadData() {
  try {
    const [postsRes, categoriesRes] = await Promise.all([
      fetch('/content/posts.json'),
      fetch('/content/categories.json')
    ]);

    // Check HTTP status codes
    if (!postsRes.ok) {
      throw new Error(`Failed to load posts: ${postsRes.status} ${postsRes.statusText}`);
    }
    if (!categoriesRes.ok) {
      throw new Error(`Failed to load categories: ${categoriesRes.status} ${categoriesRes.statusText}`);
    }

    allPosts = await postsRes.json();
    categories = await categoriesRes.json();

    // Validate data loaded correctly
    if (!Array.isArray(allPosts) || allPosts.length === 0) {
      console.warn('Posts data is empty or invalid');
    }
    if (!categories || Object.keys(categories).length === 0) {
      console.warn('Categories data is empty or invalid');
    }

  } catch (error) {
    console.error('Error loading data:', error);

    // Show user-friendly error message
    const errorContainer = document.getElementById('allPosts') || document.getElementById('featuredPosts');
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="error-message" style="text-align: center; padding: 2rem; color: var(--uni-red);">
          <p>Unable to load content. Please refresh the page or try again later.</p>
          <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">Refresh Page</button>
        </div>
      `;
    }
  }
}

// Render category pills (no longer adds event listeners - uses delegation)
function renderCategories() {
  const container = document.getElementById('categories');
  if (!container) return;

  // Don't render if no data loaded
  if (!categories || Object.keys(categories).length === 0) return;

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
}

// Render featured posts
function renderFeaturedPosts() {
  const container = document.getElementById('featuredPosts');
  if (!container) return;

  // Don't render if no data loaded
  if (!allPosts || allPosts.length === 0) return;

  // Show all featured posts (up to 4)
  const featured = allPosts.filter(p => p.featured).slice(0, 4);

  if (featured.length === 0) return;

  container.innerHTML = featured.map(post => createPostCard(post, true)).join('');
}

// Render posts with filtering and pagination
function renderPosts() {
  const container = document.getElementById('allPosts');
  if (!container) return;

  // Don't render if no data loaded
  if (!allPosts || allPosts.length === 0) return;

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

  // Escape HTML in title to prevent XSS
  const safeTitle = post.title.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
    <article class="post-card">
      <div class="post-card-image">
        <img src="${imageSrc}" alt="${safeTitle}" loading="lazy" onerror="this.src='/images/products/multimeter-ut61e.png'">
      </div>
      <div class="post-card-content">
        <span class="post-card-category">${post.categoryName}</span>
        ${featured ? '<span class="featured-badge">Featured</span>' : ''}
        <h3 class="post-card-title">
          <a href="/posts/${post.slug}.html">${safeTitle}</a>
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
  if (!excerpt) return '';
  return excerpt
    .replace(/Meta Title:.*?(?=\s|$)/gi, '')
    .replace(/Meta Description:.*?(?=\s|$)/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .substring(0, 150) + '...';
}

// Render pagination (no longer adds event listeners - uses delegation)
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
}

// Setup search
function setupSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = e.target.value.trim();
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
    showToast('Link copied to clipboard!');
  });
}

// Toast notification
function showToast(message) {
  // Remove existing toast if any
  const existingToast = document.querySelector('.toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  // Show toast
  setTimeout(() => toast.classList.add('show'), 10);

  // Hide and remove toast after 2.5 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
