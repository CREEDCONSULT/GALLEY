import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createMockValidationState } from "../lib/galley/mockValidationNode.ts";

const repository = await readFile(new URL("../lib/galley/repository.ts", import.meta.url), "utf8");
const schema = await readFile(new URL("../supabase/migrations/20260629_galley_validation_node.sql", import.meta.url), "utf8");
const policies = await readFile(new URL("../supabase/migrations/20260630_galley_persistence_policies.sql", import.meta.url), "utf8");
const hardening = await readFile(new URL("../supabase/migrations/20260701_galley_persistence_hardening.sql", import.meta.url), "utf8");

for (const name of ["getOrCreateDefaultTenant", "createClientAccount", "listClientAccounts", "createPlaybook", "getLatestPlaybook", "createDeliverable", "listDeliverables", "getDeliverableWithCurrentDraft", "createDraft", "createVerification", "createApproval", "appendEvent", "listEventsForAccount", "listEventsForDeliverable", "updateDeliverableStatus"]) {
  assert.match(repository, new RegExp(`export async function ${name}\\b`), `repository export missing: ${name}`);
}
for (const table of ["tenants", "client_accounts", "playbooks", "deliverables", "drafts", "verifications", "approvals", "events"]) {
  assert.match(schema, new RegExp(`CREATE TABLE(?: IF NOT EXISTS)? public\\.${table}\\b`, "i"), `schema table missing: ${table}`);
}
assert.match(schema, /prevent_galley_event_mutation/i, "append-only event guard is missing");
assert.match(schema, /ENABLE ROW LEVEL SECURITY/i, "RLS enablement is missing");
assert.match(policies, /CREATE POLICY "Tenant owners append events"/i, "tenant event policy is missing");
assert.match(hardening, /require_galley_approval_before_release/i, "database approval invariant is missing");
assert.match(hardening, /REVOKE UPDATE, DELETE ON public\.events FROM anon, authenticated/i, "normal app roles can mutate events");

const mock = createMockValidationState();
assert.equal(mock.accounts.length, 4, "mock mode must retain four accounts");
assert.ok(mock.deliverables.length >= 4, "mock mode must retain representative deliverables");
assert.ok(mock.events.length > 0, "mock mode must produce record events");

const hasCredentials = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
console.log(`Galley persistence contract passed (${hasCredentials ? "schema/repository mode; authenticated smoke test remains manual" : "mock/schema mode; Supabase credentials absent"}).`);
