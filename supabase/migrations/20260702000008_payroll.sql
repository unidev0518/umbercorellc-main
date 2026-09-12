-- Developer bank / payment details
CREATE TABLE developer_bank_details (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id          uuid NOT NULL UNIQUE REFERENCES portal_users(id) ON DELETE CASCADE,
  payment_method        text NOT NULL DEFAULT 'bank_transfer'
                        CHECK (payment_method IN ('bank_transfer', 'wise', 'paypal', 'other')),
  -- Bank transfer
  bank_name             text,
  account_holder_name   text,
  account_number        text,   -- stored; display masked in UI
  routing_number        text,
  iban                  text,
  swift_bic             text,
  -- Digital wallets
  paypal_email          text,
  wise_email            text,
  -- Misc
  notes                 text,
  updated_at            timestamptz DEFAULT now()
);

-- Payroll payments issued to developers
CREATE TABLE developer_payments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id  uuid NOT NULL REFERENCES portal_users(id) ON DELETE CASCADE,
  period_start  date NOT NULL,
  period_end    date NOT NULL,
  hours         numeric(8,2) NOT NULL,
  amount        numeric(10,2) NOT NULL,
  status        text NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'paid')),
  paid_date     date,
  paid_by       uuid REFERENCES admin_users(id) ON DELETE SET NULL,
  notes         text,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX ON developer_payments(developer_id);
CREATE INDEX ON developer_payments(status);
CREATE INDEX ON developer_bank_details(developer_id);
