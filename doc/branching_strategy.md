# Git Branching Strategy (Flux Electrique)

## Branch Model (Git Flow Adapted for Agile/Scrum)

This project uses a **multi-stage branching strategy** aligned with Agile sprints and GKE deployment environments.

```
main (production) ─┬─────────────────────────────────── Protected, releases only
                   │
staging ────────┬──┴──────────────────────────────────── UAT/QA environment
                │
develop ────┬───┴──────────────────────────────────────── Integration branch
            │
feature/FLX-42-contact-form ──────────────────────────── Short-lived, auto-delete after merge
bugfix/FLX-55-typo-fix ───────────────────────────────── Short-lived
hotfix/FLX-99-critical-prod-bug ──────────────────────── Branch from main, merge to main + develop
```

## Branch Descriptions

### Permanent Branches

| Branch | Environment | Deploys To | Merge Strategy | Protection |
|--------|-------------|------------|----------------|------------|
| `main` | Production | GKE prod cluster | PR from `staging` only | 2 approvals, signed commits |
| `staging` | Staging (UAT) | GKE staging cluster | PR from `develop` | 1 approval, status checks |
| `develop` | Development | GKE dev cluster | PR from feature branches | 1 approval, status checks |

### Temporary Branches

| Pattern | Purpose | Created From | Merged To | Auto-Delete |
|---------|---------|--------------|-----------|-------------|
| `feature/FLX-XX-desc` | New features | `develop` | `develop` | Yes |
| `bugfix/FLX-XX-desc` | Non-critical bugs | `develop` | `develop` | Yes |
| `hotfix/FLX-XX-desc` | Critical prod bugs | `main` | `main` + `develop` | Yes |
| `release/v1.2.0` | Release stabilization (optional) | `develop` | `staging` | Yes |

## Naming Conventions

### Feature Branches

Format: `feature/<ticket-id>-<short-description>`

Examples:
- `feature/FLX-42-contact-form`
- `feature/FLX-88-blog-mdx-support`
- `feature/FLX-120-prisma-migration`

### Bugfix Branches

Format: `bugfix/<ticket-id>-<short-description>`

Examples:
- `bugfix/FLX-55-navbar-mobile`
- `bugfix/FLX-67-prisma-connection-leak`

### Hotfix Branches

Format: `hotfix/<ticket-id>-<short-description>`

Examples:
- `hotfix/FLX-99-csrf-vulnerability`
- `hotfix/FLX-101-memory-leak`

## Workflow Examples

### Feature Development (Standard Sprint Work)

```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/FLX-42-contact-form

# Work on feature (commit often)
git add src/app/(site)/contact/
git commit -m "feat(contact): add form validation with Zod"
git push -u origin feature/FLX-42-contact-form

# Create PR to develop (via GitHub UI)
# After approval + CI passes: Squash and merge
# Branch auto-deleted
```

### End-of-Sprint Release (Staging Deployment)

```bash
# After Sprint Review, promote to staging
git checkout staging
git pull origin staging
git merge develop --no-ff
git push origin staging

# Triggers Cloud Build → deploys to staging cluster
# QA team performs UAT testing
```

### Production Release (Weekly Wednesday Deploy)

```bash
# After UAT sign-off
git checkout main
git pull origin main
git merge staging --no-ff
git tag -a v1.2.0 -m "Release v1.2.0 - Contact form + blog improvements"
git push origin main --follow-tags

# Triggers Cloud Build → deploys to production cluster
```

### Hotfix (Emergency Production Fix)

```bash
# Critical bug discovered in production
git checkout main
git pull origin main
git checkout -b hotfix/FLX-99-csrf-vulnerability

# Fix the bug
git add src/server/
git commit -m "fix(security): patch CSRF vulnerability (CVE-2026-XXXX)"
git push -u origin hotfix/FLX-99-csrf-vulnerability

# Create PR to main (expedited review)
# After merge to main:
git checkout develop
git pull origin develop
git merge main  # Backport hotfix to develop
git push origin develop
```

## CI/CD Integration

Each branch triggers specific Cloud Build pipelines:

| Branch | Cloud Build Config | Action |
|--------|-------------------|--------|
| `develop` | `cloudbuild.dev.yaml` | Deploy to dev cluster |
| `staging` | `cloudbuild.staging.yaml` | Deploy to staging cluster |
| `main` | `cloudbuild.yaml` | Deploy to production cluster |
| `feature/*` (PRs) | `cloudbuild.dev.yaml` | Lint + build + scan (no deploy) |

See `doc/branch_protection.md` for Cloud Build trigger configuration.

## Best Practices

1. **Always branch from the target**:
   - Features/bugfixes → branch from `develop`
   - Hotfixes → branch from `main`

2. **Keep branches short-lived**:
   - Target: Feature branches merged within 1-2 days
   - Avoid long-running branches (merge conflicts)

3. **Use descriptive commit messages**:
   - Follow [Conventional Commits](https://www.conventionalcommits.org/)
   - Examples: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`

4. **Sync regularly**:
   - Pull `develop` daily to stay current
   - Rebase feature branches if needed (before PR)

5. **Tag releases**:
   - Tag production releases: `git tag -a v1.2.0 -m "Release notes"`
   - Use semantic versioning (MAJOR.MINOR.PATCH)

6. **Never force-push to protected branches**:
   - `main`, `staging`, `develop` are protected
   - Force-push only allowed on personal feature branches

## Emergency Procedures

### Rollback Production

```bash
# Option 1: Revert merge commit
git checkout main
git revert -m 1 <merge-commit-sha>
git push origin main

# Option 2: Deploy previous image tag
python scripts/cicd.py deploy --image-tag <PREVIOUS_SHA>
```

### Sync `develop` with `main` (after hotfix)

```bash
git checkout develop
git pull origin develop
git merge main --no-ff -m "chore: sync develop with hotfix from main"
git push origin develop
```

## Visual Workflow

```
Sprint Day 1-10: Feature work
├── feature/FLX-42 → develop (PR reviewed, merged)
├── feature/FLX-43 → develop (PR reviewed, merged)
└── feature/FLX-44 → develop (PR reviewed, merged)

Sprint Day 10: Sprint Review
└── develop → staging (end-of-sprint merge)

Sprint Day 11-12: UAT Testing on Staging
└── QA team validates on staging cluster

Sprint Day 13 (Wednesday): Production Release
└── staging → main (PO approval required)
    └── Triggers production deployment
    └── Tag: v1.2.0

Continuous: Hotfixes (as needed)
└── main → hotfix/FLX-99 → main + develop
```

---

**See Also:**
- `doc/agile_workflow.md` - Sprint ceremonies and story management
- `doc/branch_protection.md` - GitHub protection rules and CI trigger setup
- `doc/deployment.md` - Environment-specific deployment instructions
