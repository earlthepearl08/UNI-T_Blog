# UNI-T Philippines - Agent Directory

## Project Overview
Content publishing system for UNI-T Philippines featuring 44 blog posts across multiple social media platforms.

---

## Active Agents (10)

### Core Team

| Agent | Role | Status | Directory |
|-------|------|--------|-----------|
| [Project Manager](project-manager/) | Orchestrator | Active | `project-manager/` |
| [Marketing Analyst](marketing-analyst/) | Strategy | Active | `marketing-analyst/` |
| [Graphic Designer](graphic-designer/) | Design | Active | `graphic-designer/` |
| [Web Developer](web-developer/) | Development | Active | `web-developer/` |
| [Social Media Manager](social-media-manager/) | Distribution | Active | `social-media-manager/` |

### Extended Team

| Agent | Role | Status | Directory |
|-------|------|--------|-----------|
| [Content Editor](content-editor/) | QA & Polish | Active | `content-editor/` |
| [Community Manager](community-manager/) | Engagement | Active | `community-manager/` |
| [SEO Specialist](seo-specialist/) | Search Visibility | Active | `seo-specialist/` |
| [Copywriter](copywriter/) | Ad Copy & Adaptation | Active | `copywriter/` |
| [Data Analyst](data-analyst/) | Analytics & Insights | Active | `data-analyst/` |

---

## Quick Links

- **Content Calendar**: `content/calendar.json`
- **Posts Database**: `content/posts.json`
- **Social Posts**: `content/social-posts.json`
- **Design Brief**: `content/design-brief.md`
- **Task Tracker**: `shared/tasks.json`
- **Blockers**: `shared/blockers.md`

---

## Master Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PROJECT MANAGER                                    │
│                         (Central Orchestrator)                               │
│                                                                              │
│   Coordinates all agents • Tracks milestones • Approves deliverables       │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    STRATEGY     │    │   PRODUCTION    │    │  DISTRIBUTION   │
│      TEAM       │    │      TEAM       │    │      TEAM       │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
    ┌────┴────┐            ┌────┴────┐            ┌────┴────┐
    │         │            │         │            │         │
    ▼         ▼            ▼         ▼            ▼         ▼
┌───────┐ ┌───────┐  ┌───────┐ ┌───────┐  ┌───────┐ ┌───────┐
│Market-│ │  SEO  │  │Graphic│ │  Web  │  │Social │ │Commun-│
│  ing  │ │Specia-│  │Design-│ │Develo-│  │ Media │ │  ity  │
│Analyst│ │ list  │  │  er   │ │  per  │  │Manager│ │Manager│
└───┬───┘ └───┬───┘  └───┬───┘ └───┬───┘  └───┬───┘ └───┬───┘
    │         │          │         │          │         │
    └────┬────┘          └────┬────┘          └────┬────┘
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐          ┌─────────┐          ┌─────────┐
    │  DATA   │◄────────►│ CONTENT │◄────────►│  COPY-  │
    │ ANALYST │          │  EDITOR │          │ WRITER  │
    └─────────┘          └─────────┘          └─────────┘
         │                    │                    │
         └────────────────────┼────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  QUALITY GATE   │
                    │  (All content   │
                    │   approved by   │
                    │  Content Editor)│
                    └─────────────────┘
```

---

## Agent Interaction Matrix

This matrix shows how each agent interacts with others:

|  | PM | MA | GD | WD | SMM | CE | CM | SEO | CW | DA |
|--|:--:|:--:|:--:|:--:|:---:|:--:|:--:|:---:|:--:|:--:|
| **Project Manager (PM)** | - | ⬇️ | ⬇️ | ⬇️ | ⬇️ | ⬇️ | ⬇️ | ⬇️ | ⬇️ | ⬇️ |
| **Marketing Analyst (MA)** | ⬆️ | - | ➡️ | ➡️ | ➡️ | ➡️ | ⬅️ | ↔️ | ➡️ | ↔️ |
| **Graphic Designer (GD)** | ⬆️ | ⬅️ | - | ➡️ | ➡️ | ⬅️ | - | - | ⬅️ | - |
| **Web Developer (WD)** | ⬆️ | ⬅️ | ⬅️ | - | ➡️ | ↔️ | - | ↔️ | - | ➡️ |
| **Social Media Manager (SMM)** | ⬆️ | ⬅️ | ⬅️ | ⬅️ | - | ⬅️ | ➡️ | - | ⬅️ | ➡️ |
| **Content Editor (CE)** | ⬆️ | ⬅️ | ➡️ | ↔️ | ➡️ | - | ➡️ | ↔️ | ↔️ | - |
| **Community Manager (CM)** | ⬆️ | ➡️ | - | - | ⬅️ | ⬅️ | - | - | ➡️ | ➡️ |
| **SEO Specialist (SEO)** | ⬆️ | ↔️ | - | ↔️ | - | ↔️ | - | - | ➡️ | ⬅️ |
| **Copywriter (CW)** | ⬆️ | ⬅️ | ➡️ | - | ➡️ | ↔️ | ⬅️ | ⬅️ | - | ⬅️ |
| **Data Analyst (DA)** | ⬆️ | ↔️ | - | ⬅️ | ⬅️ | - | ⬅️ | ➡️ | ➡️ | - |

**Legend**: ⬆️ Reports to | ⬇️ Manages | ➡️ Sends work to | ⬅️ Receives from | ↔️ Bidirectional

---

## Workflow Phases

### Phase 1: Foundation (Week 1)

```
Marketing Analyst ──┬──► Content categorization
                    └──► Posting sequence
                              │
