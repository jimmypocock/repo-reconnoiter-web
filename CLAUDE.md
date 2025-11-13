# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Repo Reconnoiter** - A Next.js frontend for an AI-powered GitHub repository analysis and recommendation platform. The application displays repository comparisons, showing analyzed repos, technologies, problem domains, and AI-generated recommendations.

## Architecture

### API Proxy Pattern
The application uses Next.js API routes as a secure proxy to a Rails backend:

```
Browser → Next.js API Route → Rails Backend API
         (/api/*)              (REPO_RECONNOITER_API_URL)
```

**Why this pattern:**
- Keeps API keys server-side only (never exposed to browser)
- Centralizes security header application
- Controls CORS policies
- Adds User-Agent headers required by Cloudflare protection

### Security-First Configuration
The app runs in "fortress mode" with strict security headers configured in `next.config.ts`:
- **CSP**: No `unsafe-inline` or `unsafe-eval` - all scripts/styles from external files only
- **Tailwind v4**: Chosen specifically because it compiles to CSS files (no inline styles needed)
- **HSTS, X-Frame-Options, Referrer-Policy**: All configured for production security
- API routes strip permissive CORS headers from Rails backend

### Data Fetching Strategy
- **TanStack Query (React Query)** for all API calls
- Custom hooks pattern (e.g., `use-comparisons.ts`) wrap queries
- Type-safe with Zod validation at runtime
- `apiFetch<T>()` helper provides consistent error handling

## Development Commands

```bash
# Development server on port 3000 (default)
pnpm dev

# Production build
pnpm build

# Production server
pnpm start

# Linting
pnpm lint
```

## Environment Configuration

Create `.env.local` with:

```bash
# Client-side: Points to Next.js proxy (always /api)
NEXT_PUBLIC_API_URL=/api

# Server-side: Backend Rails API endpoint
REPO_RECONNOITER_API_URL=http://localhost:3001/api/v1  # development
# REPO_RECONNOITER_API_URL=https://api.reporeconnoiter.com/v1  # production

# Server-side: API authentication (NEVER prefix with NEXT_PUBLIC_)
API_KEY=your-api-key-here
```

**Critical:** Never prefix secrets with `NEXT_PUBLIC_` - they'll be exposed to the browser.

## Key Conventions

### Import Paths
Always use `@/` prefix (mapped to `./src/`):
```typescript
import { apiFetch } from "@/lib/api";
import { ComparisonCard } from "@/components/comparison-card";
```

### Component Patterns
- Server Components by default (Next.js 16 App Router)
- Add `"use client"` directive only when using hooks, state, or browser APIs
- Providers (TanStack Query) isolated in `components/providers.tsx`

### Styling
- **Tailwind v4** with PostCSS (no separate config file)
- Theme configuration via `@theme inline` in `globals.css`
- Use `cn()` utility for conditional classes (from `@/lib/utils`)
- Dark mode via `prefers-color-scheme` (use `dark:` prefix)

### TypeScript
- All API responses typed in `src/types/api.ts`
- Zod schemas validate responses at runtime
- Generic `apiFetch<T>()` provides type inference

## Critical Technical Details

1. **Port 3000**: Default Next.js port. Rails backend runs on port 3001 in development

2. **Tailwind v4**: No `tailwind.config.ts` file - configuration inline in CSS using `@theme`

3. **Security Headers**: All CSP and security policies in `next.config.ts` `headers()` function. When adding new external services (analytics, fonts, CDNs), update CSP directives.

4. **API Route Pattern**: When creating new API routes in `src/app/api/`:
   - Include User-Agent header (required for Cloudflare)
   - Add API key via `Authorization: Bearer` header
   - Don't expose CORS headers from backend
   - Handle errors with proper status codes

5. **No Prisma/Database**: Previously had Prisma setup but removed - this is a pure frontend proxy, not a database app

## Project Structure

```
src/
├── app/
│   ├── api/              # Server-side proxy routes to Rails backend
│   ├── layout.tsx        # Root layout with QueryClientProvider
│   ├── page.tsx          # Home page (comparisons list)
│   └── globals.css       # Tailwind v4 config + theme tokens
├── components/           # React components (server by default)
│   ├── providers.tsx     # Client component wrapper for TanStack Query
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks (TanStack Query wrappers)
├── lib/                 # Shared utilities
│   ├── api.ts          # apiFetch() helper
│   ├── query-client.ts # TanStack Query configuration
│   └── utils.ts        # cn() class merger utility
└── types/              # TypeScript type definitions
```

## Dependencies Notes

- **Next.js 16** with React 19 (latest versions)
- **TanStack Query v5** - not v4 (breaking changes in v5 API)
- **Tailwind CSS v4** - uses PostCSS, not separate config file
- **Zod v4** - for runtime validation
- **pnpm** - package manager (not npm/yarn)
