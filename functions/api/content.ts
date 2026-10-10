/// <reference types="@cloudflare/workers-types" />

import {
  Env,
  getClientMetadata,
  validateSession,
  validateContentPayload,
  validateSameOrigin,
  readJsonWithLimit,
  VALID_ID_REGEX,
} from './_utils';

interface ContentRow {
  id: string;
  content: string;
  version: number;
  updated_at: string;
}

const MAX_BATCH_ENTRIES = 100;

// GET /api/content — Retorna todos os textos salvos no D1 (leitura pública)
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

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

    const { results } = await env.DB.prepare(
      'SELECT id, content, version, updated_at FROM content_overrides ORDER BY id ASC'
    ).all<ContentRow>();

    const overrides: Record<string, string> = {};
    const versions: Record<string, number> = {};

    if (results && Array.isArray(results)) {
      for (const row of results) {
        if (row && typeof row.id === 'string' && typeof row.content === 'string') {
          overrides[row.id] = row.content;
          versions[row.id] = row.version || 1;
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
          'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
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

// POST /api/content — Salva textos com AUTORIZAÇÃO OBRIGATÓRIA e histórico de quem mexeu
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Serviço de banco de dados indisponível',
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Validação de CSRF / Cross-Site Origin
    const originCheck = validateSameOrigin(request);
    if (!originCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: originCheck.error }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Autorização Obrigatória (Valida sessão do editor no servidor)
    const sessionAuth = await validateSession(env, request);
    if (!sessionAuth.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: sessionAuth.error || 'Acesso não autorizado',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Limite de tamanho de payload estrito (256KB)
    const { data: body, errorResponse } = await readJsonWithLimit<any>(request, 256 * 1024);
    if (errorResponse) {
      return errorResponse;
    }

    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Corpo da requisição inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const clientMeta = getClientMetadata(request);
    const sessionToken = request.headers.get('Authorization')?.slice(7).trim() || null;

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

        const cleanKey = key.trim();
        const contentStr = String(val);

        // Atualiza o conteúdo (nativamente idempotente via ON CONFLICT)
        statements.push(
          env.DB.prepare(
            `INSERT INTO content_overrides (id, content, version, updated_at)
             VALUES (?, ?, 1, datetime('now'))
             ON CONFLICT(id) DO UPDATE SET
               content = excluded.content,
               version = content_overrides.version + 1,
               updated_at = datetime('now')`
          ).bind(cleanKey, contentStr)
        );

        // Registra quem mexeu (IP, localização, navegador, token)
        statements.push(
          env.DB.prepare(
            `INSERT INTO content_history (content_id, action, new_content, ip, location, user_agent, session_token)
             VALUES (?, 'update', ?, ?, ?, ?, ?)`
          ).bind(cleanKey, contentStr, clientMeta.ip, clientMeta.location, clientMeta.userAgent, sessionToken)
        );
      }

      // Execução 100% ATÔMICA via env.DB.batch
      await env.DB.batch(statements);

      return new Response(
        JSON.stringify({ success: true, updated: rawEntries.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
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

    const historyStatement = env.DB.prepare(
      `INSERT INTO content_history (content_id, action, new_content, ip, location, user_agent, session_token)
       VALUES (?, 'update', ?, ?, ?, ?, ?)`
    ).bind(cleanId, content, clientMeta.ip, clientMeta.location, clientMeta.userAgent, sessionToken);

    // Execução atômica em batch
    await env.DB.batch([updateStatement, historyStatement]);

    return new Response(
      JSON.stringify({ success: true, id: cleanId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
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

// DELETE /api/content — Remove override com AUTORIZAÇÃO OBRIGATÓRIA e rastreamento
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Serviço de dados indisponível' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Validação de CSRF / Cross-Site Origin
    const originCheck = validateSameOrigin(request);
    if (!originCheck.valid) {
      return new Response(
        JSON.stringify({ success: false, error: originCheck.error }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Autorização Obrigatória (Valida sessão do editor no servidor)
    const sessionAuth = await validateSession(env, request);
    if (!sessionAuth.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: sessionAuth.error || 'Acesso não autorizado',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 3. Limite de tamanho de payload (16KB)
    const { data: body, errorResponse } = await readJsonWithLimit<any>(request, 16 * 1024);
    if (errorResponse) {
      return errorResponse;
    }

    const id = body?.id;

    if (!id || typeof id !== 'string' || !VALID_ID_REGEX.test(id.trim())) {
      return new Response(
        JSON.stringify({ success: false, error: 'Identificador (id) inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const cleanId = id.trim();
    const clientMeta = getClientMetadata(request);
    const sessionToken = request.headers.get('Authorization')?.slice(7).trim() || null;

    const deleteStmt = env.DB.prepare(
      'DELETE FROM content_overrides WHERE id = ?'
    ).bind(cleanId);

    const deleteHistoryStmt = env.DB.prepare(
      `INSERT INTO content_history (content_id, action, new_content, ip, location, user_agent, session_token)
       VALUES (?, 'delete', NULL, ?, ?, ?, ?)`
    ).bind(cleanId, clientMeta.ip, clientMeta.location, clientMeta.userAgent, sessionToken);

    // Execução atômica em batch
    await env.DB.batch([deleteStmt, deleteHistoryStmt]);

    return new Response(
      JSON.stringify({ success: true, id: cleanId }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 DELETE Error]:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Erro interno ao remover customização' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
