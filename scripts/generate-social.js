const fs = require('fs');
const path = require('path');

const CONTENT_DIR = '/Users/kinmopw/Desktop/UNI-T Newsletter/content';
const posts = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'posts.json'), 'utf8'));
const calendar = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, 'calendar.json'), 'utf8'));

const SITE_URL = 'https://unit-blog.vercel.app';

// Hashtag sets
const HASHTAGS = {
  core: '#UNIT #UNITPhilippines #Kinmo #TestInstruments',
  multimeter: '#Multimeter #DigitalMultimeter #DMM #ElectricalTesting',
  clamp: '#ClampMeter #CurrentMeasurement #ACCurrent #Electrician',
  thermal: '#ThermalImaging #ThermalCamera #InfraredCamera #Thermography',
  safety: '#ElectricalSafety #SafetyFirst #WorkplaceSafety',
  philippines: '#PhilippinesElectrical #PinoyTechnician #FilipinoPro'
};

// Get relevant hashtags for a post
function getHashtags(post) {
  let tags = HASHTAGS.core;

  if (post.tags.includes('multimeter')) tags += ' ' + HASHTAGS.multimeter;
  if (post.tags.includes('clamp-meter')) tags += ' ' + HASHTAGS.clamp;
  if (post.tags.includes('thermal-imaging')) tags += ' ' + HASHTAGS.thermal;
  if (post.tags.includes('safety')) tags += ' ' + HASHTAGS.safety;

  tags += ' ' + HASHTAGS.philippines;
  return tags;
}

// Extract key points from content
function extractKeyPoints(content, count = 3) {
  // Find list items or key sentences
  const listMatches = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
  const points = listMatches
    .map(li => li.replace(/<[^>]*>/g, '').trim())
    .filter(p => p.length > 20 && p.length < 150)
    .slice(0, count);

  if (points.length < count) {
    // Add from paragraphs
    const pMatches = content.match(/<p[^>]*>(.*?)<\/p>/gi) || [];
    pMatches.forEach(p => {
      if (points.length >= count) return;
      const text = p.replace(/<[^>]*>/g, '').trim();
      if (text.length > 40 && text.length < 150 && !text.includes('Meta')) {
        points.push(text);
      }
    });
  }

  return points.slice(0, count);
}

// Generate social post for each platform
function generateSocialPosts(post) {
  const url = `${SITE_URL}/posts/${post.slug}.html`;
  const hashtags = getHashtags(post);
  const keyPoints = extractKeyPoints(post.content);

  // Clean title
  const title = post.title.replace(/[_:]/g, ' - ').replace(/\s+/g, ' ').trim();

  return {
    id: post.id,
    title: title,
    category: post.categoryName,
    url: url,

    // Facebook - longer format
    facebook: {
      text: `📘 NEW ARTICLE: ${title}

${keyPoints.length > 0 ? '🔑 Key Takeaways:\n' + keyPoints.map((p, i) => `${i + 1}. ${p}`).join('\n') : ''}

👉 Read the full guide: ${url}

${hashtags}`,
      imageNote: 'Use 1200x630px featured image'
    },

    // Instagram - visual focus
    instagram: {
      caption: `${title} 🔧⚡

${keyPoints.length > 0 ? keyPoints.map(p => `✅ ${p}`).join('\n\n') : ''}

🔗 Link in bio for the full guide!

${hashtags}`,
      imageNote: 'Create 1080x1080px carousel with key points',
      carouselSlides: [
        `Slide 1: Title card - "${title}"`,
        ...keyPoints.map((p, i) => `Slide ${i + 2}: "${p}"`),
        `Final Slide: CTA - "Read more at unit-blog.vercel.app"`
      ]
    },

    // LinkedIn - professional tone
    linkedin: {
      text: `${title}

For professionals working with electrical test instruments, understanding the right tools for the job is essential.

${keyPoints.length > 0 ? 'Key insights from this guide:\n\n' + keyPoints.map(p => `• ${p}`).join('\n') : ''}

Read the full article: ${url}

#Electrician #Engineering #TestEquipment #ProfessionalDevelopment #Philippines`,
      imageNote: 'Use 1200x627px professional image'
    },

    // Twitter/X - concise
    twitter: {
      text: `🔧 ${title.substring(0, 100)}${title.length > 100 ? '...' : ''}

${keyPoints[0] ? '💡 ' + keyPoints[0].substring(0, 100) : ''}

Read more 👇
${url}

#UNIT #TestInstruments`,
      thread: [
        `🧵 Thread: ${title}`,
        ...keyPoints.map((p, i) => `${i + 1}/ ${p}`),
        `Read the full guide: ${url}\n\n#UNIT #Kinmo #Philippines`
      ]
    }
  };
}

