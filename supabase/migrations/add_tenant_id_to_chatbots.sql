-- Add tenant_id column to chatbots table
-- This column will be used to map chatbots to tenants for the external FAQ API

ALTER TABLE chatbots ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chatbots_tenant_id ON chatbots(tenant_id);

-- Add comment for documentation
COMMENT ON COLUMN chatbots.tenant_id IS 'External tenant ID for mapping to external APIs (e.g., FAQ service)';
