# Rolling Pipeline Workflow

A guide for managing a continuous flow of 6 parallel WordPress projects with new projects starting as others finish.

---

## Overview

**Capacity:** 6 developers × 6 active projects at all times
**Cycle:** 20-day project lifecycle
**Flow:** As one project completes (launch), a new one starts (discovery)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLLING PIPELINE VIEW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Week 1    Week 2    Week 3    Week 4    Week 5    Week 6       │
│  ───────────────────────────────────────────────────────────────│
│                                                                  │
│  Project A ████████████████████ LAUNCH ✓                        │
│            └──────────────────┘                                 │
│                      Project G ████████████████████ (starts W5) │
│                                                                  │
│  Project B      ████████████████████ LAUNCH ✓                   │
│                 └──────────────────┘                            │
│                           Project H ████████████████ (starts W6)│
│                                                                  │
│  Project C           ████████████████████ LAUNCH ✓              │
│                      └──────────────────┘                       │
│                                Project I ████████████ (starts W7)│
│                                                                  │
│  Project D ████████████████████████████████ (continues...)      │
│  Project E ████████████████████████████████ (continues...)      │
│  Project F ████████████████████████████████ (continues...)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Initial Setup (Month 1)

### Step 1: Create Your First 6 Projects

```bash
# Run batch creation
npm run batch-create

# When prompted, enter your 6 initial clients:
# 1. Client Alpha
# 2. Client Beta
# 3. Client Gamma
# 4. Client Delta
# 5. Client Epsilon
# 6. Client Zeta
```

### Step 2: Populate All 6 Projects

```bash
# The batch-create script will output commands like:
PROJECT_NUMBER=1 CLIENT_NAME="Client Alpha" npm run populate
PROJECT_NUMBER=2 CLIENT_NAME="Client Beta" npm run populate
PROJECT_NUMBER=3 CLIENT_NAME="Client Gamma" npm run populate
PROJECT_NUMBER=4 CLIENT_NAME="Client Delta" npm run populate
PROJECT_NUMBER=5 CLIENT_NAME="Client Epsilon" npm run populate
PROJECT_NUMBER=6 CLIENT_NAME="Client Zeta" npm run populate
```

### Step 3: Stagger Start Dates (Optional)

If you want to stagger the initial launch:

**Option A: All start together (simpler)**
- All 6 projects start on the same day
- All will finish around the same time (4 weeks later)
- You'll need 6 new projects ready to start simultaneously

**Option B: Stagger over 2 weeks (recommended for smooth transition)**
```
Week 1, Day 1: Start Projects A, B, C
Week 1, Day 3: Start Projects D, E
Week 2, Day 1: Start Project F
```

This creates a natural rolling wave where projects finish at different times.

---

## Steady-State Operations (Month 2+)

### Weekly Pipeline Management

#### Monday: Pipeline Review

```bash
# 1. Check all active projects
npm run list-projects

# 2. Identify projects finishing this week
#    Look for projects in Phase 9 (UAT) or Phase 10 (Launch)

# 3. Prepare replacement projects
#    - Have client names ready
#    - Confirm developers are available
```

#### When a Project Launches (Completes Phase 10)

**Step 1: Archive the Completed Project**

