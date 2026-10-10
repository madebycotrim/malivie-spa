/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

interface CredentialRow {
  key: string;
  hash: string;
  salt: string;
  updated_at: string;
}

const PASSWORD_KEY = 'editor_password';
const DEFAULT_INITIAL_PASSWORD = 'malivie2026';
const PBKDF2_ITERATIONS = 100000;

async function hashPassword(password: string, saltHex?: string): Promise<{ hash: string; salt: string }> {
  const enc = new TextEncoder();
  const salt = saltHex
    ? Uint8Array.from(saltHex.match(/.{1,2}/g) || [], (byte) => parseInt(byte, 16))
    : crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );

  const hash = Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const saltStr = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { hash, salt: saltStr };
}

// POST /api/auth — Verifica ou altera a senha criptografada no D1
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Binding DB não configurado no Cloudflare' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: any = await request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Corpo da requisição inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const action = body.action;

    // 1. Busca ou inicializa as credenciais existentes
    let credential = await env.DB.prepare(
      'SELECT key, hash, salt FROM auth_credentials WHERE key = ?'
    ).bind(PASSWORD_KEY).first<CredentialRow>();

    // Inicialização automática caso não exista credencial ainda
    if (!credential) {
      const initial = await hashPassword(DEFAULT_INITIAL_PASSWORD);
      await env.DB.prepare(
        `INSERT INTO auth_credentials (key, hash, salt, updated_at)
         VALUES (?, ?, ?, datetime('now'))`
      ).bind(PASSWORD_KEY, initial.hash, initial.salt).run();

      credential = {
        key: PASSWORD_KEY,
        hash: initial.hash,
        salt: initial.salt,
        updated_at: new Date().toISOString(),
      };
    }

    // Ação: Verificar Senha
    if (action === 'verify') {
      const password = typeof body.password === 'string' ? body.password.trim() : '';
      if (!password) {
        return new Response(
          JSON.stringify({ success: false, error: 'Senha é obrigatória' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const computed = await hashPassword(password, credential.salt);
      const isMatch = computed.hash === credential.hash;

      return new Response(
        JSON.stringify({ success: isMatch }),
        { status: isMatch ? 200 : 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Ação: Alterar Senha
    if (action === 'change-password') {
      const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword.trim() : '';
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';

      if (!currentPassword || !newPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Senha atual e nova senha são obrigatórias' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (newPassword.length < 6) {
        return new Response(
          JSON.stringify({ success: false, error: 'A nova senha deve ter no mínimo 6 caracteres' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validação da senha atual antes de autorizar troca
      const verifyCurrent = await hashPassword(currentPassword, credential.salt);
      if (verifyCurrent.hash !== credential.hash) {
        return new Response(
          JSON.stringify({ success: false, error: 'Senha atual incorreta' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Gera novo salt e novo hash para a nova senha
      const nextCred = await hashPassword(newPassword);

      await env.DB.prepare(
        `UPDATE auth_credentials
         SET hash = ?, salt = ?, updated_at = datetime('now')
         WHERE key = ?`
      ).bind(nextCred.hash, nextCred.salt, PASSWORD_KEY).run();

      return new Response(
        JSON.stringify({ success: true, message: 'Senha atualizada com sucesso no Cloudflare D1' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Ação não reconhecida' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 Auth Error]:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno ao processar autenticação' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
