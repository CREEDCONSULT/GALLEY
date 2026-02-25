# License & Setup Guide: ContentFlow AI Operational Requirements

To move ContentFlow AI from a technical skeleton to a live, autonomous engine, you will need to provide the following keys, credentials, and configurations. This guide explains exactly **what** is needed and **how** to obtain it.

---

## 1. Core Infrastructure Layer

### A. Supabase (Database & Auth)
*   **Variable**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
*   **How to get**:
    1.  Create a project at [supabase.com](https://supabase.com).
    2.  Go to **Project Settings > API**.
    3.  Copy the URL and keys.
    *   *Service Role Key*: Keep this extremely secret; it bypasses RLS for background workers.

### B. n8n (Workflow Orchestration)
*   **Requirement**: A self-hosted or cloud instance of n8n.
*   **How to get**:
    1.  Sign up at [n8n.io](https://n8n.io) or deploy via Docker on a VPS.
    2.  Provide the `N8N_WEBHOOK_URL` to the Next.js app to trigger content cycles.

---

## 2. Artificial Intelligence (Content Generation)

### A. OpenAI (Logic & Reasoning)
*   **Variable**: `OPENAI_API_KEY`
*   **Usage**: Used for complex structuring, outline generation, and the "Referee Agent."
*   **How to get**: [platform.openai.com](https://platform.openai.com) > API Keys.

### B. Moonshot / Kimi (Production Writing)
*   **Variable**: `KIMI_API_KEY`
*   **Usage**: Primary engine for long-form content generation and brand voice cloning.
*   **How to get**: Create an account at [Moonshot AI](https://platform.moonshot.cn/).

---

## 3. SEO & Intelligence Layer

### A. DataForSEO (Keyword Discovery)
*   **Variable**: `DATAFORSEO_LOGIN`, `DATAFORSEO_PASSWORD`
*   **Usage**: Real-time keyword volume, difficulty, and competitor sitemap crawling.
*   **How to get**: Sign up at [dataforseo.com](https://dataforseo.com) and add credits to your balance.

### B. Google Search Console (Performance Data)
*   **Variable**: `GSC_CLIENT_ID`, `GSC_CLIENT_SECRET`, `GSC_REDIRECT_URI`
*   **Usage**: To sync impression/click data to the Command Center.
*   **How to get**:
    1.  Go to [Google Cloud Console](https://console.cloud.google.com).
    2.  Create a project and enable the "Google Search Console API."
    3.  Create **OAuth 2.0 Credentials** (Web Application).
    4.  Add `https://yourdomain.com/api/auth/callback/gsc` as a redirect URI.

---

## 4. Quality Assurance (Anti-Risk)

### A. Copyscape (Plagiarism Prevention)
*   **Variable**: `COPYSCAPE_USERNAME`, `COPYSCAPE_API_KEY`
*   **Usage**: Verifies all AI drafts are <5% similar to existing web content before publishing.
*   **How to get**: [copyscape.com/api](https://www.copyscape.com/api.php). *Note: Requires a prepaid balance.*

---

## 5. Publishing & Distribution

### A. WordPress (Production Site)
*   **Variable**: `WP_SITE_URL`, `WP_APP_PASSWORD`
*   **Usage**: The direct target for the "One-Click Publish" feature.
*   **How to get**:
    1.  Log into your WordPress Dashboard.
    2.  Go to **Users > Profile**.
    3.  Scroll to **Application Passwords**.
    4.  Add New Application Password (e.g., "ContentFlow AI").
    *   *Warning*: Ensure your site has an SSL certificate (HTTPS) as Application Passwords require it.

### B. Buffer (Social Media Proliferation)
*   **Variable**: `BUFFER_ACCESS_TOKEN`
*   **Usage**: Automatically schedules X (Twitter), LinkedIn, and FB posts for every new article.
*   **How to get**: [buffer.com/developers](https://buffer.com/developers).

---

## Summary Checklist for Production Launch
- [ ] Supabase Project Live
- [ ] n8n Workflows Imported
- [ ] $50 initial credit in DataForSEO
- [ ] $10 initial credit in Copyscape
- [ ] Google Cloud Project approved for GSC API
- [ ] WordPress site connected via App Password

---
*Documentation Version 1.0*
