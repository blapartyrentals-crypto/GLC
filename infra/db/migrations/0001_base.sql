-- GLC base schema — multi-tenant via RLS
-- Each tenant row is scoped by tenant_id; RLS enforces isolation at the DB layer.

CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tenants
CREATE TABLE IF NOT EXISTS tenants (
  id            TEXT PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  profile       TEXT NOT NULL DEFAULT 'commercial',
  status        TEXT NOT NULL DEFAULT 'active',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Identities (scoped per tenant)
CREATE TABLE IF NOT EXISTS identities (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     TEXT NOT NULL REFERENCES tenants (id),
  legal_name    TEXT NOT NULL,
  external_id   TEXT,
  status        TEXT NOT NULL DEFAULT 'created',
  verified_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, external_id)
);

-- Baseline RLS policies
ALTER TABLE identities ENABLE ROW LEVEL SECURITY;
ALTER TABLE identities FORCE ROW LEVEL SECURITY;

-- Example policy: current tenant can see its own rows
-- In production, the tenant is injected via `set_config('glc.tenant_id', ...)` in a connection pooler.
CREATE POLICY identities_tenant_isolation
  ON identities
  USING (tenant_id = current_setting('glc.tenant_id', TRUE));

-- Vector embeddings for future semantic matching/recommendation
CREATE TABLE IF NOT EXISTS embeddings (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id  TEXT NOT NULL REFERENCES tenants (id),
  entity_type TEXT NOT NULL,
  entity_id  UUID NOT NULL,
  vector     vector(1536) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE embeddings FORCE ROW LEVEL SECURITY;

CREATE POLICY embeddings_tenant_isolation
  ON embeddings
  USING (tenant_id = current_setting('glc.tenant_id', TRUE));