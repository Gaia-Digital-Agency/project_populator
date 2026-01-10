# Simple Step-by-Step Guide: Rolling Pipeline

A practical walkthrough for managing your first two projects, with the second starting one day after the first.

---

## Initial Setup (One-Time)

### Step 1: Install and Configure

```bash
# Navigate to the project folder
cd github_populator

# Install dependencies
npm install

# Copy the environment file
cp .env.example .env
```

### Step 2: Configure Your GitHub Credentials

Edit the `.env` file:

```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_OWNER=your-github-username
GITHUB_REPO=your-repository-name
```

**To get your GitHub token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` and `project`
4. Copy the token and paste it in `.env`

### Step 3: Verify Setup

```bash
# Test that everything works
npm run list-projects
```

You should see your existing GitHub projects (or an empty list if none exist yet).

---

## Starting Your First Project

### Step 4: Create Project #1

```bash
# Run the batch creator
npm run batch-create
```

**When prompted:**
- "Use default client configuration? (y/n):" → Type `n`
- "How many projects to create?" → Type `1`
- "Client name:" → Type `Client Alpha`
- "Site type:" → Type `E-Commerce` (or your actual type)
- "Proceed? (y/n):" → Type `y`

**Output will show:**
```
✅ Created: Client Alpha → Project #1
```

### Step 5: Populate Project #1 with Tasks

```bash
# Use the project number from Step 4 (example: #1)
PROJECT_NUMBER=1 CLIENT_NAME="Client Alpha" npm run populate
```

**This creates:**
- 33 activities organized in 11 phases
- Labels for categorization
- Custom fields (Status, Phase, Priority, etc.)
- Developer assignment options

### Step 6: Open Project #1 in GitHub

1. Go to your GitHub profile/organization
2. Click "Projects" tab
3. Open "Client Alpha - WordPress Development"

**You'll see:**
- All 33 activities in "Backlog" status
- Activities grouped by 11 phases
- Ready to start working!

### Step 7: Start Working on Project #1

**Day 1 - Discovery Phase:**

1. Open Phase 1 tasks
2. Move "Client Onboarding & Kickoff Call" to "To Do"
3. Assign to a developer (e.g., "Dev 1 (Lead)")
4. Start the kickoff call
5. Move task to "In Progress"
6. Complete the task → Move to "Done"

**Continue this pattern** through all 11 phases over the next 20 days.

---

## Starting Your Second Project (One Day Later)

### Step 8: Create Project #2 (Day 2)

```bash
# Same process as Step 4
npm run batch-create
```

**When prompted:**
- "How many projects to create?" → Type `1`
- "Client name:" → Type `Client Beta`
- "Site type:" → Type `Corporate`
- "Proceed? (y/n):" → Type `y`

**Output:**
```
✅ Created: Client Beta → Project #2
```

### Step 9: Populate Project #2

```bash
PROJECT_NUMBER=2 CLIENT_NAME="Client Beta" npm run populate
```

### Step 10: Open Project #2 in GitHub

1. Go to GitHub Projects
2. Open "Client Beta - WordPress Development"
3. All 33 activities are ready

### Step 11: Start Working on Project #2 (Day 2)

**Project Status:**
- **Client Alpha:** Day 2 (Phase 1 - Discovery)
- **Client Beta:** Day 1 (Phase 1 - Discovery)

**You now have 2 parallel projects running!**

---

## Daily Workflow (Managing Both Projects)

### Step 12: Daily Routine

**Every Morning:**

1. **Open GitHub Projects**
   - View all active projects

2. **Check Project Alpha:**
   - What phase are we in?
   - What tasks are "In Progress"?
   - Move completed tasks to "Done"
   - Start new tasks for today

3. **Check Project Beta:**
   - Same process as Alpha
   - Remember: Beta is 1 day behind Alpha

4. **Developer Assignments:**
   - Ensure developers know what to work on today
   - Check for blockers
   - Update task statuses

**Example - Day 5:**

```
PROJECT ALPHA (Day 5):
├── Phase 2: Planning (In Progress)
├── Activities Done: 5/33
└── Developer: Dev 1 working on "Solution Architecture"

