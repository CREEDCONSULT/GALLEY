import { createClient } from "@supabase/supabase-js";

try { process.loadEnvFile?.(".env.local"); } catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const required = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"];
const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.error([
    `Galley Supabase smoke test not run. Missing: ${missing.join(", ")}.`,
    "Copy .env.example to .env.local, add values from Supabase project settings, apply migrations, then rerun:",
    "  npm run smoke:galley:supabase",
  ].join("\n"));
  process.exitCode = 1;
} else {
  await run();
}

async function run() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const marker = "GALLEY_SMOKE_V1";
  const email = "galley-smoke-v1@example.invalid";
  const period = "smoke-v1";

  const expect = (result, label) => {
    if (result.error) {
      const rls = result.error.code === "42501" || /row.level security|permission denied/i.test(result.error.message);
      throw new Error(`${label}${rls ? " was blocked by RLS" : " failed"}: ${result.error.message}`);
    }
    return result.data;
  };
  const one = async (query, label) => expect(await query, label);

  const users = expect(await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 }), "List smoke users").users;
  let user = users.find((candidate) => candidate.email === email);
  if (!user) {
    const created = expect(await supabase.auth.admin.createUser({ email, email_confirm: true, user_metadata: { purpose: marker } }), "Create smoke user");
    user = created.user;
  }
  if (!user) throw new Error("Create smoke user returned no user.");

  let tenant = await one(supabase.from("tenants").select("*").eq("owner_user_id", user.id).maybeSingle(), "Select smoke tenant");
  if (!tenant) tenant = await one(supabase.from("tenants").insert({ owner_user_id: user.id, name: marker }).select("*").single(), "Insert smoke tenant");

  let account = await one(supabase.from("client_accounts").select("*").eq("tenant_id", tenant.id).eq("name", marker).maybeSingle(), "Select smoke account");
  if (!account) account = await one(supabase.from("client_accounts").insert({ tenant_id: tenant.id, name: marker, website: "https://example.invalid/galley-smoke", industry: "Smoke testing", target_audience: "Galley maintainers", primary_offer: "Persistence proof", status: "active" }).select("*").single(), "Insert smoke account");

  let playbook = await one(supabase.from("playbooks").select("*").eq("account_id", account.id).eq("version", 1).maybeSingle(), "Select smoke playbook");
  if (!playbook) playbook = await one(supabase.from("playbooks").insert({ tenant_id: tenant.id, account_id: account.id, version: 1, voice: "Calm, precise, and evidence-led.", approved_claims: ["Proof before press."], forbidden_claims: ["guaranteed results"], channels: ["Website"], reporting_kpi: "Approved deliverables" }).select("*").single(), "Insert smoke playbook");

  let deliverable = await one(supabase.from("deliverables").select("*").eq("tenant_id", tenant.id).eq("period", period).eq("title", marker).maybeSingle(), "Select smoke deliverable");
  if (!deliverable) deliverable = await one(supabase.from("deliverables").insert({ tenant_id: tenant.id, account_id: account.id, period, type: "Website brief", channel: "Website", title: marker, status: "drafting" }).select("*").single(), "Insert smoke deliverable");

  let draft = await one(supabase.from("drafts").select("*").eq("deliverable_id", deliverable.id).eq("version", 1).maybeSingle(), "Select smoke draft");
  if (!draft) draft = await one(supabase.from("drafts").insert({ tenant_id: tenant.id, deliverable_id: deliverable.id, version: 1, title: marker, content: "Proof before press. This marked draft exists only to test Galley persistence.", model: "smoke-fixture", playbook_version: playbook.version }).select("*").single(), "Insert smoke draft");

  let verification = await one(supabase.from("verifications").select("*").eq("draft_id", draft.id).eq("rubric_version", marker).maybeSingle(), "Select smoke verification");
  if (!verification) verification = await one(supabase.from("verifications").insert({ tenant_id: tenant.id, draft_id: draft.id, result: "pass", reasons: ["Marked smoke fixture passed."], rubric_version: marker }).select("*").single(), "Insert smoke verification");

  const appendOnce = async (type, actorType, payload = {}) => {
    const existing = await one(supabase.from("events").select("id").eq("tenant_id", tenant.id).eq("subject_ref", deliverable.id).eq("type", type).limit(1).maybeSingle(), `Select ${type} event`);
    if (!existing) await one(supabase.from("events").insert({ tenant_id: tenant.id, account_id: account.id, actor_type: actorType, actor_label: marker, type, subject_ref: deliverable.id, payload: { ...payload, marker } }).select("id").single(), `Append ${type} event`);
  };

  await appendOnce("playbook.selected", "system", { playbookId: playbook.id });
  await appendOnce("draft.generated", "generator", { draftId: draft.id });
  await appendOnce("verification.passed", "verifier", { verificationId: verification.id });
  await appendOnce("proof.awaiting", "system", { verificationId: verification.id });

  const releaseWithoutApproval = await supabase.from("deliverables").update({ status: "scheduled" }).eq("id", deliverable.id).select("id").single();
  if (!releaseWithoutApproval.error) {
    await supabase.from("deliverables").update({ status: "drafting" }).eq("id", deliverable.id);
    throw new Error("Invariant violation: the database allowed scheduling before approval. Apply the Phase 2.6 hardening migration.");
  }
  if (!/approval/i.test(releaseWithoutApproval.error.message)) {
    throw new Error(`The pre-approval release probe failed for an unexpected reason: ${releaseWithoutApproval.error.message}`);
  }

  let approval = await one(supabase.from("approvals").select("*").eq("deliverable_id", deliverable.id).eq("action", "approve").maybeSingle(), "Select smoke approval");
  if (!approval) approval = await one(supabase.from("approvals").insert({ tenant_id: tenant.id, deliverable_id: deliverable.id, user_id: user.id, action: "approve", edit_diff: null }).select("*").single(), "Insert smoke approval");
  await appendOnce("approval.approved", "human", { approvalId: approval.id, userId: user.id });
  deliverable = await one(supabase.from("deliverables").update({ status: "approved" }).eq("id", deliverable.id).select("*").single(), "Approve smoke deliverable");

  const approvalEvent = await one(supabase.from("events").select("id").eq("subject_ref", deliverable.id).eq("type", "approval.approved").maybeSingle(), "Read approval event");
  if (!approvalEvent) throw new Error("Approval event was not readable after append.");
  const mutationProbe = await supabase.from("events").update({ actor_label: `${marker}_MUTATION_PROBE` }).eq("id", approvalEvent.id);
  if (!mutationProbe.error) {
    await supabase.from("events").update({ actor_label: marker }).eq("id", approvalEvent.id);
    throw new Error("Append-only invariant violation: an existing event could be updated.");
  }
  if (!/append-only/i.test(mutationProbe.error.message)) {
    throw new Error(`The event mutation probe failed for an unexpected reason: ${mutationProbe.error.message}`);
  }
  const timeline = await one(supabase.from("events").select("id,type,created_at").eq("subject_ref", deliverable.id).order("created_at", { ascending: true }), "Read record timeline");
  if (timeline.length < 5) throw new Error(`Record timeline is incomplete: expected at least 5 events, got ${timeline.length}.`);

  const released = await one(supabase.from("deliverables").select("id,status").eq("tenant_id", tenant.id).in("status", ["scheduled", "published"]), "Read released deliverables");
  for (const item of released) {
    const approved = await one(supabase.from("approvals").select("id").eq("deliverable_id", item.id).eq("action", "approve").limit(1).maybeSingle(), "Check release approval");
    if (!approved) throw new Error(`Invariant violation: ${item.id} is ${item.status} without approval.`);
  }

  console.log(`Galley live Supabase smoke test passed: tenant ${tenant.id}, deliverable ${deliverable.id}, ${timeline.length} timeline events, approval verified.`);
}
