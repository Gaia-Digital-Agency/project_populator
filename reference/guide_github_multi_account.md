# GitHub Multi-Account Management Guide

A comprehensive guide for managing multiple GitHub accounts from the command line.

## Overview

This guide helps you manage multiple GitHub accounts efficiently from the command line. Whether you're managing personal accounts, work accounts, or organization repositories, this guide provides robust workflows that work with any repository.

### Your GitHub Accounts

This guide is configured for these three accounts:
- **Account 1** (Organization): `github.com/Gaia-Digital-Agency` (alias: `gaia`)
- **Account 2** (Personal): `github.com/azlanet1io` (alias: `azlanet`)
- **Account 3** (Alternate): `github.com/mohdazlanabas` (alias: `mohd`)

Throughout this guide, examples show both generic placeholders (`<username>`) for general use, and specific examples using your actual account names (azlanet1io, mohdazlanabas, Gaia-Digital-Agency).

---

## Table of Contents

- [Check Current Git User](#check-current-git-user)
- [Authentication Setup](#authentication-setup)
- [Switching Between Accounts](#switching-between-accounts)
- [Managing Git Remotes](#managing-git-remotes)
- [SSH Key Configuration](#ssh-key-configuration)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

---

## Check Current Git User

### Quick Commands to Check Your Current User

```bash
# Check GitHub CLI active account
gh auth status

# Check git config for current repository
git config user.name
git config user.email

# Check global git config
git config --global user.name
git config --global user.email

# Check which account will be used for commits (local overrides global)
git config --list | grep user

# Check all git configs (global, local, system)
git config --list --show-origin | grep user
```

### Detailed Account Status

```bash
# See all authenticated GitHub accounts
gh auth status
```

Output shows:
```
github.com
  ✓ Logged in to github.com account azlanet1io (keyring)
  - Active account: true
  - Git operations protocol: ssh

  ✓ Logged in to github.com account mohdazlanabas (keyring)
  - Active account: false
```

### Check Current Repository Settings

```bash
# In your repository, check local settings
cd /path/to/your/repo
git config --local user.name
git config --local user.email

# Check which remote you're connected to
git remote -v

# See which SSH key will be used
ssh -T git@github.com-azlanet      # Test azlanet1io connection
ssh -T git@github.com-personal     # Test mohdazlanabas connection
ssh -T git@github.com-gaiada       # Test Gaia-Digital-Agency connection
```

### Quick Status Check

```bash
# One-liner to see everything
echo "GitHub CLI: $(gh api user --jq .login)" && \
echo "Git Local: $(git config user.name) <$(git config user.email)>" && \
echo "Git Global: $(git config --global user.name) <$(git config --global user.email)>"
```

---

## Authentication Setup

### GitHub CLI Authentication

The GitHub CLI (`gh`) supports multiple account authentication.

#### Login to Each Account

```bash
# Login to first account
gh auth login

# Login to additional accounts (they'll be stored alongside the first)
gh auth login --web
```

Follow the prompts:
1. Choose `GitHub.com`
2. Choose `HTTPS` or `SSH` protocol
3. Authenticate via web browser or paste token
4. Repeat for each account

#### View All Authenticated Accounts

```bash
gh auth status
```

#### Switch Active Account

```bash
# Switch to a specific account
gh auth switch

# Or specify the account directly
gh auth switch --user azlanet1io
gh auth switch --user mohdazlanabas
```

#### Logout from an Account

```bash
# Logout from specific account
gh auth logout --user <username>

# Logout from current account
gh auth logout
```

#### Setup Git to Use GitHub CLI for Authentication

```bash
gh auth setup-git
```

This configures Git to use GitHub CLI credentials for HTTPS operations.

---

## Managing Git Remotes

### View Current Remotes

```bash
git remote -v
```

### Add Multiple Remotes

You can add multiple remotes to push the same code to different accounts/repos.

```bash
# Add origin (primary remote - typically your personal account)
git remote add origin https://github.com/azlanet1io/<repo-name>.git

# Add secondary remote (e.g., work/organization account)
git remote add gaia https://github.com/Gaia-Digital-Agency/<repo-name>.git

# Add third remote (e.g., another personal account)
git remote add mohd https://github.com/mohdazlanabas/<repo-name>.git
```

### Change Remote URL

```bash
# Change origin to different account
git remote set-url origin https://github.com/<username>/repo-name.git

# Change to SSH (using SSH config alias)
git remote set-url origin git@github.com-<alias>:<username>/repo-name.git

# Example: Change origin to Gaia Digital Agency repo
git remote set-url origin git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git

# --- More Examples ---
# Gaia Digital Agency (main)
git remote set-url origin https://github.com/gaia-digital-agency/repo-name.git

# Gaia Digital Agency (alias)
git remote set-url origin https://github.com/gaiada/repo-name.git

# Azlanet1io (personal)
git remote set-url origin https://github.com/azlanet1io/repo-name.git

# Mohdazlanabas (alternate)
git remote set-url origin https://github.com/mohdazlanabas/repo-name.git
```

### Remove a Remote

```bash
git remote remove <remote-name>
```

### Rename a Remote

```bash
# Rename 'origin' to 'personal'
git remote rename origin personal
```

### Push to Specific Remote

```bash
# Push to origin (default - azlanet1io)
git push origin main

# Push to Gaia Digital Agency
git push gaia main

# Push to mohdazlanabas account
git push mohd main

# Push to all remotes
git push --all
```

### Set Default Push Remote

```bash
# Set upstream for current branch
git push -u origin main

# Now you can just use:
git push
```

---

## SSH Key Configuration

For managing multiple accounts, SSH keys with different configs work best.

### Generate SSH Keys for Each Account

```bash
# Generate key for azlanet1io account
ssh-keygen -t ed25519 -C "azlanet1io@email.com" -f ~/.ssh/id_ed25519_azlanet

# Generate key for mohdazlanabas account
ssh-keygen -t ed25519 -C "mohdazlanabas@email.com" -f ~/.ssh/id_ed25519_mohd

# Generate key for Gaia Digital Agency account
ssh-keygen -t ed25519 -C "gaia@email.com" -f ~/.ssh/id_ed25519_gaia
```

### Add SSH Keys to ssh-agent

```bash
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add keys for all three accounts
ssh-add ~/.ssh/id_ed25519_azlanet
ssh-add ~/.ssh/id_ed25519_mohd
ssh-add ~/.ssh/id_ed25519_gaia

# List added keys
ssh-add -l
```

### Configure SSH Config File

Edit `~/.ssh/config`:

```bash
# azlanet1io account
Host github.com-azlanet
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_azlanet
    IdentitiesOnly yes

# mohdazlanabas account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_mohd
    IdentitiesOnly yes

# Gaia Digital Agency account
Host github.com-gaiada
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_gaia
    IdentitiesOnly yes
```

### Add SSH Keys to GitHub

```bash
# Copy public key to clipboard (macOS)
pbcopy < ~/.ssh/id_ed25519_azlanet.pub

# Linux (with xclip)
xclip -sel clip < ~/.ssh/id_ed25519_azlanet.pub

# Or display it
cat ~/.ssh/id_ed25519_azlanet.pub

# Repeat for other accounts
pbcopy < ~/.ssh/id_ed25519_mohd.pub
pbcopy < ~/.ssh/id_ed25519_gaia.pub
```

Then:
1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste the key and save
4. Repeat for each account

### Use SSH Remotes with Different Accounts

```bash
# Add remote using SSH config host aliases
git remote add origin git@github.com-azlanet:azlanet1io/repo-name.git
git remote add gaia git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
git remote add personal git@github.com-personal:mohdazlanabas/repo-name.git
```

### Test SSH Connection

```bash
ssh -T git@github.com-azlanet
ssh -T git@github.com-personal
ssh -T git@github.com-gaiada
```

---

## Common Workflows

### Workflow 1: Clone Repository from Specific Account

```bash
# Using HTTPS (will use gh CLI auth)
gh auth switch --user azlanet1io
gh repo clone azlanet1io/repo-name

# Using SSH with different accounts
git clone git@github.com-azlanet:azlanet1io/repo-name.git
git clone git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
git clone git@github.com-personal:mohdazlanabas/repo-name.git
```

### Workflow 2: Create Repository Under Specific Account

```bash
# Switch to desired account
gh auth switch --user azlanet1io

# Create repo under azlanet1io account
gh repo create my-new-repo --public --source=. --remote=origin --push

# Create repo under Gaia Digital Agency organization
gh repo create Gaia-Digital-Agency/my-new-repo --public --source=. --remote=gaia --push
```

### Workflow 3: Push Same Code to Multiple Accounts

```bash
# Setup remotes (one-time)
git remote add origin git@github.com-azlanet:azlanet1io/repo-name.git
git remote add gaia git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
git remote add personal git@github.com-personal:mohdazlanabas/repo-name.git

# Push to all remotes individually
git push origin main
git push gaia main
git push personal main

# Or push to all at once
git push --all
```

### Workflow 4: Transfer Repository Between Accounts

```bash
# Method 1: Using GitHub CLI and Web UI
gh auth switch --user <source-username>
gh repo view <source-username>/repo-name
# Then transfer via web UI: Settings → Danger Zone → Transfer

# Method 2: Mirror push to new account
git clone --mirror https://github.com/<source-username>/old-repo.git
cd old-repo.git
git push --mirror git@github.com-work:<target-username>/new-repo.git
```

### Workflow 5: Fork Repository to Different Account

```bash
# Switch to the account you want to fork to
gh auth switch --user <target-username>

# Fork repository
gh repo fork <source-owner>/repo-name --clone
```

### Workflow 6: Work on Different Account Repos in Same Directory

```bash
# Set per-repository git config
cd /path/to/personal-project
git config user.name "Your Name"
git config user.email "personal@email.com"

cd /path/to/work-project
git config user.name "Your Work Name"
git config user.email "work@company.com"

# Or use global config and override per-repo
git config --global user.name "Default Name"
git config --local user.name "Project Specific Name"
```

### Workflow 7: List Repositories for Each Account

```bash
# Switch and list repos for each account
gh auth switch --user <username1>
gh repo list <username1> --limit 100

gh auth switch --user <username2>
gh repo list <username2> --limit 100

# List organization repos (no switch needed)
gh repo list <org-name> --limit 100
```

### Workflow 8: Create Pull Requests Between Accounts

```bash
# Fork repo to your account first
gh repo fork <upstream-owner>/repo-name --clone

# Make changes and push
git checkout -b feature-branch
# ... make changes ...
git push origin feature-branch

# Create PR to original repo
gh pr create --repo <upstream-owner>/repo-name --base main --head <your-username>:feature-branch
```

---

## Advanced Remote Configurations

### Use Multiple Push URLs for One Remote

Push to multiple repos with a single `git push`:

```bash
# Set primary URL
git remote add all git@github.com-azlanet:azlanet1io/repo-name.git

# Add additional push URLs for all three accounts
git remote set-url --add --push all git@github.com-azlanet:azlanet1io/repo-name.git
git remote set-url --add --push all git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
git remote set-url --add --push all git@github.com-personal:mohdazlanabas/repo-name.git

# Now one command pushes to all three accounts
git push all main
```

### Per-Repository Account Configuration

Create a `.git/config` file per repository:

```bash
# In repository directory
git config user.name "Your Name"
git config user.email "your@example.com"
git config credential.username "<your-github-username>"
```

---

## Repository Management Commands

### View Repository Details

```bash
# Current repository
gh repo view

# Specific repository
gh repo view <username>/repo-name
gh repo view <org-name>/repo-name
```

### Clone Repositories

```bash
# Clone using gh CLI (auto-uses authenticated account)
gh repo clone <username>/repo-name

# Clone using git with SSH
git clone git@github.com-personal:<username>/repo-name.git
git clone git@github.com-work:<org-name>/repo-name.git
```

### Archive/Unarchive Repositories

```bash
gh repo archive <username>/old-project
gh repo unarchive <username>/old-project
```

### Delete Repositories

```bash
# Delete repo (requires confirmation)
gh repo delete <username>/repo-name

# Skip confirmation
gh repo delete <username>/repo-name --yes
```

### Edit Repository Settings

```bash
# Change visibility
gh repo edit <username>/repo-name --visibility public
gh repo edit <username>/repo-name --visibility private

# Enable/disable features
gh repo edit <username>/repo-name --enable-issues
gh repo edit <username>/repo-name --enable-wiki
```

---

## Quick Reference Commands

### Check Current User

```bash
# Check active GitHub account
gh auth status

# Check git user (current repo)
git config user.name
git config user.email

# Check which remote you're using
git remote -v

# Test SSH connections
ssh -T git@github.com-azlanet
ssh -T git@github.com-personal
ssh -T git@github.com-gaiada
```

### Account Switching

```bash
# View all accounts
gh auth status

# Switch account
gh auth switch

# Login new account
gh auth login
```

### Remote Management

```bash
# View remotes
git remote -v

# Add remote
git remote add <name> <url>

# Change URL
git remote set-url <name> <new-url>

# Remove remote
git remote remove <name>

# Rename remote
git remote rename <old> <new>
```

### Push/Pull Operations

```bash
# Push to specific remote
git push <remote-name> <branch-name>

# Pull from specific remote
git pull <remote-name> <branch-name>

# Fetch from all remotes
git fetch --all

# Push to all remotes
git push --all
```

---

## Troubleshooting

### Issue: Permission Denied (SSH)

```bash
# Check SSH connection
ssh -T git@github.com-personal

# Verify ssh-agent has the key
ssh-add -l

# Add key if missing
ssh-add ~/.ssh/id_ed25519_personal
```

### Issue: Wrong Account Being Used

```bash
# Check current account
gh auth status

# Switch account
gh auth switch --user correct-username

# Or setup git to use gh CLI
gh auth setup-git
```

### Issue: HTTPS Authentication Fails

```bash
# Use GitHub CLI for credential management
gh auth setup-git

# Or switch to SSH
git remote set-url origin git@github.com-personal:<username>/repo-name.git
```

### Issue: Can't Push to Organization Repo

```bash
# Verify you're a member and have write access
gh api orgs/<org-name>/members/<your-username>

# Check repository permissions
gh repo view <org-name>/repo-name
```

### Issue: SSH Key Not Working

```bash
# Test SSH connection with verbose output
ssh -vT git@github.com-personal

# Ensure SSH config is correct
cat ~/.ssh/config

# Verify key is added to GitHub
gh ssh-key list
```

### Issue: Accidentally Committed with Wrong Account

```bash
# Amend last commit with correct author
git commit --amend --author="Correct Name <correct@email.com>"

# For multiple commits, use interactive rebase
git rebase -i HEAD~3
# Change 'pick' to 'edit' for commits to change
# For each:
git commit --amend --author="Correct Name <correct@email.com>"
git rebase --continue
```

---

## Best Practices

1. **Use SSH keys** for multi-account management - more reliable than HTTPS
2. **Name remotes clearly** - use descriptive names like `origin`, `work`, `personal` instead of `remote1`, `remote2`
3. **Set git config per repository** - ensures correct author info for each project
4. **Use `gh auth switch`** before creating repos or PRs to ensure you're using the right account
5. **Keep SSH config organized** - use clear host aliases that match your workflow
6. **Test connections regularly** - use `ssh -T` to verify authentication is working
7. **Document your setup** - keep notes on which keys/accounts/remotes are used for what purpose
8. **Use separate SSH keys** - don't share keys across accounts for better security
9. **Backup your SSH keys** - store securely in a password manager or encrypted storage
10. **Review before pushing** - use `git remote -v` to confirm destination before pushing code

---

## Summary

**Key Commands to Remember:**

```bash
# Switch GitHub account
gh auth switch --user azlanet1io
gh auth switch --user mohdazlanabas

# View remotes
git remote -v

# Push to specific remote/account
git push origin main      # Push to azlanet1io
git push gaia main        # Push to Gaia-Digital-Agency
git push personal main    # Push to mohdazlanabas

# Test SSH connections for all accounts
ssh -T git@github.com-azlanet
ssh -T git@github.com-personal
ssh -T git@github.com-gaiada

# Clone with specific account (using SSH config)
git clone git@github.com-azlanet:azlanet1io/repo-name.git
git clone git@github.com-gaiada:Gaia-Digital-Agency/repo-name.git
git clone git@github.com-personal:mohdazlanabas/repo-name.git
```

This guide is customized for your three GitHub accounts (azlanet1io, mohdazlanabas, and Gaia-Digital-Agency). Keep it handy for reference!
