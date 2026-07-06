# **CContentFlow AI --- Product Requirements Document** {#ccontentflow-ai-product-requirements-document .unnumbered}

## **1. Executive Summary** {#executive-summary .unnumbered}

# Product Name: ContentFlow AI {#product-name-contentflow-ai .unnumbered}

# Tagline: \"Rank higher while you sleep. Content that writes itself.\" {#tagline-rank-higher-while-you-sleep.-content-that-writes-itself. .unnumbered}

# Version: 1.0 (Phase 1 Launch) {#version-1.0-phase-1-launch .unnumbered}

# Date: February 24, 2026 {#date-february-24-2026 .unnumbered}

# Status: Ready for Development {#status-ready-for-development .unnumbered}

### **What We\'re Building** {#what-were-building .unnumbered}

# **A fully automated subscription service that generates, optimizes, and publishes SEO blog content for small businesses. The system requires zero ongoing effort from clients after a 5-minute onboarding---delivering \"ranking assets\" that drive organic search traffic on autopilot.** {#a-fully-automated-subscription-service-that-generates-optimizes-and-publishes-seo-blog-content-for-small-businesses.-the-system-requires-zero-ongoing-effort-from-clients-after-a-5-minute-onboardingdelivering-ranking-assets-that-drive-organic-search-traffic-on-autopilot. .unnumbered}

### **Business Objectives** {#business-objectives .unnumbered}

# TableCopy {#tablecopy .unnumbered}

+-----------------------------------+------------------+--------------+
| #                                 | #                | #            |
|  **Metric** {#metric .unnumbered} | **Target** {#tar | **Timeline** |
|                                   | get .unnumbered} |  {#timeline  |
|                                   |                  | .unnumbered} |
+===================================+==================+==============+
| # **Mo                            | # **             | # **Month 6* |
| nthly Recurring Revenue** {#month | \$5,000** {#sect | * {#month-6  |
| ly-recurring-revenue .unnumbered} | ion .unnumbered} | .unnumbered} |
+-----------------------------------+------------------+--------------+
| # **Paying Customers*             | #                | #            |
| * {#paying-customers .unnumbered} |  **34** {#sectio | **Month 6**  |
|                                   | n-1 .unnumbered} | {#month-6-1  |
|                                   |                  | .unnumbered} |
+-----------------------------------+------------------+--------------+
| # **Gross Mar                     | #                | # **         |
| gin** {#gross-margin .unnumbered} | **85%** {#sectio | Sustained**  |
|                                   | n-2 .unnumbered} | {#sustained  |
|                                   |                  | .unnumbered} |
+-----------------------------------+------------------+--------------+
| # **Customer Chur                 | # **\<5%         | # **Su       |
| n** {#customer-churn .unnumbered} | monthly** {#mont | stained** {# |
|                                   | hly .unnumbered} | sustained-1  |
|                                   |                  | .unnumbered} |
+-----------------------------------+------------------+--------------+
| # **Co                            | #                | # **Su       |
| ntent Auto-Publish Rate** {#conte | **95%** {#sectio | stained** {# |
| nt-auto-publish-rate .unnumbered} | n-3 .unnumbered} | sustained-2  |
|                                   |                  | .unnumbered} |
+-----------------------------------+------------------+--------------+

### **Core Value Proposition** {#core-value-proposition .unnumbered}

# **For time-starved small business owners who know content marketing works but can\'t execute consistently, ContentFlow AI is the invisible content team that never misses a deadline, never calls in sick, and continuously improves based on ranking data.** {#for-time-starved-small-business-owners-who-know-content-marketing-works-but-cant-execute-consistently-contentflow-ai-is-the-invisible-content-team-that-never-misses-a-deadline-never-calls-in-sick-and-continuously-improves-based-on-ranking-data. .unnumbered}

#  {#section-4 .unnumbered}

## **2. User Personas** {#user-personas .unnumbered}

### **Primary: \"Overwhelmed Owner Oliver\"** {#primary-overwhelmed-owner-oliver .unnumbered}

# Demographics: 35-50, owns service business (legal, healthcare, consulting, local services)

# Pain Points:

# Tried blogging, published 3 posts then stopped

# Can\'t afford \$2-5K/month agency retainers

# Hires freelancers, quality is inconsistent, takes too much time to manage

# Goals: Rank for local/service keywords, establish authority, generate leads without daily effort

# Tech Comfort: Medium---uses WordPress, understands basics, delegates when possible

# Quote: ***\"I know I should blog, but I spend 4 hours on one post and it gets 12 views.\"***

### **Secondary: \"Growth-Hungry Greta\"** {#secondary-growth-hungry-greta .unnumbered}

# Demographics: 28-40, SaaS/ecommerce founder or marketing manager

# Pain Points:

# Content is priority #3 after product and sales

# Needs volume (12-30 posts/month) for SEO moat

# Current process is bottlenecked by her time

# Goals: Dominate long-tail keywords, build topical authority, reduce CAC from organic

# Tech Comfort: High---wants API access, webhooks, data exports

# Quote: ***\"If I could 10x our content without hiring, I\'d pay double.\"***

### **Tertiary: \"Agency Andy\"** {#tertiary-agency-andy .unnumbered}

# Demographics: Runs 5-10 person marketing agency

# Pain Points:

# Content production is biggest bottleneck

# Clients demand more volume, margins compressing

# Quality writers are expensive and flaky

# Goals: White-label solution, maintain margins, scale client count

# Tech Comfort: Very high---needs white-label, team management, client dashboards

# Quote: ***\"I need to productize our content service or we\'ll never scale.\"***

#  {#section-5 .unnumbered}

## **3. User Stories & Acceptance Criteria** {#user-stories-acceptance-criteria .unnumbered}

### **Epic: Authentication & Onboarding** {#epic-authentication-onboarding .unnumbered}

# Story 1.1: As a prospect, I want to sign up without creating a password so that I can start immediately. {#story-1.1-as-a-prospect-i-want-to-sign-up-without-creating-a-password-so-that-i-can-start-immediately. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria .unnumbered}

# \[ \] Magic link sent within 30 seconds of email entry

# \[ \] Link valid for 60 minutes, single-use

# \[ \] Google OAuth redirects to onboarding step 2 (skips email verification)

# \[ \] Session persists for 7 days, refreshed on activity

# \[ \] \"Remember me\" option extends to 30 days

# Story 1.2: As a new user, I want to complete onboarding in under 5 minutes so that I don\'t abandon the process. {#story-1.2-as-a-new-user-i-want-to-complete-onboarding-in-under-5-minutes-so-that-i-dont-abandon-the-process. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-1 .unnumbered}

# \[ \] Progress indicator shows 4 steps with % completion

# \[ \] Step 1: Business name, website URL (with validation), industry dropdown

# \[ \] Step 2: Target audience description, 3 competitor URLs (optional)

# \[ \] Step 3: Content tone selection (5 options with preview samples)

# \[ \] Step 4: WordPress connection (skippable, \"Connect Later\" prominent)

# \[ \] Each step validates before proceeding, shows specific error messages

# \[ \] \"Save & Exit\" available at all steps, resumes on return

# \[ \] Abandoned onboarding triggers recovery email at 1 hour and 24 hours

# Story 1.3: As a user, I want to start with a free trial so that I can verify quality before paying. {#story-1.3-as-a-user-i-want-to-start-with-a-free-trial-so-that-i-can-verify-quality-before-paying. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-2 .unnumbered}

# \[ \] 14-day trial begins immediately after onboarding

# \[ \] PayPal subscription created in **APPROVAL_PENDING state (verifies payment method)**

# **\[ \] No charge for 14 days, full feature access**

# **\[ \] Trial expiration warning at 7 days, 3 days, 1 day**

# **\[ \] Trial converts automatically to paid unless cancelled**

# **\[ \] Trial users can cancel anytime, retain access until period end**

#  {#section-6 .unnumbered}

### **Epic: Content Research & Planning** {#epic-content-research-planning .unnumbered}

# Story 2.1: As a user, I want the system to find keywords automatically so that I don\'t have to research. {#story-2.1-as-a-user-i-want-the-system-to-find-keywords-automatically-so-that-i-dont-have-to-research. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-3 .unnumbered}

# \[ \] Research runs daily at 6 AM UTC for all active users

# \[ \] Analyzes user\'s website + 3 competitors for gap opportunities

# \[ \] Generates 100 keyword opportunities monthly per user

# \[ \] Each keyword includes: volume, difficulty (0-100), CPC, search intent, top 3 ranking URLs

# \[ \] Filters for keywords with difficulty \<40 (achievable for small sites)

# \[ \] Prioritizes keywords matching user\'s industry and target audience

# \[ \] Results stored in **keyword_opportunities table, deduplicated by URL+keyword**

# **Story 2.2: As a user, I want a content calendar populated automatically so that I know what\'s coming.** {#story-2.2-as-a-user-i-want-a-content-calendar-populated-automatically-so-that-i-know-whats-coming. .unnumbered}

# **Acceptance Criteria:** {#acceptance-criteria-4 .unnumbered}

# **\[ \] Calendar auto-populates with top 30 opportunities (or tier limit)**

# **\[ \] Scheduling respects tier: Starter (4/mo), Growth (12/mo), Agency (30/mo)**

# **\[ \] Publish dates optimized for user\'s timezone (Tuesday-Thursday, 6 AM local)**

# **\[ \] User can drag to reschedule, delete, or pause items**

# **\[ \] Calendar shows 60 days forward, updates daily**

# **\[ \] \"Pause all publishing\" toggle available with one click**

#  {#section-7 .unnumbered}

### **Epic: Content Generation** {#epic-content-generation .unnumbered}

# Story 3.1: As a user, I want articles written in my brand voice so that they sound like me. {#story-3.1-as-a-user-i-want-articles-written-in-my-brand-voice-so-that-they-sound-like-me. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-5 .unnumbered}

# \[ \] Website crawl extracts top 10 existing posts within 2 minutes of onboarding

# \[ \] NLP analysis identifies: tone, sentence length, vocabulary level, common phrases

# \[ \] Brand voice profile stored in **profiles.brand_voice_extracted (JSON)**

# **\[ \] Generation prompt includes voice profile for consistency**

# **\[ \] Sample shown to user: \"This is how your content will sound\" with edit option**

# **\[ \] Voice match score \>80% required for auto-approval**

# **Story 3.2: As a user, I want articles optimized for search so that they actually rank.** {#story-3.2-as-a-user-i-want-articles-optimized-for-search-so-that-they-actually-rank. .unnumbered}

# **Acceptance Criteria:** {#acceptance-criteria-6 .unnumbered}

# **\[ \] Every article targets one primary keyword**

# **\[ \] SurferSEO Content Score \>80 before publishing**

# **\[ \] Structure includes: H1 with keyword, meta description (150-160 chars), URL slug**

# **\[ \] Internal linking: 3-5 suggestions to user\'s existing posts**

# **\[ \] Featured snippet optimization: definition paragraph, bullet lists, comparison tables**

# **\[ \] EEAT signals: author persona, first-hand experience examples, citation placeholders**

# **\[ \] Word count: 1,500-2,000 words (tier-adjustable)**

# **\[ \] Readability: 8th-10th grade Flesch-Kincaid**

# **Story 3.3: As a user, I want content generated quickly so that my calendar stays full.** {#story-3.3-as-a-user-i-want-content-generated-quickly-so-that-my-calendar-stays-full. .unnumbered}

# **Acceptance Criteria:** {#acceptance-criteria-7 .unnumbered}

# **\[ \] Generation queue processes within 10 minutes of trigger**

# **\[ \] Kimi API primary, OpenAI GPT-4 fallback on timeout/error**

