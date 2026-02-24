# Tech Stack - ContentFlow AI

## Frontend & Core Logic
- **Framework**: Next.js 14 (App Router)
- **Deployment**: Vercel
- **Styling**: Tailwind CSS + Shadcn/UI (Radix)
- **Animations**: Framer Motion

## Backend & Data
- **Platform**: Supabase
- **Database**: PostgreSQL (Prisma or PostgREST)
- **Storage**: Supabase Buckets (Assets/Images)
- **Auth**: Supabase Auth (Magic Link, Google)

## Automation & AI
- **Workflow Engine**: n8n (Self-hosted or Cloud)
- **Primary LLM**: OpenAI GPT-4o (Generation), Kimi API (Fallback)
- **Search API**: DataForSEO / Google Search Console API
- **NLP**: LangChain.js for orchestration

## Integration Points
- **Publishing**: WordPress REST API (Application Passwords)
- **Social**: Buffer API (LinkedIn, X)
- **Email**: Resend (Transactional), SendGrid (Marketing)
- **Monitoring**: LogSnag (Events), Sentry (Errors)

## Draft Data Schema
- `profiles`: User settings, brand voice tokens, tier.
- `content_assets`: Status (Draft, Pending, Published), SEO Score, Markdown.
- `calendar_items`: Scheduling links between assets and dates.
- `integrations`: Encrypted API keys/tokens.
