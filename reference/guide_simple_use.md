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

## Managing Git Remotes & Account Switching

### The Three GitHub Accounts

1. **Personal** (`mohdazlanabas`) - SSH host: `github.com-personal`
2. **Net1io/Gaia-Digital-Agency** (`azlanet1io`) - SSH host: `github.com-net1io`
3. **Gaiada** (another account) - SSH host: `github.com-gaiada`

### How to Switch Between Accounts

#### For Personal Projects (mohdazlanabas)
```bash
# Set git user for this repo
git config user.name "Azlan"
git config user.email "mohdazlan@gmail.com"

# Set remote using personal SSH
git remote remove origin
git remote add origin git@github.com-personal:mohdazlanabas/repo-name.git

# Test connection
ssh -T git@github.com-personal
```

#### For Gaia-Digital-Agency / Net1io (azlanet1io)
```bash
# Set git user for this repo
git config user.name "net1io"
git config user.email "azlan@net1io.com"

# Set remote using net1io SSH
git remote remove origin
git remote add origin git@github.com-net1io:Gaia-Digital-Agency/repo-name.git
# OR for azlanet1io personal repos:
# git remote add origin git@github.com-net1io:azlanet1io/repo-name.git

# Test connection
ssh -T git@github.com-net1io
```

#### For Gaiada Account
```bash
# Set git user for this repo
git config user.name "gaiada"
git config user.email "azlan@gaiada.com"

# Set remote using gaiada SSH
git remote remove origin
git remote add origin git@github.com-gaiada:username/repo-name.git

# Test connection
ssh -T git@github.com-gaiada
```

### Key Points

- **Each SSH host** (`github.com-personal`, `github.com-net1io`, `github.com-gaiada`) uses a **different SSH key**
- The SSH config (~/.ssh/config) automatically routes to the correct key based on the host you use
- **git config** settings are per-repository (local), so you set them once per repo
- Always test SSH connection first: `ssh -T git@github.com-HOSTNAME`
- If SSH connection hangs, you're using the wrong host name

### Quick Remote Change

If you just need to change the remote URL without changing the user:

```bash
git remote set-url origin git@github.com-net1io:Gaia-Digital-Agency/repo-name.git
```

---

**That's it!**
