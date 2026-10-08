import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, Sparkles, MessageCircle, Star } from 'lucide-react';
import { ServiceCategory, ServiceItem } from '../types';
import { SERVICES_LIST, SPA_BUSINESS_DATA } from '../data/spaData';
import { ServiceDrawer } from './ServiceDrawer';

export const ServicesMenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('todos');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories: { key: ServiceCategory; label: string }[] = [
    { key: 'todos', label: 'Todos os Rituais' },
    { key: 'head-spa', label: 'Head SPA' },
    { key: 'massagens', label: 'Massagens Relaxantes' },
    { key: 'pedras-quentes', label: 'Pedras Quentes' },
    { key: 'spa-pes', label: 'Spa dos Pés' },
    { key: 'acupuntura', label: 'Acupuntura' },
    { key: 'day-spa', label: 'Rituais de Day SPA' },
    { key: 'planos-horas', label: 'Planos de Horas' },
  ];

  const filteredServices = SERVICES_LIST.filter((item) => {
    if (selectedCategory === 'todos') return true;
    return item.category === selectedCategory;
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
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0EAE1] text-[#7A8B7B] border border-[#7A8B7B]/20 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Cardápio de Experiências
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C2C2C] font-light leading-tight"
          >
            Menu de <span className="italic font-normal text-[#7A8B7B]">Rituais & Cuidados</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-sm sm:text-base text-[#555555] font-sans max-w-xl mx-auto leading-relaxed"
          >
            "Reservar um tempo pra você também é uma forma de cuidado. Permita-se viver cada minuto desse cuidado!"
          </motion.p>
        </div>

        {/* Interactive Category Tabs Filter (Spell.sh / Unlumen pill feel) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-5xl mx-auto mb-10 px-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#121C16] text-[#F3EFE6] shadow-[0_4px_20px_rgba(18,28,22,0.25)]'
                    : 'bg-[#F0EAE1] hover:bg-[#E8E0D5] text-[#2C2C2C]/80 border border-transparent hover:border-[#7A8B7B]/30'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/50 pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Official Copy Banner based on active category */}
        <div className="max-w-3xl mx-auto mb-12">
          {selectedCategory === 'massagens' || selectedCategory === 'pedras-quentes' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#F0EAE1] border border-[#7A8B7B]/30 text-center"
            >
              <h3 className="font-serif text-xl text-[#2C2C2C] mb-1">
                Massagens Relaxantes
              </h3>
              <p className="font-serif italic text-sm text-[#7A8B7B]">
                "A massagem com pedras quentes entra devagar e vai desfazendo os nós da tensão. Se você também está precisando desacelerar, talvez esse seja o seu sinal."
              </p>
            </motion.div>
          ) : selectedCategory === 'day-spa' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#F0EAE1] border border-[#D3B8AA]/40 text-center space-y-2"
            >
              <h3 className="font-serif text-xl text-[#2C2C2C]">
                Rituais de Day SPA
              </h3>
              <p className="font-serif italic text-sm text-[#7A8B7B]">
                "Reservar um tempo pra você também é uma forma de cuidado. Permita-se viver cada minuto desse cuidado!"
              </p>
              <p className="font-sans text-xs text-[#555555] border-t border-[#D3B8AA]/30 pt-2">
                "A primavera é o convite perfeito para renovar as energias, desacelerar da rotina agitada e se dedicar um momento de cuidado único."
              </p>
            </motion.div>
          ) : selectedCategory === 'planos-horas' ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#F0EAE1] border border-[#7A8B7B]/30 text-center"
            >
              <h3 className="font-serif text-xl text-[#2C2C2C] mb-1">
                Planos de Horas
              </h3>
              <p className="font-sans text-xs text-[#555555]">
                Categorias de Serviços: Head SPA, Massagens Relaxantes, Pedras Quentes, Spa dos Pés, Acupuntura, Rituais de Day SPA.
              </p>
            </motion.div>
          ) : null}
        </div>

        {/* Services Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredServices.map((service) => (
              <motion.article
                layout
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative rounded-3xl bg-[#F0EAE1]/60 hover:bg-[#F0EAE1] border border-[#E8E0D5] hover:border-[#7A8B7B]/50 transition-all duration-500 shadow-sm hover:shadow-[0_20px_45px_rgba(18,28,22,0.08)] flex flex-col justify-between overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[#18251E]">
                  <img
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
                    <p className="font-sans text-xs sm:text-sm text-[#555555] mt-3 line-clamp-3 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-[#E8E0D5] flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(service)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#121C16] hover:bg-[#18251E] text-[#F3EFE6] text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer group/btn"
                    >
                      <span>Ver Detalhes</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37] group-hover/btn:translate-x-1 transition-transform" />
                    </button>

                    <a
                      href={SPA_BUSINESS_DATA.whatsapp.formatServiceUrl(service.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-full bg-[#7A8B7B] hover:bg-[#677868] text-[#F3EFE6] transition-colors shadow-sm cursor-pointer"
                      title={`Agendar ${service.name} no WhatsApp`}
                      aria-label={`Agendar ${service.name} no WhatsApp`}
                    >
                      <MessageCircle className="w-4 h-4 text-[#121C16]" />
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
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
