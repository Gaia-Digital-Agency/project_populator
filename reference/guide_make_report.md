# Markdown Reporting Guide

Complete guide for generating markdown reports for your GitHub Projects.

---

## Quick Start

### 1. Install Dependencies (if not already done)

```bash
cd github_populator
npm install
```

### 2. Configure Environment

Make sure your [.env](.env) file has:
```env
GITHUB_TOKEN=ghp_your_personal_access_token_here
GITHUB_OWNER=your-github-username
```

---

## Report Types

### Single Project Report

Generate a detailed markdown report for **one specific project**.

**Command:**
```bash
PROJECT_NUMBER=1 npm run report-single
```

**What it includes:**
- 📊 Progress summary with completion percentages
- 📋 Status breakdown (Backlog, To Do, In Progress, In Review, Done, Blocked)
- 🎯 Phase breakdown with all tasks listed
- ⚡ Priority breakdown (Critical, High, Medium, Low)
- 👥 Developer assignments with task counts
- 📈 Progress bars and visual indicators
- 🔗 Direct links to all issues and the project

**Example:**
```bash
# Generate report for Project #1
PROJECT_NUMBER=1 npm run report-single

# Generate report for Project #3
PROJECT_NUMBER=3 npm run report-single
```

**Output:**
- Creates: `reports/project_1_client_alpha_wordpress_development_2026-01-04.md`

---

### All Projects Portfolio Report

Generate a comprehensive markdown report for **all your projects**.

**Command:**
```bash
npm run report-all
```

**What it includes:**
- 📊 Executive summary (total tasks, completion rates across all projects)
- 🟢 Active projects overview table
- 📋 Detailed breakdown for each project
  - Progress bars
  - Status distribution
  - Phase distribution
  - Priority breakdown
  - Developer assignments
- 🔴 Closed projects summary
- 🏥 Portfolio health indicators
- ⚠️ Risk assessment (projects needing attention)

**Example:**
```bash
npm run report-all
```

**Output:**
- Creates: `reports/all_projects_portfolio_2026-01-04.md`

---

## Report Output

### File Location

All reports are saved to the [reports/](reports/) directory with timestamped filenames:

```
reports/
├── project_1_client_alpha_wordpress_development_2026-01-04.md
├── project_2_client_beta_wordpress_development_2026-01-04.md
├── all_projects_portfolio_2026-01-04.md
└── README.md
```

### File Naming

- **Single Project:** `project_{number}_{sanitized_title}_{date}.md`
- **All Projects:** `all_projects_portfolio_{date}.md`

---

## Common Use Cases

### Daily Standup Report

Generate reports for all active projects to review in your morning standup:

```bash
npm run report-all
```

Review the "Projects Requiring Attention" section for blockers and risks.

---

### Client Update

Generate a clean report for a specific client project:

```bash
PROJECT_NUMBER=1 npm run report-single
```

Share the generated markdown file with your client or convert it to PDF.

---

### Weekly Review

Every Monday, generate a portfolio report to review the week:

```bash
npm run report-all
```

Check:
- Overall progress across all 6 projects
- Projects finishing this week
- Blocked tasks requiring attention
- Developer workload distribution

---

### Project Completion

When a project finishes, generate a final report:

```bash
PROJECT_NUMBER=3 npm run report-single
```

Archive this report as documentation of the completed project.

---

## Report Features Explained

### Progress Bars

Visual representation of completion:
```
████████████░░░░░ 80%
```

### Status Icons

- ✅ Done/Completed
- 🔄 In Progress
- ⏳ To Do/Backlog
- 🚫 Blocked
- 🟢 On Track
- 🔴 Closed

### Direct Links

All tasks and projects link directly to GitHub:
- Click project numbers to open the project
- Click issue numbers to view the task details

---

## Automation Ideas

### Daily Reports via Cron

Create a cron job to generate daily reports:

```bash
# Add to crontab (crontab -e)
0 9 * * 1-5 cd /path/to/github_populator && npm run report-all
```

### Git Hook Integration

Generate reports before commits:

```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run report-all
git add reports/
```

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Generate Project Reports
  run: |
    npm install
    npm run report-all
```

---

## Troubleshooting

### "Missing required environment variables"

**Solution:** Make sure `.env` file exists with `GITHUB_TOKEN` and `GITHUB_OWNER`

```bash
cp .env.example .env
# Edit .env and add your credentials
```

---

### "Project #X not found"

**Solution:** Check your project number

```bash
# List all your projects to find the correct number
npm run list-projects
```

---

### "Resource not accessible" error

**Solution:** Your GitHub token needs `project` scope

1. Go to https://github.com/settings/tokens
2. Generate new token with `repo` and `project` scopes
3. Update `GITHUB_TOKEN` in `.env`

---

### No data in reports

**Solution:** Make sure the project has tasks

```bash
# Populate a project with tasks
PROJECT_NUMBER=1 CLIENT_NAME="Client Name" npm run populate
```

---

## Examples of Generated Content

### Single Project Report Sample

```markdown
# Project Report: Client Alpha - WordPress Development

**Generated:** 1/4/2026, 8:45:23 PM

**Project Number:** #1

**Status:** 🟢 Open

## 📊 Progress Summary

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Tasks** | 32 | 100% |
| **Completed** | 15 | 47% |
| **In Progress** | 3 | 9% |
| **Blocked** | 0 | 0% |
| **Remaining** | 17 | 53% |

**Progress:** ██████████████░░░░░░░░░░░░░░░░ 47%
```

### All Projects Report Sample

```markdown
# All Projects Portfolio Report

**Generated:** 1/4/2026, 8:45:23 PM

**Total Projects:** 6

**Active Projects:** 6 | **Closed Projects:** 0

## 📊 Executive Summary

| Metric | Count |
|--------|-------|
| **Total Tasks Across All Projects** | 192 |
| **Completed Tasks** | 85 (44%) |
| **In Progress** | 12 |
| **Blocked** | 2 |
| **Remaining** | 107 |

## 🟢 Active Projects Overview

| # | Project Name | Tasks | Progress | Phase | Status |
|---|--------------|-------|----------|-------|--------|
| **#1** | Client Alpha | 32 | ██████████ 100% | 10. Deployment | ✅ |
| **#2** | Client Beta | 32 | █████████░ 94% | 9. UAT | 🔄 |
```

---

## Best Practices

1. **Generate reports regularly** - Daily for active development, weekly for portfolio review
2. **Archive important reports** - Save milestone reports (25%, 50%, 75%, 100% completion)
3. **Share with stakeholders** - Use reports for client updates and team standups
4. **Monitor blockers** - Check the "Projects Requiring Attention" section daily
5. **Track trends** - Compare weekly reports to identify patterns

---

## Quick Reference

| Command | Purpose | Requires |
|---------|---------|----------|
| `npm run report-single` | Single project report | `PROJECT_NUMBER` env var |
| `npm run report-all` | All projects report | None |
| `npm run list-projects` | List all projects | None |

---

**For more information, see:**
- [Main README](README.md) - Project setup and configuration
- [Rolling Pipeline Guide](ROLLING_PIPELINE.md) - Managing multiple projects
- [Step-by-Step Guide](reference/guide.md) - Detailed walkthrough

---

*Generated by GitHub Project Populator - Reporting Feature*
