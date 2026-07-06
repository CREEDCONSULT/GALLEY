# HITL Architecture Map: ContentFlow AI "User-in-the-Loop"

This document serves as the master blueprint for transitioning the ContentFlow AI engine from fully autonomous to a permission-gated semi-autonomous system.

## 1. The Goal: Controlled Scalability
The "Black Box" approach (Zero-input) creates trust issues for enterprise or high-authority clients. The "User-in-the-Loop" (HITL) model provides a **Human Firewall**, ensuring that AI never publishes or researches without explicit strategic alignment.

---

## 2. Stage-by-Stage Permission Mapping

### Phase I: Discovery Permission (The Strategic Gate)
*   **Autonomous Activity**: AI agent identifies 10 long-tail keywords based on GSC gaps.
*   **The Gate**: The dashboard generates a "Brief Proposition" for each.
*   **User Action**: 
    - **Approve**: Moves to drafting.
    - **Edit**: User tweaks the "Intent Focus" before drafting.
    - **Dismiss**: Keyword is added to a "Negative List" to prevent re-discovery.
*   **Change Required**: New UI component `BriefApprovalCard` in `app/dashboard/automation/`.

### Phase II: Production Permission (The Quality Gate)
*   **Autonomous Activity**: The Forge engine generates the H1, H2s, and initial body text based on approved DNA.
*   **The Gate**: Content is locked in a `REVIEW_ONLY` state.
*   **User Action**:
    - **Quick-Pass**: User reads and approves with no changes.
    - **Deep-Edit**: User modifies specific paragraphs or links.
    - **AI-Refine**: User highlights a section and clicks "Rewrite for more Humor/Professionalism".
*   **Change Required**: Editor state management in `app/dashboard/forge/` to handle `isDirty` vs `isApproved` states.

### Phase III: Distribution Permission (The Publishing Gate)
*   **Autonomous Activity**: System prepares final Slug, Meta-Description, and Featured Image.
*   **The Gate**: A "Pre-flight Checklist" modal.
*   **User Action**:
    - **Schedule**: User sets a specific date/time for WP sync.
    - **Push Now**: Immediate WP REST API execution.
*   **Change Required**: `PublishModal` component with scheduling logic.

---

## 3. Database & API Refactoring

### Schema Level (`assets` table)
```sql
ALTER TABLE assets 
ADD COLUMN approval_chain JSONB DEFAULT '{
    "discovery": {"status": "pending", "by": null, "at": null},
    "production": {"status": "pending", "by": null, "at": null},
    "distribution": {"status": "pending", "by": null, "at": null}
}';
```

### Micro-Service Level (n8n)
*   Workflows must now include a **"Wait for External Event"** node at each checkpoint.
*   The system will use **Resumable Webhooks**: n8n pauses execution and generates a unique URL. When the user clicks "Approve" in the dashboard, the frontend `POST`s to that URL to resume the workflow.

---

## 4. Business Impact of the Change
*   **LTV (Lifetime Value)**: Increases as users feel more "in control" and integrated with the product.
*   **SLA (Service Level Agreement)**: Can now guarantee 100% human-verified content for premium tiers.
*   **UX Complexity**: Slightly higher, mitigated by "Auto-Approve" toggles in the Settings for users who still want the pure autonomous experience.

---
*Blueprint Version 1.1*
