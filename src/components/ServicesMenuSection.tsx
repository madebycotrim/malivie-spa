import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, MessageCircle, Star } from 'lucide-react';
import { ServiceItem } from '../types';
import { SERVICES_LIST, SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { ServiceDrawer } from './ServiceDrawer';

type MenuCollectionKey = 'todos' | 'head-spa' | 'massagens-corporais' | 'day-spa';

export const ServicesMenuSection: React.FC = () => {
  const [selectedCollection, setSelectedCollection] = useState<MenuCollectionKey>('todos');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const collections: { key: MenuCollectionKey; label: string }[] = [
    { key: 'todos', label: 'Todos os Rituais' },
    { key: 'head-spa', label: 'Head SPA Coreano' },
    { key: 'massagens-corporais', label: 'Massagens & Terapias' },
    { key: 'day-spa', label: 'Day SPA & Imersões' },
  ];

  const filteredServices = SERVICES_LIST.filter((item) => {
    if (selectedCollection === 'todos') return true;
    if (selectedCollection === 'head-spa') return item.category === 'head-spa';
    if (selectedCollection === 'massagens-corporais') {
      return (
        item.category === 'massagens' ||
        item.category === 'pedras-quentes' ||
        item.category === 'spa-pes' ||
        item.category === 'acupuntura'
      );
    }
    if (selectedCollection === 'day-spa') {
      return item.category === 'day-spa' || item.category === 'planos-horas';
    }
    return true;
  });

  const handleOpenDetails = (service: ServiceItem) => {
    setSelectedService(service);
    setIsDrawerOpen(true);
  };

  return (
    <section id="menu-rituais" className="relative py-28 sm:py-36 bg-[#FBF9F6] text-[#2C2C2C] overflow-hidden">
      {/* Decorative Subtle Ambient Blobs */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-[#F0EAE1] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-[#D3B8AA]/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EAE1] text-[#7A8B7B] border border-[#7A8B7B]/20 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Cardápio de Experiências
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C2C2C] font-light leading-tight"
          >
            Menu de <span className="italic font-normal text-[#7A8B7B]">Rituais & Cuidados</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-sm sm:text-base text-[#555555] font-sans max-w-2xl mx-auto leading-relaxed"
          >
            Sessões individuais em salas privativas com acústica acolhedora, Welcome Drink artesanal em cristal e atendimento exclusivo pelas terapeutas Andressa e Luciana.
          </motion.p>
        </div>

        {/* Cohesive Collections Tabs Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-12 px-2">
          {collections.map((cat) => {
            const isActive = selectedCollection === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCollection(cat.key)}
                className={`relative px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#121C16] text-[#F3EFE6] shadow-[0_4px_20px_rgba(18,28,22,0.25)]'
                    : 'bg-[#F0EAE1] hover:bg-[#E8E0D5] text-[#2C2C2C]/80 border border-transparent hover:border-[#7A8B7B]/30'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/50 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Services Grid with Full Card Affordance */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredServices.map((service) => (
              <motion.article
                layout
                key={service.id}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenDetails(service)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenDetails(service);
                  }
                }}
                initial={{ opacity: 0, scale: 0.96, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.5, ease: EASE_ORGANIC }}
                className="group relative rounded-3xl bg-[#F0EAE1]/65 hover:bg-[#F0EAE1] border border-[#E8E0D5] hover:border-[#7A8B7B]/50 hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(18,28,22,0.1)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between overflow-hidden cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-[#7A8B7B]/40"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#18251E]">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121C16]/60 via-transparent to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#121C16]/85 backdrop-blur-md text-[10px] uppercase font-sans tracking-widest text-[#F3EFE6] font-semibold border border-white/10">
                      {service.categoryLabel}
                    </span>
                    {service.popular && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D4AF37] text-[10px] uppercase font-sans tracking-widest text-[#121C16] font-bold shadow-md">
                        <Star className="w-2.5 h-2.5 fill-[#121C16]" />
                        Destaque
                      </span>
                    )}
                  </div>

                  {/* Duration Pill */}
                  <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121C16]/85 backdrop-blur-md text-xs text-[#D4AF37] border border-[#D4AF37]/30">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{service.duration}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl text-[#2C2C2C] group-hover:text-[#121C16] transition-colors leading-snug">
                      {service.name}
                    </h3>
                    <p className="font-serif italic text-sm text-[#7A8B7B] mt-1">
                      {service.tagline}
                    </p>

                    {/* Sensory Highlight Pill (Replaces generic price tags) */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[#E8E0D5] text-[#7A8B7B] text-xs font-sans font-medium mt-2.5 shadow-2xs max-w-full">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                      <span className="truncate">
                        {service.includedItems[0] || 'Experiência sensorial completa'}
                      </span>
                    </div>

                    <p className="font-sans text-xs sm:text-sm text-[#555555] mt-3 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Row */}
                  <div className="pt-4 border-t border-[#E8E0D5] flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-wider text-[#121C16] group-hover:text-[#7A8B7B] transition-colors">
                      <span>Conhecer Ritual</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover:translate-x-1 transition-transform duration-300" />
                    </span>

                    <a
                      href={SPA_BUSINESS_DATA.whatsapp.formatServiceUrl(service.name)}
                      onClick={(e) => {
                        e.stopPropagation();
                        trackWhatsAppClick('servico_card', service.name);
                      }}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-full bg-[#7A8B7B] hover:bg-[#677868] text-[#121C16] transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 flex-shrink-0"
                      title={`Agendar ${service.name} direto no WhatsApp`}
                      aria-label={`Agendar ${service.name} direto no WhatsApp`}
                    >
                      <MessageCircle className="w-4 h-4 text-[#121C16]" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Concierge Banner de Transparência de Investimento & Acolhimento */}
        <div className="mt-16 sm:mt-20 max-w-4xl mx-auto p-7 sm:p-9 rounded-3xl bg-gradient-to-br from-[#F0EAE1] via-[#EFE8DF] to-[#E8E0D5] border border-[#D3B8AA]/60 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_35px_rgba(18,28,22,0.06)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 text-center sm:text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#7A8B7B]/30 text-[11px] font-sans font-semibold uppercase tracking-[0.2em] text-[#7A8B7B]">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>Atendimento Concierge & Valores</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#2C2C2C] font-light leading-snug">
              Tabela da Temporada & Agendamento Privativo
            </h3>
            <p className="text-xs sm:text-sm text-[#555555] font-sans max-w-xl leading-relaxed">
              Todas as sessões são privativas e já incluem taça de boas-vindas, toalhas aquecidas, roupão bordado e cerimonial do chá. Fale com a recepção para consultar horários livres e receber a tabela completa sem compromisso.
            </p>
          </div>

          <a
            href={SPA_BUSINESS_DATA.whatsapp.pricingInquiryUrl ? SPA_BUSINESS_DATA.whatsapp.pricingInquiryUrl() : SPA_BUSINESS_DATA.whatsapp.defaultUrl}
            onClick={() => trackWhatsAppClick('menu_tabela_valores')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 relative z-10 inline-flex items-center justify-center gap-2.5 py-3.5 px-7 rounded-full bg-[#121C16] hover:bg-[#1C2C22] text-[#F3EFE6] text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-[0_10px_25px_rgba(18,28,22,0.25)] hover:shadow-[0_12px_30px_rgba(18,28,22,0.35)] hover:scale-[1.02] active:scale-98 group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
            <span>Consultar Tabela no WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Slide-Over Drawer Integration */}
      <ServiceDrawer
        service={selectedService}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </section>
  );
};
