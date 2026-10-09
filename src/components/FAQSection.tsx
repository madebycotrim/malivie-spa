import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, Sparkles, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';
import { useEditor } from '../context/EditorContext';

export const FAQSection: React.FC = () => {
  const { faqs, addFaq, removeFaq, moveFaq, isEditorActive } = useEditor();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-quimica': true, // Primeiro item aberto por padrão para affordance imediata
  });
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCreateFaq = () => {
    const newFaq = addFaq('geral');
    setOpenItems((prev) => ({
      ...prev,
      [newFaq.id]: true,
    }));
  };

  const handleDeleteFaq = (id: string) => {
    if (confirmDeleteId === id) {
      removeFaq(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => {
        setConfirmDeleteId((prev) => (prev === id ? null : prev));
      }, 3500);
    }
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
            <EditableIcon id="faq.badge.icon" defaultIcon="HelpCircle" className="w-3.5 h-3.5 text-[#7A8B7B]" />
            <EditableText id="faq.badge" defaultText="Tire Suas Dúvidas" as="span">
              Tire Suas Dúvidas
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            <EditableText id="faq.title" defaultText="Perguntas & Preparo para a Visita" as="span">
              Perguntas & <span className="italic font-normal text-[#D4AF37]">Preparo para a Visita</span>
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/75 font-sans leading-relaxed"
          >
            <EditableText
              id="faq.description"
              defaultText="Tudo o que você precisa saber para chegar tranquilo(a) e desfrutar do seu momento de desaceleração sem preocupações."
              as="span"
            >
              Tudo o que você precisa saber para chegar tranquilo(a) e desfrutar do seu momento de desaceleração sem preocupações.
            </EditableText>
          </motion.p>
        </div>

        {/* Diretrizes & Informações Importantes Oficiais (Página 20) */}
        <div className="mb-10 p-5 sm:p-7 rounded-3xl bg-[#18251E] border border-[#D4AF37]/35 shadow-[0_15px_40px_rgba(0,0,0,0.35)] space-y-4">
          <div className="flex items-center gap-2.5 border-b border-[#F3EFE6]/10 pb-3 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
            <span>Informações Importantes & Diretrizes Oficiais</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs text-[#F3EFE6]/85 font-sans leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Agendamento Prévio:</strong> Todos os atendimentos são realizados com exclusividade mediante agendamento.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Ritual de Boas-Vindas:</strong> Chegue com 10 minutos de antecedência para desfrutar do escalda-pés de boas-vindas cortesia.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Cancelamentos & Remarcações:</strong> Mínimo de 12 horas de antecedência. Caso contrário, será considerado como sessão realizada.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Validade dos Planos:</strong> Planos de sessões e horas possuem validade de 90 dias após a contratação.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Vouchers-Presente:</strong> Validade de 60 dias a partir da data de emissão (retirada física ou formato digital).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A8B7B] mt-1.5 flex-shrink-0" />
              <span><strong className="text-[#F3EFE6]">Condições de Pagamento:</strong> Opções de parcelamento em até 4x sem juros conforme o plano ou ritual.</span>
            </div>
          </div>
        </div>

        {/* Minimalist Accordion List */}
        <div className="space-y-3.5 mb-14">
          {faqs.map((faq, idx) => {
            const isOpen = !!openItems[faq.id];
            return (
              <motion.div
                layout
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE_ORGANIC }}
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
                      <EditableText
                        id={`faq.${faq.id}.question`}
                        defaultText={faq.question}
                        as="span"
                      >
                        {faq.question}
                      </EditableText>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Botões de Ação no Modo Editor */}
                    {isEditorActive && (
                      <div className="flex items-center gap-1 mr-1">
                        {/* Mover Para Cima */}
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFaq(faq.id, 'up');
                          }}
                          className="p-1.5 rounded-full bg-[#121C16] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#121C16] border border-white/10 hover:border-[#D4AF37] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Mover pergunta para cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Mover Para Baixo */}
                        <button
                          type="button"
                          disabled={idx === faqs.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            moveFaq(faq.id, 'down');
                          }}
                          className="p-1.5 rounded-full bg-[#121C16] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#121C16] border border-white/10 hover:border-[#D4AF37] disabled:opacity-25 disabled:cursor-not-allowed transition-all cursor-pointer"
                          title="Mover pergunta para baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Excluir Pergunta */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFaq(faq.id);
                          }}
                          className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                            confirmDeleteId === faq.id
                              ? 'bg-red-600 text-white border-red-400 animate-pulse'
                              : 'bg-[#121C16] text-[#94A595] hover:text-red-300 hover:bg-red-950/60 border-white/10'
                          }`}
                          title={confirmDeleteId === faq.id ? 'Clique novamente para CONFIRMAR exclusão' : 'Remover esta pergunta do FAQ'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#121C16] border-[#D4AF37]/40 text-[#D4AF37] rotate-180'
                          : 'bg-[#121C16]/50 border-[#F3EFE6]/15 text-[#F3EFE6]/60 group-hover:text-[#F3EFE6]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
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
                        <EditableText
                          id={`faq.${faq.id}.answer`}
                          defaultText={faq.answer}
                          as="p"
                        >
                          {faq.answer}
                        </EditableText>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Botão de Adicionar Nova Pergunta no Modo Editor */}
          {isEditorActive && (
            <motion.button
              type="button"
              onClick={handleCreateFaq}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-4 px-6 rounded-2xl border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#18251E]/40 hover:bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-lg group mt-3"
            >
              <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 group-hover:bg-[#D4AF37] text-[#D4AF37] group-hover:text-[#121C16] flex items-center justify-center transition-all duration-200">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg text-[#F3EFE6] group-hover:text-[#D4AF37] transition-colors">
                Adicionar Nova Pergunta ao FAQ
              </span>
            </motion.button>
          )}
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
              <EditableIcon id="faq.receptionBadge.icon" defaultIcon="Sparkles" className="w-3.5 h-3.5" />
              <EditableText id="faq.receptionBadge" defaultText="Atendimento Direto & Humanizado" as="span">
                Atendimento Direto & Humanizado
              </EditableText>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F3EFE6] font-light">
              <EditableText id="faq.receptionTitle" defaultText="Ainda tem alguma dúvida sobre seu ritual?" as="span">
                Ainda tem alguma dúvida sobre seu ritual?
              </EditableText>
            </h3>
            <EditableText
              id="faq.receptionDesc"
              defaultText="Fale agora com a nossa recepção no WhatsApp. Estamos prontos para orientar a melhor escolha para o seu bem-estar."
              as="p"
              className="text-xs text-[#F3EFE6]/70 font-sans max-w-md leading-relaxed"
            >
              Fale agora com a nossa recepção no WhatsApp. Estamos prontos para orientar a melhor escolha para o seu bem-estar.
            </EditableText>
          </div>

          <a
            href={SPA_BUSINESS_DATA.whatsapp.receptionUrl}
            onClick={() => trackWhatsAppClick('faq_recepcao')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[#7A8B7B] hover:bg-[#677868] text-[#121C16] text-xs font-bold tracking-wide uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(122,139,123,0.3)] hover:shadow-[0_6px_25px_rgba(122,139,123,0.45)] group cursor-pointer"
          >
            <EditableIcon id="faq.receptionCta.icon" defaultIcon="MessageCircle" className="w-4 h-4 text-[#121C16] group-hover:scale-110 transition-transform" />
            <EditableText id="faq.receptionCta" defaultText="Falar com a Recepção" as="span">
              Falar com a Recepção
            </EditableText>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
