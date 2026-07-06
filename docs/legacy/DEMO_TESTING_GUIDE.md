# Demo Testing Guide: ContentFlow AI Full Feature Walkthrough

This guide provides a set of demo data and a step-by-step journey to test all implemented features of ContentFlow AI, from the landing page to the billing dashboard.

---

## 🔑 1. Demo Credentials & Business Profile
Use these details to simulate a real user journey during testing.

*   **Demo Email**: `tester@example.com`
*   **Demo Business Name**: `LegalFlow AI`
*   **Target Website**: `https://legalflow-demo.com`
*   **Industry**: `Legal Technology / SaaS`
*   **Target Audience**: `Startup Founders & General Counsel`
*   **Tone**: `Authoritative & Legally Precise`

---

## 🚀 2. Step-by-Step User Journey

### Step 1: The Landing Page Experience
1.  **Start Your Audit**: Click the **"Start Your Free Audit"** button (Hero section).
2.  **Verify Navigation**: Use the nav links (**Features, Samples, Pricing**) to check smooth-scrolling.
3.  **Pricing Preview**: Go to the **Pricing** section and toggle between **Monthly** and **Annually** to see the 20% discount logic.

### Step 2: Smart Onboarding
*   *Action*: Click "Get Started" to enter the onboarding flow.
1.  **Step 1 (Business)**: Input the Demo Business Name and Website provided above.
2.  **Step 2 (Voice)**: Select the **"Authoritative"** tone preset.
3.  **Step 3 (Integrations)**: View the WordPress connection simulation and click **"Complete Setup."**

### Step 3: Automation Pilot (Command Center)
*   *Action*: Navigate to **Automation** via the sidebar.
1.  **Approval Inbox**: Note the new **"Actions Required"** badges.
2.  **Approve a Brief**: Click **"Approve"** on the *Legal Automation for Startups* card to simulate passing the Strategic Gate.
3.  **Inspect Workflows**: Look at the three active engines: **The Pulse**, **The Forge**, and **WordPress Pipeline.**
4.  **System Logs**: Read the real-time logs in the "System Inspector" (simulates n8n handshake).

### Step 4: The Forge (Content Generation)
*   *Action*: Navigate to **The Forge** via the sidebar.
1.  **HITL Banner**: Notice the **"Revision Required"** banner at the top of the editor—this is the Quality Gate.
2.  **SEO Pulse**: Type some text into the editor. Notice the **SEO Pulse** score and progress bar update in real-time.
3.  **AI Drafting**: Click the **Floating Bot Icon** (bottom right) to simulate an AI content generation cycle.
4.  **Approve & Distribute**: Click the primary button (now renamed to **"Approve & Distribute"**) to finish the cycle.

### Step 5: Billing & Support
*   *Action*: Navigate to **Billing** via the sidebar.
1.  **Plan Selection**: Select the **"Growth"** plan.
2.  **Payment Simulation**: 
    - Enter a dummy card number (e.g., `4242 4242 4242 4242`).
    - Click **"Upgrade Now"** to see the "Payment Successful" feedback modal.

---

## ✅ 3. Expected Success Indicators
*   **Visuals**: High-fidelity glassmorphic UI remains consistent on all pages.
*   **Interactivity**: Hover effects and animations (Framer Motion) should feel responsive.
*   **Cursor**: The mouse cursor should remain a default arrow on text and a pointer on buttons (no I-beam pop).

---
*Created: February 25, 2026*
