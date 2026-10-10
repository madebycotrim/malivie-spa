/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

interface ContentRow {
  id: string;
  content: string;
  updated_at: string;
}

// GET /api/content — Retorna todos os textos salvos no D1
export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Binding DB não configurado no Cloudflare D1',
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
      'SELECT id, content FROM content_overrides'
    ).all<ContentRow>();

    const overrides: Record<string, string> = {};
    if (results && Array.isArray(results)) {
      for (const row of results) {
        if (row && typeof row.id === 'string' && typeof row.content === 'string') {
          overrides[row.id] = row.content;
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        overrides,
        count: Object.keys(overrides).length,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 GET Error]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao consultar o banco D1',
        overrides: {},
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};

// POST /api/content — Salva ou atualiza um texto ou lote no D1
export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Binding DB não configurado no Cloudflare D1',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body: any = await request.json();
    if (!body || typeof body !== 'object') {
      return new Response(
        JSON.stringify({ success: false, error: 'Corpo da requisição inválido' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Caso seja salvamento em lote: { overrides: { [id]: content } }
    if (body.overrides && typeof body.overrides === 'object') {
      const entries = Object.entries(body.overrides).filter(
        ([key, val]) => typeof key === 'string' && typeof val === 'string'
      );

      if (entries.length === 0) {
        return new Response(
          JSON.stringify({ success: true, updated: 0 }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const statements = entries.map(([id, content]) =>
        env.DB.prepare(
          `INSERT INTO content_overrides (id, content, updated_at)
           VALUES (?, ?, datetime('now'))
           ON CONFLICT(id) DO UPDATE SET
             content = excluded.content,
             updated_at = datetime('now')`
        ).bind(id.trim(), String(content))
      );

      await env.DB.batch(statements);

      return new Response(
        JSON.stringify({ success: true, updated: entries.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Caso seja salvamento individual: { id, content }
    const { id, content } = body;
    if (!id || typeof id !== 'string' || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campos id e content são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.DB.prepare(
      `INSERT INTO content_overrides (id, content, updated_at)
       VALUES (?, ?, datetime('now'))
       ON CONFLICT(id) DO UPDATE SET
         content = excluded.content,
         updated_at = datetime('now')`
    ).bind(id.trim(), content).run();

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 POST Error]:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Erro ao persistir no banco D1',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// DELETE /api/content — Remove um texto restaurando ao padrão
export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    if (!env.DB) {
      return new Response(
        JSON.stringify({ success: false, error: 'Binding DB não configurado' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body: any = await request.json();
    const id = body?.id;

    if (!id || typeof id !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Campo id é obrigatório' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await env.DB.prepare(
      'DELETE FROM content_overrides WHERE id = ?'
    ).bind(id.trim()).run();

    return new Response(
      JSON.stringify({ success: true, id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('[Cloudflare D1 DELETE Error]:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Erro ao deletar no D1' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
