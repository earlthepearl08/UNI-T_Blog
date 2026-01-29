# Master Workflow & Agent Interactions

This document details how all 10 agents work together, share deliverables, and operate independently.

---

## Team Structure Overview

```
                              ┌─────────────────────┐
                              │   PROJECT MANAGER   │
                              │    (Orchestrator)   │
                              └──────────┬──────────┘
                                         │
           ┌─────────────────────────────┼─────────────────────────────┐
           │                             │                             │
           ▼                             ▼                             ▼
   ┌───────────────┐            ┌───────────────┐            ┌───────────────┐
   │   STRATEGY    │            │  PRODUCTION   │            │ DISTRIBUTION  │
   │     TEAM      │            │     TEAM      │            │     TEAM      │
   ├───────────────┤            ├───────────────┤            ├───────────────┤
   │• Marketing    │            │• Graphic      │            │• Social Media │
   │  Analyst      │            │  Designer     │            │  Manager      │
   │• SEO          │            │• Web          │            │• Community    │
   │  Specialist   │            │  Developer    │            │  Manager      │
   └───────────────┘            └───────────────┘            └───────────────┘
           │                             │                             │
           └─────────────────────────────┼─────────────────────────────┘
                                         │
                              ┌──────────┴──────────┐
                              │   SUPPORT TEAM      │
                              ├─────────────────────┤
                              │• Content Editor     │
                              │• Copywriter         │
                              │• Data Analyst       │
                              └─────────────────────┘
```

---

## Agent Responsibilities Summary

| Agent | Primary Function | Key Output |
|-------|-----------------|------------|
| **Project Manager** | Coordination & approval | Task assignments, milestones |
| **Marketing Analyst** | Strategy & research | Content plan, audience insights |
| **SEO Specialist** | Search optimization | Keywords, meta tags, rankings |
| **Graphic Designer** | Visual creation | Templates, images, brand assets |
| **Web Developer** | Technical implementation | Website, blog posts, feeds |
| **Social Media Manager** | Content scheduling | Scheduled posts, automation |
| **Community Manager** | Audience engagement | Responses, relationships |
| **Content Editor** | Quality assurance | Reviewed & polished content |
| **Copywriter** | Content adaptation | Platform-specific copy, ads |
| **Data Analyst** | Performance tracking | Reports, insights, recommendations |

---

## Detailed Workflow by Phase

### PHASE 1: Strategy & Planning

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: STRATEGY & PLANNING                                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DAY 1-2: Content Analysis                                                  │
│  ┌─────────────────────┐                                                    │
│  │  MARKETING ANALYST  │                                                    │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • content/posts.json                                                    │
│  │  • content/categories.json                                               │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Content categorization matrix                                         │
│  │  • Audience personas                                                     │
│  │  • Posting sequence recommendation                                       │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  DAY 2-3: SEO Research                                                      │
│  ┌─────────────────────┐                                                    │
│  │   SEO SPECIALIST    │◄─── Receives: Content categories                  │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • Category data from Marketing Analyst                                  │
│  │  • Competitor analysis                                                   │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Keyword map for all 44 posts                                         │
│  │  • Optimized titles & meta descriptions                                 │
│  │  • Internal linking strategy                                            │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             ▼                                                                │
│  DAY 3-4: Strategy Approval                                                 │
│  ┌─────────────────────┐                                                    │
│  │  PROJECT MANAGER    │◄─── Receives: All strategy docs                   │
│  │  ─────────────────  │                                                    │
│  │  • Reviews categorization                                                │
│  │  • Approves posting sequence                                            │
│  │  • Signs off on keywords                                                │
│  │  • Creates Phase 2 tasks                                                │
│  └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Handoff Documents:**
- Marketing Analyst → SEO Specialist: `marketing-analyst/analysis/categorization.json`
- SEO Specialist → Content Editor: `seo-specialist/reports/keyword-map.json`
- Both → Project Manager: `shared/handoffs.md`

