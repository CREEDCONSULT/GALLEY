# Phase 2.6 live smoke checklist

Before starting, configure `.env.local`, apply all Supabase migrations, and sign in with a test workspace user.

1. Start the app with `npm run dev`.
2. Open `/dashboard/proof`.
3. Click **Seed demo**.
4. Confirm demo deliverables appear from persisted data.
5. Approve one deliverable and confirm it becomes **Approved**.
6. Edit one deliverable and confirm the new draft returns through verification.
7. Reject one deliverable and confirm it stops.
8. Open `/dashboard/records`.
9. Confirm approval, edit, and reject events appear with actors and timestamps.
10. Return to Proof Queue and click **Reset work**. Confirm generated demo work clears while event history remains append-only.
11. Refresh Proof Queue and Records to confirm the cleared state persists.
12. Run `npm run build`.

Also run `npm run smoke:galley:supabase` to verify the headless database path. Approval does not schedule or publish a deliverable; scheduled/published states require a persisted approval at both repository and database boundaries.
