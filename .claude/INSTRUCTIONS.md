# Claude Code Instructions for GitHub Project Populator

## Project Understanding

This is a **WordPress development workflow automation tool** that creates standardized GitHub Projects V2 boards. It's designed for agencies managing 6 parallel client projects with a 6-developer team.

## Key Context to Remember

### 1. Multi-Account Setup
- **3 GitHub accounts** are used:
  - `mohdazlanabas` - Personal
  - `azlanet1io` - Work personal
  - `Gaia-Digital-Agency` - Organization (accessed via azlanet1io)
- SSH aliases: `github.com-mohd`, `github.com-azlanet`, `github.com-gaia`
- Organization repos use personal account SSH keys (azlanet1io)

### 2. Project Structure
- **Backend only** - No frontend (CLI tool)
- **ES Modules** - Uses import/export, not require()
- **GraphQL API** - GitHub Projects V2 API via @octokit/graphql
- **Markdown output** - Reports generated in markdown
- **Reference docs** - All .md files kept in `reference/` folder

### 3. Core Workflow
```bash
# Single project creation
CLIENT_NAME="Client" npm run populate

# Batch creation (6 projects)
npm run batch-create

# Reporting
PROJECT_NUMBER=1 npm run report-single
npm run report-all
```

## When Assisting with This Project

### DO:
- ✅ Keep all markdown documentation in `reference/` folder
- ✅ Use ES module syntax (import/export)
- ✅ Reference multi-account setup when discussing Git/GitHub
- ✅ Suggest using existing npm scripts (don't create new ones without reason)
- ✅ Remember this is for WordPress development (11 phases, 33 activities)
- ✅ Check `.claude/PROJECT_CONTEXT.md` for detailed project info

### DON'T:
- ❌ Create markdown files in root (use reference/ instead)
- ❌ Suggest CommonJS syntax (require/module.exports)
- ❌ Forget about the 3-account setup when discussing GitHub operations
- ❌ Assume there's a frontend (it's CLI only)
- ❌ Modify core workflow without understanding the template structure

## Common User Tasks

### 1. Creating Projects
User wants to add new client projects to GitHub Projects V2
- Guide them to use `CLIENT_NAME="Name" npm run populate`
- For multiple: `npm run batch-create`

### 2. Git/GitHub Account Issues
User confused about which account they're on
- Reference `reference/guide_github_multi_account.md`
- Show: `gh auth status`, `git config user.name`

### 3. Reporting
User wants project status
- Single: `PROJECT_NUMBER=X npm run report-single`
- All: `npm run report-all`

### 4. Documentation Updates
User wants to update guides
- All docs go in `reference/` folder
- Keep multi-account context (3 accounts)
- Maintain consistency with existing guides

## File Organization Rules

```
✅ CORRECT:
reference/guide_new_feature.md
reference/guide_simple_use.md

❌ INCORRECT:
guide_new_feature.md (root)
docs/guide_new_feature.md (wrong folder)
```

## Environment Variables

Always in `.env` (never commit):
```env
GITHUB_TOKEN=ghp_xxx
GITHUB_OWNER=username
GITHUB_REPO=repo-name
PROJECT_NUMBER=optional
CLIENT_NAME=optional
```

## Testing & Development

Approved commands (no permission prompt):
- `ls`, `tree`, `cat`
- `node backend/report-single.js`
- `test`

Other bash commands require user approval.

## Quick Reference

### File Locations
- **Main code**: `backend/*.js`
- **Config**: `backend/config/wordpress-project.config.js`
- **Docs**: `reference/*.md`
- **Reports**: `reports/*.md` (generated)
- **Environment**: `.env` (gitignored)

### NPM Scripts
- `populate` - Create/populate project
- `batch-create` - Interactive multi-project
- `list-projects` - Show all projects
- `report-single` - Single project report
- `report-all` - Portfolio report
- `dry-run` - Preview mode

### GitHub Accounts Context
Always remember when discussing Git/GitHub:
1. Personal: mohdazlanabas
2. Work: azlanet1io
3. Org: Gaia-Digital-Agency (via azlanet1io)

## Helpful Reminders

- This is a **production tool** used for real client work
- Changes should maintain **backward compatibility**
- **11-phase WordPress template** is core to the system
- Users may be **non-technical project managers**
- Keep instructions **clear and concise**
- **Multi-account setup** is critical for their workflow

## When User Asks About...

**"How do I add a project?"**
→ See `reference/guide_simple_use.md`

**"Which GitHub account am I using?"**
→ `gh auth status` and `git config user.name`

**"How do I switch accounts?"**
→ See `reference/guide_github_multi_account.md`

**"Where are my reports?"**
→ `reports/` folder (auto-generated)

**"How do I customize the template?"**
→ Edit `backend/config/wordpress-project.config.js`

## Remember

This tool helps manage **real client projects** worth thousands of dollars. Accuracy and clarity in assistance is critical.
