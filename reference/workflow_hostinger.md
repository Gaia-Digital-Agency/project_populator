# Agency Workflow Guide: 50+ Sites Management
**Team Composition:** 2 Admin/GUI Devs + 1 Coder (VS Code)

---

## 1. Workflow Architecture Overview

### Diagram: The 3-Person Sync
[Local VS Code (Coder)] --(Git Push)--> [GitHub Repo] --(Deploy)--> [Staging VM]
                                                                    ^
                                                                    |
[Admin Dev 1 (GUI)] ------------------------------------------------|
[Admin Dev 2 (GUI)] ------------------------------------------------| (Save to DB)

---

## 2. Platform Comparison: Hostinger vs. GCP

| Feature | Hostinger (Business) | Google Cloud (GCP) |
| :--- | :--- | :--- |
| **Infrastructure** | Shared/Containerized | Dedicated Virtual Machines (VM) |
| **Staging Tool** | 1-Click hPanel Staging | Manual Snapshots / Managed SQL |
| **Deployment** | Git Webhook (Pull) | GitHub Actions via SSH (Push) |
| **Best For** | Standard WP builds | High-traffic/High-security |

---

## 3. The WP Migrate "Surgical Merge" Process

To ensure you don't delete live customer data, follow this exact table selection during your merge.

### ✅ Tables to INCLUDE (The "Design" Merge)
*These tables store your layouts and styles.*
- `wp_posts` & `wp_postmeta` (All Elementor/Gutenberg pages)
- `wp_options` (Theme settings and plugin configs)
- `wp_terms` & `wp_termmeta` (Menus and Categories)

### ❌ Tables to EXCLUDE (The "Safety" Shield)
*Never overwrite these on a live production site.*
- `wp_users` & `wp_usermeta` (Customer accounts)
- `wp_comments` (Recent user feedback)
- `wp_wc_orders` (Real-time sales/WooCommerce data)

---

## 4. The "Coder" Merge Workflow

### Hostinger Flow:
1. Coder works in VS Code.
2. Pushes to `staging` branch.
3. Hostinger detects Webhook and pulls files.
4. Coder uses **WP Migrate** to Pull DB for styling.

### GCP Flow (Professional Upgrade):
1. Coder runs **Cloud SQL Proxy** locally.
2. Coder connects VS Code directly to the GCP Staging Database.
3. **No manual DB Pull needed** for small CSS/PHP tweaks.
4. Deployment happens via GitHub Actions + SSH Key for maximum security.

---

## 5. Launch Day Checklist
1. [ ] Admin Devs: Log off Staging (Freeze).
2. [ ] Coder: Merge `staging` branch to `main`.
3. [ ] Manager: Run WP Migrate **Push** with "Safety Shield" exclusions.
4. [ ] Manager: Regenerate CSS in Elementor/Theme.
5. [ ] Team: Smoke test the live site.