# **\[ \] Retry logic: 3 attempts with exponential backoff (5s, 15s, 45s)**

# **\[ \] Failed generation after 3 attempts → human review queue + user notification**

# **\[ \] Always maintain 14-day buffer (content ready 2 weeks before publish date)**

# **\[ \] Generation status visible in command center: pending → generating → quality check → ready**

#  {#section-8 .unnumbered}

### **Epic: Quality Assurance** {#epic-quality-assurance .unnumbered}

# Story 4.1: As a user, I want plagiarism-free content so that I avoid penalties. {#story-4.1-as-a-user-i-want-plagiarism-free-content-so-that-i-avoid-penalties. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-8 .unnumbered}

# \[ \] Copyscape API check on every article

# \[ \] Similarity score \<5% (excluding quotes, common phrases)

# \[ \] Failed check triggers regeneration with \"original perspective\" prompt

# \[ \] 2 failed checks → human review + user notification with explanation

# Story 4.2: As a user, I want grammatically correct content so that I appear professional. {#story-4.2-as-a-user-i-want-grammatically-correct-content-so-that-i-appear-professional. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-9 .unnumbered}

# \[ \] Grammarly API or LanguageTool integration

# \[ \] Grammar score \>90 required

# \[ \] Spelling, punctuation, style consistency checked

# \[ \] Failed check auto-corrects via API suggestions, rechecks

# Story 4.3: As a user, I want to trust auto-published content so that I don\'t need to review every post. {#story-4.3-as-a-user-i-want-to-trust-auto-published-content-so-that-i-dont-need-to-review-every-post. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-10 .unnumbered}

# \[ \] Auto-approval requires: Copyscape \<5%, Grammar \>90, Brand voice \>80, SurferSEO \>80

# \[ \] YMYL topics (medical, financial, legal advice) flagged for manual review regardless of scores

# \[ \] User can enable \"approval required\" mode (off by default)

# \[ \] Pending review items show in command center with 24-hour review window

# \[ \] No user action after 24 hours → auto-approves (if scores pass) or pauses (if fails)

#  {#section-9 .unnumbered}

### **Epic: Publishing & Distribution** {#epic-publishing-distribution .unnumbered}

# Story 5.1: As a user, I want content published directly to my WordPress site so that it\'s hands-off. {#story-5.1-as-a-user-i-want-content-published-directly-to-my-wordpress-site-so-that-its-hands-off. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-11 .unnumbered}

# \[ \] WordPress connection via Application Passwords (REST API)

# \[ \] Connection test validates before first publish

# \[ \] Posts created as drafts first, scheduled publish at optimal time

# \[ \] Category auto-assigned based on content analysis (or \"Blog\" default)

# \[ \] Tags generated from content topics (3-5 tags)

# \[ \] Featured image selected from Unsplash/Pexels based on keyword

# \[ \] URL slug optimized: primary-keyword-here

# \[ \] Yoast/SEOPress meta fields populated if plugins detected

# \[ \] Failed publish retries 3x, then alerts user with error details + manual fix option

# Story 5.2: As a user, I want social media variations so that I can promote without extra work. {#story-5.2-as-a-user-i-want-social-media-variations-so-that-i-can-promote-without-extra-work. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-12 .unnumbered}

# \[ \] 3 variations generated per article: Twitter/X (280 chars), LinkedIn (500 chars), Facebook (no limit)

# \[ \] Variations include hook, key insight, call-to-action, hashtags

# \[ \] Buffer API integration for scheduling: +2 hours, +24 hours, +7 days after publish

# \[ \] User can edit variations before scheduling

# \[ \] Without Buffer: Email variations to user with copy buttons

# Story 5.3: As a user, I want to know when content goes live so that I can track performance. {#story-5.3-as-a-user-i-want-to-know-when-content-goes-live-so-that-i-can-track-performance. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-13 .unnumbered}

# \[ \] Email notification within 5 minutes of publish

# \[ \] Email includes: Title, URL, keyword, estimated 30-day traffic, social links

# \[ \] Command center \"Recent Deployments\" section updates immediately

# \[ \] Optional: Slack/Teams webhook notification (P2 feature)

#  {#section-10 .unnumbered}

### **Epic: Command Center Dashboard** {#epic-command-center-dashboard .unnumbered}

# Story 6.1: As a user, I want to see my content performance so that I know the ROI. {#story-6.1-as-a-user-i-want-to-see-my-content-performance-so-that-i-know-the-roi. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-14 .unnumbered}

# \[ \] Dashboard loads in \<2 seconds

# \[ \] Stats cards: Upcoming assets (count), Published this month (count), Avg. content score, Est. monthly traffic

# \[ \] Content calendar view: 30-day scrollable, color-coded by status

# \[ \] Published assets list: URL, keyword, publish date, performance metrics

# \[ \] Google Search Console integration (optional): Clicks, impressions, CTR, position

# \[ \] Data exports: CSV of all content + metrics

# Story 6.2: As a user, I want to manage my content queue so that I stay in control. {#story-6.2-as-a-user-i-want-to-manage-my-content-queue-so-that-i-stay-in-control. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-15 .unnumbered}

# \[ \] View all queued content: title, keyword, scheduled date, status

# \[ \] Actions per item: Preview, Edit (title/content), Reschedule, Pause, Delete

# \[ \] Bulk actions: Pause selected, Delete selected

# \[ \] \"Emergency stop\" button: Pause all publishing immediately

# \[ \] Edit mode: Rich text editor with SEO score实时 updates

# Story 6.3: As a user, I want to manage my account settings so that the service matches my needs. {#story-6.3-as-a-user-i-want-to-manage-my-account-settings-so-that-the-service-matches-my-needs. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-16 .unnumbered}

# \[ \] Brand voice adjustment: Re-crawl website, manual tone sliders

# \[ \] WordPress reconnect: Test connection, update credentials

# \[ \] Content preferences: Post length, frequency, approval mode, categories

# \[ \] Notification preferences: Email frequency, types of alerts

# \[ \] Data export: Download all content, metrics, account data (GDPR)

# \[ \] Account deletion: Self-service with 30-day purge confirmation

#  {#section-11 .unnumbered}

### **Epic: Billing & Subscription Management** {#epic-billing-subscription-management .unnumbered}

# Story 7.1: As a user, I want to upgrade or downgrade easily so that my plan matches my growth. {#story-7.1-as-a-user-i-want-to-upgrade-or-downgrade-easily-so-that-my-plan-matches-my-growth. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-17 .unnumbered}

# \[ \] Pricing page shows 3 tiers with feature comparison

# \[ \] Upgrade: Immediate access to new limits, prorated charge

# \[ \] Downgrade: New limits apply next billing cycle, no prorated refund

# \[ \] Annual billing toggle: 2 months free (17% discount), default on

# \[ \] Payment methods: PayPal primary, Stripe backup for cards

# \[ \] Invoice generation: PDF emailed within 1 hour of payment, stored in dashboard

# Story 7.2: As a user, I want transparent billing so that I trust the service. {#story-7.2-as-a-user-i-want-transparent-billing-so-that-i-trust-the-service. .unnumbered}

# Acceptance Criteria: {#acceptance-criteria-18 .unnumbered}

# \[ \] Billing history: All charges with dates, amounts, invoice links

# \[ \] Next billing date prominently displayed

# \[ \] Failed payment: 3 retry attempts (Day 1, 3, 5), email notifications each time

# \[ \] Grace period: 3 days access retained after failed payment

# \[ \] Cancellation: Self-service, confirmation modal with consequence explanation

# \[ \] Reactivation: Resume within 30 days retains data, after 30 days data archived

#  {#section-12 .unnumbered}

## **4. Technical Architecture** {#technical-architecture .unnumbered}

### **System Overview** {#system-overview .unnumbered}

# plainCopy {#plaincopy .unnumbered}

# **┌─────────────────────────────────────────────────────────────────────────────┐** {#section-13 .unnumbered}

# **│ CLIENT LAYER │** {#client-layer .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-14 .unnumbered}

# **│ │ Marketing │ │ Onboarding │ │ Command │ │ Settings │ │** {#marketing-onboarding-command-settings .unnumbered}

# **│ │ Site │ │ Flow │ │ Center │ │ & Billing │ │** {#site-flow-center-billing .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-15 .unnumbered}

# **│ Next.js 14 App Router + Tailwind CSS + shadcn/ui │** {#next.js-14-app-router-tailwind-css-shadcnui .unnumbered}

# **└─────────────────────────────────────────────────────────────────────────────┘** {#section-16 .unnumbered}

#  **│** {#section-17 .unnumbered}

#  **▼** {#section-18 .unnumbered}

# **┌─────────────────────────────────────────────────────────────────────────────┐** {#section-19 .unnumbered}

# **│ API LAYER │** {#api-layer .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-20 .unnumbered}

# **│ │ Auth │ │ Webhooks │ │ Internal │ │ Triggers │ │** {#auth-webhooks-internal-triggers .unnumbered}

# **│ │ (Supabase) │ │ (PayPal/WP) │ │ API │ │ (n8n) │ │** {#supabase-paypalwp-api-n8n .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-21 .unnumbered}

# **│ Next.js Route Handlers + Supabase Edge Functions │** {#next.js-route-handlers-supabase-edge-functions .unnumbered}

# **└─────────────────────────────────────────────────────────────────────────────┘** {#section-22 .unnumbered}

#  **│** {#section-23 .unnumbered}

#  **▼** {#section-24 .unnumbered}

# **┌─────────────────────────────────────────────────────────────────────────────┐** {#section-25 .unnumbered}

# **│ ORCHESTRATION LAYER │** {#orchestration-layer .unnumbered}

# **│ n8n Self-Hosted │** {#n8n-self-hosted .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-26 .unnumbered}

# **│ │ Onboarding │ │ Research │ │ Generation │ │ Publishing │ │** {#onboarding-research-generation-publishing .unnumbered}

# **│ │ Workflow │ │ Agent │ │ Pipeline │ │ Workflow │ │** {#workflow-agent-pipeline-workflow .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-27 .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-28 .unnumbered}

# **│ │ Quality │ │ Analytics │ │ Email │ │** {#quality-analytics-email .unnumbered}

# **│ │ Gate │ │ Loop │ │ Sequences │ │** {#gate-loop-sequences .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-29 .unnumbered}

# **└─────────────────────────────────────────────────────────────────────────────┘** {#section-30 .unnumbered}

#  **│** {#section-31 .unnumbered}

#  **▼** {#section-32 .unnumbered}

# **┌─────────────────────────────────────────────────────────────────────────────┐** {#section-33 .unnumbered}

# **│ DATA & AI LAYER │** {#data-ai-layer .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-34 .unnumbered}

# **│ │ Supabase │ │ Kimi │ │ SurferSEO │ │ DataForSEO │ │** {#supabase-kimi-surferseo-dataforseo .unnumbered}

# **│ │ PostgreSQL │ │ API │ │ API │ │ API │ │** {#postgresql-api-api-api .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-35 .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-36 .unnumbered}

# **│ │ OpenAI │ │ Copyscape │ │ Grammarly │ │ Unsplash │ │** {#openai-copyscape-grammarly-unsplash .unnumbered}

# **│ │ (Fallback) │ │ API │ │ API │ │ API │ │** {#fallback-api-api-api .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-37 .unnumbered}

# **└─────────────────────────────────────────────────────────────────────────────┘** {#section-38 .unnumbered}

#  **│** {#section-39 .unnumbered}

#  **▼** {#section-40 .unnumbered}

# **┌─────────────────────────────────────────────────────────────────────────────┐** {#section-41 .unnumbered}

