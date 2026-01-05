# Copilot Instructions for flux-electrique

## Project Overview
Next.js 16 application using the App Router with React 19, TypeScript, and Tailwind CSS v4. Uses **Biome** for linting/formatting instead of ESLint/Prettier.

## Technology Stack
- **Framework**: Next.js 16.1 with App Router (`src/app/` directory structure)
- **React**: Version 19.2 with React Compiler enabled (`reactCompiler: true` in [next.config.ts](../next.config.ts))
- **Styling**: Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
- **Type System**: TypeScript 5 with strict mode enabled
- **Code Quality**: Biome 2.2 (NOT ESLint/Prettier)

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
- Uses Tailwind v4 inline theme syntax in [globals.css](../src/app/globals.css):
  ```css
  @theme inline {
    --color-background: var(--background);
  }
  ```
- CSS variables for theming: `--background`, `--foreground`, custom font variables
- Dark mode via `prefers-color-scheme` media query
- Geist font family loaded from `next/font/google` in [layout.tsx](../src/app/layout.tsx)

### Component Structure
- **Server Components by default** (React 19 + Next.js App Router)
- Use `"use client"` directive only when needed (not present in current codebase)
- Layout pattern: Root layout in [src/app/layout.tsx](../src/app/layout.tsx) defines metadata and font loading
- Example styling pattern from [page.tsx](../src/app/page.tsx):
  - Utility-first with dark mode variants: `dark:bg-black`, `dark:text-zinc-50`
  - Responsive prefixes: `sm:items-start`, `md:w-[158px]`

## Development Workflow

### Commands
- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm start` - Run production server
- `npm run lint` - Run Biome checks
- `npm run format` - Auto-format with Biome

### React Compiler
- Enabled in [next.config.ts](../next.config.ts) - automatically optimizes components
- No manual memoization (`useMemo`, `useCallback`) needed in most cases

## Important Files
- [next.config.ts](../next.config.ts) - Next.js configuration (React Compiler enabled)
- [biome.json](../biome.json) - Code quality rules and formatting config
- [tsconfig.json](../tsconfig.json) - TypeScript settings and path aliases
- [src/app/layout.tsx](../src/app/layout.tsx) - Root layout with font loading and metadata
- [src/app/globals.css](../src/app/globals.css) - Global styles with Tailwind v4 theme

## Code Generation Preferences
- Use TypeScript for all new files
- Prefer server components unless client interactivity required
- Apply Tailwind classes directly (utility-first approach)
- Include dark mode variants for all color-based utilities
- Use semantic HTML with proper accessibility attributes
- Import `Image` from `next/image` for images, never `<img>` tags
