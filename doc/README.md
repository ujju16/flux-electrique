# Documentation Index (Flux Electrique)

Complete guide to the Flux Electrique development, deployment, and operational processes.

## 📖 Quick Start

New to the project? Start here:

1. **[README.md](../README.md)** - Project overview, tech stack, local setup
2. **[Agile Workflow](agile_workflow.md)** - Sprint ceremonies, story estimation, Definition of Done
3. **[Branching Strategy](branching_strategy.md)** - Git Flow, branch naming, merge workflows

## 🏗️ Development Process

### Agile & Scrum
- **[Agile Workflow](agile_workflow.md)** - Sprint ceremonies (2-week sprints), story estimation (Fibonacci), Definition of Done
- **[Branching Strategy](branching_strategy.md)** - Git Flow adapted for multi-stage deployments (develop → staging → main)

### Code Quality & Pull Requests
- **[Branch Protection](branch_protection.md)** - GitHub protection rules, required approvals, status checks
- **Pull Request Template** - [.github/pull_request_template.md](../.github/pull_request_template.md)
- **Pre-commit Hook** - [scripts/pre-commit.sh](../scripts/pre-commit.sh) (prevents secrets, runs Biome lint)

## 🚀 DevSecOps & Deployment

### CI/CD Pipeline
- **[CI/CD Pipeline](ci_cd_pipeline.md)** - Multi-stage pipeline architecture, Trivy scanning, supply chain security
- **[Deployment Guide](deployment.md)** - GKE setup (dev/staging/prod), Cloud Build triggers, Python helper usage
- **[Security Checklist](security.md)** - Secret management, runtime hardening, compliance requirements

### Infrastructure as Code
- **Kubernetes Manifests**: [k8s/](../k8s/) (Kustomize overlays for dev/staging/production)
- **Cloud Build Configs**:
  - [cloudbuild.dev.yaml](../cloudbuild.dev.yaml) - Development environment
  - [cloudbuild.staging.yaml](../cloudbuild.staging.yaml) - Staging/UAT environment
  - [cloudbuild.yaml](../cloudbuild.yaml) - Production environment
- **Dockerfile**: [Dockerfile](../Dockerfile) - Multi-stage build (distroless, non-root)

## 🛠️ Scripts & Tools

| Script | Purpose | Usage |
|--------|---------|-------|
| [scripts/cicd.py](../scripts/cicd.py) | Deploy automation | `python scripts/cicd.py {local\|submit\|deploy\|full}` |
| [scripts/pre-commit.sh](../scripts/pre-commit.sh) | Git pre-commit hook | `cp scripts/pre-commit.sh .git/hooks/pre-commit` |

## 📊 Environments Overview

| Environment | Branch | GKE Cluster | Namespace | Replicas | Auto-Deploy |
|-------------|--------|-------------|-----------|----------|-------------|
| **Development** | `develop` | `flux-electrique-dev` | `flux-dev` | 1 | ✅ Every push |
| **Staging** | `staging` | `flux-electrique-staging` | `flux-staging` | 2 | ✅ End-of-sprint |
| **Production** | `main` | `flux-electrique-prod` | `flux-prod` | 3 | ✅ After UAT sign-off |

## 🔄 Common Workflows

### Starting a New Feature
```bash
git checkout develop && git pull origin develop
git checkout -b feature/FLX-42-contact-form
# ... make changes ...
git push -u origin feature/FLX-42-contact-form
# Create PR to develop via GitHub UI
```

### End-of-Sprint Release
```bash
# After Sprint Review (Friday)
git checkout staging
git merge develop --no-ff
git push origin staging  # Triggers staging deployment

# After UAT (Wednesday)
git checkout main
git merge staging --no-ff
git tag -a v1.2.0 -m "Sprint 12 release"
git push origin main --follow-tags  # Triggers production deployment
```

### Emergency Hotfix
```bash
git checkout main && git pull origin main
git checkout -b hotfix/FLX-99-critical-bug
# ... fix bug ...
git push -u origin hotfix/FLX-99-critical-bug
# Create PR to main (expedited review)
# After merge: backport to develop
git checkout develop && git merge main
```

## 🎯 Key Metrics (Tracked in Retrospectives)

- **Velocity**: Story points completed per sprint (target: stable ±15%)
- **Lead Time**: Story start → production deploy (target: <5 days)
- **Deployment Frequency**: Weekly production releases (Wednesday)
- **Change Failure Rate**: Rollbacks (target: <5%)

## 📞 Support & Contacts

- **Product Owner**: Defines backlog priorities
- **Scrum Master**: Facilitates ceremonies, removes blockers
- **Dev Team**: Cross-functional (frontend, backend, DevOps)

## 🔗 External References

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Biome Linter](https://biomejs.dev)
- [Google Cloud Build](https://cloud.google.com/build/docs)
- [Kubernetes (GKE)](https://cloud.google.com/kubernetes-engine/docs)
- [Conventional Commits](https://www.conventionalcommits.org)

---

**Last Updated**: January 6, 2026  
**Maintained By**: Flux Electrique DevOps Team
