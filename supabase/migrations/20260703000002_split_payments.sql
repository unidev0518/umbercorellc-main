-- Split payment methods: multiple methods per developer with percentage split
CREATE TABLE IF NOT EXISTS developer_payment_methods (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id    uuid        NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  label           text        NOT NULL DEFAULT 'Primary',
  payment_type    text        NOT NULL DEFAULT 'bank_transfer'
                              CHECK (payment_type IN ('bank_transfer', 'wise', 'paypal', 'other')),
  percent         numeric(5,2) NOT NULL DEFAULT 100
                              CHECK (percent > 0 AND percent <= 100),
  -- Bank transfer
  bank_name             text,
  account_holder_name   text,
  account_number        text,
  routing_number        text,
  iban                  text,
  swift_bic             text,
  -- Digital wallets
  paypal_email          text,
  wise_email            text,
  other_details         text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS dev_payment_methods_dev_id ON developer_payment_methods(developer_id);

ALTER TABLE developer_payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role_dev_payment_methods" ON developer_payment_methods
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
