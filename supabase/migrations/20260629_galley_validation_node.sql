-- Galley Phase 2: validation-node foundation.
--
-- These tables model Produce -> Verify -> Proof -> Record. Scheduling and
-- publishing statuses exist so the approval invariant can be enforced before
-- those capabilities are implemented.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.client_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  industry TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  primary_offer TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  version INTEGER NOT NULL CHECK (version > 0),
  voice TEXT NOT NULL,
  approved_claims TEXT[] NOT NULL DEFAULT '{}',
  forbidden_claims TEXT[] NOT NULL DEFAULT '{}',
  channels TEXT[] NOT NULL DEFAULT '{}',
  reporting_kpi TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, version)
);

CREATE TABLE IF NOT EXISTS public.deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  period TEXT NOT NULL,
  type TEXT NOT NULL,
  channel TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'drafting' CHECK (status IN (
    'drafting',
    'verifying',
    'awaiting_proof',
    'approved',
    'scheduled',
    'published',
    'rejected',
    'escalated'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  deliverable_id UUID NOT NULL REFERENCES public.deliverables(id) ON DELETE CASCADE,
  version INTEGER NOT NULL CHECK (version > 0),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  model TEXT NOT NULL,
  playbook_version INTEGER NOT NULL CHECK (playbook_version > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (deliverable_id, version)
);

CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  draft_id UUID NOT NULL REFERENCES public.drafts(id) ON DELETE CASCADE,
  result TEXT NOT NULL CHECK (result IN ('pass', 'fail')),
  reasons TEXT[] NOT NULL DEFAULT '{}',
  rubric_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  deliverable_id UUID NOT NULL REFERENCES public.deliverables(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  action TEXT NOT NULL CHECK (action IN ('approve', 'edit', 'reject')),
  edit_diff TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES public.client_accounts(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL,
  actor_label TEXT NOT NULL,
  type TEXT NOT NULL,
  subject_ref TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS client_accounts_tenant_id_idx ON public.client_accounts (tenant_id);
CREATE INDEX IF NOT EXISTS playbooks_tenant_account_idx ON public.playbooks (tenant_id, account_id);
CREATE INDEX IF NOT EXISTS deliverables_tenant_account_idx ON public.deliverables (tenant_id, account_id);
CREATE INDEX IF NOT EXISTS deliverables_status_idx ON public.deliverables (tenant_id, status);
CREATE INDEX IF NOT EXISTS drafts_tenant_deliverable_idx ON public.drafts (tenant_id, deliverable_id);
CREATE INDEX IF NOT EXISTS verifications_tenant_draft_idx ON public.verifications (tenant_id, draft_id);
CREATE INDEX IF NOT EXISTS approvals_tenant_deliverable_idx ON public.approvals (tenant_id, deliverable_id);
CREATE INDEX IF NOT EXISTS events_tenant_account_created_idx ON public.events (tenant_id, account_id, created_at);
CREATE INDEX IF NOT EXISTS events_subject_ref_created_idx ON public.events (subject_ref, created_at);

CREATE OR REPLACE FUNCTION public.galley_touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS galley_deliverables_updated_at ON public.deliverables;
CREATE TRIGGER galley_deliverables_updated_at
  BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE FUNCTION public.galley_touch_updated_at();

-- The event log is append-only. Corrections must be represented by a new event
-- rather than rewriting or deleting prior evidence.
CREATE OR REPLACE FUNCTION public.prevent_galley_event_mutation()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Galley events are append-only; append a correcting event instead';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_galley_event_update ON public.events;
CREATE TRIGGER prevent_galley_event_update
  BEFORE UPDATE OR DELETE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.prevent_galley_event_mutation();

ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.events IS 'Append-only Galley chain-of-custody log. UPDATE and DELETE are rejected by trigger.';
COMMENT ON TABLE public.approvals IS 'Recorded human proof decisions. An approve action is required before scheduling or publishing.';

-- Phase 2 intentionally ships the secure default: RLS is enabled with no
-- browser-facing policies. Tenant membership and strict per-tenant policies
-- must be added before these tables are accessed outside trusted server code.

