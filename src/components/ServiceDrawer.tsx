import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  Sparkles,
  Check,
  Coffee,
  HeartHandshake,
  Droplets
} from 'lucide-react';
import { ServiceItem } from '../types';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { trackWhatsAppClick } from '../services/analytics';
import { WhatsAppIcon } from './SocialIcons';
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

  const customWhatsAppText = `Olá! Gostaria de agendar o ritual *${service.name}* no Maliviê SPA. Como está a disponibilidade de horários?`;
  const whatsappBookingUrl = `https://wa.me/5561999569214?text=${encodeURIComponent(customWhatsAppText)}`;

  const ritualSteps = (service.ritualSteps && service.ritualSteps.length > 0)
    ? service.ritualSteps
    : [
        'Acolhimento com escalda-pés botânico e alinhamento do conforto',
        'Início do protocolo terapêutico com óleos essenciais puros',
        'Descompressão muscular profunda e harmonia sensorial',
        'Cerimonial do chá e momento livre de repouso na sala de descanso'
      ];

  const therapistsText = (service.therapists && service.therapists.length > 0)
    ? service.therapists.join(' e ')
    : 'Andressa e Luciana';

  const includedItemsList = (service.includedItems && service.includedItems.length > 0)
    ? service.includedItems
    : (service.description && service.description.includes('•'))
    ? service.description.split('•').map((s) => s.trim()).filter(Boolean)
    : [
        'Aromaterapia inclusa com óleos essenciais botânicos puros',
        'Toalhas aquecidas e ambiente sob iluminação âmbar (3000K)',
        'Escalda-pés de boas-vindas cortesia com antecedência*',
        'Cerimonial do chá artesanal digestivo e castanhas'
      ];

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay com Fade Profundo */}
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={onClose}
            className="fixed inset-0 bg-[#09100C]/85 backdrop-blur-md cursor-pointer"
            style={{ zIndex: 99990 }}
          />

          {/* Slide-Over Drawer Container (Refinado como Suíte Botânica) */}
          <motion.aside
            data-lenis-prevent
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 240, mass: 0.8 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-[#0F1913] text-[#FAF8F5] border-l border-[#D4AF37]/20 shadow-[-25px_0_60px_rgba(0,0,0,0.7)] flex flex-col justify-between overflow-hidden overscroll-contain"
            style={{ zIndex: 99991 }}
          >
            {/* 1. Header Fixo com Vidro Fosco e Fechamento Instantâneo */}
            <div className="relative px-6 sm:px-8 py-5 border-b border-white/10 bg-[#0F1913]/90 backdrop-blur-md flex items-center justify-between shrink-0 z-20">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-sans font-semibold flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <EditableText id={`drawer.${service.id}.categoryLabel`} defaultText={service.categoryLabel || 'Ritual Maliviê'} as="span">
                    {service.categoryLabel || 'Ritual Maliviê'}
                  </EditableText>
                </span>
                <h2 className="font-serif text-2xl sm:text-[1.75rem] text-[#FAF8F5] font-normal mt-0.5 truncate leading-tight">
                  <EditableText id={`service.${service.id}.name`} defaultText={service.name} as="span">
                    {service.name}
                  </EditableText>
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#D4AF37] hover:text-[#0F1913] text-[#FAF8F5]/80 transition-all flex items-center justify-center shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 active:scale-95"
                aria-label="Fechar detalhes do ritual"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2. Conteúdo com Rolagem Fluida e Design Editorial */}
            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-7 scrollbar-thin"
            >
              {/* Foto Showcase Emoldurada com Iluminação Quente */}
              <div className="relative rounded-3xl overflow-hidden aspect-[16/10] shadow-xl border border-white/10 bg-[#121C16]">
                <EditableImage
                  id={`service.${service.id}.image`}
                  defaultImage={service.image}
                  alt={service.name}
                  prefix={`drawer-${service.id}`}
                  className="w-full h-full object-cover object-center"
                  containerClassName="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1913] via-transparent to-black/20 pointer-events-none" />

                {/* Selos Flutuantes sobre a Foto */}
                <div className="absolute bottom-3.5 inset-x-3.5 flex items-center justify-between gap-2 pointer-events-none">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0F1913]/90 backdrop-blur-md text-xs font-sans text-white border border-white/15 shadow-sm">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{service.duration}</span>
                  </div>

                  {(service.popular || service.badge) && (
                    <span className="px-3 py-1.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#DFBC48] to-[#D4AF37] text-[#0F1913] text-[10px] uppercase font-sans font-bold tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap">
                      <Sparkles className="w-3 h-3 fill-[#0F1913]" />
                      <span>{service.badge || 'MAIS PROCURADO'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Descrição Completa & Imersão Sensorial */}
              <div className="space-y-4">
                {/* Frase / Tagline Poética em Destaque */}
                {service.tagline && (
                  <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 shadow-xs">
                    <p className="font-serif italic text-base sm:text-lg text-[#E5C158] leading-snug">
                      "
                      <EditableText id={`service.${service.id}.tagline`} defaultText={service.tagline} as="span">
                        {service.tagline}
                      </EditableText>
                      "
                    </p>
                  </div>
                )}

                {/* Visão Geral Terapêutica Completa */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 font-sans text-[13.5px] text-[#FAF8F5]/90 leading-relaxed">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-sans font-bold text-[#D4AF37]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Visão Geral do Ritual</span>
                  </div>
                  
                  {service.description && (
                    <div className="text-[#FAF8F5]/90 leading-relaxed font-normal">
                      <EditableText id={`service.${service.id}.desc`} defaultText={service.description} as="p">
                        {service.description}
                      </EditableText>
                    </div>
                  )}

                  {service.longDescription && service.longDescription !== service.description && (
                    <div className="text-[#FAF8F5]/75 leading-relaxed font-normal pt-1 border-t border-white/5">
                      <EditableText id={`service.${service.id}.longDesc`} defaultText={service.longDescription} as="p">
                        {service.longDescription}
                      </EditableText>
                    </div>
                  )}
                </div>

                {/* Benefícios & Efeitos Sentidos na Sessão */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-sans font-bold text-[#D4AF37]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Benefícios & Efeitos Imediatos</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 text-left">
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-sans font-semibold text-[#FAF8F5] block">🌿 Descompressão Muscular</span>
                      <span className="text-[10px] text-[#FAF8F5]/65 leading-normal block mt-1">Alívio profundo de nós de tensão, contraturas e sobrecargas posturais.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-sans font-semibold text-[#FAF8F5] block">✨ Redução do Cortisol</span>
                      <span className="text-[10px] text-[#FAF8F5]/65 leading-normal block mt-1">Desaceleração do sistema nervoso e redução imediata da ansiedade.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-sans font-semibold text-[#FAF8F5] block">🩸 Circulação & Leveza</span>
                      <span className="text-[10px] text-[#FAF8F5]/65 leading-normal block mt-1">Estímulo do fluxo sanguíneo, oxigenação tecidual e alívio do peso corporal.</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-[11px] font-sans font-semibold text-[#FAF8F5] block">🌙 Sono & Repouso Vital</span>
                      <span className="text-[10px] text-[#FAF8F5]/65 leading-normal block mt-1">Sensação prolongada de serenidade que potencializa o sono reparador.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilares da Atmosfera Botânica (Micro-Badges Sensoriais) */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
                  <Droplets className="w-4 h-4 text-[#D4AF37] mb-1.5" />
                  <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#FAF8F5]/90">Aromaterapia</span>
                  <span className="text-[9.5px] text-[#7A8B7B] mt-0.5">Óleos puros</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] mb-1.5" />
                  <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#FAF8F5]/90">Luz 3000K</span>
                  <span className="text-[9.5px] text-[#7A8B7B] mt-0.5">Toalhas mornas</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/5 flex flex-col items-center text-center">
                  <Coffee className="w-4 h-4 text-[#D4AF37] mb-1.5" />
                  <span className="text-[10px] font-sans uppercase font-bold tracking-wider text-[#FAF8F5]/90">Chá Botânico</span>
                  <span className="text-[9.5px] text-[#7A8B7B] mt-0.5">Descompressão</span>
                </div>
              </div>

              {/* Jornada Passo a Passo: Etapas do Ritual (Visual Chronological Timeline) */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Jornada do Ritual • Etapa por Etapa</span>
                </div>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-[#D4AF37] before:via-[#D4AF37]/40 before:to-[#D4AF37]/10">
                  {ritualSteps.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#0F1913] border border-[#D4AF37] text-[#D4AF37] text-[10px] font-serif font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-xs sm:text-[13px] font-sans text-[#FAF8F5]/90 font-medium leading-relaxed block">
                          {step}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mimos e Cuidados Inclusos */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3.5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans font-bold text-[#D4AF37]">
                  <Check className="w-4 h-4 text-[#D4AF37]" />
                  <span>Mimos & Confortos Inclusos</span>
                </div>

                <ul className="space-y-2.5">
                  {includedItemsList.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-[12.5px] text-[#FAF8F5]/85">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0 mt-1.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Terapeutas Responsáveis & Acolhimento Humanizado */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-[#16251B] to-[#0F1913] border border-[#D4AF37]/30 space-y-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37] shrink-0">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-[#D4AF37] block">
                      Acolhimento Humanizado
                    </span>
                    <h4 className="font-serif text-sm sm:text-base text-[#FAF8F5] font-normal">
                      Conduzido por {therapistsText}
                    </h4>
                  </div>
                </div>

                <p className="text-xs text-[#FAF8F5]/85 leading-relaxed font-sans pt-1">
                  Seu atendimento é realizado com extrema delicadeza, toques envolventes e sensibilidade anatômica, respeitando integralmente o seu ritmo, silêncio e conforto físico.
                </p>

                <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#7A8B7B] font-sans">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>Ambiente 100% privativo, iluminação âmbar suave e aromaterapia.</span>
                </div>
              </div>

              {/* Investimento & Opções de Duração */}
              <div className="p-5 sm:p-6 rounded-3xl bg-white/[0.04] border border-[#D4AF37]/35 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-[0.18em] text-[#D4AF37] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Investimento & Sessão</span>
                  </span>
                  {service.price && (
                    <span className="text-sm font-serif font-bold text-[#FAF8F5]">
                      {service.price}
                    </span>
                  )}
                </div>

                {/* Opções de Duração e Preço */}
                {service.priceOptions && service.priceOptions.length > 0 && (
                  <div className="space-y-2 pt-1 border-t border-white/10">
                    {service.priceOptions.map((opt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-2xl bg-black/30 border border-white/10 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                          <span className="font-medium text-[#FAF8F5] text-xs sm:text-[13px]">
                            {opt.duration || 'Sessão'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {opt.originalPrice && (
                            <span className="text-[11px] text-[#FAF8F5]/40 line-through">
                              {opt.originalPrice}
                            </span>
                          )}
                          <span className="font-serif font-bold text-[#D4AF37] text-sm sm:text-base">
                            {opt.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {service.courtesyNote && (
                  <div className="flex items-start gap-2 pt-1 text-[11.5px] text-[#D4AF37] bg-[#D4AF37]/10 p-3 rounded-2xl border border-[#D4AF37]/25">
                    <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{service.courtesyNote}</span>
                  </div>
                )}

                <p className="text-[11px] text-[#FAF8F5]/65 leading-relaxed font-sans pt-1">
                  Sessão privativa com toalhas aquecidas e cerimonial do chá. Cancelamento ou remarcação flexível solicitado com no mínimo 12h de antecedência.
                </p>
              </div>
            </div>

            {/* 3. Rodapé Fixo com Botão Nobre de Agendamento */}
            <div className="p-5 sm:p-6 border-t border-white/10 bg-[#0F1913]/95 backdrop-blur-md space-y-2.5 shrink-0 z-20">
              <a
                href={whatsappBookingUrl}
                onClick={() => trackWhatsAppClick('servico_drawer', service?.name)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Agendar ${service?.name || 'Ritual'} via WhatsApp`}
                className="w-full min-h-[52px] flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-[#0F1913] font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_10px_25px_rgba(212,175,55,0.35)] hover:shadow-[0_15px_35px_rgba(212,175,55,0.5)] active:scale-[0.98] cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#0F1913]" />
                <span>Agendar Ritual no WhatsApp</span>
              </a>

              <p className="text-[11px] text-center text-[#FAF8F5]/60 font-sans">
                Atendimento humanizado pelo canal oficial do Maliviê SPA
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
