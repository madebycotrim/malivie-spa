/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ADMIN_INITIAL_PASSWORD?: string;
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
 * Obtém o endereço IP do cliente de forma segura nos headers da Cloudflare
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

export interface ClientMetadata {
  ip: string;
  location: string;
  userAgent: string;
}

/**
 * Extrai metadados completos de rastreamento (IP, Cidade/País via Cloudflare e Dispositivo)
 */
export function getClientMetadata(request: Request): ClientMetadata {
  const ip = getClientIp(request);
  const city = request.headers.get('cf-ipcity') || '';
  const region = request.headers.get('cf-region') || '';
  const country = request.headers.get('cf-ipcountry') || '';
  const parts = [city, region, country].filter(Boolean);
  const location = parts.length > 0 ? parts.join(', ') : 'Localização não identificada';
  const userAgent = (request.headers.get('user-agent') || 'Desconhecido').slice(0, 200);

  return { ip, location, userAgent };
}

/**
 * Bloqueia ataques CSRF e requisições cross-site não autorizadas em métodos mutativos
 */
export function validateSameOrigin(request: Request): { valid: boolean; error?: string } {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const fetchSite = request.headers.get('sec-fetch-site');
  if (fetchSite === 'cross-site') {
    return { valid: false, error: 'Requisições cross-site não permitidas por política de segurança.' };
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      const originHost = new URL(origin).host;
      const requestHost = new URL(request.url).host;
      if (originHost !== requestHost) {
        return { valid: false, error: 'Origem da requisição não autorizada.' };
      }
    } catch {
      return { valid: false, error: 'Cabeçalho Origin malformado.' };
    }
  }

  return { valid: true };
}

/**
 * Lê o corpo da requisição com limite estrito de bytes para prevenir DoS
 */
export async function readJsonWithLimit<T = unknown>(
  request: Request,
  maxBytes: number = 256 * 1024
): Promise<{ data?: T; errorResponse?: Response }> {
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return {
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Payload excede o tamanho máximo permitido.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }

  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).length > maxBytes) {
      return {
        errorResponse: new Response(
          JSON.stringify({ success: false, error: 'Payload excede o tamanho máximo permitido.' }),
          { status: 413, headers: { 'Content-Type': 'application/json' } }
        ),
      };
    }

    if (!text.trim()) {
      return { data: {} as T };
    }

    const data = JSON.parse(text) as T;
    return { data };
  } catch {
    return {
      errorResponse: new Response(
        JSON.stringify({ success: false, error: 'Formato JSON inválido ou corrompido.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      ),
    };
  }
}
