-- Rebrand company name from Axovernet to UmberCore.
-- Leaves prior migrations unchanged so applied checksums stay valid.

UPDATE company_settings
SET company_name = 'UmberCore'
WHERE company_name = 'Axovernet';

ALTER TABLE company_settings
  ALTER COLUMN company_name SET DEFAULT 'UmberCore';