# **│ PUBLISHING LAYER │** {#publishing-layer .unnumbered}

# **│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │** {#section-42 .unnumbered}

# **│ │ WordPress │ │ Buffer │ │ Resend │ │ LogSnag │ │** {#wordpress-buffer-resend-logsnag .unnumbered}

# **│ │ REST API │ │ API │ │ (Email) │ │ (Monitoring)│ │** {#rest-api-api-email-monitoring .unnumbered}

# **│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │** {#section-43 .unnumbered}

# **└─────────────────────────────────────────────────────────────────────────────┘** {#section-44 .unnumbered}

### **Data Model (Detailed)** {#data-model-detailed .unnumbered}

# sqlCopy {#sqlcopy .unnumbered}

# ***\-- Core entities with relationships*** {#core-entities-with-relationships .unnumbered}

#  {#section-45 .unnumbered}

# **profiles \|\|*\--o{ content_queue : generates*** {#profiles---o-content_queue-generates .unnumbered}

# **profiles \|\|*\--o{ published_content : owns*** {#profiles---o-published_content-owns .unnumbered}

# **profiles \|\|*\--\|\| subscriptions : has*** {#profiles----subscriptions-has .unnumbered}

# **profiles \|\|*\--o{ integrations : connects*** {#profiles---o-integrations-connects .unnumbered}

# **profiles \|\|*\--o{ activity_logs : generates*** {#profiles---o-activity_logs-generates .unnumbered}

#  {#section-46 .unnumbered}

# **content_queue \|\|*\--o\| published_content : becomes*** {#content_queue---o-published_content-becomes .unnumbered}

# Table Specifications: {#table-specifications .unnumbered}

# See TECH-STACK.md §Data Model for complete field specifications. Key constraints: {#see-tech-stack.md-data-model-for-complete-field-specifications.-key-constraints .unnumbered}

# All tables use UUID primary keys

# **updated_at auto-updated via trigger**

# **RLS policies enforce user data isolation**

# **Soft deletes via status fields (no hard deletes for audit)**

### **API Specifications** {#api-specifications .unnumbered}

# Internal API Endpoints: {#internal-api-endpoints .unnumbered}

# TableCopy {#tablecopy-1 .unnumbered}

