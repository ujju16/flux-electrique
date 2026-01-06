# Security & Compliance Checklist

This checklist helps ensure DevSecOps guardrails stay enforced across the Flux Electrique platform.

## 1. Source Control Hygiene

- Commit signing enabled for maintainers.
- Secrets, certificates, and kubeconfigs are forbidden in Git. Use `git secrets` or `trufflehog` pre-commit hooks.
- Protected branches require pull requests + review + status checks (Biome, unit tests, container scan).

## 2. Dependencies

- Run `npm audit` locally before bumping packages.
- Bi-weekly dependency review; pin versions in `package-lock.json`.
- Prisma schema changes require migration review.

## 3. Build Pipeline

- Cloud Build service account limited to Artifact Registry + specific cluster.
- Enable Cloud Build provenance and store SBOMs (Trivy `--format cyclonedx --output sbom.json`).
- Enforce `requestedVerifyOption: VERIFIED` to prevent unverified sources.
- Rotate service-account keys (prefer Workload Identity to avoid keys entirely).

## 4. Runtime (GKE)

- Pods run as `runAsNonRoot`, `readOnlyRootFilesystem=true`, `allowPrivilegeEscalation=false`.
- Use Autopilot Pod Security defaults or PodSecurityAdmission (baseline).
- Configure Network Policies to limit ingress/egress if cluster hosts more workloads.
- Enable Cloud Armor or Ingress security policies if exposing externally via HTTP(S) load balancer.

## 5. Secret Management

- Store production secrets in Google Secret Manager with automatic rotation.
- Deploy via Secret Manager CSI driver or sealed secrets; never bake into Docker images.
- Use Workload Identity Federation for database access tokens if feasible.

## 6. Monitoring & Alerting

- Log-based alerts for repeated 401/403 (possible attack).
- Metrics: CPU/memory, response latency, error rate, queue of failed builds.
- Audit logs retained for at least 400 days per compliance.

## 7. Incident Response

- Keep `doc/deployment.md` handy for redeploying/rollback.
- Tag releases with `v*` to map incidents to code.
- Document root cause within 48h and track mitigations.
