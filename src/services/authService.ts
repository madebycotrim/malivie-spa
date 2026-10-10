/**
 * Serviço de Autenticação Segura no Cloudflare D1
 * Realiza verificação e alteração de senha com emissão de token de sessão.
 */

const AUTH_TIMEOUT_MS = 6000;
const AUTH_TOKEN_STORAGE_KEY = 'malivie_auth_session_token';

interface AuthVerifyResponse {
  success: boolean;
  token?: string;
  expiresAt?: number;
  error?: string;
}

interface AuthChangeResponse {
  success: boolean;
  message?: string;
  token?: string;
  expiresAt?: number;
  error?: string;
}

export function getStoredAuthToken(): string | null {
  try {
    return sessionStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredAuthToken(token: string): void {
  try {
    sessionStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {
    // Ignore storage errors
  }
}

export function clearStoredAuthToken(): void {
  try {
    sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

function generateAuthIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `auth_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

async function fetchAuthWithTimeout(
  url: string,
  body: unknown,
  idempotencyKey?: string,
  timeoutMs = AUTH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }

  const existingToken = getStoredAuthToken();
  if (existingToken) {
    headers['Authorization'] = `Bearer ${existingToken}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (error: unknown) {
    clearTimeout(timer);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`[Auth Service Timeout] Requisição excedeu ${timeoutMs}ms`, { cause: error });
    }
    throw error;
  }
}

/**
 * Verifica a senha de acesso e obtém token de sessão seguro
 */
export async function verifyRemotePassword(password: string): Promise<boolean> {
  try {
    const response = await fetchAuthWithTimeout('/api/auth', {
      action: 'verify',
      password,
    });

    if (response.status === 429) {
      console.warn('[Auth Service] Rate limit atingido na autenticação.');
      return false;
    }

    if (response.status === 200) {
      const data: AuthVerifyResponse = await response.json();
      if (data.success && data.token) {
        setStoredAuthToken(data.token);
        return true;
      }
      return Boolean(data.success);
    }

    // Se senha inválida, limpa token antigo
    clearStoredAuthToken();
    return false;
  } catch (error: unknown) {
    console.warn('[Auth Service] Falha ao verificar senha no Cloudflare D1:', error);
    return false;
  }
}

/**
 * Altera a senha no banco de dados Cloudflare D1 e atualiza a sessão
 */
export async function changeRemotePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const idempotencyKey = generateAuthIdempotencyKey();

  try {
    const response = await fetchAuthWithTimeout(
      '/api/auth',
      {
        action: 'change-password',
        currentPassword,
        newPassword,
      },
      idempotencyKey
    );

    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || '60';
      return {
        success: false,
        error: `Muitas tentativas de alteração. Aguarde ${retryAfter} segundos.`,
      };
    }

    const data: AuthChangeResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Não foi possível alterar a senha',
      };
    }

    if (data.token) {
      setStoredAuthToken(data.token);
    }

    return { success: true };
  } catch (error: unknown) {
    console.warn('[Auth Service] Erro ao alterar senha no Cloudflare D1:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Falha na conexão com o servidor',
    };
  }
}