// Generate CSV format for Buffer/Hootsuite import
function generateCSV(socialPosts) {
  const rows = [
    ['Day', 'Post ID', 'Title', 'Platform', 'Content', 'URL', 'Status']
  ];

  // Flatten calendar schedule
  calendar.schedule.forEach(week => {
    week.posts.forEach(scheduleItem => {
      const social = socialPosts.find(s => s.id === scheduleItem.postId);
      if (!social) return;

      // Facebook
      rows.push([
        scheduleItem.day,
        scheduleItem.postId,
        social.title,
        'Facebook',
        social.facebook.text.replace(/\n/g, ' | '),
        social.url,
        'Draft'
      ]);

      // Instagram
      rows.push([
        scheduleItem.day,
        scheduleItem.postId,
        social.title,
        'Instagram',
        social.instagram.caption.replace(/\n/g, ' | '),
        social.url,
        'Draft'
      ]);

      // LinkedIn
      rows.push([
        scheduleItem.day,
        scheduleItem.postId,
        social.title,
        'LinkedIn',
        social.linkedin.text.replace(/\n/g, ' | '),
        social.url,
        'Draft'
      ]);

      // Twitter
      rows.push([
        scheduleItem.day,
        scheduleItem.postId,
        social.title,
        'Twitter/X',
        social.twitter.text.replace(/\n/g, ' | '),
        social.url,
        'Draft'
      ]);
    });
  });

  return rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
}

// Main execution
console.log('Generating social media content bank...\n');

// Generate social posts for all blog posts
const socialPosts = posts.map(generateSocialPosts);

// Save as JSON (full detail)
fs.writeFileSync(
  path.join(CONTENT_DIR, 'social-posts.json'),
  JSON.stringify(socialPosts, null, 2)
);
console.log('✓ Generated social-posts.json (full detail)');

// Save as CSV (for import to schedulers)
const csv = generateCSV(socialPosts);
fs.writeFileSync(path.join(CONTENT_DIR, 'social-posts.csv'), csv);
console.log('✓ Generated social-posts.csv (for Buffer/Hootsuite import)');

// Generate a readable markdown version
let markdown = `# UNI-T Social Media Content Bank

Generated: ${new Date().toISOString().split('T')[0]}
Total Posts: ${socialPosts.length}

---

`;

socialPosts.forEach((social, index) => {
  markdown += `## ${index + 1}. ${social.title}

**Category:** ${social.category}
**URL:** ${social.url}

### Facebook
\`\`\`
${social.facebook.text}
\`\`\`

### Instagram Caption
\`\`\`
${social.instagram.caption}
\`\`\`

**Carousel Slides:**
${social.instagram.carouselSlides.map(s => `- ${s}`).join('\n')}

### LinkedIn
\`\`\`
${social.linkedin.text}
\`\`\`

### Twitter/X
\`\`\`
${social.twitter.text}
\`\`\`

**Thread:**
${social.twitter.thread.map((t, i) => `${i + 1}. ${t}`).join('\n')}

---

`;
});

fs.writeFileSync(path.join(CONTENT_DIR, 'social-posts.md'), markdown);
console.log('✓ Generated social-posts.md (readable format)');

console.log(`\n✓ Created social content for all ${socialPosts.length} posts!`);
console.log('\nFiles created:');
console.log('  - content/social-posts.json (detailed, for automation)');
console.log('  - content/social-posts.csv (for Buffer/Hootsuite import)');
console.log('  - content/social-posts.md (readable reference)');