---

### PHASE 2: Content Production

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 2: CONTENT PRODUCTION                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PARALLEL TRACK A: Visual Design                                            │
│  ┌─────────────────────┐                                                    │
│  │  GRAPHIC DESIGNER   │                                                    │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • Brand guidelines │                                                    │
│  │  • content/design-brief.md                                               │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Social media templates (5 platforms)                                  │
│  │  • Blog featured images (44)                                            │
│  │  • Brand style guide                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Sends templates to:                                           │
│             ├──► Web Developer (for blog integration)                       │
│             ├──► Copywriter (for text placement reference)                  │
│             └──► Social Media Manager (for scheduling)                      │
│                                                                              │
│  PARALLEL TRACK B: Content Polish                                           │
│  ┌─────────────────────┐                                                    │
│  │   CONTENT EDITOR    │                                                    │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • content/posts.json                                                    │
│  │  • SEO keyword map  │                                                    │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • QA'd blog content                                                    │
│  │  • Optimized titles/metas                                               │
│  │  • Style guide compliance                                               │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Sends approved content to:                                    │
│             ├──► Web Developer (for blog updates)                           │
│             └──► Copywriter (for social adaptation)                         │
│                                                                              │
│  PARALLEL TRACK C: Copy Adaptation                                          │
│  ┌─────────────────────┐                                                    │
│  │     COPYWRITER      │◄─── Receives: Approved content + templates        │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • QA'd blog content│                                                    │
│  │  • Platform templates                                                   │
│  │  • Audience personas                                                    │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Facebook captions│                                                    │
│  │  • Instagram carousels                                                  │
│  │  • LinkedIn posts   │                                                    │
│  │  • Twitter threads  │                                                    │
│  │  • Ad copy variations                                                   │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Sends copy to:                                                │
│             ├──► Content Editor (for final QA)                              │
│             └──► Social Media Manager (after approval)                      │
│                                                                              │
│  TECHNICAL TRACK: Website Updates                                           │
│  ┌─────────────────────┐                                                    │
│  │   WEB DEVELOPER     │◄─── Receives: Images + Approved content           │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • Featured images  │                                                    │
│  │  • Edited content   │                                                    │
│  │  • SEO optimizations                                                    │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Updated blog posts                                                   │
│  │  • Updated RSS feed │                                                    │
│  │  • Updated sitemap  │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             └──► Deploys to live site                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Handoff Documents:**
- Graphic Designer → Web Developer: `graphic-designer/assets/` (images)
- Content Editor → Copywriter: `content-editor/reviews/approved/`
- Copywriter → Content Editor: `copywriter/templates/` (for review)
- All → Web Developer: `shared/handoffs.md`

---