SEO Specialist ────────► Keyword research
                              │
                              ▼
                    Strategy documents ready
```

### Phase 2: Production (Weeks 2-3)

```
Graphic Designer ──────► Templates + Images
         │                    │
         ▼                    ▼
    Brand assets ────► Web Developer (integration)
                              │
                              ▼
                    Content Editor (QA)
                              │
                              ▼
                    Copywriter (adaptation)
                              │
                              ▼
                    Content Editor (final review)
```

### Phase 3: Distribution (Week 4+)

```
Social Media Manager ──► Schedule posts
         │                    │
         ▼                    ▼
Community Manager ◄──── Engagement begins
         │
         ▼
Data Analyst ──────────► Track performance
         │
         ▼
All agents ◄─────────── Insights & optimization
```

---

## Content Flow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONTENT FLOW PIPELINE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ CONTENT  │    │  VISUAL  │    │  QUALITY │    │  PUBLISH │              │
│  │ CREATION │───►│ DESIGN   │───►│  CHECK   │───►│    &     │              │
│  │          │    │          │    │          │    │  ENGAGE  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│       │               │               │               │                     │
│       ▼               ▼               ▼               ▼                     │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐  │
│  │Marketing│    │ Graphic │    │ Content │    │ Social  │    │Community│  │
│  │ Analyst │    │Designer │    │  Editor │    │  Media  │    │ Manager │  │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘  │
│       │               │               │               │             │       │
│       │               │               ▲               │             │       │
│       │               │               │               │             │       │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐           │       │
│  │   SEO   │    │   Web   │    │  Copy-  │    │  Data   │◄──────────┘       │
│  │Specialis│    │Developer│    │ writer  │    │ Analyst │                   │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘                   │
│       │               │               │               │                     │
│       └───────────────┴───────────────┴───────────────┘                     │
│                               │                                              │
│                               ▼                                              │
│                    ┌─────────────────────┐                                  │
│                    │   FEEDBACK LOOP     │                                  │
│                    │   (Continuous       │                                  │
│                    │    Optimization)    │                                  │
│                    └─────────────────────┘                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Communication Protocol

### Task Assignment
1. Project Manager creates task in `shared/tasks.json`
2. Assigned agent picks up task and updates status
3. Agent completes work and marks for review
4. Project Manager approves or requests changes

### Handoffs Between Agents
1. Completing agent documents in `shared/handoffs.md`
2. Receiving agent is notified
3. Context is preserved for smooth transition

### Status Codes
- `pending` - Not started
- `in_progress` - Currently being worked on
- `review` - Awaiting approval (PM or Content Editor)
- `approved` - Completed and approved
- `blocked` - Waiting on dependency

---

## Directory Structure

```
.agents/
├── README.md                    # This file
├── RECOMMENDED-AGENTS.md        # Future agent recommendations
│
├── shared/                      # Cross-agent resources
│   ├── tasks.json              # Central task tracking
│   ├── handoffs.md             # Agent handoff notes
│   └── blockers.md             # Current blockers
│
├── project-manager/            # Orchestrator
│   ├── AGENT.md
│   ├── milestones.json
│   └── approvals.md
│
├── marketing-analyst/          # Strategy
│   ├── AGENT.md
│   ├── analysis/
│   └── recommendations/
│
├── graphic-designer/           # Visuals
│   ├── AGENT.md
│   ├── templates/
│   └── assets/
│
├── web-developer/              # Technical
│   ├── AGENT.md
│   ├── technical/
│   └── issues/
│
├── social-media-manager/       # Distribution
│   ├── AGENT.md
│   ├── schedules/
│   └── analytics/
│
├── content-editor/             # Quality
│   ├── AGENT.md
│   ├── reviews/
│   └── templates/
│
├── community-manager/          # Engagement
│   ├── AGENT.md
│   ├── templates/
│   └── reports/
│
├── seo-specialist/             # Search
│   ├── AGENT.md
│   ├── reports/
│   └── templates/
│
├── copywriter/                 # Copy
│   ├── AGENT.md
│   ├── templates/
│   └── reports/
│
└── data-analyst/               # Analytics
    ├── AGENT.md
    ├── reports/
    └── templates/
```

---

## Getting Started

1. **Read your AGENT.md** - Understand your role and responsibilities
2. **Check shared/tasks.json** - See what's assigned to you
3. **Review shared/handoffs.md** - Get context from other agents
4. **Check shared/blockers.md** - Be aware of current issues
5. **Start working** - Update task status as you progress