In GitHub Projects:
1. Add a "Status" field value: `✅ COMPLETED`
2. Move to an "Archive" view (create if needed)
3. Or close the project (if you don't need historical reference)

**Step 2: Create the Replacement Project**

```bash
# Create a single new project
# You'll input the client details interactively

# Option 1: Use batch-create for one project
npm run batch-create
# Enter: 1 (for number of projects)
# Enter client details

# Option 2: Manually create via GitHub UI + populate
# 1. Create project in GitHub Projects UI
# 2. Note the project number
# 3. Run populate:
PROJECT_NUMBER=<new_number> CLIENT_NAME="New Client" npm run populate
```

**Step 3: Assign Resources**

1. Open the new project in GitHub Projects
2. Assign the developer who just freed up from the completed project
3. Move Phase 1 tasks to "To Do"
4. Schedule kickoff call

---

## Pipeline Health Dashboard

### Weekly Status Template

```
PIPELINE STATUS - Week of [Date]
────────────────────────────────────────────────────────────────

ACTIVE PROJECTS (6):
┌────────────────┬───────────┬─────────┬───────────┬─────────┐
│ Client         │ Phase     │ Day     │ Developer │ Status  │
├────────────────┼───────────┼─────────┼───────────┼─────────┤
│ Alpha          │ Phase 8   │ 16/20   │ Dev 4     │ 🟢 Good │
│ Beta           │ Phase 6   │ 12/20   │ Dev 1     │ 🟢 Good │
│ Gamma          │ Phase 5   │ 10/20   │ Dev 2     │ 🟡 Risk │
│ Delta          │ Phase 4   │  8/20   │ Dev 3     │ 🟢 Good │
│ Epsilon        │ Phase 3   │  5/20   │ Dev 2     │ 🟢 Good │
│ Zeta           │ Phase 2   │  3/20   │ Dev 5     │ 🟢 Good │
└────────────────┴───────────┴─────────┴───────────┴─────────┘

LAUNCHING THIS WEEK:
• Alpha (Day 20 - Friday) → Dev 4 available for new project

STARTING NEXT WEEK:
• Client Eta (assigned to Dev 4)

PIPELINE HEALTH: 🟢 HEALTHY
```

---

## Project Intake Queue

Maintain a backlog of upcoming projects so you always have clients ready when a slot opens.

### Create a "Pipeline Queue" Spreadsheet

| Queue Position | Client Name | Type | Target Start | Assigned Dev | Notes |
|---|---|---|---|---|---|
| 1 | Client Eta | E-Commerce | Week 5 | Dev 4 | Waiting for Alpha to finish |
| 2 | Client Theta | Corporate | Week 6 | Dev 1 | Waiting for Beta to finish |
| 3 | Client Iota | Portfolio | Week 7 | Dev 2 | Waiting for Gamma to finish |
| 4 | Client Kappa | Static | TBD | TBD | In sales pipeline |
| 5 | Client Lambda | Dynamic | TBD | TBD | Proposal sent |

### Intake Workflow

```
NEW CLIENT INQUIRY
       ↓
Sales/Discovery Call
       ↓
Add to Pipeline Queue
       ↓
Wait for Developer Availability
       ↓
Create GitHub Project
       ↓
Populate with Template
       ↓
START PROJECT
```

---

## Monthly Capacity Planning

### Calculate Your Throughput

```
6 developers × 20-day projects = 6 projects per month

If staggered evenly:
• Week 1: 1-2 projects launch, 1-2 new ones start
• Week 2: 1-2 projects launch, 1-2 new ones start
• Week 3: 1-2 projects launch, 1-2 new ones start
• Week 4: 1-2 projects launch, 1-2 new ones start

Result: ~6 projects completed per month
        ~6 new projects started per month
        6 always in progress
```

### Annual Capacity

```
6 projects/month × 12 months = 72 projects/year

With holidays and buffer:
Realistic: 60-65 projects/year
```

---

## Automation Scripts (Optional)

### Create a Helper Script for New Projects

Create `backend/start-new-project.sh`:

```bash
#!/bin/bash

# Rolling Pipeline - New Project Starter
# Usage: ./start-new-project.sh "Client Name" "Site Type" "Developer"

CLIENT_NAME=$1
SITE_TYPE=$2
DEVELOPER=$3

echo "🚀 Starting new project: $CLIENT_NAME"
echo "   Type: $SITE_TYPE"
echo "   Developer: $DEVELOPER"
echo ""

# Create project (you'll need to note the project number from output)
echo "Creating GitHub Project..."
# Note: GitHub API doesn't return project number in batch-create
# You'll need to manually note this or use list-projects

read -p "Enter the new project number from GitHub: " PROJECT_NUM

# Populate the project
echo "Populating project #$PROJECT_NUM..."
PROJECT_NUMBER=$PROJECT_NUM CLIENT_NAME="$CLIENT_NAME" npm run populate

echo ""
echo "✅ Project created and populated!"
echo "   Project Number: #$PROJECT_NUM"
echo "   Next: Assign tasks in GitHub Projects to $DEVELOPER"
```

Make it executable:
```bash
chmod +x backend/start-new-project.sh
```

Usage:
```bash
./backend/start-new-project.sh "Client Eta" "E-Commerce" "Dev 4"
```

---

## GitHub Projects Views for Rolling Pipeline

### Create These Custom Views

#### View 1: Active Projects Overview
- **Layout:** Table
- **Group by:** Status
- **Filter:** Status != "Completed"
- **Sort:** By Phase (ascending)
- **Columns:** Client Name, Phase, Developer, Days Elapsed, Status

#### View 2: Launching This Month
- **Layout:** Board
- **Filter:** Phase = "Phase 9" OR Phase = "Phase 10"
- **Group by:** Developer
- **Purpose:** See which projects are finishing and which developers will be free

#### View 3: Pipeline Timeline
- **Layout:** Timeline (Roadmap)
- **Filter:** Status != "Completed"
- **Start Date:** Project created date
- **End Date:** Estimated completion (created date + 20 days)
- **Purpose:** Visual representation of project flow

#### View 4: Completed Archive
- **Layout:** Table
- **Filter:** Status = "Completed"
- **Sort:** Completion date (descending)
- **Purpose:** Historical reference

---

## Best Practices

### 1. Always Have Projects Queued
- Maintain 3-5 projects in your intake queue
- Pre-qualify clients before adding to queue
- Assign tentative start dates based on current pipeline

### 2. Don't Overcommit
- Resist pressure to start a 7th project "just this once"
- The system is designed for 6 concurrent projects
- Overloading causes delays across ALL projects

### 3. Buffer Time
- Real-world: Some projects will take 22-25 days instead of 20
- Build in 2-3 days buffer when promising client deadlines
- Better to finish early than consistently late

### 4. Developer Handoffs
- When Dev 4 finishes Project Alpha, immediately start Client Eta
- Don't leave developers idle between projects
- Use 1-2 day gaps for project retrospectives and prep

### 5. Track Metrics
- Average project duration (target: 20 days)
- Developer utilization (target: 85-95%)
- Projects completed per month (target: 6)
- Client satisfaction scores

---

## Troubleshooting

### What if 2 projects finish the same week?

**Solution:** Have 2 clients queued and ready
```bash
# Create both at once
npm run batch-create
# Enter: 2 (for number of projects)
```

### What if a project is delayed?

**Impact:** The replacement project start date shifts
**Action:**
1. Update the pipeline queue spreadsheet
2. Communicate new start date to queued client
3. Identify root cause of delay (scope creep, client delays, etc.)

### What if a developer is sick/on vacation?

**Short-term (1-3 days):**
- Other developers cover critical tasks
- Push less urgent tasks back 1-3 days

**Long-term (1+ weeks):**
- Extend that project's timeline
- Delay the replacement project start
- Or temporarily assign a 2nd project to another developer

---

## Example: First 8 Weeks

```
WEEK 1: Start Projects A, B, C, D, E, F (initial batch of 6)

WEEK 2-3: All 6 projects in phases 2-5 (planning, design, environment, backend)

WEEK 4: Projects A, B starting Phase 9-10 (UAT/Launch)
        Queue up Projects G, H

WEEK 5:
  • Project A LAUNCHES → Create Project G → Assign to Dev 4
  • Project B LAUNCHES → Create Project H → Assign to Dev 1
  • Active: C, D, E, F, G, H (6 projects)

WEEK 6: Projects C, D approaching launch
        Queue up Projects I, J

WEEK 7:
  • Project C LAUNCHES → Create Project I → Assign to Dev 2
  • Project D LAUNCHES → Create Project J → Assign to Dev 3
  • Active: E, F, G, H, I, J (6 projects)

WEEK 8: Steady state - always 6 active projects
```

---

## Summary Checklist

**Weekly:**
- [ ] Review pipeline status (6 active projects)
- [ ] Identify projects finishing this/next week
- [ ] Confirm queued projects are ready to start
- [ ] Update pipeline queue spreadsheet

**When a Project Launches:**
- [ ] Mark project as completed in GitHub
- [ ] Celebrate with team! 🎉
- [ ] Create replacement project
- [ ] Assign to freed-up developer
- [ ] Move to discovery phase

**Monthly:**
- [ ] Review completed projects (target: ~6)
- [ ] Analyze average project duration
- [ ] Update capacity forecast
- [ ] Sales team: Replenish pipeline queue

---

**Remember:** The key to a smooth rolling pipeline is maintaining a healthy queue of pre-qualified clients ready to start when a slot opens.
