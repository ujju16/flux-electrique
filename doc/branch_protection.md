# Branch Protection & CI/CD Triggers Guide

This document describes how to configure GitHub repository settings and Cloud Build triggers for the multi-stage development workflow.

## 1. GitHub Branch Protection Rules

### Protected Branches Configuration

Navigate to **Settings → Branches → Branch protection rules** and create the following:

#### Rule 1: `main` (Production)

- ✅ **Require a pull request before merging**
  - Required approvals: **2**
  - Dismiss stale reviews when new commits are pushed
  - Require review from Code Owners (optional if CODEOWNERS file exists)
- ✅ **Require status checks to pass before merging**
  - Required checks:
    - `Cloud Build - Staging` (ensures staging was tested first)
    - `Biome Lint`
    - `TypeScript Build`
    - `Trivy Security Scan`
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits** (recommended for production)
- ✅ **Include administrators** (no one bypasses these rules)
- ✅ **Restrict who can push** (only release managers or CI/CD service accounts)
- ❌ **Allow force pushes**: Disabled
- ❌ **Allow deletions**: Disabled

#### Rule 2: `staging` (Pre-Production)

- ✅ **Require a pull request before merging**
  - Required approvals: **1**
  - Dismiss stale reviews when new commits are pushed
- ✅ **Require status checks to pass before merging**
  - Required checks:
    - `Cloud Build - Development`
    - `Biome Lint`
    - `TypeScript Build`
- ✅ **Require conversation resolution before merging**
- ❌ **Allow force pushes**: Disabled
- ❌ **Allow deletions**: Disabled

#### Rule 3: `develop` (Integration)

- ✅ **Require a pull request before merging**
  - Required approvals: **1**
- ✅ **Require status checks to pass before merging**
  - Required checks:
    - `Biome Lint`
    - `TypeScript Build`
- ✅ **Require conversation resolution before merging**
- ❌ **Allow force pushes**: Disabled (except for maintainers in emergencies)

#### Rule 4: `feature/*`, `bugfix/*`, `hotfix/*` (Feature Branches)

- No protection rules (developers can force-push during development)
- Auto-delete after merge enabled

## 2. Cloud Build Triggers Setup

### Prerequisites

1. Connect GitHub repository to Cloud Build via GitHub App or Cloud Source Repositories mirroring.
2. Grant Cloud Build service account permissions (see `doc/deployment.md`).

### Trigger 1: Development (feature/* → develop)

```bash
gcloud builds triggers create github \
  --name="flux-dev-ci" \
  --repo-owner="ujju16" \
  --repo-name="flux-electrique" \
  --branch-pattern="^develop$" \
  --build-config="cloudbuild.dev.yaml" \
  --substitutions=_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/flux/flux-electrique",_GKE_CLUSTER="flux-electrique-dev",_GKE_REGION="europe-west1",_GKE_NAMESPACE="flux-dev",_DEPLOYMENT="flux-electrique",_ENV="development"
```

**When it runs**: Every push to `develop` (after feature branch merges).  
**What it does**: Deploys to dev environment for continuous integration testing.

### Trigger 2: Staging (develop → staging)

```bash
gcloud builds triggers create github \
  --name="flux-staging-ci" \
  --repo-owner="ujju16" \
  --repo-name="flux-electrique" \
  --branch-pattern="^staging$" \
  --build-config="cloudbuild.staging.yaml" \
  --substitutions=_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/flux/flux-electrique",_GKE_CLUSTER="flux-electrique-staging",_GKE_REGION="europe-west1",_GKE_NAMESPACE="flux-staging",_DEPLOYMENT="flux-electrique",_ENV="staging"
```

**When it runs**: Every push to `staging` (end-of-sprint merges from develop).  
**What it does**: Deploys to staging cluster for UAT and QA sign-off.

### Trigger 3: Production (staging → main)

```bash
gcloud builds triggers create github \
  --name="flux-production-ci" \
  --repo-owner="ujju16" \
  --repo-name="flux-electrique" \
  --branch-pattern="^main$" \
  --build-config="cloudbuild.yaml" \
  --substitutions=_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/flux/flux-electrique",_GKE_CLUSTER="flux-electrique-prod",_GKE_REGION="europe-west1",_GKE_NAMESPACE="flux-prod",_DEPLOYMENT="flux-electrique",_ENV="production"
```

**When it runs**: Every push to `main` (production releases after PO approval).  
**What it does**: Deploys to production GKE cluster with zero-downtime rolling update.

### Trigger 4: PR Validation (feature/* PRs)

```bash
gcloud builds triggers create github \
  --name="flux-pr-validation" \
  --repo-owner="ujju16" \
  --repo-name="flux-electrique" \
  --pull-request-pattern="^feature/.*|^bugfix/.*" \
  --build-config="cloudbuild.dev.yaml" \
  --comment-control="COMMENTS_ENABLED" \
  --substitutions=_IMAGE="europe-west1-docker.pkg.dev/$PROJECT_ID/flux/flux-electrique",_GKE_CLUSTER="flux-electrique-dev",_GKE_REGION="europe-west1",_GKE_NAMESPACE="flux-dev",_DEPLOYMENT="flux-electrique",_ENV="development"
```

**When it runs**: Pull requests from feature/bugfix branches to `develop`.  
**What it does**: Runs lint, build, security scan (no deployment). Reports status to PR.

## 3. GitHub Actions (Alternative/Supplement)

If you prefer GitHub Actions for PR checks instead of Cloud Build:

Create `.github/workflows/pr-checks.yml`:

```yaml
name: PR Validation
on:
  pull_request:
    branches: [develop, staging, main]
jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npx prisma validate
```

## 4. Secrets Management

Store these secrets in **Settings → Secrets and variables → Actions** (for GitHub Actions) or **Google Secret Manager** (for Cloud Build):

- `DATABASE_URL` (per environment: dev, staging, prod)
- `NEXTAUTH_SECRET` (if using auth)
- `GCP_SERVICE_ACCOUNT_KEY` (only if not using Workload Identity)

**Never commit secrets to the repository.**

## 5. CODEOWNERS File (Optional)

Create `.github/CODEOWNERS` to auto-assign reviewers:

```
# Default reviewers for all files
* @ujju16

# DevOps/Infrastructure changes
/k8s/ @ujju16
/cloudbuild*.yaml @ujju16
/scripts/ @ujju16
/Dockerfile @ujju16

# Database schema changes
/prisma/ @ujju16

# Frontend components
/src/app/ @ujju16
/src/components/ @ujju16
```

## 6. Notifications & Monitoring

### Slack Integration

1. Install **Google Cloud Build** Slack app in your workspace.
2. Configure notifications for:
   - Build failures (all environments)
   - Production deployments (success/failure)
   - Security scan failures

### Email Alerts

Configure Cloud Monitoring alerts for:
- Failed deployments (any environment)
- High error rate in production (>5% over 5 minutes)
- Pod crash loops

## 7. Enforcement Checklist

Before going live with this workflow, verify:

- [ ] All branch protection rules active
- [ ] Cloud Build triggers configured for `develop`, `staging`, `main`
- [ ] Service accounts have least-privilege IAM roles
- [ ] Secrets migrated to Secret Manager (not in Git)
- [ ] PR template in use (`.github/pull_request_template.md`)
- [ ] Team trained on Agile workflow (see `doc/agile_workflow.md`)
- [ ] First sprint planned with backlog groomed

---

**Reference**: See `doc/agile_workflow.md` for branching strategy details and sprint ceremonies.
