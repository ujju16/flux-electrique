# CI/CD Pipeline (Flux Electrique)

This document describes the production-ready pipeline that keeps the Flux Electrique platform secure, reproducible, and auditable on Google Cloud (Cloud Build + Artifact Registry + GKE).

## 1. Guiding Principles

- **Shift-left security**: lint, type-check, and dependency scans run prior to any container build.
- **No plaintext secrets**: every credential is sourced at runtime from Google Secret Manager or Kubernetes secrets created from GSM versions.
- **Immutable artifacts**: containers are tagged with the commit SHA and stored in Artifact Registry. Deployments only reference immutable tags.
- **Zero-trust deploys**: Cloud Build runs with a dedicated service account (least privilege) and deploys through `kubectl` using Workload Identity.

## 2. Stage Overview

| Stage | Tooling | Purpose |
| --- | --- | --- |
| Local pre-flight | `scripts/cicd.py local` | Prevent obviously bad commits from reaching CI (Biome lint, Next build, Prisma validation).
| Cloud Build - Install & Test | `npm ci`, `npm run lint`, `npm run build` | Re-run deterministic install; produces `.next` artifacts.
| Cloud Build - Containerize | `docker build` + multi-stage `Dockerfile` | Builds non-root image with Prisma client included.
| Cloud Build - Scan | `aquasec/trivy` | Blocks promotion if HIGH/CRITICAL vulnerabilities are detected.
| Cloud Build - Push | `docker push` | Publishes to Artifact Registry (`${_IMAGE}:$SHORT_SHA`).
| Cloud Build - Deploy | `kubectl` | Applies Kubernetes manifests and performs a rolling update (with rollout status check).

## 3. Cloud Build Configuration

File: `cloudbuild.yaml`

Key substitution variables (set per-trigger):

- `_IMAGE` – Artifact Registry URI (e.g. `europe-west1-docker.pkg.dev/$PROJECT_ID/flux/flux-electrique`).
- `_GKE_CLUSTER` – Target Autopilot cluster name.
- `_GKE_REGION` – Region of the cluster (Autopilot only uses regional control planes).
- `_GKE_NAMESPACE` – Namespace managed by the pipeline (e.g. `flux-app`).
- `_DEPLOYMENT` – Kubernetes Deployment name (`flux-electrique`).

All GCP access happens through the Cloud Build service account `flux-electrique-cicd@<PROJECT_ID>.iam.gserviceaccount.com`. Grant it only:

- `roles/artifactregistry.writer`
- `roles/container.developer`
- `roles/container.clusterViewer`
- `roles/container.admin` (only if you cannot scope more narrowly for apply/set-image)

## 4. Secret Handling

1. Store sensitive values (e.g. `DATABASE_URL`, `NEXTAUTH_SECRET`) in Google Secret Manager.
2. Grant read access to the GKE workload identity service account used by the deployment.
3. Sync secrets into the cluster via the Secret Manager CSI driver **or** a short-lived `kubectl create secret` command executed from a secure workstation.
4. Kubernetes manifests reference secrets only by name (`envFrom.secretRef`). No literal values live in Git.

## 5. Supply-chain Hardening

- Containers are built on top of `gcr.io/distroless/nodejs20-debian12` and run as `nonroot` with a read-only file system.
- Trivy executes in `--exit-code 1 --severity CRITICAL,HIGH` mode to break the pipeline if severe vulnerabilities are present.
- Set up Artifact Analysis (Container Scanning) and Binary Authorization in the project for runtime enforcement.
- Enable Cloud Build provenance attestations (`requestedVerifyOption: VERIFIED`).

## 6. Observability & Rollbacks

- Cloud Build streams logs to Cloud Logging; use alerting on failed builds.
- Kubernetes deployment uses rolling updates with a max unavailable of one pod. A failed rollout is automatically detected by the rollout status check.
- Rollback by re-running the Python script with `--deployment-version <PREVIOUS_SHA>` or via `kubectl rollout undo deployment/flux-electrique -n <namespace>`.

## 7. Local to Cloud Workflow

1. Run `python scripts/cicd.py local` before pushing to ensure lint/build parity.
2. Push to `main`. Cloud Build trigger runs automatically with repo mirroring (or call `python scripts/cicd.py submit` if invoking manually from Cloud Shell).
3. Monitor build logs; upon success the workload updates in GKE.

Refer to `doc/deployment.md` for environment preparation and trigger wiring specifics.
