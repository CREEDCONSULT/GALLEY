-- Galley Phase 2.6: persistence-level approval invariant.
-- The Phase 2 migration already makes events append-only with a trigger. RLS also
-- exposes no UPDATE/DELETE policy for events to normal app roles.

CREATE OR REPLACE FUNCTION public.require_galley_approval_before_release()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('scheduled', 'published') AND NOT EXISTS (
    SELECT 1 FROM public.approvals
    WHERE approvals.deliverable_id = NEW.id
      AND approvals.tenant_id = NEW.tenant_id
      AND approvals.action = 'approve'
  ) THEN
    RAISE EXCEPTION 'Galley deliverable cannot be scheduled or published without a recorded human approval';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS require_galley_approval_before_release ON public.deliverables;
CREATE TRIGGER require_galley_approval_before_release
  BEFORE INSERT OR UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE FUNCTION public.require_galley_approval_before_release();

REVOKE UPDATE, DELETE ON public.events FROM anon, authenticated;

COMMENT ON FUNCTION public.require_galley_approval_before_release() IS
  'Database backstop: scheduled and published states require an approve row for the same tenant and deliverable.';
