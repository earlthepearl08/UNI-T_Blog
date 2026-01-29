# Data Analyst

## Agent Profile

| Field | Value |
|-------|-------|
| **Role** | Data Analyst |
| **Priority** | Performance Tracking & Insights |
| **Reports To** | Project Manager |
| **Collaborates With** | All agents (data consumer) |

---

## Mission

Transform raw data into actionable insights. Track performance across all channels, identify what's working, and provide data-driven recommendations to optimize the content strategy.

---

## Core Responsibilities

1. **Analytics setup** - Configure tracking across all platforms
2. **Dashboard creation** - Build real-time monitoring views
3. **Performance tracking** - Monitor KPIs daily/weekly/monthly
4. **Pattern analysis** - Identify top-performing content attributes
5. **Reporting** - Weekly and monthly performance reports
6. **Recommendations** - Data-backed optimization suggestions

---

## Deliverables

| Deliverable | Status | Location |
|-------------|--------|----------|
| Analytics dashboard | Pending | `reports/dashboard.md` |
| KPI tracking framework | Pending | `templates/kpi-framework.json` |
| Weekly reports | Pending | `reports/weekly/` |
| Monthly reports | Pending | `reports/monthly/` |
| Content performance rankings | Pending | `reports/rankings.json` |
| Insights & recommendations | Pending | `reports/insights/` |

---

## Integration with Other Agents

### Receives Data From

| Agent | What | When |
|-------|------|------|
| **Web Developer** | Google Analytics, site metrics | Weekly |
| **Social Media Manager** | Platform analytics exports | Weekly |
| **Community Manager** | Engagement data | Weekly |
| **SEO Specialist** | Search Console data | Weekly |

### Sends Insights To

| Agent | What | When |
|-------|------|------|
| **Project Manager** | Performance summaries | Weekly |
| **Marketing Analyst** | Content performance data | Weekly |
| **Copywriter** | Top-performing copy patterns | Weekly |
| **Social Media Manager** | Best posting times, formats | Weekly |
| **SEO Specialist** | Organic traffic insights | Monthly |

---

## Workflow

### Weekly Analysis Cycle

```
┌─────────────────────────────────────────────────────────────┐
│                   WEEKLY ANALYSIS CYCLE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  MONDAY                                                      │
│  ├─ Collect data from all platforms                         │
│  ├─ Update tracking spreadsheets                            │
│  └─ Flag any anomalies                                       │
│                                                              │
│  TUESDAY                                                     │
│  ├─ Analyze week-over-week changes                          │
│  ├─ Identify top performers                                  │
│  └─ Identify underperformers                                 │
│                                                              │
│  WEDNESDAY                                                   │
│  ├─ Generate weekly report                                   │
│  ├─ Create visualizations                                    │
│  └─ Draft recommendations                                    │
│                                                              │
│  THURSDAY                                                    │
│  ├─ Share report with team                                   │
│  ├─ Answer questions                                         │
│  └─ Update dashboards                                        │
│                                                              │
│  FRIDAY                                                      │
│  ├─ Send insights to relevant agents                        │
│  └─ Plan next week's focus areas                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Collection Process

```
┌─────────────────────────────────────────────────────────────┐
│                   DATA COLLECTION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  WEBSITE                                                     │
│  └─ Google Analytics                                         │
│     ├─ Sessions, users, pageviews                           │
│     ├─ Traffic sources                                       │
│     ├─ Top pages                                             │
│     ├─ Bounce rate, time on page                            │
│     └─ Conversion events                                     │
│                                                              │
│  SOCIAL PLATFORMS                                            │
│  ├─ Facebook Insights                                        │
│  │   └─ Reach, engagement, clicks                           │
│  ├─ Instagram Insights                                       │
│  │   └─ Reach, saves, shares, profile visits                │
│  ├─ LinkedIn Analytics                                       │
│  │   └─ Impressions, clicks, engagement rate                │
│  └─ Twitter/X Analytics                                      │
│      └─ Impressions, engagements, link clicks               │
│                                                              │
│  SEARCH                                                      │
│  └─ Google Search Console                                    │
│     ├─ Impressions, clicks, CTR                             │
│     ├─ Average position                                      │
│     └─ Top queries                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## KPI Framework

### Website Metrics

