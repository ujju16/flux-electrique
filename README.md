# Flux Electrique

Site web professionnel présentant la double expertise **Hardware (Réparation Électronique)** et **Software (Développement & DevSecOps)**.

## 🚀 Stack Technique

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod
- **Code Quality**: Biome (pas ESLint/Prettier)
- **Deployment**: Google Cloud (GKE + Cloud SQL)

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Configurer la base de données dans .env
# DATABASE_URL="postgresql://user:password@localhost:5432/flux_electrique"

# Générer le client Prisma
npx prisma generate

# Lancer les migrations
npx prisma migrate dev

# Démarrer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## 🎨 Charte Graphique

### Couleurs
- **Primaire**: `#00E5FF` (Cyan électrique) - CTA et liens
- **Secondaire**: `#00C853` (Vert Matrix) - Succès, opérationnel
- **Fond Deep**: `#0D1117` (Noir profond)
- **Fond Card**: `#161B22` (Gris foncé)
- **Texte**: `#E6EDF3` (Blanc cassé)

### Typographie
- **Corps**: Inter (via next/font)
- **Titres**: Orbitron (touche futuriste)
- **Code**: Fira Code (blog technique)

## 📁 Structure du Projet

```
src/
├── app/(site)/          # Pages publiques (route group)
│   ├── page.tsx         # Accueil
│   ├── about/           # À propos
│   ├── services/        # Services
│   ├── contact/         # Contact
│   └── blog/
│       └── [slug]/      # Articles dynamiques
├── components/
│   ├── ui/              # Composants atomiques
│   ├── business/        # Composants métier
│   └── layout/          # Header, Footer
├── lib/
│   ├── prisma.ts        # Client Prisma singleton
│   └── utils.ts         # Helpers (cn, etc.)
└── server/
    └── actions.ts       # Server Actions (formulaires)

prisma/
└── schema.prisma        # Schéma DB (Post, ContactSubmission)
```

## 🗄️ Modèle de Données

### Post (Blog)
- Catégories: `ELECTRONIC`, `SOFTWARE`, `DEVSECOPS`
- Support Markdown/MDX
- Génération statique avec `generateStaticParams`

### ContactSubmission
- Tracking des demandes de contact
- Validation Zod côté serveur

## 🛠️ Commandes

```bash
npm run dev      # Dev server
npm run build    # Production build
npm start        # Production server
npm run lint     # Biome check
npm run format   # Biome format

# Prisma
npx prisma studio          # Interface DB
npx prisma migrate dev     # Nouvelle migration
npx prisma generate        # Générer le client
npx prisma db push         # Sync sans migration
```

## 🚢 Déploiement (Google Cloud)

### Prérequis
- GKE Autopilot cluster
- Cloud SQL PostgreSQL instance
- Artifact Registry repository

### Pipeline CI/CD
1. **Lint** - Biome checks
2. **Build** - Docker multi-stage
3. **Scan** - Trivy (vulnérabilités)
4. **Push** - Artifact Registry
5. **Deploy** - GKE (via Helm/Kustomize)

### Configuration
- Container non-root user (sécurité K8s)
- Headers CSP dans `next.config.ts`
- Standalone output mode activé

## 🧪 CI/CD & DevSecOps (Multi-Stage Pipeline)

### Environment Strategy

- **Development** (`develop` branch) → GKE dev cluster (1 replica, continuous deployment)
- **Staging** (`staging` branch) → GKE staging cluster (2 replicas, UAT/QA testing)
- **Production** (`main` branch) → GKE prod cluster (3 replicas, zero-downtime rolling updates)

### Pipeline Automation

- **Cloud Build** pilote la chaîne complète via trois configurations :
  - [`cloudbuild.dev.yaml`](cloudbuild.dev.yaml) - Développement continu
  - [`cloudbuild.staging.yaml`](cloudbuild.staging.yaml) - Validation pré-production
  - [`cloudbuild.yaml`](cloudbuild.yaml) - Déploiement production
  