PROJECT BETA (Day 4):
├── Phase 1: Discovery (Wrapping up)
├── Activities Done: 3/33
└── Developer: Dev 2 working on "Technical Scoping"
```

---

## When Project #1 Finishes

### Step 13: Project Alpha Launch (Day 20)

**When Project Alpha reaches Phase 10 and launches:**

1. Complete all final tasks
2. Move all Phase 10 tasks to "Done"
3. In GitHub Projects, add a field: `Status: ✅ COMPLETED`
4. Celebrate! 🎉

**Current Status:**
- **Project Alpha:** COMPLETED ✅
- **Project Beta:** Day 19 (Phase 10 - Launch tomorrow)

### Step 14: Start Project #3 (Replacement for Alpha)

```bash
# Create the next project
npm run batch-create
```

**When prompted:**
- "Client name:" → Type `Client Gamma`
- "Site type:" → Type `Portfolio`

```bash
# Populate it
PROJECT_NUMBER=3 CLIENT_NAME="Client Gamma" npm run populate
```

**New Status:**
- **Project Alpha:** COMPLETED ✅
- **Project Beta:** Day 19 (Phase 10)
- **Project Gamma:** Day 1 (Phase 1) ← New!

---

## Scaling to 6 Projects

### Step 15: Add More Projects (Days 3, 4, 5, 6)

**Day 3:**
```bash
npm run batch-create  # Create "Client Delta"
PROJECT_NUMBER=4 CLIENT_NAME="Client Delta" npm run populate
```

**Day 4:**
```bash
npm run batch-create  # Create "Client Epsilon"
PROJECT_NUMBER=5 CLIENT_NAME="Client Epsilon" npm run populate
```

**Day 5:**
```bash
npm run batch-create  # Create "Client Zeta"
PROJECT_NUMBER=6 CLIENT_NAME="Client Zeta" npm run populate
```

**Day 6:**
```bash
npm run batch-create  # Create "Client Eta"
PROJECT_NUMBER=7 CLIENT_NAME="Client Eta" npm run populate
```

**Result (Day 6):**
- 6 active projects running simultaneously
- Each project is 1 day apart
- Projects will finish 1 day apart
- Create new projects as old ones complete

---

## Weekly Management

### Step 16: Weekly Pipeline Check (Every Monday)

**Check what's happening this week:**

```
WEEK VIEW:
┌────────────┬────────┬──────────────────┬─────────┐
│ Project    │ Day    │ Phase            │ Status  │
├────────────┼────────┼──────────────────┼─────────┤
│ Alpha      │ 16/20  │ Phase 8: Testing │ 🟢 Good │
│ Beta       │ 15/20  │ Phase 7: Content │ 🟢 Good │
│ Gamma      │ 14/20  │ Phase 7: Content │ 🟡 Risk │
│ Delta      │ 13/20  │ Phase 6: Frontend│ 🟢 Good │
│ Epsilon    │ 12/20  │ Phase 6: Frontend│ 🟢 Good │
│ Zeta       │ 11/20  │ Phase 5: Backend │ 🟢 Good │
└────────────┴────────┴──────────────────┴─────────┘

ACTIONS THIS WEEK:
• Alpha finishes Friday → Prepare Project Theta
• Beta finishes Saturday → Prepare Project Iota
```

### Step 17: Prepare Upcoming Projects

**Maintain a Queue:**

Create a simple list (text file, spreadsheet, or notes):

```
PIPELINE QUEUE:
1. Client Theta (E-Commerce) - Starts when Alpha finishes
2. Client Iota (Corporate) - Starts when Beta finishes
3. Client Kappa (Portfolio) - Starts when Gamma finishes
4. Client Lambda (Static) - In sales pipeline
5. Client Mu (Dynamic) - Proposal sent
```

**When a project finishes:**
1. Take next client from queue
2. Create GitHub project
3. Populate with tasks
4. Assign to freed-up developer
5. Start Phase 1

---

## Complete Two-Project Example Timeline

### Example: Alpha & Beta (Detailed 5-Day View)

**DAY 1:**
```
PROJECT ALPHA - Day 1
├── Create project: npm run batch-create
├── Populate: PROJECT_NUMBER=1 CLIENT_NAME="Client Alpha" npm run populate
├── Open in GitHub Projects
├── Assign Dev 4 (BE/Ecom)
├── Start: "Client Onboarding & Kickoff Call"
└── Status: Phase 1, Task 1 in progress

