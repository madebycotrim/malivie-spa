/// <reference types="@cloudflare/workers-types" />

import {
  Env,
  getClientIp,
  checkRateLimit,
  checkIdempotency,
  buildIdempotencyStatement,
  generateSecureToken,
  SESSION_TTL_SECONDS,
} from './_utils';

interface CredentialRow {
  key: string;
  hash: string;
  salt: string;
  updated_at: string;
}

const PASSWORD_KEY = 'editor_password';
const PBKDF2_ITERATIONS = 100000;

// Proteção contra brute force: Máximo de 10 tentativas por minuto por IP
const AUTH_RATE_LIMIT_MAX = 10;
const AUTH_RATE_LIMIT_WINDOW = 60;

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

// POST /api/auth — Autenticação com emissão de sessão segura no D1
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Serviço de dados temporariamente indisponível' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Rate Limiting anti brute-force
    const clientIp = getClientIp(request);
    const rate = await checkRateLimit(
      env,
      clientIp,
      'auth:attempt',
      AUTH_RATE_LIMIT_MAX,
      AUTH_RATE_LIMIT_WINDOW
    );

    if (!rate.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Muitas tentativas de autenticação. Por segurança, aguarde antes de tentar novamente.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rate.retryAfter),
            'X-RateLimit-Limit': String(AUTH_RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rate.resetAt),
          },
        }
      );
    }

    // 2. Idempotência opcional
    const idempotencyKey =
      request.headers.get('Idempotency-Key') || request.headers.get('x-idempotency-key');
    const replayResponse = await checkIdempotency(env, idempotencyKey);
    if (replayResponse) {
      return replayResponse;
    }

    const body: any = await request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Corpo da requisição inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const action = body.action;

    // 3. Busca ou inicializa as credenciais existentes
    let credential = await env.DB.prepare(
      'SELECT key, hash, salt FROM auth_credentials WHERE key = ?'
    ).bind(PASSWORD_KEY).first<CredentialRow>();

    // Inicialização segura a partir de variável de ambiente (obrigatória)
    if (!credential) {
      const initialPassword = env.ADMIN_INITIAL_PASSWORD?.trim();
      if (!initialPassword || initialPassword.length < 8) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Configuração do servidor incompleta: ADMIN_INITIAL_PASSWORD deve ser definida no painel do Cloudflare Pages com no mínimo 8 caracteres.',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const initial = await hashPassword(initialPassword);
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

    // AÇÃO A: Verificar Senha & Emitir Sessão Segura
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

      if (!isMatch) {
        return new Response(
          JSON.stringify({ success: false, error: 'Senha incorreta' }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              'X-RateLimit-Limit': String(AUTH_RATE_LIMIT_MAX),
              'X-RateLimit-Remaining': String(rate.remaining),
              'X-RateLimit-Reset': String(rate.resetAt),
            },
          }
        );
      }

      // Emite novo token de sessão com 256 bits de entropia
      const sessionToken = generateSecureToken();
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;

      await env.DB.prepare(
        `INSERT INTO auth_sessions (token, expires_at)
         VALUES (?, ?)`
      ).bind(sessionToken, expiresAt).run();

      return new Response(
        JSON.stringify({
          success: true,
          token: sessionToken,
          expiresAt,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': String(AUTH_RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': String(rate.remaining),
            'X-RateLimit-Reset': String(rate.resetAt),
          },
        }
      );
    }

    // AÇÃO B: Logout e Invalidação de Sessão Específica
    if (action === 'logout') {
      const authHeader = request.headers.get('Authorization') || '';
      if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7).trim();
        if (token) {
          await env.DB.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(token).run().catch(() => {});
        }
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Sessão encerrada com sucesso' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // AÇÃO C: Alterar Senha (com invalidação de todas as sessões anteriores)
    if (action === 'change-password') {
      const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword.trim() : '';
      const newPassword = typeof body.newPassword === 'string' ? body.newPassword.trim() : '';

      if (!currentPassword || !newPassword) {
        return new Response(
          JSON.stringify({ success: false, error: 'Senha atual e nova senha são obrigatórias' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (newPassword.length < 8) {
        return new Response(
          JSON.stringify({ success: false, error: 'A nova senha deve ter no mínimo 8 caracteres' }),
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

      const updateStmt = env.DB.prepare(
        `UPDATE auth_credentials
         SET hash = ?, salt = ?, updated_at = datetime('now')
         WHERE key = ?`
      ).bind(nextCred.hash, nextCred.salt, PASSWORD_KEY);

      // Invalida TODAS as sessões ativas existentes
      const invalidateSessionsStmt = env.DB.prepare('DELETE FROM auth_sessions');

      // Cria imediatamente nova sessão para o usuário que realizou a troca
      const newSessionToken = generateSecureToken();
      const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
      const newSessionStmt = env.DB.prepare(
        `INSERT INTO auth_sessions (token, expires_at)
         VALUES (?, ?)`
      ).bind(newSessionToken, expiresAt);

      const responsePayload = JSON.stringify({
        success: true,
        message: 'Senha atualizada com sucesso no Cloudflare D1',
        token: newSessionToken,
        expiresAt,
      });

      const statements: D1PreparedStatement[] = [
        updateStmt,
        invalidateSessionsStmt,
        newSessionStmt,
      ];

      if (idempotencyKey) {
        statements.push(
          buildIdempotencyStatement(
            env,
            idempotencyKey,
            '/api/auth:change',
            200,
            responsePayload
          )
        );
      }

      // Execução atômica no D1
      await env.DB.batch(statements);

      return new Response(responsePayload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(AUTH_RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
          ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
        },
      });
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
