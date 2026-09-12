-- Billing rates + auto-invoice scheduling on projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS client_rate          numeric(8,2),
  ADD COLUMN IF NOT EXISTS billing_cycle_day    integer CHECK (billing_cycle_day BETWEEN 1 AND 28),
  ADD COLUMN IF NOT EXISTS generate_days_before integer NOT NULL DEFAULT 7;

-- Invoice enhancements: tax, subtotal, auto-generated flag
ALTER TABLE invoices
  ADD COLUMN IF NOT EXISTS subtotal         numeric(12,2),
  ADD COLUMN IF NOT EXISTS tax_rate         numeric(5,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tax_amount       numeric(12,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_auto_generated boolean NOT NULL DEFAULT false;

-- RLS on invoices (service_role only — all access via API)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_invoices" ON invoices
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_invoice_items" ON invoice_items
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX IF NOT EXISTS idx_projects_billing_cycle ON projects(billing_cycle_day) WHERE billing_cycle_day IS NOT NULL;