PROJECTS ACTIVE: 1
```

**DAY 2:**
```
PROJECT ALPHA - Day 2
├── Complete: "Client Onboarding & Kickoff Call" → Done
├── Start: "Requirements Gathering"
└── Status: Phase 1, Task 2 in progress

PROJECT BETA - Day 1
├── Create project: npm run batch-create
├── Populate: PROJECT_NUMBER=2 CLIENT_NAME="Client Beta" npm run populate
├── Assign Dev 1 (Lead)
├── Start: "Client Onboarding & Kickoff Call"
└── Status: Phase 1, Task 1 in progress

PROJECTS ACTIVE: 2
```

**DAY 3:**
```
PROJECT ALPHA - Day 3
├── Complete: "Requirements Gathering" → Done
├── Start: "Technical Scoping"
└── Status: Phase 1, Task 3 in progress

PROJECT BETA - Day 2
├── Complete: "Client Onboarding & Kickoff Call" → Done
├── Start: "Requirements Gathering"
└── Status: Phase 1, Task 2 in progress

PROJECTS ACTIVE: 2
```

**DAY 4:**
```
PROJECT ALPHA - Day 4
├── Complete: "Technical Scoping" → Done
├── Start: "Project Planning" (Phase 2)
└── Status: Phase 2, Task 1 in progress

PROJECT BETA - Day 3
├── Complete: "Requirements Gathering" → Done
├── Start: "Technical Scoping"
└── Status: Phase 1, Task 3 in progress

PROJECTS ACTIVE: 2
```

**DAY 5:**
```
PROJECT ALPHA - Day 5
├── Complete: "Project Planning" → Done
├── Start: "Solution Architecture"
└── Status: Phase 2, Task 2 in progress

PROJECT BETA - Day 4
├── Complete: "Technical Scoping" → Done
├── Start: "Project Planning" (Phase 2)
└── Status: Phase 2, Task 1 in progress

PROJECTS ACTIVE: 2
```

---

## Quick Reference Commands

### Create a New Project
```bash
npm run batch-create
```

### Populate a Project with Tasks
```bash
PROJECT_NUMBER=<number> CLIENT_NAME="<name>" npm run populate
```

### List All Projects
```bash
npm run list-projects
```

### Create Multiple Projects at Once
```bash
# When you want to start 6 projects on Day 1
npm run batch-create
# Enter: 6
# Fill in all 6 client names
```

---

## Troubleshooting

### "Resource not accessible" error
- Check your `GITHUB_TOKEN` in `.env` has `project` scope
- Regenerate token at https://github.com/settings/tokens

### "Could not resolve ProjectV2" error
- Check the `PROJECT_NUMBER` is correct
- Run `npm run list-projects` to see all project numbers

### Can't find a project in GitHub
- Go to https://github.com/users/YOUR_USERNAME/projects
- Or https://github.com/orgs/YOUR_ORG/projects

### Tasks aren't showing up
- Make sure you ran the `npm run populate` command
- Check you used the correct PROJECT_NUMBER

---

## Summary: Your First Week

**Day 1:**
1. Setup (Steps 1-3)
2. Create Project Alpha (Steps 4-6)
3. Start working on Alpha

**Day 2:**
1. Continue Alpha (Phase 1)
2. Create Project Beta (Steps 8-10)
3. Start working on Beta

**Day 3-6:**
1. Create Projects Gamma, Delta, Epsilon, Zeta (Step 15)
2. Work on all projects in parallel
3. Each project progresses through phases

**Day 7 onwards:**
1. Daily routine (Step 12)
2. Weekly reviews (Step 16)
3. Replace finished projects with new ones (Steps 13-14)

**Result:**
- 6 projects always running
- 1 project finishing every ~3 days
- 1 new project starting every ~3 days
- Continuous workflow

---

**You're all set! Start with Steps 1-7 to launch your first project today.**
