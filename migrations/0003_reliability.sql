-- Migration: 0003_reliability.sql
-- Idempotência, Rate Limit e Versionamento Concorrente no Cloudflare D1

-- 1. Tabela de Idempotência para suporte ao header Idempotency-Key
CREATE TABLE IF NOT EXISTS idempotency_keys (
  key TEXT PRIMARY KEY,
  endpoint TEXT NOT NULL,
  response_status INTEGER NOT NULL,
  response_body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_idempotency_keys_created ON idempotency_keys(created_at);

-- 2. Tabela de Rate Limit por IP e rota
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);

-- 3. Versionamento otimista para controle de concorrência e race condition
ALTER TABLE content_overrides ADD COLUMN version INTEGER NOT NULL DEFAULT 1;
