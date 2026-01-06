# Agile & Scrum Workflow (Flux Electrique)

This document establishes the Agile/Scrum development methodology for Flux Electrique, including sprint ceremonies, story estimation, branching strategy, and definition of done.

## 1. Team Structure

- **Product Owner**: Defines and prioritizes backlog; single source of truth for business requirements.
- **Scrum Master**: Facilitates ceremonies, removes impediments, coaches team on Agile practices.
- **Development Team**: Cross-functional team (frontend, backend, DevOps, QA) responsible for delivering potentially shippable increments.

## 2. Sprint Cadence (2-week sprints)

### Sprint Ceremonies

| Ceremony | Duration | Participants | Purpose |
|----------|----------|--------------|---------|
| **Sprint Planning** | 2h | Full team | Select stories from backlog, define sprint goal, break down tasks, commit to sprint backlog. |
| **Daily Standup** | 15min | Dev team | Sync on progress (yesterday, today, blockers). |
| **Sprint Review** | 1h | Full team + stakeholders | Demo completed work, collect feedback. |
| **Sprint Retrospective** | 1h | Full team | Reflect on process, identify improvements. |
| **Backlog Refinement** | 1h mid-sprint | PO + 2-3 devs | Estimate upcoming stories, clarify acceptance criteria. |

### Story Estimation (Fibonacci Scale)

- **1 point**: Trivial change (typo fix, config tweak) – < 2 hours.
- **2 points**: Small feature or bug fix – 2-4 hours.
- **3 points**: Medium feature – half day.
- **5 points**: Complex feature – 1 day.
- **8 points**: Large feature requiring multiple devs or research – 2 days.
- **13+ points**: Epic; split into smaller stories.

**Planning Poker** used in refinement sessions to reach consensus.

## 3. Branching Strategy (Git Flow Adapted)

### Permanent Branches

- **`main`** → Production-ready code. Deploys to GKE production cluster. Protected; merge only via PR from `staging`.
- **`staging`** → Pre-production environment for UAT/QA. Deploys to GKE staging cluster. Merge from `develop` after sprint review.
- **`develop`** → Integration branch for ongoing sprint work. Deploys to dev environment. Merge feature branches here.

### Temporary Branches

- **`feature/<ticket-id>-<short-desc>`** → e.g. `feature/FLX-42-contact-form`. Created from `develop`, merged back via PR.
- **`bugfix/<ticket-id>-<short-desc>`** → Non-critical bugs found in `develop`.
- **`hotfix/<ticket-id>-<short-desc>`** → Critical production bugs. Branch from `main`, merge to both `main` AND `develop`.
- **`release/<version>`** → Optional for larger releases. Branch from `develop`, stabilize, then merge to `staging` → `main`.

### Branch Lifecycle

```
develop ──┬── feature/FLX-42-contact-form
          │   (work happens here)
          └── PR → develop (after CI passes + review)
          
develop ──── PR → staging (post-sprint review)
          
staging ──── PR → main (after UAT sign-off)
```

## 4. Pull Request (PR) Workflow

### PR Requirements (enforced via branch protection)

1. **Title Format**: `[FLX-42] Add contact form with Zod validation`
2. **Description Template** (see `.github/pull_request_template.md`):
   - User story reference
   - Changes made
   - Testing evidence (screenshots, test output)
   - Deployment notes
3. **Checks Must Pass**:
   - Biome lint + format
   - TypeScript build
   - Prisma validation
   - Trivy container scan (HIGH/CRITICAL = 0)
4. **Approval**: Minimum 1 peer review from a dev team member.
5. **No Direct Commits**: Force-push and direct commits disabled on `main`, `staging`, `develop`.

### PR Review Checklist

- Code follows Biome style guide.
- Tests added/updated (manual testing documented if no automated tests yet).
- No hardcoded secrets or credentials.
- README/docs updated if public API changed.
- Migration scripts tested locally (if schema changes).

## 5. Definition of Done (DoD)

A story is "Done" when:

- [ ] Code merged to `develop` via approved PR.
- [ ] All acceptance criteria met (verified in review demo).
- [ ] Biome lint passes with zero errors.
- [ ] Next.js builds successfully in standalone mode.
- [ ] Deployed to dev environment and smoke-tested.
- [ ] Security scan (Trivy) shows no HIGH/CRITICAL vulnerabilities.
- [ ] Relevant documentation updated in `doc/` or README.
- [ ] PO accepts the story during Sprint Review.

## 6. Release Process (Staging → Production)

### End of Sprint

1. **Sprint Review** (Friday): Demo all "Done" stories to PO/stakeholders. Collect feedback.
2. **Merge `develop` → `staging`**: Triggers staging deployment (Cloud Build + GKE staging cluster).
3. **UAT Phase** (Monday-Tuesday): QA and PO test on staging. Log any critical bugs as hotfixes.
4. **Production Release** (Wednesday):
   - Create PR: `staging` → `main`
   - PO approval required
   - Merge triggers production Cloud Build pipeline
   - Monitor rollout; rollback if SLOs breached

### Hotfix Process (Production Emergencies)

1. Create `hotfix/FLX-99-critical-bug` from `main`.
2. Fix + test locally.
3. PR to `main` (expedited review; single approver OK).
4. After merge, **immediately backport**: create PR from `main` to `develop` to keep branches in sync.

## 7. Metrics & Continuous Improvement

- **Velocity Tracking**: Sum of story points completed per sprint. Target: stabilize within ±15% after 3 sprints.
- **Lead Time**: Time from story start to production deploy. Target: < 5 business days.
- **Deployment Frequency**: Aim for weekly production releases (every Wednesday).
- **Change Failure Rate**: Track rollbacks. Target: < 5%.

Metrics reviewed in retrospectives to identify process bottlenecks.

## 8. Tools Integration

- **Backlog Management**: GitHub Projects (Kanban board with "Backlog", "Sprint", "In Progress", "Review", "Done" columns).
- **Ticket Format**: `FLX-<number>` in GitHub Issues.
- **CI/CD**: Cloud Build triggers auto-run on PRs to `develop`, `staging`, `main`.
- **Alerts**: Slack notifications for failed builds, deployment events, and Sentry errors.

## 9. Sprint Artifact Examples

### Sprint Goal Template

> "Enable visitors to submit contact inquiries and receive automated email confirmation."

### User Story Template

```
As a [persona],
I want to [action],
So that [business value].

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3
```

### Sprint Retrospective Format

- **What went well**: Celebrate wins.
- **What could improve**: Identify friction points.
- **Action items**: Assign owners for process changes (track as tickets).

---

**Version**: 1.0  
**Last Updated**: January 6, 2026  
**Review Cycle**: Quarterly (or after major process changes)
