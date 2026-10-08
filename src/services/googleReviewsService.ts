/**
 * Serviço de Integração e Automação de Avaliações do Google
 * Maliviê SPA • Brasília - DF
 *
 * Este módulo fornece os adaptadores e contratos para sincronização contínua
 * das avaliações do Perfil de Empresa do Google (Google Meu Negócio).
 */

export interface GoogleReviewRaw {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

export interface GooglePlaceDetailsResponse {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReviewRaw[];
  };
  status: string;
}

/**
 * OPÇÃO 1: Integração Direta via Google Places API (New)
 * 
 * Requisitos:
 * 1. Criar um projeto no Google Cloud Console (https://console.cloud.google.com/)
 * 2. Ativar a "Places API (New)"
 * 3. Gerar uma API Key com restrição de IP/HTTP Referrer
 * 4. Chamar via Backend / Edge Worker (Vercel Serverless / Cloudflare Worker)
 *    para não expor a chave de API no cliente (Regra de Segurança).
 *
 * Endpoint de chamada pelo backend:
 * GET https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJgTqnugE6WpMRf39Cn-WHvLM&fields=name,rating,reviews,user_ratings_total&language=pt-BR&key=SUA_CHAVE
 */
export async function fetchGoogleReviewsFromApi(backendEndpoint = '/api/google-reviews') {
  try {
    const response = await fetch(backendEndpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Falha ao obter avaliações do Google: ${response.statusText}`);
    }

    const data: GooglePlaceDetailsResponse = await response.json();
    return data.result;
  } catch (error) {
    console.warn('Aviso: Utilizando cache local de avaliações do Google.', error);
    return null;
  }
}

/**
 * OPÇÃO 2: Integração via SaaS Especializado (Elfsight / Trustmary / EmbedSocial)
 * 
 * É a opção mais recomendada para spas e clínicas locais porque:
 * - Sincroniza todas as 117+ avaliações automaticamente (a Google Places API gratuita limita a 5 por requisição).
 * - Permite aprovar/filtrar apenas notas 5 estrelas.
 * - Atualiza automaticamente em tempo real sem necessidade de servidor próprio.
 * 
 * Exemplo de incorporação via Script Widget:
 * <script src="https://static.elfsight.com/platform/platform.js" async></script>
 * <div class="elfsight-app-YOUR-WIDGET-ID" data-elfsight-app-lazy></div>
 */
