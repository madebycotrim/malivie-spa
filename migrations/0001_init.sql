-- Migration: 0001_init.sql
-- Criação da tabela de textos editáveis no Cloudflare D1

CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_updated ON content_overrides(updated_at);
