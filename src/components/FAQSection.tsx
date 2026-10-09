import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles, Droplets, CheckCircle2 } from 'lucide-react';
import { FAQ_ITEMS, SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';

export const FAQSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'todos' | 'head-spa' | 'preparacao' | 'geral'>('todos');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-quimica': true, // Primeiro item aberto por padrão para affordance imediata
  });

  const categories = [
    { key: 'todos' as const, label: 'Todas as Dúvidas' },
    { key: 'head-spa' as const, label: 'Head SPA Coreano' },
    { key: 'preparacao' as const, label: 'Preparação & Visita' },
    { key: 'geral' as const, label: 'Agendamento & Geral' },
  ];

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    if (activeCategory === 'todos') return true;
    return item.category === activeCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="relative py-28 sm:py-36 bg-[#121C16] text-[#F3EFE6] overflow-hidden border-t border-[#F3EFE6]/10">
      {/* Botanical ambient subtle halos com respiração zen */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#7A8B7B]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Tire Suas Dúvidas
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            Perguntas & <span className="italic font-normal text-[#D4AF37]">Preparo para a Visita</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/75 font-sans leading-relaxed"
          >
            Tudo o que você precisa saber para chegar tranquilo(a) e desfrutar do seu momento de desaceleração sem preocupações.
          </motion.p>
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`relative px-4 py-2 rounded-full text-xs font-sans font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/40 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    : 'bg-[#18251E]/50 hover:bg-[#18251E] text-[#F3EFE6]/70 border border-[#F3EFE6]/10'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeFaqPill"
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/50 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                )}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Minimalist Accordion List */}
        <div className="space-y-3.5 mb-14">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = !!openItems[faq.id];
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05, ease: EASE_ORGANIC }}
                className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-[#18251E] border-[#7A8B7B]/50 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-[#18251E]/45 border-[#F3EFE6]/10 hover:border-[#F3EFE6]/25'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] flex-shrink-0" />
                    <span className="font-serif text-lg sm:text-xl text-[#F3EFE6] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {faq.question}
                    </span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-[#121C16] border-[#D4AF37]/40 text-[#D4AF37] rotate-180'
                        : 'bg-[#121C16]/50 border-[#F3EFE6]/15 text-[#F3EFE6]/60 group-hover:text-[#F3EFE6]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_ORGANIC }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#F3EFE6]/80 font-sans leading-relaxed border-t border-[#F3EFE6]/5 space-y-2">
                        <p>{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Personalized Reception Assistance Callout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_ORGANIC }}
          className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#18251E] to-[#142019] border border-[#7A8B7B]/30 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_15px_40px_rgba(0,0,0,0.3)]"
        >
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Atendimento Direto & Humanizado</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F3EFE6] font-light">
              Ainda tem alguma dúvida sobre seu ritual?
            </h3>
            <p className="text-xs text-[#F3EFE6]/70 font-sans max-w-md leading-relaxed">
              Fale agora com a nossa recepção no WhatsApp. Estamos prontos para orientar a melhor escolha para o seu bem-estar.
            </p>
          </div>

          <a
            href={SPA_BUSINESS_DATA.whatsapp.receptionUrl}
            onClick={() => trackWhatsAppClick('faq_recepcao')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#7A8B7B] hover:bg-[#677868] text-[#121C16] text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(122,139,123,0.3)] hover:shadow-[0_6px_25px_rgba(122,139,123,0.45)] group cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#121C16] group-hover:scale-110 transition-transform" />
            <span>Falar com a Recepção</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
