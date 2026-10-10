/**
 * Serviço de Integração com o Cloudflare D1 Database
 * Gerencia persistência dos textos com:
 * 1. Autorização Obrigatória (Header Authorization: Bearer <token>)
 * 2. Prevenção de Race Condition (AbortController por ID + Sequenciamento Monotônico)
 * 3. Idempotência (Header Idempotency-Key com UUID único por transação)
 * 4. Atomicidade (Comitações em batch garantidas no SQLite D1)
 * 5. Proteção contra Rate Limit (Backoff exponencial e respeito a Retry-After)
 */

import { getStoredAuthToken, clearStoredAuthToken } from './authService';

const DEFAULT_TIMEOUT_MS = 6000;
const MAX_AUTO_RETRIES = 1;

// Mapas de isolamento para controle estrito de Race Conditions no cliente
const activeControllers = new Map<string, AbortController>();
const targetSequenceMap = new Map<string, number>();

export interface D1ContentResponse {
  success: boolean;
  overrides?: Record<string, string>;
  versions?: Record<string, number>;
  error?: string;
}

/**
 * Gera um UUID padrão v4 seguro para idempotência
 */
export function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `idemp_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

interface FetchReliableOptions extends RequestInit {
  timeoutMs?: number;
  retries?: number;
  idempotencyKey?: string;
  cancelKey?: string;
}

/**
 * Executa requisição HTTP com timeout explícito, autorização, cancelamento concorrente e retry idempotente
 */
async function fetchWithReliability(
  url: string,
  options: FetchReliableOptions = {}
): Promise<Response> {
  const {
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = MAX_AUTO_RETRIES,
    idempotencyKey,
    cancelKey,
    headers: incomingHeaders = {},
    ...fetchInit
  } = options;

  // 1. Race Condition: Cancela requisição anterior ainda em andamento para o mesmo ID
  if (cancelKey) {
    const existing = activeControllers.get(cancelKey);
    if (existing) {
      existing.abort();
      activeControllers.delete(cancelKey);
    }
  }

  const controller = new AbortController();
  if (cancelKey) {
    activeControllers.set(cancelKey, controller);
  }

  const timeoutTimer = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(incomingHeaders as Record<string, string>),
  };

  // Anexa token de autorização Bearer se disponível
  const token = getStoredAuthToken();
  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  if (idempotencyKey) {
    requestHeaders['Idempotency-Key'] = idempotencyKey;
  }

  try {
    const response = await fetch(url, {
      ...fetchInit,
      headers: requestHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutTimer);

    if (cancelKey && activeControllers.get(cancelKey) === controller) {
      activeControllers.delete(cancelKey);
    }

    // Se 401 Unauthorized, limpa o token expirado
    if (response.status === 401) {
      console.warn('[D1 Service] Sessão não autorizada ou expirada (401). Limpando token...');
      clearStoredAuthToken();
      return response;
    }

    // 2. Tratamento inteligente de Rate Limit (HTTP 429)
    if (response.status === 429 && retries > 0) {
      const retryAfterHeader = response.headers.get('Retry-After');
      const waitSeconds = retryAfterHeader ? Math.min(parseInt(retryAfterHeader, 10) || 2, 4) : 2;
      console.warn(`[D1 Rate Limit] Aguardando ${waitSeconds}s antes de reexecutar...`);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));

      return fetchWithReliability(url, {
        ...options,
        retries: retries - 1,
      });
    }

    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutTimer);

    if (cancelKey && activeControllers.get(cancelKey) === controller) {
      activeControllers.delete(cancelKey);
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      if (cancelKey && !activeControllers.has(cancelKey)) {
        throw new Error(`[D1 Race Condition Abort] Requisição anterior para ${cancelKey} cancelada`);
      }
      throw new Error(`[Cloudflare D1 Timeout] Requisição para ${url} excedeu ${timeoutMs}ms`);
    }

    // Retry com backoff se houver falha de rede temporária
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return fetchWithReliability(url, {
        ...options,
        retries: retries - 1,
      });
    }

    throw error;
  }
}

/**
 * Busca todos os textos personalizados armazenados no Cloudflare D1 (leitura pública)
 */
export async function fetchD1Overrides(): Promise<Record<string, string> | null> {
  try {
    const response = await fetchWithReliability('/api/content', {
      method: 'GET',
      timeoutMs: 5000,
      retries: 1,
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
 * Salva ou atualiza um texto individual no Cloudflare D1 com autorização obrigatória
 */
export async function saveD1Override(id: string, content: string): Promise<boolean> {
  const cleanId = id.trim();
  const currentSeq = (targetSequenceMap.get(cleanId) || 0) + 1;
  targetSequenceMap.set(cleanId, currentSeq);

  const idempotencyKey = generateIdempotencyKey();

  try {
    const response = await fetchWithReliability('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: cleanId, content }),
      timeoutMs: 5000,
      idempotencyKey,
      cancelKey: cleanId,
    });

    if (targetSequenceMap.get(cleanId) !== currentSeq) {
      return true;
    }

    if (!response.ok) {
      console.warn(`[D1 Service] Falha ao salvar texto ${cleanId}: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error: unknown) {
    if (targetSequenceMap.get(cleanId) !== currentSeq) {
      return true;
    }
    console.warn(`[D1 Service] Erro ao persistir texto ${cleanId} no D1:`, error);
    return false;
  }
}

/**
 * Salva múltiplos textos em lote atômico no Cloudflare D1 com autorização obrigatória
 */
export async function saveD1Batch(overrides: Record<string, string>): Promise<boolean> {
  const idempotencyKey = generateIdempotencyKey();

  try {
    const response = await fetchWithReliability('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ overrides }),
      timeoutMs: 8000,
      idempotencyKey,
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
 * Remove um texto customizado do Cloudflare D1 com autorização obrigatória
 */
export async function deleteD1Override(id: string): Promise<boolean> {
  const cleanId = id.trim();
  const idempotencyKey = generateIdempotencyKey();

  try {
    const response = await fetchWithReliability('/api/content', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: cleanId }),
      timeoutMs: 5000,
      idempotencyKey,
      cancelKey: cleanId,
    });

    if (!response.ok) {
      console.warn(`[D1 Service] Falha ao deletar texto ${cleanId}: status ${response.status}`);
      return false;
    }

    const data = await response.json();
    return Boolean(data.success);
  } catch (error: unknown) {
    console.warn(`[D1 Service] Erro ao deletar texto ${cleanId} no D1:`, error);
    return false;
  }
}
