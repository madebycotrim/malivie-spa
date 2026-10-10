/**
 * Serviço de Integração com o Cloudflare D1 Database
 * Gerencia persistência dos textos editados com resiliência e timeouts explícitos.
 */

const DEFAULT_TIMEOUT_MS = 6000;

interface FetchOptions extends RequestInit {
  timeoutMs?: number;
}

async function fetchWithTimeout(url: string, options: FetchOptions = {}): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchInit } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchInit,
      signal: controller.signal,
    });
    clearTimeout(timer);
    return response;
  } catch (error: unknown) {
    clearTimeout(timer);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`[Cloudflare D1 Timeout] Requisição para ${url} excedeu ${timeoutMs}ms`, { cause: error });
    }
    throw error;
  }
}

export interface D1ContentResponse {
  success: boolean;
  overrides?: Record<string, string>;
  error?: string;
}

/**
 * Busca todos os textos personalizados armazenados no Cloudflare D1
 */
export async function fetchD1Overrides(): Promise<Record<string, string> | null> {
  try {
    const response = await fetchWithTimeout('/api/content', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      timeoutMs: 5000,
    });

    if (!response.ok) {
      console.warn(`[D1 Service] Status inesperado ao buscar overrides: ${response.status}`);
      return null;
    }

    const data: D1ContentResponse = await response.json();
    if (data.success && data.overrides) {
      return data.overrides;
    }
    return null;
  } catch (error: unknown) {
    console.warn('[D1 Service] Falha ao sincronizar textos com Cloudflare D1:', error);
    return null;
  }
}

/**
 * Salva ou atualiza um texto individual no Cloudflare D1
 */
export async function saveD1Override(id: string, content: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content }),
      timeoutMs: 5000,
    });

    if (!response.ok) {
      console.warn(`[D1 Service] Falha ao salvar texto ${id}: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error: unknown) {
    console.warn(`[D1 Service] Erro ao persistir texto ${id} no D1:`, error);
    return false;
  }
}

/**
 * Salva múltiplos textos em lote no Cloudflare D1
 */
export async function saveD1Batch(overrides: Record<string, string>): Promise<boolean> {
  try {
    const response = await fetchWithTimeout('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ overrides }),
      timeoutMs: 8000,
    });

    if (!response.ok) {
      console.warn(`[D1 Service] Falha ao salvar lote no D1: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error: unknown) {
    console.warn('[D1 Service] Erro ao persistir lote no Cloudflare D1:', error);
    return false;
  }
}

/**
 * Remove um texto customizado do Cloudflare D1 (restaura ao padrão)
 */
export async function deleteD1Override(id: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout('/api/content', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
      timeoutMs: 5000,
    });

    if (!response.ok) {
      console.warn(`[D1 Service] Falha ao deletar texto ${id}: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error: unknown) {
    console.warn(`[D1 Service] Erro ao deletar texto ${id} no D1:`, error);
    return false;
  }
}