+--------+----------------------+---------+---------------------------+
| # **   | # **Path**           | #       | # **Description** {       |
| Method |  {#path .unnumbered} | **Auth* | #description .unnumbered} |
| ** {#m |                      | * {#aut |                           |
| ethod  |                      | h .unnu |                           |
| .unnum |                      | mbered} |                           |
| bered} |                      |         |                           |
+========+======================+=========+===========================+
| # **PO | # **/api/auth/c      | # **Pu  | # **OAuth callba          |
| ST** { | allback** {#apiauthc | blic**  | ck handler** {#oauth-call |
| #post  | allback .unnumbered} | {#publi | back-handler .unnumbered} |
| .unnum |                      | c .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/api/webhooks/p  | # **S   | # **PayPal event p        |
| **POST | aypal** {#apiwebhook | ignatur | rocessing** {#paypal-even |
| ** {#p | spaypal .unnumbered} | e** {#s | t-processing .unnumbered} |
| ost-1  |                      | ignatur |                           |
| .unnum |                      | e .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/                | # **    | # **WordP                 |
| **POST | api/webhooks/wordpre | Token** | ress publish notification |
| ** {#p | ss** {#apiwebhookswo |  {#toke | s** {#wordpress-publish-n |
| ost-2  | rdpress .unnumbered} | n .unnu | otifications .unnumbered} |
| .unnum |                      | mbered} |                           |
| bered} |                      |         |                           |
+--------+----------------------+---------+---------------------------+
| # **   | # **/api/dashboard/  | #       | # **User metrics agg      |
| GET**  | stats** {#apidashboa |  **Sess | regation** {#user-metrics |
| {#get  | rdstats .unnumbered} | ion** { | -aggregation .unnumbered} |
| .unnum |                      | #sessio |                           |
| bered} |                      | n .unnu |                           |
|        |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| # **GE | # **/api/conten      | # *     | # **List user\'s conte    |
| T** {# | t/queue** {#apiconte | *Sessio | nt queue** {#list-users-c |
| get-1  | ntqueue .unnumbered} | n** {#s | ontent-queue .unnumbered} |
| .unnum |                      | ession- |                           |
| bered} |                      | 1 .unnu |                           |
|        |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/api/content/ap  | # *     | # **Approve pendin        |
| **POST | prove** {#apicontent | *Sessio | g content** {#approve-pen |
| ** {#p | approve .unnumbered} | n** {#s | ding-content .unnumbered} |
| ost-3  |                      | ession- |                           |
| .unnum |                      | 2 .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| # **   | # **/api/cont        | # *     | # **Update                |
| PUT**  | ent/\[id\]** {#apico | *Sessio |  content item** {#update- |
| {#put  | ntentid .unnumbered} | n** {#s | content-item .unnumbered} |
| .unnum |                      | ession- |                           |
| bered} |                      | 3 .unnu |                           |
|        |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| # **   | # **/api/conten      | # *     | # **Delete/ca             |
| DELETE | t/\[id\]** {#apicont | *Sessio | ncel content** {#deleteca |
| ** {#d | entid-1 .unnumbered} | n** {#s | ncel-content .unnumbered} |
| elete  |                      | ession- |                           |
| .unnum |                      | 4 .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/api/billing/up  | # *     | # **Change subscript      |
| **POST | grade** {#apibilling | *Sessio | ion tier** {#change-subsc |
| ** {#p | upgrade .unnumbered} | n** {#s | ription-tier .unnumbered} |
| ost-4  |                      | ession- |                           |
| .unnum |                      | 5 .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/api/billing/    | # *     | # **Cancel                |
| **POST | cancel** {#apibillin | *Sessio |  subscription** {#cancel- |
| ** {#p | gcancel .unnumbered} | n** {#s | subscription .unnumbered} |
| ost-5  |                      | ession- |                           |
| .unnum |                      | 6 .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # **/api/triggers    | #       | # **Initiate web          |
| **POST | /crawl** {#apitrigge |  **Serv | site crawl** {#initiate-w |
| ** {#p | rscrawl .unnumbered} | ice** { | ebsite-crawl .unnumbered} |
| ost-6  |                      | #servic |                           |
| .unnum |                      | e .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+
| #      | # *                  | # *     | # **Trigger content gene  |
| **POST | */api/triggers/gener | *Servic | ration** {#trigger-conten |
| ** {#p | ate** {#apitriggersg | e** {#s | t-generation .unnumbered} |
| ost-7  | enerate .unnumbered} | ervice- |                           |
| .unnum |                      | 1 .unnu |                           |
| bered} |                      | mbered} |                           |
+--------+----------------------+---------+---------------------------+

### **Third-Party Integrations** {#third-party-integrations .unnumbered}

# TableCopy {#tablecopy-2 .unnumbered}

+------------------+-------------------+--------------------+----------+
| # **Se           | #                 | #                  | #        |
| rvice** {#servic | **Purpose** {#pur | **Fallback** {#fal | **Risk L |
| e-2 .unnumbered} | pose .unnumbered} | lback .unnumbered} | evel** { |
|                  |                   |                    | #risk-le |
|                  |                   |                    | vel .unn |
|                  |                   |                    | umbered} |
+==================+===================+====================+==========+
| # **Ki           | # **Con           | # **OpenAI         | # **Hi   |
| mi API** {#kimi- | tent generation** |  GPT-4** {#openai- | gh** {#h |
| api .unnumbered} |  {#content-genera | gpt-4 .unnumbered} | igh .unn |
|                  | tion .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **SurferSEO AP | # **Content       | # **Manual checkli | #        |
| I** {#surferseo- |  optimization** { | st** {#manual-chec | **Medium |
| api .unnumbered} | #content-optimiza | klist .unnumbered} | ** {#med |
|                  | tion .unnumbered} |                    | ium .unn |
|                  |                   |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| #                | # *               | # **Ca             | # **     |
| **DataForSEO API | *Keyword research | ched data + manual | Low** {# |
| ** {#dataforseo- | ** {#keyword-rese | ** {#cached-data-m | low .unn |
| api .unnumbered} | arch .unnumbered} | anual .unnumbered} | umbered} |
+------------------+-------------------+--------------------+----------+
| # **Copyscape AP | # **Plagiar       | # **Quet           | # **     |
| I** {#copyscape- | ism detection** { | ext API** {#quetex | Medium** |
| api .unnumbered} | #plagiarism-detec | t-api .unnumbered} |  {#mediu |
|                  | tion .unnumbered} |                    | m-1 .unn |
|                  |                   |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **Grammarly AP | # *               | # **Langua         | # **Lo   |
| I** {#grammarly- | *Grammar checking | geTool** {#languag | w** {#lo |
| api .unnumbered} | ** {#grammar-chec | etool .unnumbered} | w-1 .unn |
|                  | king .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **PayPal       | # **Subscri       | # **Stripe** {#s   | # **Lo   |
|  API** {#paypal- | ption billing** { | tripe .unnumbered} | w** {#lo |
| api .unnumbered} | #subscription-bil |                    | w-2 .unn |
|                  | ling .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **WordPr       | # **Con           | # **Email deli     | # **     |
| ess REST API** { | tent publishing** | very** {#email-del | Medium** |
| #wordpress-rest- |  {#content-publis | ivery .unnumbered} |  {#mediu |
| api .unnumbered} | hing .unnumbered} |                    | m-2 .unn |
|                  |                   |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **Buffer       | # **S             | # **Manual         | # **Lo   |
|  API** {#buffer- | ocial scheduling* |  email** {#manual- | w** {#lo |
| api .unnumbered} | * {#social-schedu | email .unnumbered} | w-3 .unn |
|                  | ling .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **Resend       | # **Trans         | #                  | # **Lo   |
|  API** {#resend- | actional email**  | **SendGrid** {#sen | w** {#lo |
| api .unnumbered} | {#transactional-e | dgrid .unnumbered} | w-4 .unn |
|                  | mail .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+
| # **LogSnag      | # *               | # **Consol         | # **Lo   |
| API** {#logsnag- | *Event monitoring | e logs** {#console | w** {#lo |
| api .unnumbered} | ** {#event-monito | -logs .unnumbered} | w-5 .unn |
|                  | ring .unnumbered} |                    | umbered} |
+------------------+-------------------+--------------------+----------+

#  {#section-47 .unnumbered}

## **5. User Interface Design** {#user-interface-design .unnumbered}

### **Design System** {#design-system .unnumbered}

# Colors: {#colors .unnumbered}

# Midnight (#0F172A): Primary backgrounds, authority

# Electric (#3B82F6): Actions, links, energy

# Success (#10B981): Positive states, published

# Warning (#F59E0B): Attention, pending

# Danger (#EF4444): Errors, cancellations

# Cloud (#F8FAFC): Card backgrounds

# Slate (#64748B): Secondary text

# Typography: {#typography .unnumbered}

# Display/Body: Inter (400-900)

# Data/Mono: JetBrains Mono (400)

# Spacing Scale: 4px base (4, 8, 16, 24, 32, 48, 64) {#spacing-scale-4px-base-4-8-16-24-32-48-64 .unnumbered}

### **Key Screens** {#key-screens .unnumbered}

# 1. Marketing Homepage {#marketing-homepage .unnumbered}

# Hero: \"Rank higher while you sleep\" + email capture

# Social proof: Logos, testimonials, \"500+ businesses\"

# How it works: 3-step visual (Activate → Automate → Dominate)

# Pricing: 3 tiers with annual toggle

# FAQ: 6 common objections handled

# 2. Onboarding Flow (4 Steps) {#onboarding-flow-4-steps .unnumbered}

# Progress bar at top

# Step 1: Business basics (URL validation with crawl preview)

# Step 2: Competitive intel (optional competitor URLs)

# Step 3: Voice selection (5 cards with sample text)

# Step 4: WordPress connect (skippable, \"I\'ll do this later\")

# 3. Command Center Dashboard {#command-center-dashboard .unnumbered}

# Header: Business name, tier badge, settings cog

# Stats row: 4 cards with trend indicators

# Calendar: 30-day view, drag-drop rescheduling

# Queue: List view with status badges, action menus

# Recent: Last 5 published with performance sparklines

# 4. Content Preview/Edit {#content-previewedit .unnumbered}

# Split view: Editor left, SEO score right

# Score breakdown: Readability, keyword density, links, length

# Tabs: Content, Meta, Social variations, History

# Actions: Approve, Request changes, Delete, Reschedule

# 5. Settings {#settings .unnumbered}

# Tabs: Account, Brand Voice, Integrations, Billing, Notifications

# Brand Voice: Sliders for tone dimensions + re-crawl button

# Integrations: WordPress (test/reconnect), Buffer (connect), GSC (authorize)

# Billing: Current plan, usage meter, upgrade/downgrade, invoices

#  {#section-48 .unnumbered}

## **6. Automation Workflows (n8n)** {#automation-workflows-n8n .unnumbered}

### **Workflow 1: Onboarding Orchestration** {#workflow-1-onboarding-orchestration .unnumbered}

# Trigger: **profiles.status = \'pending_onboarding\'** {#trigger-profiles.status-pending_onboarding .unnumbered}

# **Steps:** {#steps .unnumbered}

# **Wait for onboarding completion (webhook)**

# **Trigger website crawl (Python function)**

# **Extract brand voice (NLP analysis)**

# **Create initial content calendar (30 days)**

# **Send welcome email with preview of first ranking asset**

# **Update status to active_trial**

### **Workflow 2: Daily Research Agent** {#workflow-2-daily-research-agent .unnumbered}

# Trigger: Cron 6:00 AM UTC {#trigger-cron-600-am-utc .unnumbered}

# Steps: {#steps-1 .unnumbered}

# Fetch all **status = \'active\' profiles**

# **For each profile:**

# **DataForSEO: Keywords for industry + location**

# **Competitor gap analysis (top 3 competitors)**

# **Filter: Volume \>100, Difficulty \<40, Intent = informational/commercial**

# **Score opportunities by relevance**

# **Insert top 10 into keyword_opportunities**

# **Trigger calendar population if gaps exist**

### **Workflow 3: Content Generation Pipeline** {#workflow-3-content-generation-pipeline .unnumbered}

# Trigger: **content_queue.status = \'pending_generation** {#trigger-content_queue.status-pending_generation .unnumbered}

# **Steps:** {#steps-2 .unnumbered}

# **Fetch keyword + brand voice profile**

# **SurferSEO: Get NLP terms and content brief**

# **Kimi API: Generate article (retry 3x)**

# **Parse JSON response (title, content, meta, social)**

# **Insert into content_json field**

# **Update status to pending_quality_check**

# **Trigger Quality Gate workflow**

### **Workflow 4: Quality Gate** {#workflow-4-quality-gate .unnumbered}

# Trigger: **content_queue.status = \'pending_quality_check** {#trigger-content_queue.status-pending_quality_check .unnumbered}

# **Steps:** {#steps-3 .unnumbered}

# **Copyscape API: Plagiarism check**

# **Grammarly API: Grammar score**

# **Embedding similarity: Brand voice match**

# **SurferSEO API: Content score**

# **If all pass (\>thresholds): status = approved**

# **If any fail: Regenerate with feedback (max 2x)**

# **If still failing: status = pending_review + notify user**

### **Workflow 5: Scheduled Publishing** {#workflow-5-scheduled-publishing .unnumbered}

# Trigger: Cron every hour {#trigger-cron-every-hour .unnumbered}

# Steps: {#steps-4 .unnumbered}

# Query **status = \'pending_publish\' AND scheduled_at \<= now()**

# **For each item:**

# **Fetch WordPress credentials (decrypt)**

# **Upload featured image to WP Media**

# **Create post via REST API (scheduled status)**

# **Update content_queue with wordpress_post_id**

# **Buffer API: Schedule social variations**

# **Send \"Deployed\" email to user**

# **Create published_content record**

### **Workflow 6: Analytics Loop (Weekly)** {#workflow-6-analytics-loop-weekly .unnumbered}

# Trigger: Cron Monday 9 AM UTC {#trigger-cron-monday-9-am-utc .unnumbered}

# Steps: {#steps-5 .unnumbered}

# Fetch all published content from last 30 days

# Google Search Console API: Pull metrics (if connected)

# Kimi API: Analyze \"Why this ranked/didn\'t rank\"

# Generate \"Search Dominance Report\" PDF

# Email report to user with recommendations

# Update **published_content.metrics_json**

#  {#section-49 .unnumbered}

## **7. Non-Functional Requirements** {#non-functional-requirements .unnumbered}

### **Performance** {#performance .unnumbered}

# **Dashboard TTFB: \<500ms (Vercel Edge)**

# **API response time: P95 \<200ms**

# **Content generation: \<10 minutes end-to-end**

# **Webhook processing: \<2 seconds (acknowledge immediately)**

# **Image optimization: Next.js Image component with WebP**

### **Security** {#security .unnumbered}

# **Encryption: AES-256-GCM for credentials at rest**

# **Auth: Supabase Auth with PKCE, HTTP-only cookies**

# **RLS: Row-level security on all user data tables**

# **Rate limiting: 100 req/min per IP, 1000 per user**

# **Secrets: Vault storage, rotation every 90 days**

# **Dependencies: Automated vulnerability scanning (Snyk)**

### **Reliability** {#reliability .unnumbered}

# **Uptime target: 99.9% (Vercel + Supabase SLA)**

# **Database: Daily backups, 30-day retention**

# **n8n: Queue persistence, automatic restart on failure**

# **Failed payments: 3 retry attempts with exponential backoff**

# **Content generation: 48-hour buffer maintained**

### **Compliance** {#compliance .unnumbered}

# **GDPR: Right to export (JSON), right to deletion (30-day purge)**

# **CCPA: \"Do not sell\" disclosure, opt-out mechanism**

# **PCI-DSS: PayPal/Stripe hosted fields (no card data touches servers)**

# **Accessibility: WCAG 2.1 AA compliance (keyboard nav, screen readers)**

#  {#section-50 .unnumbered}

## **8. Go-to-Market Strategy** {#go-to-market-strategy .unnumbered}

### **Pricing Tiers** {#pricing-tiers .unnumbered}

# TableCopy {#tablecopy-3 .unnumbered}

+-------------------+---------------+----------------+----------------+
| #                 | # **Starter   | # **Gro        | # **Age        |
| **Feature** {#fea | \$149/mo** {# | wth \$349/mo** | ncy \$749/mo** |
| ture .unnumbered} | starter-149mo |  {#growth-349m |  {#agency-749m |
|                   |  .unnumbered} | o .unnumbered} | o .unnumbered} |
+===================+===============+================+================+
| # **Rankin        | # **4**       | # **12         | # **30         |
| g Assets/Month**  |  {#section-51 | ** {#section-5 | ** {#section-5 |
| {#ranking-assetsm |  .unnumbered} | 2 .unnumbered} | 3 .unnumbered} |
| onth .unnumbered} |               |                |                |
+-------------------+---------------+----------------+----------------+
| # **Word          | # **1,500**   | # **2,000      | # **2,500      |
|  Count** {#word-c |  {#section-54 | ** {#section-5 | ** {#section-5 |
| ount .unnumbered} |  .unnumbered} | 5 .unnumbered} | 6 .unnumbered} |
+-------------------+---------------+----------------+----------------+
| # **Auto-Pub      | # **✅**      | # **✅         | # **✅         |
| lish** {#auto-pub |  {#section-57 | ** {#section-5 | ** {#section-5 |
| lish .unnumbered} |  .unnumbered} | 8 .unnumbered} | 9 .unnumbered} |
+-------------------+---------------+----------------+----------------+
| # **S             | # **3/as      | # **5/as       | # **10/as      |
| ocial Variations* | set** {#asset | set** {#asset- | set** {#asset- |
| * {#social-variat |  .unnumbered} | 1 .unnumbered} | 2 .unnumbered} |
| ions .unnumbered} |               |                |                |
+-------------------+---------------+----------------+----------------+
| #                 | # **❌**      | # **✅         | # **✅         |
|  **GSC Integratio |  {#section-60 | ** {#section-6 | ** {#section-6 |
| n** {#gsc-integra |  .unnumbered} | 1 .unnumbered} | 2 .unnumbered} |
| tion .unnumbered} |               |                |                |
+-------------------+---------------+----------------+----------------+
| # **White-        | # **❌**      | # **❌         | # **✅         |
| Label** {#white-l |  {#section-63 | ** {#section-6 | ** {#section-6 |
| abel .unnumbered} |  .unnumbered} | 4 .unnumbered} | 5 .unnumbered} |
+-------------------+---------------+----------------+----------------+
| # **API           | # **❌**      | # **❌         | # **✅         |
| Access** {#api-ac |  {#section-66 | ** {#section-6 | ** {#section-6 |
| cess .unnumbered} |  .unnumbered} | 7 .unnumbered} | 8 .unnumbered} |
+-------------------+---------------+----------------+----------------+
| #                 | # **Em        | # **Priori     | # **Dedicate   |
| **Support** {#sup | ail** {#email | ty** {#priorit | d** {#dedicate |
| port .unnumbered} |  .unnumbered} | y .unnumbered} | d .unnumbered} |
+-------------------+---------------+----------------+----------------+

# **Annual billing: 2 months free (17% discount)** {#annual-billing-2-months-free-17-discount .unnumbered}

### **Launch Timeline** {#launch-timeline .unnumbered}

# TableCopy {#tablecopy-4 .unnumbered}

+----------+---------+--------------------------------+---------------+
| # **Phas | # *     | #                              | # **Success   |
| e** {#ph | *Durati | **Focus** {#focus .unnumbered} |  Metric** {#s |
| ase .unn | on** {# |                                | uccess-metric |
| umbered} | duratio |                                |  .unnumbered} |
|          | n .unnu |                                |               |
|          | mbered} |                                |               |
+==========+=========+================================+===============+
| # **Alph | # **W   | # *                            | # **0 criti   |
| a** {#al | eeks 1- | *3 free beta users, iron out w | cal bugs** {# |
| pha .unn | 2** {#w | orkflows** {#free-beta-users-i | critical-bugs |
| umbered} | eeks-1- | ron-out-workflows .unnumbered} |  .unnumbered} |
|          | 2 .unnu |                                |               |
|          | mbered} |                                |               |
+----------+---------+--------------------------------+---------------+
| # **Be   | # **W   | # **10 users at 50%            | # **3 cas     |
| ta** {#b | eeks 3- |  discount, collect testimonial | e studies** { |
| eta .unn | 4** {#w | s** {#users-at-50-discount-col | #case-studies |
| umbered} | eeks-3- | lect-testimonials .unnumbered} |  .unnumbered} |
|          | 4 .unnu |                                |               |
|          | mbered} |                                |               |
+----------+---------+--------------------------------+---------------+
| # **Publ | # **We  | # **Product                    | # **1         |
| ic Launc | ek 5**  | Hunt, IndieHackers, cold outre | 00 signups, 1 |
| h** {#pu | {#week- | ach** {#product-hunt-indiehack | 0 paid** {#si |
| blic-lau | 5 .unnu | ers-cold-outreach .unnumbered} | gnups-10-paid |
| nch .unn | mbered} |                                |  .unnumbered} |
| umbered} |         |                                |               |
+----------+---------+--------------------------------+---------------+
| #        | # **Mon | # **Content ma                 | # **\$5K      |
| **Growth | ths 2-6 | rketing, partnerships, referra | MRR** {#k-mrr |
| ** {#gro | ** {#mo | ls** {#content-marketing-partn |  .unnumbered} |
| wth .unn | nths-2- | erships-referrals .unnumbered} |               |
| umbered} | 6 .unnu |                                |               |
|          | mbered} |                                |               |
+----------+---------+--------------------------------+---------------+

