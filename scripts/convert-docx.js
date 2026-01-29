const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

const DOCS_ROOT = '/Users/kinmopw/Desktop/Uni-T Documents';
const OUTPUT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/content';

// Batch folder mappings with categories
const BATCHES = [
  { folder: 'Batch 1', category: 'equipment-guides', categoryName: 'Equipment Guides' },
  { folder: 'Batch 2 & 3', category: 'safety-techniques', categoryName: 'Safety & Techniques' },
  { folder: 'Batch 4', category: 'professional', categoryName: 'Professional Development' },
  { folder: 'Batch 5', category: 'faqs', categoryName: 'FAQs' }
];

// Generate URL-friendly slug from title
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

// Extract first paragraph as excerpt
function extractExcerpt(html, maxLength = 200) {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i);
  if (match) {
    const text = match[1].replace(/<[^>]*>/g, '').trim();
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
  return '';
}

// Get estimated reading time
function getReadingTime(html) {
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200); // 200 words per minute
}

// Determine content type and tags based on title
function getTags(title) {
  const tags = [];
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes('multimeter') || lowerTitle.includes('dmm')) tags.push('multimeter');
  if (lowerTitle.includes('clamp')) tags.push('clamp-meter');
  if (lowerTitle.includes('thermal') || lowerTitle.includes('infrared')) tags.push('thermal-imaging');
  if (lowerTitle.includes('oscilloscope')) tags.push('oscilloscope');
  if (lowerTitle.includes('voltage')) tags.push('voltage-tester');
  if (lowerTitle.includes('insulation')) tags.push('insulation-tester');
  if (lowerTitle.includes('battery')) tags.push('battery-tester');
  if (lowerTitle.includes('hvac')) tags.push('hvac');
  if (lowerTitle.includes('safety') || lowerTitle.includes('safe')) tags.push('safety');
  if (lowerTitle.includes('beginner') || lowerTitle.includes('guide') || lowerTitle.includes('how to')) tags.push('guide');
  if (lowerTitle.includes('faq')) tags.push('faq');
  if (lowerTitle.includes('calibration')) tags.push('calibration');
  if (lowerTitle.includes('network') || lowerTitle.includes('lan')) tags.push('network-testing');
  if (lowerTitle.includes('automotive')) tags.push('automotive');
  if (lowerTitle.includes('environmental')) tags.push('environmental');

  return tags.length > 0 ? tags : ['general'];
}

async function convertDocx(filePath, category, categoryName, index) {
  try {
    const result = await mammoth.convertToHtml({ path: filePath });
    const html = result.value;

    // Extract title from filename (remove .docx extension)
    const filename = path.basename(filePath, '.docx');
    // Clean up title (remove underscores that might represent colons)
    const title = filename.replace(/_/g, ':').replace(/:/g, ': ').replace(/  /g, ' ').trim();

    const slug = slugify(filename);
    const excerpt = extractExcerpt(html);
    const readingTime = getReadingTime(html);
    const tags = getTags(title);

    // Get file stats for date
    const stats = fs.statSync(filePath);
    const publishDate = stats.mtime.toISOString().split('T')[0];

    return {
      id: index,
      title: title,
      slug: slug,
      category: category,
      categoryName: categoryName,
      tags: tags,
      excerpt: excerpt,
      content: html,
      readingTime: readingTime,
      publishDate: publishDate,
      author: 'UNI-T Philippines',
      featured: index < 5, // First 5 posts are featured
      status: 'draft'
    };
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
    return null;
  }
}

async function processAllBatches() {
  const allPosts = [];
  let globalIndex = 1;

  for (const batch of BATCHES) {
    const batchPath = path.join(DOCS_ROOT, batch.folder);

    if (!fs.existsSync(batchPath)) {
      console.log(`Skipping ${batch.folder} - folder not found`);
      continue;
    }

    const files = fs.readdirSync(batchPath)
      .filter(f => f.endsWith('.docx') && !f.startsWith('~'))
      .sort();

    console.log(`\nProcessing ${batch.folder} (${files.length} files)...`);

    for (const file of files) {
      const filePath = path.join(batchPath, file);
      console.log(`  Converting: ${file}`);

      const post = await convertDocx(filePath, batch.category, batch.categoryName, globalIndex);
      if (post) {
        allPosts.push(post);
        globalIndex++;
      }
    }
  }

  return allPosts;
}

async function main() {
  console.log('=== UNI-T Content Converter ===\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Process all documents
  const posts = await processAllBatches();

  // Save main posts.json
  const postsPath = path.join(OUTPUT_DIR, 'posts.json');
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`\n✓ Saved ${posts.length} posts to ${postsPath}`);

  // Create category index
  const categories = {};
  posts.forEach(post => {
    if (!categories[post.category]) {
      categories[post.category] = {
        slug: post.category,
        name: post.categoryName,
        count: 0,
        posts: []
      };
    }
    categories[post.category].count++;
    categories[post.category].posts.push(post.id);
  });

  const categoriesPath = path.join(OUTPUT_DIR, 'categories.json');
  fs.writeFileSync(categoriesPath, JSON.stringify(categories, null, 2));
  console.log(`✓ Saved categories to ${categoriesPath}`);

  // Create tags index
  const tags = {};
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (!tags[tag]) {
        tags[tag] = { name: tag, count: 0, posts: [] };
      }
      tags[tag].count++;
      tags[tag].posts.push(post.id);
    });
  });

  const tagsPath = path.join(OUTPUT_DIR, 'tags.json');
  fs.writeFileSync(tagsPath, JSON.stringify(tags, null, 2));
  console.log(`✓ Saved tags to ${tagsPath}`);

  // Summary
  console.log('\n=== Summary ===');
  console.log(`Total posts: ${posts.length}`);
  console.log(`Categories: ${Object.keys(categories).length}`);
  console.log(`Tags: ${Object.keys(tags).length}`);

  Object.values(categories).forEach(cat => {
    console.log(`  - ${cat.name}: ${cat.count} posts`);
  });
}

main().catch(console.error);
