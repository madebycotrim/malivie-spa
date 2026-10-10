-- Maliviê SPA — Cloudflare D1 Database Schema
-- Arquitetura Enxuta e Eficiente (4 Tabelas Essenciais)

-- 1. Armazena os textos editados em tempo real pelo modo editor
CREATE TABLE IF NOT EXISTS content_overrides (
  id TEXT PRIMARY KEY,
  content TEXT NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_content_overrides_updated ON content_overrides(updated_at);

-- 2. Tabela para autenticação segura criptografada com salt (PBKDF2/SHA-256)
CREATE TABLE IF NOT EXISTS auth_credentials (
  key TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 3. Tabela para gerenciamento de sessões com rastreamento de IP e Dispositivo
CREATE TABLE IF NOT EXISTS auth_sessions (
  token TEXT PRIMARY KEY,
  ip TEXT,
  location TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);

-- 4. Tabela de Auditoria: Histórico Completo de Quem Mexeu (IP, Localização, Dispositivo e Alterações)
CREATE TABLE IF NOT EXISTS content_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content_id TEXT NOT NULL,
  action TEXT NOT NULL, -- 'create', 'update', 'delete'
  old_content TEXT,
  new_content TEXT,
  ip TEXT NOT NULL,
  location TEXT,
  user_agent TEXT,
  session_token TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_content_history_content_id ON content_history(content_id);
CREATE INDEX IF NOT EXISTS idx_content_history_created_at ON content_history(created_at);
