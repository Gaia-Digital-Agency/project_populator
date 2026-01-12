# GitHub Projects V2 Populator for WordPress Development

A complete project management automation tool designed for WordPress development running multiple parallel projects with grouped teams.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Context](#business-context)
3. [How It Works](#how-it-works)
4. [Project Management](#project-management)
5. [Client Management](#client-management)
6. [Team Management](#team-management)
7. [The WordPress Development Lifecycle](#the-wordpress-development-lifecycle)
8. [Technical Setup](#technical-setup)
9. [Daily Operations](#daily-operations)
10. [Reporting & Metrics](#reporting--metrics)
11. [Scaling the System](#scaling-the-system)

---

## Executive Summary

This tool automates the creation of standardized GitHub Projects for WordPress website development. It solves three core challenges:

| Challenge | Solution |
|-----------|----------|
| Inconsistent project execution | Standardized 11-phase, 33-activity template |
| Difficult resource allocation | Developer assignment matrix with workload visibility |
| Client communication gaps | Phase-based milestones with clear deliverables |

**Key Metrics:**
- 20-day project cycle (1 calendar month)
- 6 parallel projects capacity
- 6 developers with specialized roles
- 33 activities with 150+ checklist items per project

---

## Business Context

### The Problem

Running multiple WordPress projects simultaneously creates complexity:

1. **Project Drift** - Without standardization, each project follows different processes
2. **Resource Conflicts** - Developers pulled in multiple directions without clear priorities
3. **Client Uncertainty** - Clients don't know where their project stands
4. **Quality Variance** - Some projects get thorough testing, others rush to deployment

### The Solution

This system provides:

```
┌────────────────────────────────────────────────────────────────┐
│                    SINGLE SOURCE OF TRUTH                      │
│                                                                │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐     │
│  │ Project  │   │ Project  │   │ Project  │   │ Project  │     │
│  │    A     │   │    B     │   │    C     │   │   D-F    │     │
│  └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘     │
│       │              │              │              │           │
│       └──────────────┴──────────────┴──────────────┘           │
│                           │                                    │
│                    GitHub Projects V2                          │
│                           │                                    │
│       ┌───────────────────┼───────────────────┐                │
│       │                   │                   │                │
│  ┌────▼────┐        ┌─────▼────┐        ┌────▼────┐            │
│  │ General │        │  Client  │        │  Team   │            │
│  │ Manager │        │  Portal  │        │  Board  │            │
│  └─────────┘        └──────────┘        └─────────┘            │
└────────────────────────────────────────────────────────────────┘
```

## How It Works

### System Architecture

```
github-project-populator/
├── backend/
│   ├── index.js                    # Main populator engine
│   ├── batch-create.js             # Multi-project creation
│   ├── list-projects.js            # Project inventory
│   ├── report-single.js            # Single project markdown report
│   ├── report-all.js               # Portfolio-wide report
│   └── config/
│       └── wordpress-project.config.js  # Template definition
├── reference/                       # All markdown documentation
│   ├── guide_simple_use.md         # Quick start guide
│   ├── guide_github_multi_account.md  # Multi-account setup
│   ├── guide_manage_dual_git.md    # Git user switching
│   ├── guide_make_report.md        # Reporting guide
│   └── [other workflow guides]
├── reports/                         # Generated markdown reports
├── .claude/                         # Claude Code AI assistant configuration
│   └── PROJECT_CONTEXT.md          # Project overview for AI context
├── .env.example                     # Configuration template
├── .env                             # Your config (gitignored)
├── package.json
└── README.md                        # This file
```

### Data Flow

```
Step 1: Configuration
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  .env file                                              │
│  - GITHUB_TOKEN (authentication)                        │
│  - GITHUB_OWNER (your username/org)                     │
│  - GITHUB_REPO (repository for issues)                  │
│  - CLIENT_NAME (project identifier)                     │
└─────────────────────────────────────────────────────────┘
    │
    ▼
Step 2: Project Creation
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Projects V2 (via GraphQL API)                   │
│  - Creates project board                                │
│  - Adds custom fields (Status, Phase, Priority, etc.)   │
│  - Creates 30+ labels for categorization                │
└─────────────────────────────────────────────────────────┘
    │
    ▼
Step 3: Task Population
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  33 Issues Created (one per activity)                    │
│  - Title: [Phase Name] Task Name                        │
│  - Body: Description + Checklist                        │
│  - Labels: Categorization tags                          │
│  - Fields: Phase, Priority, Time %, Developer           │
└─────────────────────────────────────────────────────────┘
    │
    ▼
Step 4: Ready for Execution
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│  Project Board Views                                    │
│  - Kanban by Status                                     │
│  - Table by Phase                                       │
│  - Timeline by Developer                                │
└─────────────────────────────────────────────────────────┘
```

---

## Project Management

### The 11-Phase Lifecycle

Every WordPress project follows this standardized lifecycle:
(6 developers x 20 days = 120 person-days / 20 days per project = 6 parallel projects per month)

```
Phase 1       Phase 2       Phase 3       Phase 4       Phase 5       Phase 6
Discovery ──▶ Planning  ──▶ Design    ──▶ Environment ──▶ Backend  ──▶ Frontend
(10% | 2d)    (8% | 1.5d)   (15% | 3d)    (5% | 1d)       (20% | 4d)    (20% | 4d)
    │             │             │             │               │             │
    ▼             ▼             ▼             ▼               ▼             ▼
┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐    ┌────────┐
│Client  │    │Tech    │    │UI/UX   │    │Hosting │    │Theme   │    │Pages   │
│Brief   │    │Scoping │    │All     │    │Setup   │    │Plugins │    │Build   │
│Require │    │Arch    │    │Pages   │    │WP/CMS  │    │Custom  │    │Respond │
│Plan    │    │Spec    │    │Approve │    │DevSync │    │Ecom    │    │Animate │
└────────┘    └────────┘    └────────┘    └────────┘    └────────┘    └────────┘

Phase 7       Phase 8       Phase 9          Phase 10      Phase 11
Content   ──▶ Testing   ──▶ Functionality ──▶ User      ──▶ Deployment
(7% | 1.5d)   (5% | 1d)     (5% | 1d)         Acceptance    (2% | 0.5d)
    │             │             │               (3% | 0.5d)      │
    ▼             ▼             ▼               │                ▼
┌────────┐    ┌────────┐    ┌────────┐        ▼            ┌────────┐
│Migrate │    │Func    │    │Perform │    ┌────────┐       │Pre-    │
│Format  │    │Browser │    │Security│    │Review  │       │Launch  │
│QA      │    │Mobile  │    │SEO     │    │Feedback│       │Go-Live │
│        │    │        │    │        │    │Handover│       │Post    │
└────────┘    └────────┘    └────────┘    └────────┘       └────────┘
```

### Time Allocation Model

The 20-day cycle breaks down as follows:

| Phase | % | Days | Gate Criteria |
|-------|---|------|---------------|
| 1. Discovery | 10% | 2.0 | Signed requirements document |
| 2. Planning | 8% | 1.5 | Technical spec approved |
| 3. Design | 15% | 3.0 | Design sign-off from client |
| 4. Environment | 5% | 1.0 | WordPress accessible on staging |
| 5. Backend | 20% | 4.0 | All functionality working |
| 6. Frontend | 20% | 4.0 | All pages built and responsive |
| 7. Content | 7% | 1.5 | All content entered |
| 8. Testing | 5% | 1.0 | Functional & browser tests complete |
| 9. Functionality | 5% | 1.0 | Performance, security, SEO verified |
| 10. User Acceptance | 3% | 0.5 | Client sign-off |
| 11. Deployment | 2% | 0.5 | Site live, handover complete |

### Project Status Tracking

Each task moves through these statuses:

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Backlog  │ ─▶ │  To Do   │ ─▶ │   In     │ ─▶ │   In     │ ─▶ │   Done   │
│          │    │          │    │ Progress │    │  Review  │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
                                      │
                                      ▼
                               ┌──────────┐
                               │ Blocked  │
                               │          │
                               └──────────┘
```

### Priority Levels

| Priority | Definition | Response Time |
|----------|------------|---------------|
| Critical | Blocks other tasks or client-facing deadline | Same day |
| High | Important for project progress | Within 2 days |
| Medium | Standard development work | Within phase |
| Low | Nice-to-have, can defer | End of project |

---

## Client Management

### Client Touchpoints

The system defines clear client interaction points:

```
   Week 1                    Week 2              Week 3               Week 4
──────────────────────────────────────────────────────────────────────────────────────
     │                         │                    │                    │
     ▼                         ▼                    ▼                    ▼
┌─────────┐          ┌─────────┐          ┌─────────┐          ┌─────────┐
│ KICKOFF │          │ DESIGN  │          │PROGRESS │          │ UAT &   │
│  CALL   │          │ REVIEW  │          │ UPDATE  │          │ LAUNCH  │
└─────────┘          └─────────┘          └─────────┘          └─────────┘
     │                    │                    │                    │
     ▼                    ▼                    ▼                    ▼
Discovery            Design Sign-off      Dev Demo            Go-Live
Requirements         Color/Typography     Functionality       Training
Scope Agreement      UI/UX Approval       Content Review      Handover
```

### Client-Facing Tasks

Tasks labeled `client-facing` require direct client interaction:

| Phase | Client-Facing Task | Deliverable |
|-------|-------------------|-------------|
| Discovery | Client Onboarding & Kickoff | Requirements Document |
| Planning | Technical Specification | Sitemap & Wireframes |
| Design | Design Review & Approval | Approved Mockups |
| UAT | Client Review Session | UAT Sign-off |
| Launch | Post-Launch Handover | Training + Documentation |

### Client Communication Protocol

```
DISCOVERY PHASE
├── Day 1: Kickoff call scheduled
├── Day 2: Discovery questionnaire sent
├── Day 3: Requirements documented
└── Day 4: Scope agreement signed
          └── GATE: Cannot proceed without sign-off

DESIGN PHASE
├── Day 5-6: Design work (no client contact needed)
├── Day 7: Design presentation scheduled
└── Day 8: Design review call
          ├── Round 1 feedback collected
          ├── Revisions implemented
          └── GATE: Design approval required

UAT PHASE
├── Day 19: UAT session scheduled
├── Client walkthrough conducted
├── Punch list created
└── GATE: Final sign-off required for launch
```

### Client Portal (GitHub Projects View)

Clients can be given read-only access to their project board:

**What clients see:**
- Task status (To Do, In Progress, Done)
- Phase progress
- Upcoming milestones

**What clients don't see:**
- Developer assignments
- Internal notes
- Time tracking details

---

## Team Management

### The 6-Developer Model

This system is optimized for a team of 6 developers handling 6 parallel projects:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TEAM STRUCTURE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐                                                        │
│  │   DEV 1     │  Lead / Full-Stack                                     │
│  │   (Lead)    │  • Handles complex projects                            │
│  │             │  • Provides technical oversight                         │
│  │             │  • Code reviews for team                                │
│  └─────────────┘  • 1 complex project + mentoring                       │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐                                       │
│  │   DEV 2     │  │   DEV 3     │  Frontend Specialists                 │
│  │   (FE)      │  │   (FE)      │  • Page building                      │
│  │             │  │             │  • Responsive design                   │
│  │             │  │             │  • Animations/interactions             │
│  └─────────────┘  └─────────────┘  • 2 projects each                    │
│                                                                          │
│  ┌─────────────┐  ┌─────────────┐                                       │
│  │   DEV 4     │  │   DEV 5     │  Backend Specialists                  │
│  │ (BE/Ecom)   │  │ (BE/Int)    │  • WooCommerce                        │
│  │             │  │             │  • Custom functionality                │
│  │             │  │             │  • API integrations                    │
│  └─────────────┘  └─────────────┘  • 1-2 projects each                  │
│                                                                          │
│  ┌─────────────┐                                                        │
│  │   DEV 6     │  QA / Support                                          │
│  │   (QA)      │  • Testing all 6 projects                              │
│  │             │  • Cross-browser verification                           │
│  │             │  • Performance audits                                   │
│  └─────────────┘  • Floats across all projects                          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Project-Developer Assignment Matrix

| Project | Type | Lead Dev | Support Dev | QA |
|---------|------|----------|-------------|-----|
| Client Alpha | E-Commerce | Dev 4 | Dev 1 | Dev 6 |
| Client Beta | Corporate | Dev 1 | Dev 2 | Dev 6 |
| Client Gamma | Portfolio | Dev 2 | Dev 3 | Dev 6 |
| Client Delta | Blog | Dev 3 | Dev 2 | Dev 6 |
| Client Epsilon | Static | Dev 2 | Dev 3 | Dev 6 |
| Client Zeta | Dynamic | Dev 5 | Dev 4 | Dev 6 |

### Workload Distribution

```
WEEK VIEW - Developer Capacity
────────────────────────────────────────────────────────────────────────
Developer    │ Mon        │ Tue        │ Wed        │ Thu        │ Fri
────────────────────────────────────────────────────────────────────────
Dev 1 (Lead) │ Beta-BE    │ Beta-BE    │ Alpha-Rev  │ Beta-FE    │ Beta-FE
Dev 2 (FE)   │ Gamma-FE   │ Gamma-FE   │ Epsilon-FE │ Epsilon-FE │ Delta-Sup
Dev 3 (FE)   │ Delta-FE   │ Delta-FE   │ Gamma-Sup  │ Delta-FE   │ Epsilon-Sup
Dev 4 (Ecom) │ Alpha-Woo  │ Alpha-Woo  │ Alpha-Pay  │ Zeta-Sup   │ Alpha-Ship
Dev 5 (Int)  │ Zeta-API   │ Zeta-API   │ Zeta-API   │ Zeta-FE    │ Zeta-FE
Dev 6 (QA)   │ Gamma-Test │ Delta-Test │ Alpha-Test │ Beta-Test  │ All-Review
────────────────────────────────────────────────────────────────────────
```

### Daily Standup Template

For managing 6 parallel projects, use this standup format:

```
DAILY STANDUP - [DATE]

PROJECT STATUS ROUND
─────────────────────
Each developer reports (30 seconds max per project):
1. Project name
2. Current task
3. Status: On Track / At Risk / Blocked
4. ETA to next milestone

BLOCKERS & HANDOFFS
─────────────────────
• List any blockers requiring PM intervention
• Identify handoff needs (BE → FE, Dev → QA)

PRIORITY CONFLICTS
─────────────────────
• Flag if developer is overallocated today
• Adjust assignments as needed
```

### Task Handoff Protocol

```
PHASE TRANSITION CHECKLIST

Backend → Frontend Handoff
├── [ ] All custom post types registered
├── [ ] ACF fields configured and documented
├── [ ] Plugin stack finalized
├── [ ] Staging environment stable
└── [ ] Handoff meeting completed

Development → QA Handoff
├── [ ] All pages built
├── [ ] Responsive implementation complete
├── [ ] Content populated
├── [ ] Developer self-test completed
└── [ ] QA ticket created with test scope

QA → UAT Handoff
├── [ ] All test cases passed
├── [ ] Bug fixes verified
├── [ ] Performance scores meet targets
├── [ ] Security scan clean
└── [ ] UAT environment prepared
```

---

## The WordPress Development Lifecycle

### Phase Details

#### Phase 1: Discovery & Requirements (10% | 2 days)

**Objective:** Understand what the client needs and document requirements.

**Tasks:**
1. **Client Onboarding & Kickoff Call** (3%)
   - Schedule and conduct kickoff meeting
   - Document business objectives
   - Identify target audience
   - Competitor analysis

2. **Requirements Gathering** (4%)
   - Determine site type (static, e-commerce, etc.)
   - List required features
   - Inventory existing content
   - Identify integrations needed

3. **Technical Scoping** (3%)
   - Validate hosting requirements
   - Plan domain & SSL
   - Define performance targets
   - Security requirements

**Gate:** Signed requirements document

---

#### Phase 2: Planning & Architecture (8% | 1.5 days)

**Objective:** Design the technical solution and project plan.

**Tasks:**
1. **Project Planning** (3%)
   - Define milestones
   - Allocate resources
   - Setup communication channels
   - Risk assessment

2. **Solution Architecture** (3%)
   - Theme selection
   - Plugin stack decision
   - Database planning
   - URL structure

3. **Technical Specification** (2%)
   - Create sitemap
   - Define wireframes
   - Document specifications

**Gate:** Approved technical specification

---

#### Phase 3: Design (15% | 3 days)

**Objective:** Create and approve visual design.

**Tasks:**
1. **Visual Identity Setup** (5%)
   - Color palette selection
   - Typography selection
   - Style guide creation

2. **UI/UX Design - Homepage** (3%)
   - Desktop/tablet/mobile mockups
   - Hero section
   - Navigation design

3. **UI/UX Design - Inner Pages** (4%)
   - Page templates
   - User flow mapping

4. **Design Review & Approval** (3%)
   - Client presentation
   - 2 revision rounds
   - Final sign-off

**Gate:** Design approval from client

---

#### Phase 4: Environment Setup (5% | 1 day)

**Objective:** Prepare development infrastructure.

**Tasks:**
1. **Hostinger/cPanel Configuration** (2%)
   - Domain pointing
   - SSL installation
   - PHP configuration
   - Database creation

2. **WordPress Installation** (2%)
   - Fresh installation
   - Admin setup
   - Staging URL

3. **Development Environment** (1%)
   - Local dev sync
   - Backup automation

**Gate:** WordPress accessible on staging URL

---

#### Phase 5: Backend Development (20% | 4 days)

**Objective:** Build all functionality and features.

**Tasks:**
1. **Theme Setup** (5%)
   - Install and configure theme
   - Create child theme
   - Header/footer setup

2. **Plugin Installation** (3%)
   - Page builder
   - SEO, forms, security
   - Caching, backup

3. **Custom Functionality** (6%)
   - Custom post types
   - ACF fields
   - Shortcodes, widgets
   - API integrations

4. **E-Commerce Setup** (6%) - if applicable
   - WooCommerce
   - Payment gateways
   - Shipping, tax

**Gate:** All functionality working on staging

---

#### Phase 6: Frontend Development (20% | 4 days)

**Objective:** Build all pages and ensure responsiveness.

**Tasks:**
1. **Core Pages** (8%)
   - Homepage
   - About, Services, Contact
   - Blog templates

2. **Secondary Pages** (5%)
   - Policy pages
   - Landing pages
   - 404, search results

3. **Responsive Implementation** (4%)
   - Tablet/mobile optimization
   - Touch navigation

4. **Animation & Interactions** (3%)
   - Scroll animations
   - Hover effects

**Gate:** All pages built and responsive

---

#### Phase 7: Content Population (7% | 1.5 days)

**Objective:** Enter all content and optimize for SEO.

**Tasks:**
1. **Content Entry** (4%)
   - Text content
   - Image optimization (WebP)
   - Media organization

2. **Content Formatting** (3%)
   - Typography consistency
   - Internal linking
   - Meta data

**Gate:** All content entered, SEO metadata complete

---

#### Phase 8: Testing (10% | 2 days)

**Objective:** Verify quality across all dimensions.

**Tasks:**
1. **Functional Testing** (3%)
   - Links, forms, checkout
   - Search, login

2. **Cross-Browser Testing** (2%)
   - Chrome, Firefox, Safari, Edge
   - iOS, Android

3. **Performance Testing** (2%)
   - PageSpeed (target: 90+)
   - Core Web Vitals

4. **Security Testing** (2%)
   - Vulnerability scan
   - SSL verification

5. **SEO Audit** (1%)
   - Meta verification
   - Schema markup
   - Sitemap submission

**Gate:** QA checklist 100% complete

---

#### Phase 9: User Acceptance Testing (3% | 0.5 days)

**Objective:** Get client approval.

**Tasks:**
1. **Client Review Session** (2%)
   - Guided walkthrough
   - Feature demonstration
   - Feedback collection

2. **Feedback Implementation** (1%)
   - Punch list
   - Minor revisions
   - Final sign-off

**Gate:** Client sign-off document

---

#### Phase 10: Deployment & Launch (2% | 0.5 days)

**Objective:** Go live and hand over.

**Tasks:**
1. **Pre-Launch Checklist** (1%)
   - Favicon, analytics
   - Search console
   - Social meta tags

2. **Go-Live** (0.5%)
   - Production migration
   - Cache setup
   - Final verification

3. **Handover** (0.5%)
   - Documentation
   - Training
   - Credentials

**Gate:** Site live, client trained

---

## Technical Setup

### Prerequisites

1. **Node.js** v18 or higher
2. **GitHub Account** with repository access
3. **GitHub Personal Access Token** with scopes:
   - `repo` (full repository access)
   - `project` (read:project, write:project)

### Installation

```bash
# Clone or extract the project
cd github-project-populator

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

### Configuration

Edit `.env` with your values:

```env
# Required
GITHUB_TOKEN=YOUR_GITHUB_TOKEN_HERE
GITHUB_OWNER=your-username-or-org
GITHUB_REPO=your-repository-name

# Optional
PROJECT_NUMBER=5          # Use existing project
CLIENT_NAME=Client Alpha  # Project name prefix
```

### Creating Your GitHub Token

1. Go to [GitHub Settings → Developer Settings → Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - ✅ `repo` (all)
   - ✅ `project` (read:project, write:project)
4. Copy the token

### Usage Commands

```bash
# List existing projects
npm run list-projects

# Create single project
CLIENT_NAME="Client Name" npm run populate

# Create 6 projects at once (interactive)
GITHUB_TOKEN="YOUR_TOKEN_HERE" CLIENT_NAME="Gaia Digital" node backend/index.js

# Populate existing project
PROJECT_NUMBER=5 CLIENT_NAME="Client Alpha" npm run populate

# Generate reports
PROJECT_NUMBER=1 npm run report-single    # Single project
npm run report-all                        # All projects

# Preview without creating (dry run)
CLIENT_NAME="Test Client" npm run dry-run
```

### Configuring Your Project View

After creating a project, you'll want to customize which columns are visible in your board view:

**Method 1: Add columns using the + button**
1. Open your project board
2. Look for the **"+" button** at the right edge of your column headers
3. Click it to see all available fields
4. Select the fields you want to display: Phase, Phase Description, Developer, Status, Est. Days

**Method 2: Use column header dropdowns**
1. Click any column header to see a dropdown menu (▼)
2. Select "Hide field" or "Show field" options
3. Customize which fields appear in your view

**Recommended columns for WordPress projects:**
- Title (always visible)
- Status
- Phase
- Phase Description
- Developer
- Priority
- Est. Days

**Pro tip:** You can create multiple views with different column configurations for different team members (e.g., "Developer View" vs "Manager View").

---

## Daily Operations

### Morning Routine (Project Manager)

```bash
# 1. Check all project statuses
#    Open GitHub Projects → Filter by "In Progress"

# 2. Identify blockers
#    Filter by "Blocked" status

# 3. Review today's priorities
#    Filter by "Critical" priority

# 4. Check phase progress
#    Group by "Phase" field
```

### Weekly Review Checklist

```
MONDAY - Week Planning
├── [ ] Review all 6 project statuses
├── [ ] Identify phase transitions this week
├── [ ] Schedule client touchpoints
└── [ ] Allocate developer time

FRIDAY - Week Closeout
├── [ ] Verify completed tasks match plan
├── [ ] Update project health status
├── [ ] Prepare client status reports
└── [ ] Plan next week's priorities
```

### GitHub Projects Views to Create

1. **Kanban by Status** (default)
   - Columns: Backlog, To Do, In Progress, In Review, Done, Blocked

2. **Table by Phase**
   - Group by Phase field
   - Sort by Priority

3. **Table by Developer**
   - Group by Developer field
   - Filter by Status != Done

4. **Timeline View**
   - Start: Task creation date
   - End: Target completion (based on phase)

---

## Reporting & Metrics

### Automated Markdown Reports

Generate comprehensive markdown reports for your projects with built-in commands.

**Single Project Report:**
```bash
PROJECT_NUMBER=1 npm run report-single
# or by name:
PROJECT_NAME="Client Alpha" npm run report-single
```

Generates detailed report including:
- 📊 Progress summary with completion percentages and **To Do** count
- 📈 Active Days calculation (Updated - Created dates)
- 📋 Status breakdown (Backlog, To Do, In Progress, Done, Blocked)
- 🎯 Phase breakdown with task lists
- ⚡ Priority breakdown
- 👥 Developer assignments

**All Projects Portfolio Report:**
```bash
npm run report-all
```

Generates comprehensive portfolio overview including:
- 📊 Executive summary across all projects
- 🟢 Active projects table with progress bars
- 🏥 **Portfolio health indicators** (risk assessment and project status)
- 📋 Detailed breakdown for each project with:
  - Active Days tracking
  - Correct To Do calculation (Total - Completed - In Progress)
  - Progress visualization
  - In Progress and Blocked items
- ⚠️ Projects requiring attention
- 📊 Closed projects summary

**Recent Enhancements (January 2026):**
- Added To Do row to Progress Summary tables
- Active Days calculation in all reports
- Improved To Do calculation accuracy
- Reorganized portfolio report for better readability
- Removed redundant Phase Distribution from individual sections

**Output:** Reports saved to `reports/` directory as timestamped markdown files.

---

### Project Health Dashboard

```
PROJECT: Client Alpha - E-Commerce
────────────────────────────────────────────────────────────
Phase Progress:    █████████░░░░░░░░░░░  45% (Phase 5: Backend)
Activities Completed:   14 / 33
Days Elapsed:      9 / 20
Status:            🟢 ON TRACK

Phase Breakdown:
├── Phase 1: Discovery         ████████████████████  100% ✓
├── Phase 2: Planning          ████████████████████  100% ✓
├── Phase 3: Design            ████████████████████  100% ✓
├── Phase 4: Environment       ████████████████████  100% ✓
├── Phase 5: Backend           ██████████░░░░░░░░░░   50% ← Current
├── Phase 6: Frontend          ░░░░░░░░░░░░░░░░░░░░    0%
├── Phase 7: Content           ░░░░░░░░░░░░░░░░░░░░    0%
├── Phase 8: Testing           ░░░░░░░░░░░░░░░░░░░░    0%
├── Phase 9: Functionality     ░░░░░░░░░░░░░░░░░░░░    0%
├── Phase 10: User Acceptance  ░░░░░░░░░░░░░░░░░░░░    0%
└── Phase 11: Deployment       ░░░░░░░░░░░░░░░░░░░░    0%
────────────────────────────────────────────────────────────
```

### Client Status Report Template

```
STATUS REPORT - [Client Name]
Date: [Date]
Project Manager: [Name]

OVERALL STATUS: 🟢 On Track / 🟡 At Risk / 🔴 Behind

CURRENT PHASE: [Phase Name]
Completion: [X]%

COMPLETED THIS WEEK:
• [Task 1]
• [Task 2]

PLANNED NEXT WEEK:
• [Task 1]
• [Task 2]

UPCOMING CLIENT ACTIONS:
• [Date]: [Action required]

BLOCKERS/RISKS:
• [If any]
```

### Team Utilization Report

```
TEAM UTILIZATION - Week of [Date]
────────────────────────────────────────────────────────────
Developer    │ Allocated │ Available │ Projects
────────────────────────────────────────────────────────────
Dev 1 (Lead) │    85%    │    15%    │ Beta, Alpha (review)
Dev 2 (FE)   │   100%    │     0%    │ Gamma, Epsilon
Dev 3 (FE)   │    90%    │    10%    │ Delta, Gamma (support)
Dev 4 (Ecom) │    95%    │     5%    │ Alpha
Dev 5 (Int)  │    80%    │    20%    │ Zeta
Dev 6 (QA)   │   100%    │     0%    │ All projects
────────────────────────────────────────────────────────────
TEAM TOTAL   │    92%    │     8%    │ 6 active projects
```

---

## Scaling the System

### Adding More Projects

```bash
# For 7+ projects, add more developers or extend timeline

# Option 1: Add developers
# Update wordpress-project.config.js:
assignee: {
  options: [
    "Dev 1 (Lead)", 
    "Dev 2 (FE)", 
    "Dev 3 (FE)",
    "Dev 4 (BE/Ecom)", 
    "Dev 5 (BE/Int)", 
    "Dev 6 (QA)",
    "Dev 7 (FE)",      // New
    "Dev 8 (BE)"       // New
  ]
}

# Option 2: Extend project timeline
# Change totalDays in config from 20 to 25 or 30
```

### Custom Project Templates

Create specialized templates for different project types:

```javascript
// backend/config/ecommerce-project.config.js
// - Extended WooCommerce phase
// - Additional payment testing

// backend/config/portfolio-project.config.js
// - Reduced backend phase
// - Extended design phase

// backend/config/enterprise-project.config.js
// - Additional security phase
// - Compliance documentation
```

### Integration Options

```
POSSIBLE INTEGRATIONS
─────────────────────
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Slack     │     │   Asana     │     │   Jira      │
│ Notifications│    │   Sync      │     │   Export    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                    GitHub Projects
                          │
       ┌──────────────────┼───────────────────┐
       │                  │                   │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Time       │     │   Client    │     │  Invoicing  │
│  Tracking   │     │   Portal    │     │  System     │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Resource not accessible" | Check token has `project` scope |
| "Could not resolve ProjectV2" | Verify PROJECT_NUMBER exists |
| Rate limiting | Increase delay in index.js |
| Labels not creating | May already exist with different case |

---

---

## Additional Documentation

All guides are located in the `reference/` directory:

### Quick Start
- **[Simple Use Guide](reference/guide_simple_use.md)** - Commands for adding/deleting projects

### GitHub Setup
- **[Multi-Account Guide](reference/guide_github_multi_account.md)** - Managing 3 GitHub accounts (SSH, CLI, remotes)
- **[Dual Git Setup](reference/guide_manage_dual_git.md)** - Quick account switching reference

### Reporting
- **[Report Guide](reference/guide_make_report.md)** - Generating project and portfolio reports

### Workflows
- **[GitHub Project Plan](reference/project_plan_github.md)** - Detailed project planning
- **[Rolling Pipeline](reference/rolling_pipeline.md)** - Managing parallel projects
- **[WordPress Workflow](reference/guide_github_wordpress.md)** - WordPress development process
- **[Hostinger Workflow](reference/workflow_hostinger.md)** - Deployment workflows

---

## License

MIT License - Customize freely for your agency.

---

## Author

Built for Gaia Digital Agency WordPress development workflow management.

**Version:** 1.1.0
**Last Updated:** January 12, 2026

## Changelog

### Version 1.1.0 (January 12, 2026)
- Enhanced reporting system with To Do counts and Active Days tracking
- Improved portfolio report organization with health indicators moved up
- Fixed To Do calculation logic across all reports
- Removed redundant Phase Distribution from individual project sections
- Added .claude/ directory for AI assistant context

### Version 1.0.0
- Initial release with complete WordPress project template
- Single and portfolio report generation
- Batch project creation support
- 11-phase workflow with 33 activities