### **Acquisition Channels** {#acquisition-channels .unnumbered}

# Product Hunt Launch: #1 Product of the Day goal

# IndieHackers: Build in public, weekly metrics

# Cold Outreach: Target businesses with 90+ day old blogs

# Content Marketing: Eat our own dog food (rank for \"automated SEO content\")

# Referral Program: \$50 credit for referrer and referee (P2)

#  {#section-69 .unnumbered}

## **9. Risk Assessment** {#risk-assessment .unnumbered}

# TableCopy {#tablecopy-5 .unnumbered}

+------------------+---------+------+---------------------------------+
| # **Risk** {#r   | #       | #    | # **Mitigat                     |
| isk .unnumbered} | **Proba | **Im | ion** {#mitigation .unnumbered} |
|                  | bility* | pact |                                 |
|                  | * {#pro | ** { |                                 |
|                  | babilit | #imp |                                 |
|                  | y .unnu | act  |                                 |
|                  | mbered} | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+==================+=========+======+=================================+
| # **Kimi         | #       | # ** | # **Op                          |
|  API downtime**  |  **Medi | High | enAI fallback, 48-hour content  |
| {#kimi-api-downt | um** {# | ** { | buffer** {#openai-fallback-48-h |
| ime .unnumbered} | medium- | #hig | our-content-buffer .unnumbered} |
|                  | 3 .unnu | h-1  |                                 |
|                  | mbered} | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+
| # **PayPal accou | #       | #    | # **                            |
| nt freeze** {#pa | **Low** | **Cr | Stripe backup, maintain 3-month |
| ypal-account-fre |  {#low- | itic |  runway** {#stripe-backup-maint |
| eze .unnumbered} | 6 .unnu | al** | ain-3-month-runway .unnumbered} |
|                  | mbered} |  {#c |                                 |
|                  |         | riti |                                 |
|                  |         | cal  |                                 |
|                  |         | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+
| # **             | #       | # ** | #                               |
| Google algorithm |  **Medi | Medi | **EEAT focus, diversify traffic |
|  update** {#goog | um** {# | um** |  sources** {#eeat-focus-diversi |
| le-algorithm-upd | medium- |  {#m | fy-traffic-sources .unnumbered} |
| ate .unnumbered} | 4 .unnu | ediu |                                 |
|                  | mbered} | m-5  |                                 |
|                  |         | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+
| # **Qualit       | #       | # ** | # **95% au                      |
| y complaints** { |  **Medi | High | to-approval target, human revie |
| #quality-complai | um** {# | ** { | w gate** {#auto-approval-target |
| nts .unnumbered} | medium- | #hig | -human-review-gate .unnumbered} |
|                  | 6 .unnu | h-2  |                                 |
|                  | mbered} | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+
| # **WordPress AP | #       | # ** | # **Abstraction layer, em       |
| I changes** {#wo | **Low** | Medi | ail fallback** {#abstraction-la |
| rdpress-api-chan |  {#low- | um** | yer-email-fallback .unnumbered} |
| ges .unnumbered} | 7 .unnu |  {#m |                                 |
|                  | mbered} | ediu |                                 |
|                  |         | m-7  |                                 |
|                  |         | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+
| # **Competitor   | #       | #    | #                               |
|  price war** {#c |  **Medi | **Lo |  **Differentiation via automati |
| ompetitor-price- | um** {# | w**  | on depth** {#differentiation-vi |
| war .unnumbered} | medium- | {#lo | a-automation-depth .unnumbered} |
|                  | 8 .unnu | w-8  |                                 |
|                  | mbered} | .unn |                                 |
|                  |         | umbe |                                 |
|                  |         | red} |                                 |
+------------------+---------+------+---------------------------------+

#  {#section-70 .unnumbered}

## **10. Success Metrics (North Star)** {#success-metrics-north-star .unnumbered}

### **Primary: Content Velocity** {#primary-content-velocity .unnumbered}

# Definition: Number of ranking assets published per user per month {#definition-number-of-ranking-assets-published-per-user-per-month .unnumbered}

# Target: 100% of tier limit (4/12/30) {#target-100-of-tier-limit-41230 .unnumbered}

# Why: Measures core value delivery {#why-measures-core-value-delivery .unnumbered}

### **Secondary Metrics** {#secondary-metrics .unnumbered}

# TableCopy {#tablecopy-6 .unnumbered}

+-------------------------+---------+----------------------------------+
| # **Metric**            | #       | # **Measurem                     |
| {#metric-1 .unnumbered} |  **Targ | ent** {#measurement .unnumbered} |
|                         | et** {# |                                  |
|                         | target- |                                  |
|                         | 1 .unnu |                                  |
|                         | mbered} |                                  |
+=========================+=========+==================================+
| # **Ac                  | #       | # **Complete o                   |
| tivation Rate** {#activ | **\>60% | nboarding / Signups** {#complete |
| ation-rate .unnumbered} | ** {#se | -onboarding-signups .unnumbered} |
|                         | ction-7 |                                  |
|                         | 1 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| #                       | #       | # **                             |
| **Trial-to-Paid** {#tri | **\>30% | Paid / Trial completions** {#pai |
| al-to-paid .unnumbered} | ** {#se | d-trial-completions .unnumbered} |
|                         | ction-7 |                                  |
|                         | 2 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| # **Auto-P              | #       | # **Auto-approved                |
| ublish Rate** {#auto-pu | **\>95% | / Total published** {#auto-appro |
| blish-rate .unnumbered} | ** {#se | ved-total-published .unnumbered} |
|                         | ction-7 |                                  |
|                         | 3 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| # **Time to Fi          | # **    | # **First rankin                 |
| rst Value** {#time-to-f | \<24hrs | g asset published** {#first-rank |
| irst-value .unnumbered} | ** {#hr | ing-asset-published .unnumbered} |
|                         | s .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| # **NPS Score** {       | #       | # **Monthly survey               |
| #nps-score .unnumbered} |  **\>50 | ** {#monthly-survey .unnumbered} |
|                         | ** {#se |                                  |
|                         | ction-7 |                                  |
|                         | 4 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| # **Gross Churn** {#g   | #       | # **Canceled / Tot               |
| ross-churn .unnumbered} |  **\<5% | al at month start** {#canceled-t |
|                         | ** {#se | otal-at-month-start .unnumbered} |
|                         | ction-7 |                                  |
|                         | 5 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+
| # **Net Revenue Re      | # *     | # **Including                    |
| tention** {#net-revenue | *\>100% |  upgrades/expansion** {#includin |
| -retention .unnumbered} | ** {#se | g-upgradesexpansion .unnumbered} |
|                         | ction-7 |                                  |
|                         | 6 .unnu |                                  |
|                         | mbered} |                                  |
+-------------------------+---------+----------------------------------+

#  {#section-77 .unnumbered}

## **11. Open Questions & Decisions** {#open-questions-decisions .unnumbered}

# TableCopy {#tablecopy-7 .unnumbered}

+-------------------------------+-----+-----------------------+-------+
| # **Quest                     | #   | #                     | # *   |
| ion** {#question .unnumbered} |  ** |  **Default if Unresol | *Bloc |
|                               | Sta | ved** {#default-if-un | king* |
|                               | tus | resolved .unnumbered} | * {#b |
|                               | **  |                       | locki |
|                               | {#s |                       | ng .u |
|                               | tat |                       | nnumb |
|                               | us  |                       | ered} |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+===============================+=====+=======================+=======+
| # **SurferSEO v               | # * | #                     | #     |
| s Clearscope for optimization | *Op |  **SurferSEO (better  |  **No |
| ** {#surferseo-vs-clearscope- | en* | API)** {#surferseo-be | ** {# |
| for-optimization .unnumbered} | * { | tter-api .unnumbered} | no .u |
|                               | #op |                       | nnumb |
|                               | en  |                       | ered} |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+
| # **Image gener               | #   | #                     | # *   |
| ation (DALL-E) vs stock photo | **O |  **Stock photos only  | *No** |
| s** {#image-generation-dall-e | pen | (P2)** {#stock-photos |  {#no |
| -vs-stock-photos .unnumbered} | **  | -only-p2 .unnumbered} | -1 .u |
|                               | {#o |                       | nnumb |
|                               | pen |                       | ered} |
|                               | -1  |                       |       |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+
| # **White-g                   | #   | # **Self-service +    | # *   |
| love onboarding for Agency ti | **O | concierge option** {# | *No** |
| er** {#white-glove-onboarding | pen | self-service-concierg |  {#no |
| -for-agency-tier .unnumbered} | **  | e-option .unnumbered} | -2 .u |
|                               | {#o |                       | nnumb |
|                               | pen |                       | ered} |
|                               | -2  |                       |       |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+
| # **Multi-la                  | #   | # **English           | # *   |
| nguage support (Spanish, Fren | **O | only (P3)** {#english | *No** |
| ch)** {#multi-language-suppor | pen | -only-p3 .unnumbered} |  {#no |
| t-spanish-french .unnumbered} | **  |                       | -3 .u |
|                               | {#o |                       | nnumb |
|                               | pen |                       | ered} |
|                               | -3  |                       |       |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+
| # **Af                        | #   | # **\$50 dual c       | # *   |
| filiate/referral program stru | **O | redit (P2)** {#dual-c | *No** |
| cture** {#affiliatereferral-p | pen | redit-p2 .unnumbered} |  {#no |
| rogram-structure .unnumbered} | **  |                       | -4 .u |
|                               | {#o |                       | nnumb |
|                               | pen |                       | ered} |
|                               | -4  |                       |       |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+
| # **Mobil                     | #   | # **Not               | # *   |
| e app (iOS/Android)** {#mobil | **O | in roadmap** {#not-in | *No** |
| e-app-iosandroid .unnumbered} | pen | -roadmap .unnumbered} |  {#no |
|                               | **  |                       | -5 .u |
|                               | {#o |                       | nnumb |
|                               | pen |                       | ered} |
|                               | -5  |                       |       |
|                               | .un |                       |       |
|                               | num |                       |       |
|                               | ber |                       |       |
|                               | ed} |                       |       |
+-------------------------------+-----+-----------------------+-------+

#  {#section-78 .unnumbered}

## **12. Appendices** {#appendices .unnumbered}

### **A. Brand Vocabulary Enforcement** {#a.-brand-vocabulary-enforcement .unnumbered}

# **See DESIGN-NOTES.md §3 for complete \"Never say → Always say\" table.** {#see-design-notes.md-3-for-complete-never-say-always-say-table. .unnumbered}

### **B. Technical Stack Details** {#b.-technical-stack-details .unnumbered}

# **See TECH-STACK.md for layer-by-layer decisions, cost estimates, API specifications.** {#see-tech-stack.md-for-layer-by-layer-decisions-cost-estimates-api-specifications. .unnumbered}

### **C. UI Component Specifications** {#c.-ui-component-specifications .unnumbered}

# **See DESIGN-NOTES.md §6 for button hierarchies, modal specs, form patterns.** {#see-design-notes.md-6-for-button-hierarchies-modal-specs-form-patterns. .unnumbered}

### **D. Database Migration Scripts** {#d.-database-migration-scripts .unnumbered}

# **See migrations/001_initial_schema.sql in repository.** {#see-migrations001_initial_schema.sql-in-repository. .unnumbered}

### **E. n8n Workflow JSON** {#e.-n8n-workflow-json .unnumbered}

# **Exported workflows stored in /automation/n8n/workflows/ (version controlled).** {#exported-workflows-stored-in-automationn8nworkflows-version-controlled. .unnumbered}

#  {#section-79 .unnumbered}

## **Document Control** {#document-control .unnumbered}

# TableCopy {#tablecopy-8 .unnumbered}

+---------+-------------+---------------+------------------------------+
| #       | # **Date    | # **Auth      | # **Chan                     |
|  **Vers | ** {#date . | or** {#author | ges** {#changes .unnumbered} |
| ion** { | unnumbered} |  .unnumbered} |                              |
| #versio |             |               |                              |
| n .unnu |             |               |                              |
| mbered} |             |               |                              |
+=========+=============+===============+==============================+
| # **1.0 | # **2026-   | # **Pro       | # **Initial PRD for Phase    |
| ** {#se | 02-24** {#s | duct Team** { | 1 launch** {#initial-prd-for |
| ction-8 | ection-81 . | #product-team | -phase-1-launch .unnumbered} |
| 0 .unnu | unnumbered} |  .unnumbered} |                              |
| mbered} |             |               |                              |
+---------+-------------+---------------+------------------------------+

# Next Review: March 24, 2026 (post-launch) or upon major feature completion. {#next-review-march-24-2026-post-launch-or-upon-major-feature-completion. .unnumbered}

#  {#section-82 .unnumbered}

# This PRD is ready for development execution. All Phase 1 features are specified with acceptance criteria. Phase 2+ features are identified but not detailed {#this-prd-is-ready-for-development-execution.-all-phase-1-features-are-specified-with-acceptance-criteria.-phase-2-features-are-identified-but-not-detailed .unnumbered}

# **ontentFlow AI --- Product Requirements Document** {#ontentflow-ai-product-requirements-document .unnumbered}

## **1. Executive Summary** {#executive-summary-1 .unnumbered}

Product Name: ContentFlow AI

Tagline: \"Rank higher while you sleep. Content that writes itself.\"

Version: 1.0 (Phase 1 Launch)

Date: February 24, 2026

Status: Ready for Development

### **What We\'re Building** {#what-were-building-1 .unnumbered}

A fully automated subscription service that generates, optimizes, and
publishes SEO blog content for small businesses. The system requires
zero ongoing effort from clients after a 5-minute
onboarding---delivering \"ranking assets\" that drive organic search
traffic on autopilot.

### **Business Objectives** {#business-objectives-1 .unnumbered}

TableCopy

  ------------------------------------------------------------------------
  **Metric**                           **Target**          **Timeline**
  ------------------------------------ ------------------- ---------------
  Monthly Recurring Revenue            \$5,000             Month 6

  Paying Customers                     34                  Month 6

  Gross Margin                         85%                 Sustained

  Customer Churn                       \<5% monthly        Sustained

  Content Auto-Publish Rate            95%                 Sustained
  ------------------------------------------------------------------------

### **Core Value Proposition** {#core-value-proposition-1 .unnumbered}

For time-starved small business owners who know content marketing works
but can\'t execute consistently, ContentFlow AI is the invisible content
team that never misses a deadline, never calls in sick, and continuously
improves based on ranking data.

## **2. User Personas** {#user-personas-1 .unnumbered}

### **Primary: \"Overwhelmed Owner Oliver\"** {#primary-overwhelmed-owner-oliver-1 .unnumbered}

-   Demographics: 35-50, owns service business (legal, healthcare,
    > consulting, local services)

-   Pain Points:

    -   Tried blogging, published 3 posts then stopped

    -   Can\'t afford \$2-5K/month agency retainers

    -   Hires freelancers, quality is inconsistent, takes too much time
        > to manage

-   Goals: Rank for local/service keywords, establish authority,
    > generate leads without daily effort

-   Tech Comfort: Medium---uses WordPress, understands basics, delegates
    > when possible

-   Quote: *\"I know I should blog, but I spend 4 hours on one post and
    > it gets 12 views.\"*

### **Secondary: \"Growth-Hungry Greta\"** {#secondary-growth-hungry-greta-1 .unnumbered}

-   Demographics: 28-40, SaaS/ecommerce founder or marketing manager

-   Pain Points:

    -   Content is priority #3 after product and sales

    -   Needs volume (12-30 posts/month) for SEO moat

    -   Current process is bottlenecked by her time

-   Goals: Dominate long-tail keywords, build topical authority, reduce
    > CAC from organic

-   Tech Comfort: High---wants API access, webhooks, data exports

-   Quote: *\"If I could 10x our content without hiring, I\'d pay
    > double.\"*

### **Tertiary: \"Agency Andy\"** {#tertiary-agency-andy-1 .unnumbered}

-   Demographics: Runs 5-10 person marketing agency

-   Pain Points:

    -   Content production is biggest bottleneck

    -   Clients demand more volume, margins compressing

    -   Quality writers are expensive and flaky

-   Goals: White-label solution, maintain margins, scale client count

-   Tech Comfort: Very high---needs white-label, team management, client
    > dashboards

-   Quote: *\"I need to productize our content service or we\'ll never
    > scale.\"*

## **3. User Stories & Acceptance Criteria** {#user-stories-acceptance-criteria-1 .unnumbered}

### **Epic: Authentication & Onboarding** {#epic-authentication-onboarding-1 .unnumbered}

Story 1.1: As a prospect, I want to sign up without creating a password
so that I can start immediately.

Acceptance Criteria:

-   \[ \] Magic link sent within 30 seconds of email entry

-   \[ \] Link valid for 60 minutes, single-use

-   \[ \] Google OAuth redirects to onboarding step 2 (skips email
    > verification)

-   \[ \] Session persists for 7 days, refreshed on activity

-   \[ \] \"Remember me\" option extends to 30 days

Story 1.2: As a new user, I want to complete onboarding in under 5
minutes so that I don\'t abandon the process.

Acceptance Criteria:

-   \[ \] Progress indicator shows 4 steps with % completion

-   \[ \] Step 1: Business name, website URL (with validation), industry
    > dropdown

-   \[ \] Step 2: Target audience description, 3 competitor URLs
    > (optional)

-   \[ \] Step 3: Content tone selection (5 options with preview
    > samples)

-   \[ \] Step 4: WordPress connection (skippable, \"Connect Later\"
    > prominent)

-   \[ \] Each step validates before proceeding, shows specific error
    > messages

-   \[ \] \"Save & Exit\" available at all steps, resumes on return

-   \[ \] Abandoned onboarding triggers recovery email at 1 hour and 24
    > hours

Story 1.3: As a user, I want to start with a free trial so that I can
verify quality before paying.

Acceptance Criteria:

-   \[ \] 14-day trial begins immediately after onboarding

-   \[ \] PayPal subscription created in APPROVAL_PENDING state
    > (verifies payment method)

-   \[ \] No charge for 14 days, full feature access

-   \[ \] Trial expiration warning at 7 days, 3 days, 1 day

-   \[ \] Trial converts automatically to paid unless cancelled

-   \[ \] Trial users can cancel anytime, retain access until period end

### **Epic: Content Research & Planning** {#epic-content-research-planning-1 .unnumbered}

Story 2.1: As a user, I want the system to find keywords automatically
so that I don\'t have to research.

Acceptance Criteria:

-   \[ \] Research runs daily at 6 AM UTC for all active users

-   \[ \] Analyzes user\'s website + 3 competitors for gap opportunities

-   \[ \] Generates 100 keyword opportunities monthly per user

-   \[ \] Each keyword includes: volume, difficulty (0-100), CPC, search
    > intent, top 3 ranking URLs

-   \[ \] Filters for keywords with difficulty \<40 (achievable for
    > small sites)

-   \[ \] Prioritizes keywords matching user\'s industry and target
    > audience

-   \[ \] Results stored in keyword_opportunities table, deduplicated by
    > URL+keyword

Story 2.2: As a user, I want a content calendar populated automatically
so that I know what\'s coming.

Acceptance Criteria:

-   \[ \] Calendar auto-populates with top 30 opportunities (or tier
    > limit)

-   \[ \] Scheduling respects tier: Starter (4/mo), Growth (12/mo),
    > Agency (30/mo)

-   \[ \] Publish dates optimized for user\'s timezone
    > (Tuesday-Thursday, 6 AM local)

-   \[ \] User can drag to reschedule, delete, or pause items

-   \[ \] Calendar shows 60 days forward, updates daily

-   \[ \] \"Pause all publishing\" toggle available with one click

### **Epic: Content Generation** {#epic-content-generation-1 .unnumbered}

Story 3.1: As a user, I want articles written in my brand voice so that
they sound like me.

Acceptance Criteria:

-   \[ \] Website crawl extracts top 10 existing posts within 2 minutes
    > of onboarding

-   \[ \] NLP analysis identifies: tone, sentence length, vocabulary
    > level, common phrases

-   \[ \] Brand voice profile stored in profiles.brand_voice_extracted
    > (JSON)

-   \[ \] Generation prompt includes voice profile for consistency

-   \[ \] Sample shown to user: \"This is how your content will sound\"
    > with edit option

-   \[ \] Voice match score \>80% required for auto-approval

Story 3.2: As a user, I want articles optimized for search so that they
actually rank.

Acceptance Criteria:

-   \[ \] Every article targets one primary keyword

-   \[ \] SurferSEO Content Score \>80 before publishing

-   \[ \] Structure includes: H1 with keyword, meta description (150-160
    > chars), URL slug

-   \[ \] Internal linking: 3-5 suggestions to user\'s existing posts

-   \[ \] Featured snippet optimization: definition paragraph, bullet
    > lists, comparison tables

-   \[ \] EEAT signals: author persona, first-hand experience examples,
    > citation placeholders

-   \[ \] Word count: 1,500-2,000 words (tier-adjustable)

-   \[ \] Readability: 8th-10th grade Flesch-Kincaid

Story 3.3: As a user, I want content generated quickly so that my
calendar stays full.

Acceptance Criteria:

-   \[ \] Generation queue processes within 10 minutes of trigger

-   \[ \] Kimi API primary, OpenAI GPT-4 fallback on timeout/error

-   \[ \] Retry logic: 3 attempts with exponential backoff (5s, 15s,
    > 45s)

-   \[ \] Failed generation after 3 attempts → human review queue + user
    > notification

-   \[ \] Always maintain 14-day buffer (content ready 2 weeks before
    > publish date)

-   \[ \] Generation status visible in command center: pending →
    > generating → quality check → ready

### **Epic: Quality Assurance** {#epic-quality-assurance-1 .unnumbered}

Story 4.1: As a user, I want plagiarism-free content so that I avoid
penalties.

Acceptance Criteria:

-   \[ \] Copyscape API check on every article

-   \[ \] Similarity score \<5% (excluding quotes, common phrases)

-   \[ \] Failed check triggers regeneration with \"original
    > perspective\" prompt

-   \[ \] 2 failed checks → human review + user notification with
    > explanation

Story 4.2: As a user, I want grammatically correct content so that I
appear professional.

Acceptance Criteria:

-   \[ \] Grammarly API or LanguageTool integration

-   \[ \] Grammar score \>90 required

-   \[ \] Spelling, punctuation, style consistency checked

-   \[ \] Failed check auto-corrects via API suggestions, rechecks

Story 4.3: As a user, I want to trust auto-published content so that I
don\'t need to review every post.

Acceptance Criteria:

-   \[ \] Auto-approval requires: Copyscape \<5%, Grammar \>90, Brand
    > voice \>80, SurferSEO \>80

-   \[ \] YMYL topics (medical, financial, legal advice) flagged for
    > manual review regardless of scores

-   \[ \] User can enable \"approval required\" mode (off by default)

-   \[ \] Pending review items show in command center with 24-hour
    > review window

-   \[ \] No user action after 24 hours → auto-approves (if scores pass)
    > or pauses (if fails)

### **Epic: Publishing & Distribution** {#epic-publishing-distribution-1 .unnumbered}

Story 5.1: As a user, I want content published directly to my WordPress
site so that it\'s hands-off.

Acceptance Criteria:

-   \[ \] WordPress connection via Application Passwords (REST API)

-   \[ \] Connection test validates before first publish

-   \[ \] Posts created as drafts first, scheduled publish at optimal
    > time

-   \[ \] Category auto-assigned based on content analysis (or \"Blog\"
    > default)

-   \[ \] Tags generated from content topics (3-5 tags)

-   \[ \] Featured image selected from Unsplash/Pexels based on keyword

-   \[ \] URL slug optimized: primary-keyword-here

-   \[ \] Yoast/SEOPress meta fields populated if plugins detected

-   \[ \] Failed publish retries 3x, then alerts user with error
    > details + manual fix option

Story 5.2: As a user, I want social media variations so that I can
promote without extra work.

Acceptance Criteria:

-   \[ \] 3 variations generated per article: Twitter/X (280 chars),
    > LinkedIn (500 chars), Facebook (no limit)

-   \[ \] Variations include hook, key insight, call-to-action, hashtags

-   \[ \] Buffer API integration for scheduling: +2 hours, +24 hours, +7
    > days after publish

-   \[ \] User can edit variations before scheduling

-   \[ \] Without Buffer: Email variations to user with copy buttons

Story 5.3: As a user, I want to know when content goes live so that I
can track performance.

Acceptance Criteria:

-   \[ \] Email notification within 5 minutes of publish

-   \[ \] Email includes: Title, URL, keyword, estimated 30-day traffic,
    > social links

-   \[ \] Command center \"Recent Deployments\" section updates
    > immediately

-   \[ \] Optional: Slack/Teams webhook notification (P2 feature)

### **Epic: Command Center Dashboard** {#epic-command-center-dashboard-1 .unnumbered}

Story 6.1: As a user, I want to see my content performance so that I
know the ROI.

Acceptance Criteria:

-   \[ \] Dashboard loads in \<2 seconds

-   \[ \] Stats cards: Upcoming assets (count), Published this month
    > (count), Avg. content score, Est. monthly traffic

-   \[ \] Content calendar view: 30-day scrollable, color-coded by
    > status

-   \[ \] Published assets list: URL, keyword, publish date, performance
    > metrics

-   \[ \] Google Search Console integration (optional): Clicks,
    > impressions, CTR, position

-   \[ \] Data exports: CSV of all content + metrics

Story 6.2: As a user, I want to manage my content queue so that I stay
in control.

Acceptance Criteria:

-   \[ \] View all queued content: title, keyword, scheduled date,
    > status

-   \[ \] Actions per item: Preview, Edit (title/content), Reschedule,
    > Pause, Delete

-   \[ \] Bulk actions: Pause selected, Delete selected

-   \[ \] \"Emergency stop\" button: Pause all publishing immediately

-   \[ \] Edit mode: Rich text editor with SEO score实时 updates

Story 6.3: As a user, I want to manage my account settings so that the
service matches my needs.

Acceptance Criteria:

-   \[ \] Brand voice adjustment: Re-crawl website, manual tone sliders

-   \[ \] WordPress reconnect: Test connection, update credentials

-   \[ \] Content preferences: Post length, frequency, approval mode,
    > categories

-   \[ \] Notification preferences: Email frequency, types of alerts

-   \[ \] Data export: Download all content, metrics, account data
    > (GDPR)

-   \[ \] Account deletion: Self-service with 30-day purge confirmation

### **Epic: Billing & Subscription Management** {#epic-billing-subscription-management-1 .unnumbered}

Story 7.1: As a user, I want to upgrade or downgrade easily so that my
plan matches my growth.

Acceptance Criteria:

-   \[ \] Pricing page shows 3 tiers with feature comparison

-   \[ \] Upgrade: Immediate access to new limits, prorated charge

-   \[ \] Downgrade: New limits apply next billing cycle, no prorated
    > refund

-   \[ \] Annual billing toggle: 2 months free (17% discount), default
    > on

-   \[ \] Payment methods: PayPal primary, Stripe backup for cards

-   \[ \] Invoice generation: PDF emailed within 1 hour of payment,
    > stored in dashboard

Story 7.2: As a user, I want transparent billing so that I trust the
service.

Acceptance Criteria:

-   \[ \] Billing history: All charges with dates, amounts, invoice
    > links

-   \[ \] Next billing date prominently displayed

-   \[ \] Failed payment: 3 retry attempts (Day 1, 3, 5), email
    > notifications each time

-   \[ \] Grace period: 3 days access retained after failed payment

-   \[ \] Cancellation: Self-service, confirmation modal with
    > consequence explanation

-   \[ \] Reactivation: Resume within 30 days retains data, after 30
    > days data archived

## **4. Technical Architecture** {#technical-architecture-1 .unnumbered}

### **System Overview** {#system-overview-1 .unnumbered}

plainCopy

┌─────────────────────────────────────────────────────────────────────────────┐

│ CLIENT LAYER │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ Marketing │ │ Onboarding │ │ Command │ │ Settings │ │

│ │ Site │ │ Flow │ │ Center │ │ & Billing │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

│ Next.js 14 App Router + Tailwind CSS + shadcn/ui │

└─────────────────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────────────────┐

│ API LAYER │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ Auth │ │ Webhooks │ │ Internal │ │ Triggers │ │

│ │ (Supabase) │ │ (PayPal/WP) │ │ API │ │ (n8n) │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

│ Next.js Route Handlers + Supabase Edge Functions │

└─────────────────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────────────────┐

│ ORCHESTRATION LAYER │

│ n8n Self-Hosted │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ Onboarding │ │ Research │ │ Generation │ │ Publishing │ │

│ │ Workflow │ │ Agent │ │ Pipeline │ │ Workflow │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ Quality │ │ Analytics │ │ Email │ │

│ │ Gate │ │ Loop │ │ Sequences │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ │

└─────────────────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────────────────┐

│ DATA & AI LAYER │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ Supabase │ │ Kimi │ │ SurferSEO │ │ DataForSEO │ │

│ │ PostgreSQL │ │ API │ │ API │ │ API │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ OpenAI │ │ Copyscape │ │ Grammarly │ │ Unsplash │ │

│ │ (Fallback) │ │ API │ │ API │ │ API │ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

└─────────────────────────────────────────────────────────────────────────────┘

│

▼

┌─────────────────────────────────────────────────────────────────────────────┐

│ PUBLISHING LAYER │

│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │

│ │ WordPress │ │ Buffer │ │ Resend │ │ LogSnag │ │

│ │ REST API │ │ API │ │ (Email) │ │ (Monitoring)│ │

│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘ │

└─────────────────────────────────────────────────────────────────────────────┘

### **Data Model (Detailed)** {#data-model-detailed-1 .unnumbered}

sqlCopy

*\-- Core entities with relationships*

profiles \|\|*\--o{ content_queue : generates*

profiles \|\|*\--o{ published_content : owns*

profiles \|\|*\--\|\| subscriptions : has*

profiles \|\|*\--o{ integrations : connects*

profiles \|\|*\--o{ activity_logs : generates*

content_queue \|\|*\--o\| published_content : becomes*

Table Specifications:

See TECH-STACK.md §Data Model for complete field specifications. Key
constraints:

-   All tables use UUID primary keys

-   updated_at auto-updated via trigger

-   RLS policies enforce user data isolation

-   Soft deletes via status fields (no hard deletes for audit)

### **API Specifications** {#api-specifications-1 .unnumbered}

Internal API Endpoints:

TableCopy

  -------------------------------------------------------------------------------
  **Method**   **Path**                  **Auth**    **Description**
  ------------ ------------------------- ----------- ----------------------------
  POST         /api/auth/callback        Public      OAuth callback handler

  POST         /api/webhooks/paypal      Signature   PayPal event processing

  POST         /api/webhooks/wordpress   Token       WordPress publish
                                                     notifications

  GET          /api/dashboard/stats      Session     User metrics aggregation

  GET          /api/content/queue        Session     List user\'s content queue

  POST         /api/content/approve      Session     Approve pending content

  PUT          /api/content/\[id\]       Session     Update content item

  DELETE       /api/content/\[id\]       Session     Delete/cancel content

  POST         /api/billing/upgrade      Session     Change subscription tier

  POST         /api/billing/cancel       Session     Cancel subscription

  POST         /api/triggers/crawl       Service     Initiate website crawl

  POST         /api/triggers/generate    Service     Trigger content generation
  -------------------------------------------------------------------------------

### **Third-Party Integrations** {#third-party-integrations-1 .unnumbered}

TableCopy

  -----------------------------------------------------------------------
  **Service**        **Purpose**         **Fallback**         **Risk
                                                              Level**
  ------------------ ------------------- -------------------- -----------
  Kimi API           Content generation  OpenAI GPT-4         High

  SurferSEO API      Content             Manual checklist     Medium
                     optimization                             

  DataForSEO API     Keyword research    Cached data + manual Low

  Copyscape API      Plagiarism          Quetext API          Medium
                     detection                                

  Grammarly API      Grammar checking    LanguageTool         Low

  PayPal API         Subscription        Stripe               Low
                     billing                                  

  WordPress REST API Content publishing  Email delivery       Medium

  Buffer API         Social scheduling   Manual email         Low

  Resend API         Transactional email SendGrid             Low

  LogSnag API        Event monitoring    Console logs         Low
  -----------------------------------------------------------------------

## **5. User Interface Design** {#user-interface-design-1 .unnumbered}

### **Design System** {#design-system-1 .unnumbered}

Colors:

-   Midnight (#0F172A): Primary backgrounds, authority

-   Electric (#3B82F6): Actions, links, energy

-   Success (#10B981): Positive states, published

-   Warning (#F59E0B): Attention, pending

-   Danger (#EF4444): Errors, cancellations

-   Cloud (#F8FAFC): Card backgrounds

-   Slate (#64748B): Secondary text

Typography:

-   Display/Body: Inter (400-900)

-   Data/Mono: JetBrains Mono (400)

Spacing Scale: 4px base (4, 8, 16, 24, 32, 48, 64)

### **Key Screens** {#key-screens-1 .unnumbered}

1\. Marketing Homepage

-   Hero: \"Rank higher while you sleep\" + email capture

-   Social proof: Logos, testimonials, \"500+ businesses\"

-   How it works: 3-step visual (Activate → Automate → Dominate)

-   Pricing: 3 tiers with annual toggle

-   FAQ: 6 common objections handled

2\. Onboarding Flow (4 Steps)

-   Progress bar at top

-   Step 1: Business basics (URL validation with crawl preview)

-   Step 2: Competitive intel (optional competitor URLs)

-   Step 3: Voice selection (5 cards with sample text)

-   Step 4: WordPress connect (skippable, \"I\'ll do this later\")

3\. Command Center Dashboard

-   Header: Business name, tier badge, settings cog

-   Stats row: 4 cards with trend indicators

-   Calendar: 30-day view, drag-drop rescheduling

-   Queue: List view with status badges, action menus

-   Recent: Last 5 published with performance sparklines

4\. Content Preview/Edit

-   Split view: Editor left, SEO score right

-   Score breakdown: Readability, keyword density, links, length

-   Tabs: Content, Meta, Social variations, History

-   Actions: Approve, Request changes, Delete, Reschedule

5\. Settings

-   Tabs: Account, Brand Voice, Integrations, Billing, Notifications

-   Brand Voice: Sliders for tone dimensions + re-crawl button

-   Integrations: WordPress (test/reconnect), Buffer (connect), GSC
    > (authorize)

-   Billing: Current plan, usage meter, upgrade/downgrade, invoices

## **6. Automation Workflows (n8n)** {#automation-workflows-n8n-1 .unnumbered}

### **Workflow 1: Onboarding Orchestration** {#workflow-1-onboarding-orchestration-1 .unnumbered}

Trigger: profiles.status = \'pending_onboarding\'

Steps:

1.  Wait for onboarding completion (webhook)

2.  Trigger website crawl (Python function)

3.  Extract brand voice (NLP analysis)

4.  Create initial content calendar (30 days)

5.  Send welcome email with preview of first ranking asset

6.  Update status to active_trial

### **Workflow 2: Daily Research Agent** {#workflow-2-daily-research-agent-1 .unnumbered}

Trigger: Cron 6:00 AM UTC

Steps:

1.  Fetch all status = \'active\' profiles

2.  For each profile:

    -   DataForSEO: Keywords for industry + location

    -   Competitor gap analysis (top 3 competitors)

    -   Filter: Volume \>100, Difficulty \<40, Intent =
        > informational/commercial

    -   Score opportunities by relevance

    -   Insert top 10 into keyword_opportunities

3.  Trigger calendar population if gaps exist

### **Workflow 3: Content Generation Pipeline** {#workflow-3-content-generation-pipeline-1 .unnumbered}

Trigger: content_queue.status = \'pending_generation

Steps:

1.  Fetch keyword + brand voice profile

2.  SurferSEO: Get NLP terms and content brief

3.  Kimi API: Generate article (retry 3x)

4.  Parse JSON response (title, content, meta, social)

5.  Insert into content_json field

6.  Update status to pending_quality_check

7.  Trigger Quality Gate workflow

### **Workflow 4: Quality Gate** {#workflow-4-quality-gate-1 .unnumbered}

Trigger: content_queue.status = \'pending_quality_check

Steps:

1.  Copyscape API: Plagiarism check

2.  Grammarly API: Grammar score

3.  Embedding similarity: Brand voice match

4.  SurferSEO API: Content score

5.  If all pass (\>thresholds): status = approved

6.  If any fail: Regenerate with feedback (max 2x)

7.  If still failing: status = pending_review + notify user

### **Workflow 5: Scheduled Publishing** {#workflow-5-scheduled-publishing-1 .unnumbered}

Trigger: Cron every hour

Steps:

1.  Query status = \'pending_publish\' AND scheduled_at \<= now()

2.  For each item:

    -   Fetch WordPress credentials (decrypt)

    -   Upload featured image to WP Media

    -   Create post via REST API (scheduled status)

    -   Update content_queue with wordpress_post_id

    -   Buffer API: Schedule social variations

    -   Send \"Deployed\" email to user

    -   Create published_content record

### **Workflow 6: Analytics Loop (Weekly)** {#workflow-6-analytics-loop-weekly-1 .unnumbered}

Trigger: Cron Monday 9 AM UTC

Steps:

1.  Fetch all published content from last 30 days

2.  Google Search Console API: Pull metrics (if connected)

3.  Kimi API: Analyze \"Why this ranked/didn\'t rank\"

4.  Generate \"Search Dominance Report\" PDF

5.  Email report to user with recommendations

6.  Update published_content.metrics_json

## **7. Non-Functional Requirements** {#non-functional-requirements-1 .unnumbered}

### **Performance** {#performance-1 .unnumbered}

-   Dashboard TTFB: \<500ms (Vercel Edge)

-   API response time: P95 \<200ms

-   Content generation: \<10 minutes end-to-end

-   Webhook processing: \<2 seconds (acknowledge immediately)

-   Image optimization: Next.js Image component with WebP

### **Security** {#security-1 .unnumbered}

-   Encryption: AES-256-GCM for credentials at rest

-   Auth: Supabase Auth with PKCE, HTTP-only cookies

-   RLS: Row-level security on all user data tables

-   Rate limiting: 100 req/min per IP, 1000 per user

-   Secrets: Vault storage, rotation every 90 days

-   Dependencies: Automated vulnerability scanning (Snyk)

### **Reliability** {#reliability-1 .unnumbered}

-   Uptime target: 99.9% (Vercel + Supabase SLA)

-   Database: Daily backups, 30-day retention

-   n8n: Queue persistence, automatic restart on failure

-   Failed payments: 3 retry attempts with exponential backoff

-   Content generation: 48-hour buffer maintained

### **Compliance** {#compliance-1 .unnumbered}

-   GDPR: Right to export (JSON), right to deletion (30-day purge)

-   CCPA: \"Do not sell\" disclosure, opt-out mechanism

-   PCI-DSS: PayPal/Stripe hosted fields (no card data touches servers)

-   Accessibility: WCAG 2.1 AA compliance (keyboard nav, screen readers)

## **8. Go-to-Market Strategy** {#go-to-market-strategy-1 .unnumbered}

### **Pricing Tiers** {#pricing-tiers-1 .unnumbered}

TableCopy

  ------------------------------------------------------------------------
  **Feature**          **Starter        **Growth          **Agency
                       \$149/mo**       \$349/mo**        \$749/mo**
  -------------------- ---------------- ----------------- ----------------
  Ranking Assets/Month 4                12                30

  Word Count           1,500            2,000             2,500

  Auto-Publish         ✅               ✅                ✅

  Social Variations    3/asset          5/asset           10/asset

  GSC Integration      ❌               ✅                ✅

  White-Label          ❌               ❌                ✅

  API Access           ❌               ❌                ✅

  Support              Email            Priority          Dedicated
  ------------------------------------------------------------------------

Annual billing: 2 months free (17% discount)

### **Launch Timeline** {#launch-timeline-1 .unnumbered}

TableCopy

  -----------------------------------------------------------------------------
  **Phase**   **Duration**   **Focus**                         **Success
                                                               Metric**
  ----------- -------------- --------------------------------- ----------------
  Alpha       Weeks 1-2      3 free beta users, iron out       0 critical bugs
                             workflows                         

  Beta        Weeks 3-4      10 users at 50% discount, collect 3 case studies
                             testimonials                      

  Public      Week 5         Product Hunt, IndieHackers, cold  100 signups, 10
  Launch                     outreach                          paid

  Growth      Months 2-6     Content marketing, partnerships,  \$5K MRR
                             referrals                         
  -----------------------------------------------------------------------------

### **Acquisition Channels** {#acquisition-channels-1 .unnumbered}

1.  Product Hunt Launch: #1 Product of the Day goal

2.  IndieHackers: Build in public, weekly metrics

3.  Cold Outreach: Target businesses with 90+ day old blogs

4.  Content Marketing: Eat our own dog food (rank for \"automated SEO
    > content\")

5.  Referral Program: \$50 credit for referrer and referee (P2)

## **9. Risk Assessment** {#risk-assessment-1 .unnumbered}

TableCopy

  ------------------------------------------------------------------------------------
  **Risk**            **Probability**   **Impact**   **Mitigation**
  ------------------- ----------------- ------------ ---------------------------------
  Kimi API downtime   Medium            High         OpenAI fallback, 48-hour content
                                                     buffer

  PayPal account      Low               Critical     Stripe backup, maintain 3-month
  freeze                                             runway

  Google algorithm    Medium            Medium       EEAT focus, diversify traffic
  update                                             sources

  Quality complaints  Medium            High         95% auto-approval target, human
                                                     review gate

  WordPress API       Low               Medium       Abstraction layer, email fallback
  changes                                            

  Competitor price    Medium            Low          Differentiation via automation
  war                                                depth
  ------------------------------------------------------------------------------------

## **10. Success Metrics (North Star)** {#success-metrics-north-star-1 .unnumbered}

### **Primary: Content Velocity** {#primary-content-velocity-1 .unnumbered}

Definition: Number of ranking assets published per user per month

Target: 100% of tier limit (4/12/30)

Why: Measures core value delivery

### **Secondary Metrics** {#secondary-metrics-1 .unnumbered}

TableCopy

  --------------------------------------------------------------------------
  **Metric**                **Target**   **Measurement**
  ------------------------- ------------ -----------------------------------
  Activation Rate           \>60%        Complete onboarding / Signups

  Trial-to-Paid             \>30%        Paid / Trial completions

  Auto-Publish Rate         \>95%        Auto-approved / Total published

  Time to First Value       \<24hrs      First ranking asset published

  NPS Score                 \>50         Monthly survey

  Gross Churn               \<5%         Canceled / Total at month start

  Net Revenue Retention     \>100%       Including upgrades/expansion
  --------------------------------------------------------------------------

## **11. Open Questions & Decisions** {#open-questions-decisions-1 .unnumbered}

TableCopy

  ------------------------------------------------------------------------------------
  **Question**                     **Status**   **Default if            **Blocking**
                                                Unresolved**            
  -------------------------------- ------------ ----------------------- --------------
  SurferSEO vs Clearscope for      Open         SurferSEO (better API)  No
  optimization                                                          

  Image generation (DALL-E) vs     Open         Stock photos only (P2)  No
  stock photos                                                          

  White-glove onboarding for       Open         Self-service +          No
  Agency tier                                   concierge option        

  Multi-language support (Spanish, Open         English only (P3)       No
  French)                                                               

  Affiliate/referral program       Open         \$50 dual credit (P2)   No
  structure                                                             

  Mobile app (iOS/Android)         Open         Not in roadmap          No
  ------------------------------------------------------------------------------------

## **12. Appendices** {#appendices-1 .unnumbered}

### **A. Brand Vocabulary Enforcement** {#a.-brand-vocabulary-enforcement-1 .unnumbered}

See DESIGN-NOTES.md §3 for complete \"Never say → Always say\" table.

### **B. Technical Stack Details** {#b.-technical-stack-details-1 .unnumbered}

See TECH-STACK.md for layer-by-layer decisions, cost estimates, API
specifications.

### **C. UI Component Specifications** {#c.-ui-component-specifications-1 .unnumbered}

See DESIGN-NOTES.md §6 for button hierarchies, modal specs, form
patterns.

### **D. Database Migration Scripts** {#d.-database-migration-scripts-1 .unnumbered}

See migrations/001_initial_schema.sql in repository.

### **E. n8n Workflow JSON** {#e.-n8n-workflow-json-1 .unnumbered}

Exported workflows stored in /automation/n8n/workflows/ (version
controlled).

## **Document Control** {#document-control-1 .unnumbered}

TableCopy

  --------------------------------------------------------------------------
  **Version**   **Date**      **Author**      **Changes**
  ------------- ------------- --------------- ------------------------------
  1.0           2026-02-24    Product Team    Initial PRD for Phase 1 launch

  --------------------------------------------------------------------------

Next Review: March 24, 2026 (post-launch) or upon major feature
completion.

This PRD is ready for development execution. All Phase 1 features are
specified with acceptance criteria. Phase 2+ features are identified but
not detailed
