/// <reference types="@cloudflare/workers-types" />

import {
  Env,
  getClientIp,
  checkRateLimit,
  checkIdempotency,
  buildIdempotencyStatement,
  validateSession,
  validateContentPayload,
  VALID_ID_REGEX,
} from './_utils';

interface ContentRow {
  id: string;
  content: string;
  version: number;
  updated_at: string;
}

const CONTENT_RATE_LIMIT_MAX = 60; // 60 requisições
const CONTENT_RATE_LIMIT_WINDOW = 60; // por minuto
const MAX_BATCH_ENTRIES = 100; // Máximo de 100 textos por requisição em lote

// GET /api/content — Retorna todos os textos salvos no D1 (leitura pública)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Serviço temporariamente indisponível',
          overrides: {},
        }),
        {
          status: 503,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // Rate Limiting
    const clientIp = getClientIp(request);
    const rate = await checkRateLimit(
      env,
      clientIp,
      'content:get',
      CONTENT_RATE_LIMIT_MAX * 2,
      CONTENT_RATE_LIMIT_WINDOW
    );

    if (!rate.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de requisições excedido. Tente novamente mais tarde.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rate.retryAfter),
            'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX * 2),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rate.resetAt),
          },
        }
      );
    }

    const { results } = await env.DB.prepare(
      'SELECT id, content, version FROM content_overrides'
    ).all<ContentRow>();

    const overrides: Record<string, string> = {};
    const versions: Record<string, number> = {};

    if (results && Array.isArray(results)) {
      for (const row of results) {
        if (row && typeof row.id === 'string' && typeof row.content === 'string') {
          overrides[row.id] = row.content;
          versions[row.id] = typeof row.version === 'number' ? row.version : 1;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        overrides,
        versions,
        count: Object.keys(overrides).length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
          'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX * 2),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
        },
      }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 GET Error]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno ao consultar textos customizados',
        overrides: {},
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// POST /api/content — Salva textos com AUTORIZAÇÃO OBRIGATÓRIA, validação e atomicidade
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Serviço de banco de dados indisponível',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 1. Autorização Obrigatória (Valida sessão do editor no servidor)
    const sessionAuth = await validateSession(env, request);
    if (!sessionAuth.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: sessionAuth.error || 'Acesso não autorizado',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Rate Limiting por IP
    const clientIp = getClientIp(request);
    const rate = await checkRateLimit(
      env,
      clientIp,
      'content:write',
      CONTENT_RATE_LIMIT_MAX,
      CONTENT_RATE_LIMIT_WINDOW
    );

    if (!rate.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de requisições excedido. Aguarde alguns segundos.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rate.retryAfter),
            'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rate.resetAt),
          },
        }
      );
    }

    // 3. Idempotência
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

    // CASO A: Salvamento em lote ({ overrides: { [id]: content } })
    if (body.overrides && typeof body.overrides === 'object') {
      const rawEntries = Object.entries(body.overrides);

      if (rawEntries.length === 0) {
        return new Response(
          JSON.stringify({ success: true, updated: 0 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      if (rawEntries.length > MAX_BATCH_ENTRIES) {
        return new Response(
          JSON.stringify({
            success: false,
            error: `Lote excede o tamanho máximo permitido de ${MAX_BATCH_ENTRIES} itens`,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Validação individual de cada par id/conteúdo
      const statements: D1PreparedStatement[] = [];
      for (const [key, val] of rawEntries) {
        const check = validateContentPayload(key, val);
        if (!check.valid) {
          return new Response(
            JSON.stringify({ success: false, error: `Item '${key}': ${check.error}` }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          );
        }

        statements.push(
          env.DB.prepare(
            `INSERT INTO content_overrides (id, content, version, updated_at)
             VALUES (?, ?, 1, datetime('now'))
             ON CONFLICT(id) DO UPDATE SET
               content = excluded.content,
               version = content_overrides.version + 1,
               updated_at = datetime('now')`
          ).bind(key.trim(), String(val))
        );
      }

      const responsePayload = JSON.stringify({ success: true, updated: statements.length });

      if (idempotencyKey) {
        statements.push(
          buildIdempotencyStatement(
            env,
            idempotencyKey,
            '/api/content',
            200,
            responsePayload
          )
        );
      }

      // Execução 100% ATÔMICA via env.DB.batch
      await env.DB.batch(statements);

      return new Response(responsePayload, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rate.remaining),
          'X-RateLimit-Reset': String(rate.resetAt),
          ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
        },
      });
    }

    // CASO B: Salvamento individual ({ id, content })
    const { id, content } = body;
    const checkSingle = validateContentPayload(id, content);
    if (!checkSingle.valid) {
      return new Response(
        JSON.stringify({ success: false, error: checkSingle.error }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanId = String(id).trim();

    const updateStatement = env.DB.prepare(
      `INSERT INTO content_overrides (id, content, version, updated_at)
       VALUES (?, ?, 1, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         content = excluded.content,
         version = content_overrides.version + 1,
         updated_at = datetime('now')`
    ).bind(cleanId, content);

    const responsePayload = JSON.stringify({ success: true, id: cleanId });
    const statements: D1PreparedStatement[] = [updateStatement];

    if (idempotencyKey) {
      statements.push(
        buildIdempotencyStatement(
          env,
          idempotencyKey,
          '/api/content',
          200,
          responsePayload
        )
      );
    }

    // Execução atômica em batch
    await env.DB.batch(statements);

    return new Response(responsePayload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(rate.remaining),
        'X-RateLimit-Reset': String(rate.resetAt),
        ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
      },
    });
  } catch (error: any) {
    console.error('[Cloudflare D1 POST Error]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno ao salvar dados no servidor',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/content — Remove override com AUTORIZAÇÃO OBRIGATÓRIA
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Serviço de dados indisponível' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Autorização Obrigatória (Valida sessão do editor no servidor)
    const sessionAuth = await validateSession(env, request);
    if (!sessionAuth.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: sessionAuth.error || 'Acesso não autorizado',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 2. Rate Limiting por IP
    const clientIp = getClientIp(request);
    const rate = await checkRateLimit(
      env,
      clientIp,
      'content:delete',
      CONTENT_RATE_LIMIT_MAX,
      CONTENT_RATE_LIMIT_WINDOW
    );

    if (!rate.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Limite de requisições excedido. Aguarde alguns segundos.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(rate.retryAfter),
            'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(rate.resetAt),
          },
        }
      );
    }

    // 3. Idempotência
    const idempotencyKey =
      request.headers.get('Idempotency-Key') || request.headers.get('x-idempotency-key');
    const replayResponse = await checkIdempotency(env, idempotencyKey);
    if (replayResponse) {
      return replayResponse;
    }

    const body: any = await request.json();
    const id = body?.id;

    if (!id || typeof id !== 'string' || !VALID_ID_REGEX.test(id.trim())) {
      return new Response(
        JSON.stringify({ success: false, error: 'Identificador (id) inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanId = id.trim();
    const deleteStmt = env.DB.prepare(
      'DELETE FROM content_overrides WHERE id = ?'
    ).bind(cleanId);

    const responsePayload = JSON.stringify({ success: true, id: cleanId });
    const statements: D1PreparedStatement[] = [deleteStmt];

    if (idempotencyKey) {
      statements.push(
        buildIdempotencyStatement(
          env,
          idempotencyKey,
          '/api/content',
          200,
          responsePayload
        )
      );
    }

    // Execução atômica em batch
    await env.DB.batch(statements);

    return new Response(responsePayload, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': String(CONTENT_RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(rate.remaining),
        'X-RateLimit-Reset': String(rate.resetAt),
        ...(idempotencyKey ? { 'X-Idempotency-Key': idempotencyKey } : {}),
      },
    });
  } catch (error: any) {
    console.error('[Cloudflare D1 DELETE Error]:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno ao remover item' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