- **Étapes par environnement** : Lint (Biome) → Build (Next.js) → Scan (Trivy CRITICAL/HIGH) → Push (Artifact Registry) → Deploy (GKE via Kustomize overlays)

- **Sécurité pipeline** :
  - `requestedVerifyOption: VERIFIED` (provenance attestation)
  - Scan Trivy en mode bloquant (zero tolerance for HIGH/CRITICAL in staging/prod)
  - Service account à privilèges minimaux (Artifact Registry Writer + GKE Developer)
  - Aucun secret dans Git (Google Secret Manager + Kubernetes secrets)

### Kustomize Overlays (Environment-Specific Configs)

```
k8s/
├── base/                  # Manifestes communs (deployment, service, namespace)
└── overlays/
    ├── dev/               # 1 replica, 100m CPU, 128Mi RAM
    ├── staging/           # 2 replicas, 200m CPU, 192Mi RAM
    └── production/        # 3 replicas, 250m CPU, 256Mi RAM, maxUnavailable=0
```

Chaque overlay applique des patches JSON pour les ressources, replicas et labels d'environnement.

## 🏃 Agile & Scrum Workflow

### Branching Strategy (Git Flow)

- **`main`** → Production (merges from `staging` only, 2 approvals required)
- **`staging`** → Pre-production UAT (merges from `develop` after sprint review)
- **`develop`** → Integration branch (feature branches merge here)
- **`feature/FLX-XX-desc`** → Feature branches (auto-delete after merge)
- **`hotfix/FLX-XX-desc`** → Emergency production fixes (branch from `main`)

See [doc/branching_strategy.md](doc/branching_strategy.md) for detailed workflow and examples.

### Sprint Cadence (2 semaines)

| Jour | Cérémonie | Durée | Action Technique |
|------|-----------|-------|------------------|
| Lundi | Sprint Planning | 2h | Estimer les stories (Planning Poker) |
| Lundi-Jeudi | Daily Standup | 15min | Sync équipe (bloqueurs, progrès) |
| Vendredi | Sprint Review | 1h | Démo PO → Merge `develop` → `staging` |
| Vendredi | Retrospective | 1h | Amélioration continue |
| Mercredi | Backlog Refinement | 1h | Préparer prochain sprint |
| **Mercredi Release** | Production Deploy | - | Merge `staging` → `main` (après UAT) |

### Definition of Done (DoD)

- [ ] Code merged to `develop` via approved PR
- [ ] Biome lint + Next.js build passes
- [ ] Trivy scan: 0 HIGH/CRITICAL vulnerabilities
- [ ] Deployed to dev environment and smoke-tested
- [ ] Documentation updated (if public API changed)
- [ ] PO accepts story in Sprint Review

See [doc/agile_workflow.md](doc/agile_workflow.md) for story estimation, metrics, and ceremony templates.

## 📚 Documentation Complète

- **[doc/agile_workflow.md](doc/agile_workflow.md)** - Scrum ceremonies, story estimation, metrics
- **[doc/branching_strategy.md](doc/branching_strategy.md)** - Git Flow, branch naming, merge workflows
- **[doc/branch_protection.md](doc/branch_protection.md)** - GitHub protection rules, Cloud Build triggers
- **[doc/ci_cd_pipeline.md](doc/ci_cd_pipeline.md)** - Pipeline stages, security hardening
- **[doc/deployment.md](doc/deployment.md)** - Multi-environment GKE setup, `scripts/cicd.py` usage
- **[doc/security.md](doc/security.md)** - Security checklist, secret management, compliance



## 📋 Exigences Non-Fonctionnelles

- **PERF-01**: Core Web Vitals (LCP < 2.5s sur mobile)
- **SEC-01**: CSP headers configurés
- **SEC-02**: Container non-root
- **FUNC-Blog-01**: SSG avec `generateStaticParams`
- **FUNC-Contact-01**: Validation Zod + Server Actions

## 🎯 Personas

1. **Particulier** - Appareil en panne, cherche expert local
2. **Professionnel B2B** - Projet IoT/embarqué nécessitant expertise Hardware+Software

## 📝 License

Propriétaire - Flux Electrique © 2026
