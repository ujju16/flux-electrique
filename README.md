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