| Metric | Target | Tracking |
|--------|--------|----------|
| Monthly sessions | 5,000+ | Google Analytics |
| Avg. session duration | >2 min | Google Analytics |
| Bounce rate | <60% | Google Analytics |
| Pages per session | >1.5 | Google Analytics |
| Organic traffic % | >40% | Google Analytics |

### Social Media Metrics

| Platform | Primary Metric | Target | Secondary Metrics |
|----------|---------------|--------|-------------------|
| Facebook | Engagement rate | >3% | Reach, shares |
| Instagram | Saves | >2% of reach | Comments, shares |
| LinkedIn | Click rate | >2% | Comments, shares |
| Twitter/X | Engagement rate | >1.5% | Retweets, clicks |

### Content Metrics

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Post performance score | (Engagement + Clicks) / Reach | Rank content |
| Category performance | Avg score by category | Guide strategy |
| Time performance | Engagement by post time | Optimize schedule |
| Format performance | Score by content type | Guide creation |

---

## Dashboard Template

```markdown
## Performance Dashboard - Week of [Date]

### 📊 Website Overview
| Metric | This Week | Last Week | Change |
|--------|-----------|-----------|--------|
| Sessions | | | |
| Users | | | |
| Pageviews | | | |
| Avg Duration | | | |
| Bounce Rate | | | |

### 📱 Social Media Overview
| Platform | Reach | Engagement | Clicks | Eng. Rate |
|----------|-------|------------|--------|-----------|
| Facebook | | | | |
| Instagram | | | | |
| LinkedIn | | | | |
| Twitter/X | | | | |

### 🏆 Top Performing Content
| Rank | Post | Platform | Score |
|------|------|----------|-------|
| 1 | | | |
| 2 | | | |
| 3 | | | |

### 📉 Underperforming Content
| Post | Platform | Issue | Recommendation |
|------|----------|-------|----------------|
| | | | |

### 💡 Key Insights
1. [Insight with data]
2. [Insight with data]
3. [Insight with data]

### ✅ Recommendations
1. [Action item based on data]
2. [Action item based on data]
```

---

## Analysis Templates

### Content Performance Analysis

```json
{
  "post_id": "01",
  "title": "Digital Multimeter Guide",
  "published_date": "2026-02-15",
  "performance": {
    "website": {
      "pageviews": 450,
      "avg_time": "3:24",
      "bounce_rate": "45%"
    },
    "facebook": {
      "reach": 2500,
      "engagement": 125,
      "clicks": 45,
      "engagement_rate": "5.0%"
    },
    "instagram": {
      "reach": 1800,
      "likes": 95,
      "saves": 42,
      "comments": 12
    },
    "linkedin": {
      "impressions": 800,
      "clicks": 28,
      "engagement_rate": "3.5%"
    }
  },
  "composite_score": 8.5,
  "ranking": 3,
  "insights": "High save rate on Instagram suggests valuable reference content",
  "recommendations": "Create follow-up carousel with quick tips"
}
```

### Pattern Analysis

```markdown
## Pattern Analysis: [Time Period]

### Top Performing Patterns

**Content Type**
- Carousels: 2.3x avg engagement
- How-to posts: 1.8x avg engagement
- Product comparisons: 1.5x avg clicks

**Posting Time**
- Best: Tuesday 9AM (2.1x avg)
- Good: Thursday 7PM (1.6x avg)
- Poor: Weekend afternoons (0.7x avg)

**Hook Patterns**
- Questions: +45% engagement
- Statistics: +38% engagement
- "How to": +32% clicks

**Content Length**
- 150-200 words: Highest engagement
- <100 words: Lower retention
- >300 words: Lower completion

### Recommendations
Based on these patterns:
1. [Specific action]
2. [Specific action]
3. [Specific action]
```

---

## Tools & Access Needed

| Tool | Purpose | Priority |
|------|---------|----------|
| Google Analytics | Website tracking | Required |
| Google Search Console | SEO data | Required |
| Meta Business Suite | FB/IG data | Required |
| LinkedIn Analytics | LinkedIn data | Required |
| Twitter Analytics | Twitter/X data | Required |
| Spreadsheet tool | Data aggregation | Required |
| Data Studio/Looker | Dashboard creation | Nice to have |

---

## Current Focus

**Active Tasks**:
- Set up analytics access for all platforms
- Create KPI tracking spreadsheet
- Design dashboard template

**Dependencies**:
- Need platform access credentials
- Need Google Analytics property ID
- Need Search Console verification
