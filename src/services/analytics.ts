/**
 * Rastreamento de cliques de conversão (WhatsApp).
 *
 * Não carrega nenhum script de terceiros: apenas despacha o evento para
 * GA4 (window.gtag) e/ou Plausible (window.plausible) se estiverem
 * instalados no index.html. Sem nenhum dos dois, é um no-op silencioso.
 * Nenhum dado pessoal é enviado — só a origem do clique.
 */

export type OrigemWhatsApp =
  | 'hero'
  | 'navbar'
  | 'navbar_mobile'
  | 'dock_mobile'
  | 'head_spa'
  | 'servico_card'
  | 'servico_drawer'
  | 'gift_card'
  | 'rodape_recepcao'
  | 'rodape_canais';

declare global {
  interface Window {
    gtag?: (command: 'event', eventName: string, params?: Record<string, string>) => void;
    plausible?: (eventName: string, options?: { props?: Record<string, string> }) => void;
  }
}

export const trackWhatsAppClick = (origem: OrigemWhatsApp, servico?: string): void => {
  const params: Record<string, string> = { origem };
  if (servico) params.servico = servico;

  window.gtag?.('event', 'whatsapp_click', params);
  window.plausible?.('WhatsApp Click', { props: params });
};
