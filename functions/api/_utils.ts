/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ADMIN_INITIAL_PASSWORD?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
}

export const VALID_ID_REGEX = /^[a-zA-Z0-9_.\-:\[\]#]{1,120}$/;
export const MAX_CONTENT_LENGTH = 100000; // 100KB máximo por elemento
export const SESSION_TTL_SECONDS = 86400; // 24 horas

/**
 * Gera um token criptograficamente seguro com 256 bits de entropia
 */
export function generateSecureToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Valida a sessão de autorização do editor a partir do cabeçalho Authorization
 */
export async function validateSession(
  env: Env,
  request: Request
): Promise<{ valid: boolean; error?: string }> {
  const authHeader = request.headers.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    return {
      valid: false,
      error: 'Autenticação necessária. Faça login no modo editor para salvar alterações.',
    };
  }

  const token = authHeader.slice(7).trim();
  if (!token || token.length < 32) {
    return {
      valid: false,
      error: 'Token de autenticação inválido ou corrompido.',
    };
  }

  const now = Math.floor(Date.now() / 1000);

  try {
    const session = await env.DB.prepare(
      'SELECT token, expires_at FROM auth_sessions WHERE token = ?'
    ).bind(token).first<{ token: string; expires_at: number }>();

    if (!session) {
      return {
        valid: false,
        error: 'Sessão expirada ou não encontrada. Faça login novamente.',
      };
    }

    if (session.expires_at <= now) {
      // Sessão expirada
      await env.DB.prepare('DELETE FROM auth_sessions WHERE token = ?').bind(token).run().catch(() => {});
      return {
        valid: false,
        error: 'Sessão expirada por inatividade. Faça login novamente.',
      };
    }

    // Purga preguiçosa de sessões expiradas (1 a cada 30 requisições)
    if (Math.random() < 0.03) {
      env.DB.prepare('DELETE FROM auth_sessions WHERE expires_at < ?').bind(now).run().catch(() => {});
    }

    return { valid: true };
  } catch (err) {
    console.error('[Session Validation Error]:', err);
    return {
      valid: false,
      error: 'Falha ao verificar autorização no servidor.',
    };
  }
}

/**
 * Validação rigorosa do schema de ID e conteúdo de texto
 */
export function validateContentPayload(
  id: unknown,
  content: unknown
): { valid: boolean; error?: string } {
  if (typeof id !== 'string' || !id.trim()) {
    return { valid: false, error: 'O identificador do elemento (id) é obrigatório' };
  }

  const cleanId = id.trim();
  if (!VALID_ID_REGEX.test(cleanId)) {
    return {
      valid: false,
      error: 'Formato de identificador inválido. Use apenas letras, números e caracteres: _ . - : # [ ]',
    };
  }

  if (typeof content !== 'string') {
    return { valid: false, error: 'O conteúdo deve ser uma string de texto' };
  }

  if (content.length > MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: `Tamanho de texto excede o limite máximo permitido (${MAX_CONTENT_LENGTH} caracteres)`,
    };
  }

  return { valid: true };
}

/**
 * Obtém o endereço IP do cliente de forma segura nos headers da Cloudflare com validação de formato
 */
export function getClientIp(request: Request): string {
  const IP_REGEX = /^[0-9a-fA-F:.]+$/;

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    const clean = cfIp.trim();
    if (IP_REGEX.test(clean)) return clean;
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (IP_REGEX.test(first)) return first;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    const clean = realIp.trim();
    if (IP_REGEX.test(clean)) return clean;
  }

  return '127.0.0.1';
}

/**
 * Validação de Rate Limiting persistente no D1
 */
export async function checkRateLimit(
  env: Env,
  ip: string,
  endpoint: string,
  maxRequests: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `${endpoint}:${ip}`;

  try {
    const row = await env.DB.prepare(
      'SELECT count, reset_at FROM rate_limits WHERE key = ?'
    ).bind(key).first<{ count: number; reset_at: number }>();

    if (row && row.reset_at > now) {
      if (row.count >= maxRequests) {
        const retryAfter = Math.max(1, row.reset_at - now);
        return {
          allowed: false,
          remaining: 0,
          resetAt: row.reset_at,
          retryAfter,
        };
      }

      await env.DB.prepare(
        'UPDATE rate_limits SET count = count + 1 WHERE key = ?'
      ).bind(key).run();

      return {
        allowed: true,
        remaining: Math.max(0, maxRequests - (row.count + 1)),
        resetAt: row.reset_at,
        retryAfter: 0,
      };
    }

    const resetAt = now + windowSeconds;
    await env.DB.prepare(
      `INSERT INTO rate_limits (key, count, reset_at)
       VALUES (?, 1, ?)
       ON CONFLICT(key) DO UPDATE SET count = 1, reset_at = excluded.reset_at`
    ).bind(key, resetAt).run();

    if (Math.random() < 0.05) {
      env.DB.prepare('DELETE FROM rate_limits WHERE reset_at < ?').bind(now).run().catch(() => {});
    }

    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetAt,
      retryAfter: 0,
    };
  } catch (error) {
    console.warn('[RateLimit Warning] Falha ao verificar no D1, permitindo tráfego:', error);
    return {
      allowed: true,
      remaining: maxRequests,
      resetAt: now + windowSeconds,
      retryAfter: 0,
    };
  }
}

/**
 * Verifica se já existe resposta armazenada para a Idempotency-Key
 */
export async function checkIdempotency(
  env: Env,
  idempotencyKey: string | null
): Promise<Response | null> {
  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return null;
  }

  const cleanKey = idempotencyKey.trim();
  if (!cleanKey) return null;

  try {
    const row = await env.DB.prepare(
      'SELECT response_status, response_body FROM idempotency_keys WHERE key = ?'
    ).bind(cleanKey).first<{ response_status: number; response_body: string }>();

    if (row && row.response_body) {
      return new Response(row.response_body, {
        status: row.response_status,
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotent-Replay': 'true',
          'X-Idempotency-Key': cleanKey,
        },
      });
    }
  } catch (error) {
    console.warn('[Idempotency Warning] Falha ao buscar chave no D1:', error);
  }

  return null;
}

/**
 * Cria o prepared statement para registrar a chave de idempotência de forma atômica no batch
 */
export function buildIdempotencyStatement(
  env: Env,
  idempotencyKey: string,
  endpoint: string,
  status: number,
  body: string
): D1PreparedStatement {
  return env.DB.prepare(
    `INSERT INTO idempotency_keys (key, endpoint, response_status, response_body, created_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(key) DO UPDATE SET
       response_status = excluded.response_status,
       response_body = excluded.response_body`
  ).bind(idempotencyKey.trim(), endpoint, status, body);
}
