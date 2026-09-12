#!/usr/bin/env node
/* ============================================================================
 * STOP — THIS SCRIPT IS STALE AND WILL REGRESS THE LIVE SITE IF RUN AS-IS.
 * ----------------------------------------------------------------------------
 * The pages under /posts, /categories, /tools and /products have been edited by
 * hand since this generator was last used. Its templates no longer contain:
 *   - the versioned stylesheet URL (/css/styles.css?v=...)
 *   - the mobile drawer / theme-toggle markup and the FOUC guard
 *   - the safety warning and "preliminary basis only" disclaimer blocks
 *   - the footer legal links (/disclaimer.html, /privacy.html)
 *   - absolute og:image / og:url tags and RSS autodiscovery
 *   - guarded localStorage access
 * Re-running it would overwrite those pages with the older template and undo
 * the pre-release fixes.
 *
 * Before using this script again, bring its templates back in line with a
 * current page (diff against one under /posts) and re-run the checks in
 * docs/RELEASE-CHECKS.md.
 *
 * Set ALLOW_STALE_GENERATOR=1 to run anyway, deliberately.
 * ==========================================================================*/
if (!process.env.ALLOW_STALE_GENERATOR) {
  console.error('\n  Refusing to run: this generator is stale and would regress the site.');
  console.error('  Read the banner at the top of this file. Set ALLOW_STALE_GENERATOR=1 to override.\n');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/content';

// Read posts.json
const postsPath = path.join(CONTENT_DIR, 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

console.log(`Found ${posts.length} posts to update...\n`);

// Update all dates to January 2026
// Distribute posts across the month (2 posts per day starting Jan 1)
posts.forEach((post, index) => {
  const day = Math.floor(index / 2) + 1; // 2 posts per day
  const dayStr = day.toString().padStart(2, '0');
  const newDate = `2026-01-${dayStr}`;

  console.log(`${post.slug}: ${post.publishDate} → ${newDate}`);
  post.publishDate = newDate;
});

// Save updated posts.json
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

console.log('\n✓ All dates updated to January 2026!');
console.log(`\nDate range: 2026-01-01 to 2026-01-${Math.ceil(posts.length / 2).toString().padStart(2, '0')}`);
