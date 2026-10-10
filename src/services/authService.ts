/**
 * Serviço de Autenticação Segura no Cloudflare D1
 * Realiza verificação e alteração de senha de forma criptografada.
 */

const AUTH_TIMEOUT_MS = 6000;

interface AuthVerifyResponse {
  success: boolean;
  error?: string;
}

interface AuthChangeResponse {
  success: boolean;
  message?: string;
  error?: string;
}

async function fetchAuthWithTimeout(url: string, body: unknown, timeoutMs = AUTH_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
 * Verifica a senha de acesso ao modo editor
 */
export async function verifyRemotePassword(password: string): Promise<boolean> {
  try {
    const response = await fetchAuthWithTimeout('/api/auth', {
      action: 'verify',
      password,
    });

    if (response.status === 200) {
      const data: AuthVerifyResponse = await response.json();
      return Boolean(data.success);
    }
    return false;
  } catch (error: unknown) {
    console.warn('[Auth Service] Falha ao verificar senha no Cloudflare D1:', error);
    return false;
  }
}

/**
 * Altera a senha no banco de dados Cloudflare D1
 */
export async function changeRemotePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetchAuthWithTimeout('/api/auth', {
      action: 'change-password',
      currentPassword,
      newPassword,
    });

    const data: AuthChangeResponse = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Não foi possível alterar a senha',
      };
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
