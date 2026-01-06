# Copilot Instructions for flux-electrique

## Project Overview
"Flux Electrique" - Professional website showcasing dual expertise in **electronics repair** (Hardware) and **software development** (DevSecOps, IoT, embedded systems). Built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, and PostgreSQL via Prisma. Uses **Biome** for linting/formatting instead of ESLint/Prettier.

## Technology Stack
- **Framework**: Next.js 16.1 with App Router (`src/app/` directory structure)
- **React**: Version 19.2 with React Compiler enabled (`reactCompiler: true` in [next.config.ts](../next.config.ts))
- **Styling**: Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- **Database**: PostgreSQL with Prisma ORM v6 (see [prisma/schema.prisma](../prisma/schema.prisma))
- **Type System**: TypeScript 5 with strict mode enabled
- **Validation**: Zod for form validation and environment variables
- **Code Quality**: Biome 2.2 (NOT ESLint/Prettier)
- **Deployment Target**: Google Cloud (GKE + Cloud SQL) with Docker containers

## Key Conventions

### Code Quality & Formatting
- **Always use Biome**, never ESLint or Prettier:
  - Lint: `npm run lint` (runs `biome check`)
  - Format: `npm run format` (runs `biome format --write`)
- Biome config in [biome.json](../biome.json) enforces:
  - 2-space indentation
  - Next.js and React recommended rules
  - Auto-organize imports on save
  - VCS-aware (Git integration enabled)

### TypeScript & Module Resolution
- Path alias: `@/*` maps to `./src/*` (configured in [tsconfig.json](../tsconfig.json))
- React JSX transform: `"jsx": "react-jsx"` (no need to import React in components)
- Strict mode enabled with `noEmit` (Next.js handles compilation)

### Styling Patterns
- **Brand Identity**: Dark theme with electric/tech aesthetic
  - Primary: `#00E5FF` (cyan électrique) - for CTAs and links
  - Secondary: `#00C853` (green Matrix/circuit) - for success states
  - Background Deep: `#0D1117` (GitHub Dark style)
  - Background Card: `#161B22` (for cards/sections)
  - Text: `#E6EDF3` (off-white for readability)
- Uses Tailwind v4 inline theme syntax in [globals.css](../src/app/globals.css):
  ```css
  @theme inline {
    --color-flux-primary: var(--flux-primary);
  }
  ```
- CSS variables for theming: Access via `--flux-primary`, `--flux-secondary`, etc.
- Dark mode by default (no light mode toggle currently)
- Typography fonts loaded in [layout.tsx](../src/app/layout.tsx):
  - **Inter** (body text) - `--font-inter`
  - **Orbitron** (headings/display) - `--font-orbitron`
  - **Fira Code** (code blocks in blog) - `--font-fira-code`

### Component Structure
- **Server Components by default** (React 19 + Next.js App Router)
- Use `"use client"` directive only when needed (forms, interactive elements)
- **Route Groups**: Main site in `src/app/(site)/` for shared layout
- Folder organization:
  ```
  src/
  ├── app/(site)/          # Public-facing pages with shared layout
  │   ├── page.tsx         # Homepage
  │   ├── about/
  │   ├── services/
  │   ├── contact/
  │   └── blog/
  │       └── [slug]/      # Dynamic blog post pages
  ├── components/
  │   ├── ui/              # Atomic components (shadcn/ui style)
  │   ├── business/        # Domain-specific (ServiceCard, TechStackList)
  │   └── layout/          # Header, Footer
  ├── lib/
  │   ├── prisma.ts        # Singleton Prisma client
  │   └── utils.ts         # Helpers (cn() for class merging)
  └── server/
      └── actions.ts       # Server Actions (contact form, etc.)
  ```

## Development Workflow

### Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm start` - Run production server
- `npm run lint` - Run Biome checks
- `npm run format` - Auto-format with Biome

### Database (Prisma)
- Prisma schema in [prisma/schema.prisma](../prisma/schema.prisma)
- Models: `Post` (blog), `ContactSubmission` (contact tracking)
- Categories: `ELECTRONIC`, `SOFTWARE`, `DEVSECOPS`
- Generate client: `npx prisma generate`
- Run migrations: `npx prisma migrate dev`
- Access via singleton in [lib/prisma.ts](../src/lib/prisma.ts)

