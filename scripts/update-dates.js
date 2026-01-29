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