### PHASE 3: Distribution & Engagement

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PHASE 3: DISTRIBUTION & ENGAGEMENT                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SCHEDULING                                                                  │
│  ┌─────────────────────┐                                                    │
│  │ SOCIAL MEDIA MGR    │◄─── Receives: All approved content + images       │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • Approved social copy                                                  │
│  │  • Featured images  │                                                    │
│  │  • Posting sequence │                                                    │
│  │                      │                                                    │
│  │  Actions:           │                                                    │
│  │  • Schedule in Buffer/Meta                                               │
│  │  • Set optimal times│                                                    │
│  │  • Monitor queue    │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Notifies:                                                     │
│             └──► Community Manager (when posts go live)                     │
│                                                                              │
│  ENGAGEMENT                                                                  │
│  ┌─────────────────────┐                                                    │
│  │ COMMUNITY MANAGER   │◄─── Receives: Post notifications                  │
│  │  ─────────────────  │                                                    │
│  │  Actions:           │                                                    │
│  │  • Monitor comments │                                                    │
│  │  • Respond to DMs   │                                                    │
│  │  • Handle inquiries │                                                    │
│  │  • Build relationships                                                  │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Engagement metrics                                                   │
│  │  • Community insights                                                   │
│  │  • Advocate database│                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Sends data to:                                                │
│             ├──► Data Analyst (engagement metrics)                          │
│             ├──► Marketing Analyst (community feedback)                     │
│             └──► Copywriter (testimonials, UGC)                             │
│                                                                              │
│  ANALYTICS                                                                   │
│  ┌─────────────────────┐                                                    │
│  │   DATA ANALYST      │◄─── Receives: All platform data                   │
│  │  ─────────────────  │                                                    │
│  │  Input:             │                                                    │
│  │  • GA website data  │                                                    │
│  │  • Social platform insights                                             │
│  │  • Engagement metrics                                                   │
│  │  • Search Console data                                                  │
│  │                      │                                                    │
│  │  Output:            │                                                    │
│  │  • Weekly reports   │                                                    │
│  │  • Content rankings │                                                    │
│  │  • Optimization recommendations                                         │
│  └──────────┬──────────┘                                                    │
│             │                                                                │
│             │ Sends insights to:                                            │
│             ├──► Project Manager (summary)                                  │
│             ├──► Marketing Analyst (strategy adjustments)                   │
│             ├──► Copywriter (top-performing patterns)                       │
│             └──► Social Media Manager (optimal times)                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Independent Operation Guidelines

Each agent operates independently within their domain. Here's how:

### Project Manager
```
OPERATES INDEPENDENTLY:
├── Creates and assigns tasks
├── Sets deadlines and priorities
├── Approves deliverables
└── Resolves blockers

TRIGGERS FOR ACTION:
├── Daily: Check task status, blockers
├── When notified: Review deliverables
└── Weekly: Milestone review
```

### Marketing Analyst
```
OPERATES INDEPENDENTLY:
├── Analyzes content data
├── Creates audience personas
├── Recommends posting sequence
└── Identifies high-value content

TRIGGERS FOR ACTION:
├── Project start: Initial analysis
├── Weekly: Review community feedback from CM
└── Monthly: Strategy refinement based on DA data
```

### SEO Specialist
```
OPERATES INDEPENDENTLY:
├── Conducts keyword research
├── Optimizes meta content
├── Monitors rankings
└── Identifies opportunities

TRIGGERS FOR ACTION:
├── After MA categorization: Keyword mapping
├── Before publication: Final SEO check
└── Weekly: Rankings monitoring
```

### Graphic Designer
```
OPERATES INDEPENDENTLY:
├── Creates brand assets
├── Designs templates
├── Produces featured images
└── Maintains visual consistency

TRIGGERS FOR ACTION:
├── Project start: Brand guide + templates
├── Per post: Featured image creation
└── As needed: Custom graphics
```

### Web Developer
```
OPERATES INDEPENDENTLY:
├── Maintains website
├── Implements technical updates
├── Ensures performance
└── Deploys changes

TRIGGERS FOR ACTION:
├── When receiving images: Integrate to posts
├── When content approved: Update HTML
├── Weekly: Performance check
```

### Social Media Manager
```
OPERATES INDEPENDENTLY:
├── Schedules content
├── Manages posting queue
├── Sets up automation
└── Monitors scheduled posts

TRIGGERS FOR ACTION:
├── When content approved: Schedule posts
├── Daily: Queue management
└── Notify CM: When posts go live
```

### Content Editor
```
OPERATES INDEPENDENTLY:
├── Reviews all content
├── Enforces quality standards
├── Provides feedback
└── Approves for publication

TRIGGERS FOR ACTION:
├── When content received: Begin review
├── Return feedback: If changes needed
└── Approve: When quality met
```

### Copywriter
```
OPERATES INDEPENDENTLY:
├── Adapts content for platforms
├── Creates ad variations
├── Writes hooks and CTAs
└── Tests copy approaches

TRIGGERS FOR ACTION:
├── When blog approved: Adapt for social
├── Per platform: Create variations
└── Submit to CE: For final review
```

