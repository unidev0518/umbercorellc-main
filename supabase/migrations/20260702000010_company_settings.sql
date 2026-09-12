-- Company settings (single row)
CREATE TABLE company_settings (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name      text NOT NULL DEFAULT 'Axovernet',
  logo_url          text,
  address           text,
  city              text,
  state             text,
  zip               text,
  country           text NOT NULL DEFAULT 'US',
  phone             text,
  email             text,
  website           text,
  -- Bank details (shown on invoices)
  bank_name         text,
  account_holder    text,
  account_number    text,
  routing_number    text,
  iban              text,
  swift_bic         text,
  paypal_email      text,
  -- Invoice defaults
  tax_id            text,
  payment_terms     text NOT NULL DEFAULT 'Net 30',
  invoice_notes     text,
  invoice_footer    text,
  updated_at        timestamptz DEFAULT now()
);

-- Seed one row so we always have settings
INSERT INTO company_settings (company_name) VALUES ('Axovernet') ON CONFLICT DO NOTHING;

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_settings" ON company_settings
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
