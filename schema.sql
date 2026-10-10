-- Maliviê SPA — Cloudflare D1 Database Schema
-- Armazena os textos editados em tempo real pelo modo editor

CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_updated ON content_overrides(updated_at);

-- Tabela para autenticação segura criptografada com salt (PBKDF2/SHA-256)
CREATE TABLE IF NOT EXISTS auth_credentials (
  key TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
