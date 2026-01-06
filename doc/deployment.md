# Multi-Environment Deployment Guide (Google Cloud)

This runbook explains how to prepare Google Cloud resources for **development**, **staging**, and **production** environments and operate deployments using the Python helper `scripts/cicd.py`.

See `doc/agile_workflow.md` for the branching strategy and sprint-based release process.

## 1. Prerequisites

- Google Cloud project with billing enabled
- Cloud Build API, Artifact Registry API, GKE API enabled
- gcloud CLI >= 470 installed locally (or Cloud Shell)
- Python 3.10+

## 2. Bootstrap Infrastructure

### Shared Artifact Registry

```bash
PROJECT_ID="flux-prod"
REGION="europe-west1"
REPO="flux"

# Artifact Registry (shared across all environments)
gcloud artifacts repositories create "$REPO" \
  --repository-format=docker \
  --location="$REGION" \
  --description="Flux Electrique containers (all environments)"
```

### GKE Clusters (3 Autopilot clusters)

```bash
# Development cluster
gcloud container clusters create-auto flux-electrique-dev \
  --region="$REGION" \
  --project="$PROJECT_ID"

# Staging cluster
gcloud container clusters create-auto flux-electrique-staging \
  --region="$REGION" \
  --project="$PROJECT_ID"

# Production cluster (with additional hardening)
gcloud container clusters create-auto flux-electrique-prod \
  --region="$REGION" \
  --project="$PROJECT_ID" \
  --enable-shielded-nodes \
  --enable-binauthz
```

### Namespaces (created automatically by Kustomize overlays)

Namespaces `flux-dev`, `flux-staging`, and `flux-prod` are defined in `k8s/overlays/*/kustomization.yaml` and applied during deployment.

## 3. Service Accounts + Secrets

1. **Cloud Build SA** (`$PROJECT_NUMBER@cloudbuild.gserviceaccount.com`) – grant:
   - `Artifact Registry Writer`
   - `Kubernetes Engine Developer`
   - `Kubernetes Engine Cluster Viewer`
2. **Runtime SA** (Workload Identity) – grant Secret Manager accessor for runtime secrets.
3. Populate Google Secret Manager entries and replicate them into Kubernetes secrets via Secret Manager CSI driver or `kubectl create secret generic flux-runtime --from-literal=...`.

## 4. Cloud Build Triggers (Multi-Environment)

See `doc/branch_protection.md` for detailed trigger setup commands.

**Summary of triggers:**

- **`flux-dev-ci`** → Triggered on push to `develop` → Deploys to dev cluster
- **`flux-staging-ci`** → Triggered on push to `staging` → Deploys to staging cluster
- **`flux-production-ci`** → Triggered on push to `main` → Deploys to production cluster
- **`flux-pr-validation`** → Triggered on PRs → Runs lint/build/scan (no deploy)

Each trigger uses a dedicated Cloud Build config (`cloudbuild.dev.yaml`, `cloudbuild.staging.yaml`, `cloudbuild.yaml`).

## 5. Python Helper (`scripts/cicd.py`)

The script wraps common DevSecOps operations.

### Environment Variables (Environment-Specific)

Set these in your shell before running `scripts/cicd.py` (no secrets checked into Git):

**For Development:**
```bash
export GCP_PROJECT_ID="flux-prod"
export GCP_REGION="europe-west1"
export GKE_CLUSTER="flux-electrique-dev"
export GKE_NAMESPACE="flux-dev"
export ARTIFACT_REPOSITORY="europe-west1-docker.pkg.dev/flux-prod/flux/flux-electrique"
export DEPLOYMENT_NAME="flux-electrique"
```

**For Staging:**
```bash
export GKE_CLUSTER="flux-electrique-staging"
export GKE_NAMESPACE="flux-staging"
```

**For Production:**
```bash
export GKE_CLUSTER="flux-electrique-prod"
export GKE_NAMESPACE="flux-prod"
```

Optional for manual image tags:

- `IMAGE_TAG` – override commit SHA when re-deploying existing images (e.g., for rollbacks).

### Usage

```bash
python scripts/cicd.py local        # Run Biome + Next build locally
python scripts/cicd.py submit       # Submit Cloud Build with substitutions and wait for completion
python scripts/cicd.py deploy       # Pull credentials + kubectl apply + rollout status
python scripts/cicd.py full         # local -> submit -> deploy
```

All commands fail fast and return non-zero on errors, allowing inclusion in other automation.

## 6. Observability + Rollback

- Inspect Cloud Build logs via `gcloud builds describe <BUILD_ID>` or the console.
- Kubernetes rollout status is printed by both the pipeline and the Python helper; rollback with `kubectl rollout undo deployment/flux-electrique -n $NAMESPACE`.
- Store SLO and monitoring rules in Cloud Monitoring (alert on 5xx, high latency, or failed deploys).

## 7. Disaster Recovery Checklist

1. Confirm Artifact Registry contains last known-good image.
2. Run `python scripts/cicd.py deploy --image-tag <KNOWN_SHA>` to pin deploy.
3. If cluster unavailable, recreate Autopilot cluster and re-apply manifests from `k8s/`.
4. Restore secrets from Secret Manager by re-mounting or re-creating Kubernetes secrets.
