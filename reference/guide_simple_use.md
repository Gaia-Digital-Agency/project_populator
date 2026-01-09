# Simple Usage Guide

Quick reference for creating projects and generating reports.

---

## Create New Project

### Single Project

```bash
CLIENT_NAME="Client Name" npm run populate
```

**Example:**
```bash
CLIENT_NAME="Acme Corp" npm run populate
```

This creates a GitHub Project with 32 tasks across 10 phases.

### Multiple Projects

```bash
npm run batch-create
```

Follow the prompts to create multiple projects at once.

---

## Report Generation

### All Projects Report

```bash
npm run report-all
```

Generates a comprehensive report for all projects.

### Single Project Report

**By project number:**
```bash
PROJECT_NUMBER=1 npm run report-single
```

**By project name:**
```bash
PROJECT_NAME="Client Name - WordPress Development" npm run report-single
```

Reports are saved to the `reports/` directory.

---

## List All Projects

```bash
npm run list-projects
```

Shows all your projects with their numbers, names, and URLs.

---

## Managing Git Remotes

### Switch Remote URL

If you need to change the remote repository URL, you can use the `git remote set-url` command.

**Example:**
```bash
# Switch the 'origin' remote to the Gaia Digital Agency repository
git remote set-url origin git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
```

---

**That's it!**
