-- Galley Phase 2.5: minimal tenant ownership and RLS policies.
-- Multi-user tenant memberships are intentionally deferred. Each authenticated
-- user owns one default tenant for this narrow persistence phase.

ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS owner_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX IF NOT EXISTS tenants_owner_user_id_idx
  ON public.tenants (owner_user_id)
  WHERE owner_user_id IS NOT NULL;

DROP POLICY IF EXISTS "Tenant owners manage their tenant" ON public.tenants;
CREATE POLICY "Tenant owners manage their tenant"
  ON public.tenants FOR ALL
  USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "Tenant owners manage client accounts" ON public.client_accounts;
CREATE POLICY "Tenant owners manage client accounts"
  ON public.client_accounts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = client_accounts.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = client_accounts.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners manage playbooks" ON public.playbooks;
CREATE POLICY "Tenant owners manage playbooks"
  ON public.playbooks FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = playbooks.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = playbooks.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners manage deliverables" ON public.deliverables;
CREATE POLICY "Tenant owners manage deliverables"
  ON public.deliverables FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = deliverables.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = deliverables.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners manage drafts" ON public.drafts;
CREATE POLICY "Tenant owners manage drafts"
  ON public.drafts FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = drafts.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = drafts.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners manage verifications" ON public.verifications;
CREATE POLICY "Tenant owners manage verifications"
  ON public.verifications FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = verifications.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = verifications.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners manage approvals" ON public.approvals;
CREATE POLICY "Tenant owners manage approvals"
  ON public.approvals FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = approvals.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ))
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.tenants
      WHERE tenants.id = approvals.tenant_id
        AND tenants.owner_user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Tenant owners read events" ON public.events;
CREATE POLICY "Tenant owners read events"
  ON public.events FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = events.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Tenant owners append events" ON public.events;
CREATE POLICY "Tenant owners append events"
  ON public.events FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.tenants
    WHERE tenants.id = events.tenant_id
      AND tenants.owner_user_id = auth.uid()
  ));

COMMENT ON COLUMN public.tenants.owner_user_id IS
  'Phase 2.5 single-owner tenant boundary. Replace with tenant memberships before multi-user workspaces.';

