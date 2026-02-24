# ContentFlow AI - Project Guide

## Build & Development
- **Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Check**: `tsc --noEmit`
- **Test**: `npm run test`

## Code Style & Standards
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn/UI
- **Icons**: Lucide React
- **Patterns**: Functional components, Radix UI primitives, clean separation of concerns (lib/components/app).
- **Naming**: PascalCase for components, kebab-case for files/directories unless standard (e.g., `layout.tsx`).

## Core Dependencies
- **Auth/Backend**: Supabase (Auth, DB, Storage)
- **Workflows**: n8n
- **State**: React Context / Server Actions
- **Forms**: React Hook Form + Zod

## Critical Commands
- `npm install`: Install dependencies.
- `supabase gen types typescript --local > types/supabase.ts`: Update DB types.
