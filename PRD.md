# Product Requirements Document - ContentFlow AI

## 1. Executive Summary
**Product Name**: ContentFlow AI  
**Tagline**: "Rank higher while you sleep. Content that writes itself."  
**Target**: Small business owners, solo founders, and agency managers.  
**Core Value**: A fully automated subscription service that generates, optimizes, and publishes SEO blog content with zero ongoing effort after onboarding.

## 2. User Personas
### Primary: "Overwhelmed Owner Oliver"
- **Profile**: Service business owner (legal, healthcare, consulting).
- **Pain Points**: No time for consistent blogging, can't afford expensive agencies, inconsistent quality from freelancers.
- **Goals**: Rank for local keywords, establish authority, generate leads on autopilot.

### Secondary: "Growth-Hungry Greta"
- **Profile**: SaaS/Ecommerce solo-founder.
- **Pain Points**: Needs high volume (12-30 posts/mo) for SEO moat, bottlenecked by personal time.
- **Goals**: Dominate long-tail keywords, build topical authority, reduce CAC.

### Tertiary: "Agency Andy"
- **Profile**: Marketing agency manager (5-10 people).
- **Pain Points**: Scaling content production is hard, quality writers are expensive/flaky.
- **Goals**: White-label solution, maintain margins, scale client count.

## 3. Core Features (Phase 1)
### 3.1 Smart Onboarding
- **Business Crawl**: Automatic extraction of brand voice, target audience, and industry from a website URL.
- **Voice Mapping**: NLP analysis to match the user's existing tone and style.
- **Success Gate**: 30-day initial content calendar generated immediately.

### 3.2 Command Center (Dashboard)
- **Pulse View**: Quick overview of SEO health and content status.
- **Calendar**: Drag-and-drop scheduling, rescheduling, and status tracking (Draft, Scheduled, Published).
- **Integrations**: Quick connection to WordPress (via REST API) and other platforms.

### 3.3 AI Research Agent
- **Daily Keywords**: Automated keyword research using competitor gap analysis.
- **Topic Clustering**: Grouping keywords into logical content series.
- **SEO Intel**: Real-time scoring and optimization suggestions.

### 3.4 Interactive Forge (Editor)
- **Split View**: Markdown/Rich Text editing with a live SEO panel.
- **Direct Publishing**: One-click sync to WordPress or Buffer.

## 4. Technical Constraints
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend**: Supabase (Auth, DB, Functions).
- **Workflows**: n8n for automation orchestration.
- **AI**: OpenAI GPT-4o for generation and analysis.

## 5. Success Metrics
- Average SEO score > 80/100 for generated content.
- < 10 mins user time per approved content asset.
- Positive traffic trend within 60 days of activation.