### React Compiler
- Enabled in [next.config.ts](../next.config.ts) - automatically optimizes components
- No manual memoization (`useMemo`, `useCallback`) needed in most cases

### DevSecOps & Deployment
- **Target**: Google Cloud (GKE Autopilot + Cloud SQL PostgreSQL)
- **Container**: Docker multi-stage build (standalone output mode enabled)
- **CI/CD**: Cloud Build or GitHub Actions
  - Pipeline: Lint → Build → Scan (Trivy) → Push → Deploy
- **Security**: Non-root container user, CSP headers in next.config.ts

## Important Files
- [next.config.ts](../next.config.ts) - Next.js configuration (React Compiler enabled, standalone output)
- [biome.json](../biome.json) - Code quality rules and formatting config
- [tsconfig.json](../tsconfig.json) - TypeScript settings and path aliases
- [src/app/layout.tsx](../src/app/layout.tsx) - Root layout with font loading and metadata
- [src/app/globals.css](../src/app/globals.css) - Global styles with Tailwind v4 theme
- [prisma/schema.prisma](../prisma/schema.prisma) - Database schema definition
- [src/lib/prisma.ts](../src/lib/prisma.ts) - Prisma client singleton
- [src/server/actions.ts](../src/server/actions.ts) - Server Actions with Zod validation

## Code Generation Preferences
- Use TypeScript for all new files
- Prefer server components unless client interactivity required
- Apply Tailwind classes directly (utility-first approach)
- Include dark mode variants for all color-based utilities
- Use semantic HTML with proper accessibility attributes
- Import `Image` from `next/image` for images, never `<img>` tags
- Validate forms with Zod schemas before processing
- Use Server Actions for mutations (forms, data updates)
- Blog posts: Use `generateStaticParams` for SSG with dynamic routes

## Accessibility Guidelines (ARIA)
Follow W3C ARIA Authoring Practices Guide (APG) for all interactive components:

### Navigation & Landmarks
- **Navigation**: Add `aria-label="Navigation principale"` to `<nav>` elements
- **Main Content**: Use `aria-labelledby` to reference page heading ID
- **Sections**: Use `aria-labelledby` for section headings or descriptive `aria-label`

### Interactive Elements
- **Buttons**: 
  - Toggle buttons: Use `aria-expanded="true|false"` for disclosure widgets
  - Mobile menu: Add `aria-controls="menu-id"` to reference controlled element
  - Icon-only buttons: Always include descriptive `aria-label`
- **Links**: Add `aria-label` for context when link text alone is unclear
- **Forms**:
  - Group related fields with `<fieldset>` and `<legend>`
  - Use `aria-invalid="true"` on fields with validation errors
  - Use `aria-describedby="error-id"` to associate error messages
  - Required fields: Use HTML5 `required` attribute

### Dynamic Content
- **Status Messages**: Use `role="status"` with `aria-live="polite"` for non-critical updates
- **Alerts**: Use `role="alert"` or `aria-live="assertive"` for critical messages
- **Loading States**: Add `aria-label="Loading..."` to spinner elements
- **Menu States**: Use `aria-hidden="true"` on collapsed/hidden elements

### Examples from Project
```tsx
// Navigation (Navbar.tsx)
<nav aria-label="Navigation principale">
  <button 
    aria-expanded={isOpen}
    aria-controls="mobile-menu"
    aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
  />
  <div id="mobile-menu" aria-hidden={!isOpen}>
</nav>

// Page Structure (page.tsx)
<main aria-labelledby="page-heading">
  <h1 id="page-heading">Title</h1>
</main>

// Sections (Hero.tsx, ServicesSection.tsx)
<section aria-label="Introduction Flux Electrique">
<section aria-labelledby="services-heading">
  <h2 id="services-heading">Services</h2>
</section>

// Forms (contact/page.tsx)
<form>
  <fieldset>
    <legend>Informations de contact</legend>
    <input 
      aria-invalid={!!errors.email}
      aria-describedby={errors.email ? "email-error" : undefined}
    />
    {errors.email && <span id="email-error">{errors.email}</span>}
  </fieldset>
</form>

// Status Messages
<div role="status" aria-live="polite">
  Formulaire envoyé avec succès
</div>
```

### Resources
- W3C ARIA APG: https://www.w3.org/WAI/ARIA/apg/
- MDN Accessibility: https://developer.mozilla.org/en-US/docs/Web/Accessibility
- WebAIM: https://webaim.org/
