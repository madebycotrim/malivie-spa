import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { ServiceItem } from '../types';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';
import { EditableImage } from './editor/EditableImage';

interface ServiceDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDrawer: React.FC<ServiceDrawerProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.__lenis?.stop();
    } else {
      document.body.style.overflow = '';
      window.__lenis?.start();
    }
    return () => {
      document.body.style.overflow = '';
      window.__lenis?.start();
    };
  }, [isOpen]);

  if (!service) return null;

  const whatsappBookingUrl = SPA_BUSINESS_DATA.whatsapp.formatServiceUrl(service.name);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-[#121C16]/80 backdrop-blur-md cursor-pointer"
            style={{ zIndex: 99990 }}
          />

          {/* Slide-Over Drawer Container */}
          <motion.aside
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 220, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#18251E] text-[#F3EFE6] border-l border-[#F3EFE6]/15 shadow-[-20px_0_50px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden overscroll-contain"
            style={{ zIndex: 99991 }}
          >
            {/* Drawer Header */}
            <div className="relative p-6 sm:p-8 border-b border-[#F3EFE6]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#7A8B7B] font-sans font-semibold">
                  <EditableText id={`drawer.${service.id}.categoryLabel`} defaultText={`${service.categoryLabel} • Detalhes do Ritual`} as="span">
                    {service.categoryLabel} • Detalhes do Ritual
                  </EditableText>
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EFE6] font-light mt-1">
                  <EditableText id={`service.${service.id}.name`} defaultText={service.name} as="span">
                    {service.name}
                  </EditableText>
                </h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-full bg-[#121C16] text-[#F3EFE6]/70 hover:text-[#D4AF37] hover:bg-[#1E2D24] transition-colors focus:outline-none cursor-pointer"
                aria-label="Fechar gaveta de detalhes"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-8 scrollbar-thin"
            >
              {/* Photo Showcase */}
              <div className="relative rounded-2xl overflow-hidden aspect-[16/9] shadow-lg border border-[#F3EFE6]/10 bg-[#121C16]">
                <EditableImage
                  id={`service.${service.id}.image`}
                  defaultImage={service.image}
                  alt={service.name}
                  prefix={`drawer-${service.id}`}
                  className="w-full h-full object-cover object-center"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#18251E] via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121C16]/85 backdrop-blur-md text-xs text-[#D4AF37] border border-[#D4AF37]/30 z-20">
                  <EditableIcon id={`drawer.${service.id}.duration.icon`} defaultIcon="Clock" className="w-3.5 h-3.5" />
                  <span>
                    Duração:{' '}
                    <EditableText id={`service.${service.id}.duration`} defaultText={service.duration} as="span">
                      {service.duration}
                    </EditableText>
                  </span>
                </div>
              </div>

              {/* Tagline & Long Description */}
              <div className="space-y-3">
                <p className="font-serif italic text-lg sm:text-xl text-[#D4AF37]">
                  "
                  <EditableText id={`service.${service.id}.tagline`} defaultText={service.tagline} as="span">
                    {service.tagline}
                  </EditableText>
                  "
                </p>
                <div className="font-sans text-xs sm:text-sm text-[#F3EFE6]/80 leading-relaxed">
                  <EditableText id={`service.${service.id}.longDesc`} defaultText={service.longDescription} as="p">
                    {service.longDescription}
                  </EditableText>
                </div>
              </div>

              {/* Included Items / Mimos Inclusos */}
              <div className="p-5 rounded-2xl bg-[#121C16]/70 border border-[#F3EFE6]/10 space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#7A8B7B] font-semibold">
                  <EditableIcon id={`drawer.${service.id}.mimos.icon`} defaultIcon="Sparkles" className="w-4 h-4 text-[#D4AF37]" />
                  <EditableText id={`drawer.${service.id}.mimos.title`} defaultText="Mimos & Cuidados Inclusos Nesta Experiência" as="span">
                    Mimos & Cuidados Inclusos Nesta Experiência
                  </EditableText>
                </div>
                <ul className="space-y-2.5">
                  {((service.includedItems && service.includedItems.length > 0)
                    ? service.includedItems
                    : service.description && service.description.includes('•')
                    ? service.description.split('•').map((s) => s.trim()).filter(Boolean)
                    : []
                  ).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F3EFE6]/85">
                      <EditableIcon id={`drawer.${service.id}.included.${idx}.icon`} defaultIcon="Check" className="w-4 h-4 text-[#7A8B7B] flex-shrink-0 mt-0.5" />
                      <EditableText id={`service.${service.id}.included.${idx}`} defaultText={item} as="span">
                        {item}
                      </EditableText>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Humanized Therapist Highlight (Andressa e Luciana) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1E2D24] to-[#18251E] border border-[#7A8B7B]/30 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
                  <EditableIcon id={`drawer.${service.id}.therapists.icon`} defaultIcon="HeartHandshake" className="w-4 h-4 text-[#7A8B7B]" fallbackComponent={Users} />
                  <EditableText id="drawer.therapists.title" defaultText="Equipe Terapêutica Humanizada" as="span">
                    Equipe Terapêutica Humanizada
                  </EditableText>
                </div>
                <EditableText
                  id="drawer.therapists"
                  defaultText="Seu atendimento é conduzido com sensibilidade, toques acolhedores e maestria técnica pelas terapeutas **Andressa e Luciana**, garantindo um acolhimento respeitoso ao seu ritmo e conforto físico."
                  as="p"
                  className="text-xs text-[#F3EFE6]/90 leading-relaxed font-sans"
                >
                  Seu atendimento é conduzido com sensibilidade, toques acolhedores e maestria técnica pelas terapeutas **Andressa e Luciana**, garantindo um acolhimento respeitoso ao seu ritmo e conforto físico.
                </EditableText>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#7A8B7B] font-serif italic">
                  <EditableIcon id={`drawer.${service.id}.ambience.icon`} defaultIcon="Heart" className="w-3.5 h-3.5 text-[#D3B8AA]" />
                  <EditableText id="drawer.ambience.note" defaultText="Ambiente silencioso, luz âmbar (3000K) e toalhas aquecidas." as="span">
                    Ambiente silencioso, luz âmbar (3000K) e toalhas aquecidas.
                  </EditableText>
                </div>
              </div>

              {/* Chá de Despedida Ritual */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-[#121C16]/40 border border-[#F3EFE6]/5 text-xs text-[#F3EFE6]/70">
                <EditableIcon id={`drawer.${service.id}.tea.icon`} defaultIcon="Coffee" className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                <EditableText id="drawer.tea.note" defaultText="Ao término da sessão, você desfruta de um tempo livre na sala de relaxamento com chá artesanal digestivo e castanhas." as="span">
                  Ao término da sessão, você desfruta de um tempo livre na sala de relaxamento com chá artesanal digestivo e castanhas.
                </EditableText>
              </div>

              {/* Transparência de Investimento & Reserva */}
              <div className="p-5 rounded-2xl bg-[#121C16]/80 border border-[#D4AF37]/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <EditableIcon id={`drawer.${service.id}.investment.icon`} defaultIcon="Sparkles" className="w-3.5 h-3.5" />
                    <EditableText id="drawer.investment.title" defaultText="Investimento & Opções" as="span">
                      Investimento & Opções
                    </EditableText>
                  </span>
                  {service.price && (
                    <EditableText id={`service.${service.id}.price`} defaultText={service.price} as="span" className="text-xs text-[#F3EFE6] font-bold">
                      {service.price}
                    </EditableText>
                  )}
                </div>

                {/* Opções de Duração e Preço */}
                {service.priceOptions && service.priceOptions.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-white/10">
                    {service.priceOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs"
                      >
                        <div className="flex flex-col">
                          <EditableText id={`service.${service.id}.opt.${idx}.duration`} defaultText={opt.duration || 'Opção'} as="span" className="font-medium text-[#F3EFE6]">
                            {opt.duration || 'Opção'}
                          </EditableText>
                          {opt.note && (
                            <EditableText id={`service.${service.id}.opt.${idx}.note`} defaultText={opt.note} as="span" className="text-[10px] text-[#7A8B7B]">
                              {opt.note}
                            </EditableText>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5">
                          {opt.originalPrice && (
                            <EditableText id={`service.${service.id}.opt.${idx}.origPrice`} defaultText={opt.originalPrice} as="span" className="text-[11px] text-[#F3EFE6]/40 line-through">
                              {opt.originalPrice}
                            </EditableText>
                          )}
                          <EditableText id={`service.${service.id}.opt.${idx}.price`} defaultText={opt.price} as="span" className="font-bold text-[#D4AF37] text-sm">
                            {opt.price}
                          </EditableText>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {service.courtesyNote && (
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-[#7A8B7B]">
                    <EditableIcon id={`drawer.${service.id}.courtesy.icon`} defaultIcon="Sparkles" className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <EditableText id={`service.${service.id}.courtesy`} defaultText={service.courtesyNote} as="span">
                      {service.courtesyNote}
                    </EditableText>
                  </div>
                )}

                <EditableText
                  id="drawer.cancellationPolicy"
                  defaultText="Sessão privativa. Inclui toalhas aquecidas, roupão, aromaterapia e cerimonial do chá. Cancelamentos ou remarcações devem ser solicitados com no mínimo 12 horas de antecedência."
                  as="p"
                  className="text-[11px] text-[#F3EFE6]/70 leading-relaxed font-sans"
                >
                  Sessão privativa. Inclui toalhas aquecidas, roupão, aromaterapia e cerimonial do chá. Cancelamentos ou remarcações devem ser solicitados com no mínimo 12 horas de antecedência.
                </EditableText>
              </div>
            </div>

            {/* Drawer Sticky Footer with Direct Parameterized WhatsApp CTA */}
            <div className="p-6 sm:p-8 border-t border-[#F3EFE6]/10 bg-[#121C16]/90 backdrop-blur-md space-y-3">
              <a
                href={whatsappBookingUrl}
                onClick={() => trackWhatsAppClick('servico_drawer', service?.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-[#7A8B7B] hover:bg-[#677868] text-[#F3EFE6] font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_10px_25px_rgba(122,139,123,0.35)] hover:shadow-[0_14px_30px_rgba(122,139,123,0.5)] group"
              >
                <EditableIcon id={`drawer.${service.id}.whatsappCta.icon`} defaultIcon="MessageCircle" className="w-5 h-5 text-[#121C16] group-hover:scale-110 transition-transform" />
                <EditableText id="drawer.ctaBtn" defaultText="Agendar este Ritual via WhatsApp" as="span" className="text-[#121C16] font-bold">
                  Agendar este Ritual via WhatsApp
                </EditableText>
              </a>

              <p className="text-[11px] text-center text-[#F3EFE6]/65 font-sans">
                <EditableText id="drawer.footerNote" defaultText="Atendimento direto pelo canal oficial do Maliviê SPA • WhatsApp" as="span">
                  Atendimento direto pelo canal oficial do Maliviê SPA • WhatsApp
                </EditableText>
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
