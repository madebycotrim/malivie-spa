-- Migration: 0002_auth.sql
-- Tabela para autenticação segura criptografada com salt (PBKDF2/SHA-256)
CREATE TABLE IF NOT EXISTS auth_credentials (
  key TEXT PRIMARY KEY,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
