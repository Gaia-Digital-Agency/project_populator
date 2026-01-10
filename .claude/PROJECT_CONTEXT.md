# GitHub Projects V2 Populator - Project Context

## Project Overview

This is an automation tool for creating and managing GitHub Projects V2 boards specifically designed for WordPress development workflows. It standardizes project management across multiple parallel client projects.

## Core Purpose

**Problem Solved:** WordPress development agencies struggle with:
- Inconsistent project execution across different clients
- Difficulty tracking 6+ parallel projects
- Resource allocation conflicts with 6 developers
- Client communication gaps about project status

**Solution Provided:** Automated creation of standardized GitHub Project boards with:
- 11 development phases (Discovery → Deployment)
- 33 pre-configured activities with checklists
- Custom fields for tracking (Status, Phase, Priority, Developer, etc.)
- 30+ categorization labels

## Technical Architecture

### Tech Stack
- **Runtime:** Node.js (v18+) with ES modules
- **API:** GitHub GraphQL API via @octokit/graphql
- **CLI:** chalk (colors), ora (spinners)
- **Config:** dotenv for environment variables

### File Structure
```
github_populator/
├── backend/
│   ├── index.js                    # Main populator (creates projects & tasks)
│   ├── batch-create.js             # Batch creation for 6 projects
│   ├── list-projects.js            # List all GitHub projects
│   ├── report-single.js            # Generate markdown report for 1 project
│   ├── report-all.js               # Generate portfolio report
│   └── config/
│       └── wordpress-project.config.js  # WordPress 11-phase template
├── reference/                      # All markdown documentation
│   ├── guide_simple_use.md         # Quick start guide
│   ├── guide_github_multi_account.md  # Multi-account SSH setup
│   ├── guide_manage_dual_git.md    # Git user switching
│   └── [other guides]
├── .env                            # Environment configuration (gitignored)
├── .env.example                    # Template for .env
└── package.json                    # NPM scripts & dependencies
```

### NPM Scripts
- `npm run populate` - Create/populate single project
- `npm run batch-create` - Interactive batch creation (6 projects)
- `npm run list-projects` - List all GitHub projects
- `npm run report-single` - Generate single project report
- `npm run report-all` - Generate portfolio report
- `npm run dry-run` - Preview without creating

## Key Features

### 1. WordPress Development Template
- **11 Phases:** Discovery (10%) → Planning (8%) → Design (15%) → Environment (5%) → Backend (20%) → Frontend (20%) → Content (7%) → Testing (5%) → Functionality (5%) → User Acceptance (3%) → Deployment (2%)
- **33 Activities:** Each with descriptions, checklists, priority, time allocation
- **20-Day Cycle:** Optimized for 1-month project completion

### 2. Custom Fields
- Status: Backlog, To Do, In Progress, In Review, Done, Blocked
- Phase: 1-11 (Discovery through Deployment)
- Priority: Critical, High, Medium, Low
- Developer: 6-developer team structure
- Time %: Percentage allocation
- Site Type: Static, Dynamic, E-Commerce, Portfolio, Corporate, Blog

### 3. Team Structure
- Dev 1 (Lead): Full-stack, complex projects
- Dev 2-3 (FE): Frontend specialists
- Dev 4-5 (BE): Backend/E-commerce/Integrations
- Dev 6 (QA): Testing across all projects

### 4. Reporting
- Single project status reports (markdown)
- Portfolio-wide reports
- Progress tracking, phase completion, blockers

## Environment Configuration

Required `.env` variables:
```env
GITHUB_TOKEN=ghp_xxx           # Personal access token (repo + project scopes)
GITHUB_OWNER=username          # GitHub username or org
GITHUB_REPO=repo-name          # Repository for issues

# Optional
PROJECT_NUMBER=5               # Existing project to populate
CLIENT_NAME=Client Name        # Project title prefix
```

## Multi-Account Setup

This project supports 3 GitHub accounts:
1. **mohdazlanabas** - Personal account
2. **azlanet1io** - Work personal account
3. **Gaia-Digital-Agency** - Organization (accessed via azlanet1io)

SSH configuration in `~/.ssh/config`:
- `git@github.com-mohd` - mohdazlanabas
- `git@github.com-azlanet` - azlanet1io
- `git@github.com-gaia` - Gaia-Digital-Agency

## Workflow

### Creating a New Client Project
```bash
CLIENT_NAME="Acme Corp" npm run populate
```

### Monthly Batch Setup (6 clients)
```bash
npm run batch-create
# Interactive prompts for each client name
```

### Generating Reports
```bash
PROJECT_NUMBER=1 npm run report-single
npm run report-all
```

## Important Notes

- **GitHub Projects V2 API:** Uses GraphQL, not REST API
- **Issues Required:** Creates GitHub Issues for tasks (requires repo access)
- **Rate Limits:** Includes delays to avoid API rate limiting
- **Organization Projects:** Must be created under user account with org access
- **SSH Keys:** Organization repos use personal account SSH keys

## Common Use Cases

1. **Agency Onboarding:** Create 6 standardized project boards monthly
2. **Client Communication:** Share read-only project board access
3. **Team Management:** Track developer workload across projects
4. **Status Reporting:** Generate weekly portfolio reports
5. **Standardization:** Ensure all projects follow same 11-phase process

## Development Notes

- ES Modules: Uses `import/export` syntax
- GraphQL API: All GitHub operations via GraphQL
- No Frontend: CLI-only tool (future: web dashboard planned)
- Markdown Output: Reports in markdown for easy sharing
- Config-Driven: Template in `wordpress-project.config.js`

## Related Documentation

See `reference/` folder for:
- Multi-account GitHub/Git setup
- WordPress development workflows
- Project management guides
- Reporting guides
- Rolling pipeline methodology