### Community Manager
```
OPERATES INDEPENDENTLY:
├── Monitors all platforms
├── Responds to engagement
├── Handles inquiries
└── Builds relationships

TRIGGERS FOR ACTION:
├── When posts live: Monitor engagement
├── Within SLA: Respond to comments/DMs
├── Weekly: Send insights to DA/MA
```

### Data Analyst
```
OPERATES INDEPENDENTLY:
├── Collects platform data
├── Analyzes performance
├── Identifies patterns
└── Creates reports

TRIGGERS FOR ACTION:
├── Weekly: Data collection & analysis
├── Monthly: Comprehensive report
└── As patterns emerge: Share insights
```

---

## Deliverable Handoff Matrix

| From | To | Deliverable | Location |
|------|-----|-------------|----------|
| Marketing Analyst | SEO Specialist | Content categories | `marketing-analyst/analysis/` |
| Marketing Analyst | Copywriter | Audience personas | `marketing-analyst/analysis/personas.md` |
| Marketing Analyst | Social Media Mgr | Posting sequence | `marketing-analyst/recommendations/` |
| SEO Specialist | Content Editor | Keywords & metas | `seo-specialist/reports/keyword-map.json` |
| SEO Specialist | Web Developer | Technical fixes | `shared/handoffs.md` |
| Graphic Designer | Web Developer | Images | `graphic-designer/assets/` |
| Graphic Designer | Social Media Mgr | Templates | `graphic-designer/templates/` |
| Graphic Designer | Copywriter | Design specs | `graphic-designer/templates/` |
| Web Developer | Data Analyst | Site metrics | `shared/handoffs.md` |
| Content Editor | Copywriter | Approved content | `content-editor/reviews/approved/` |
| Content Editor | Web Developer | Final content | `content-editor/reviews/approved/` |
| Content Editor | Social Media Mgr | Approved copy | `content-editor/reviews/approved/` |
| Copywriter | Content Editor | Draft copy | `copywriter/templates/` |
| Copywriter | Graphic Designer | Copy for designs | `shared/handoffs.md` |
| Social Media Mgr | Community Mgr | Post notifications | Direct notification |
| Social Media Mgr | Data Analyst | Platform data | `social-media-manager/analytics/` |
| Community Mgr | Data Analyst | Engagement data | `community-manager/reports/` |
| Community Mgr | Marketing Analyst | Community feedback | `shared/handoffs.md` |
| Community Mgr | Copywriter | UGC & testimonials | `community-manager/reports/` |
| Data Analyst | All agents | Performance insights | `data-analyst/reports/` |

---

## Communication Channels

### Async (Primary)
- **Task updates**: `shared/tasks.json`
- **Handoffs**: `shared/handoffs.md`
- **Blockers**: `shared/blockers.md`

### Sync (As Needed)
- **Standups**: Brief status updates
- **Reviews**: Deliverable walkthroughs
- **Escalations**: Urgent issues

---

## Quality Gates

All content must pass through the Content Editor before:
1. Blog publication
2. Social media scheduling
3. Promotional use

```
        ┌─────────────────┐
        │   ANY CONTENT   │
        └────────┬────────┘
                 │
                 ▼
        ┌─────────────────┐
        │ CONTENT EDITOR  │
        │    REVIEW       │
        └────────┬────────┘
                 │
        ┌────────┴────────┐
        │                 │
        ▼                 ▼
   ┌─────────┐      ┌─────────┐
   │ APPROVE │      │ REVISE  │
   └────┬────┘      └────┬────┘
        │                 │
        ▼                 ▼
   Publication      Back to author
```

---

## Escalation Path

```
Level 1: Direct agent-to-agent communication
    │
    ▼ (If unresolved)
Level 2: Content Editor (for content issues)
    │
    ▼ (If unresolved)
Level 3: Project Manager (for all issues)
    │
    ▼ (If unresolved)
Level 4: Project Owner escalation
```
