import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Calendar,
  ShieldCheck,
  Clock,
  Footprints,
  Heart,
  Info,
  FileText
} from 'lucide-react';
import { SPA_BUSINESS_DATA } from '../data/spaData';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableIcon } from './editor/EditableIcon';
import { ConfirmPopover } from './editor/ConfirmPopover';
import { useEditor } from '../context/EditorContext';

// Mapeamento dinâmico de ícones temáticos para cada orientação/pergunta do FAQ
const getFaqIcon = (faq: { id: string; category?: string; question: string }) => {
  const q = (faq.question + ' ' + (faq.category || '')).toLowerCase();
  if (q.includes('agendamento') || q.includes('chegada') || q.includes('antecedência') || q.includes('horário')) {
    return Calendar;
  }
  if (q.includes('cancelamento') || q.includes('remarcação') || q.includes('regra') || q.includes('política') || q.includes('segurança')) {
    return ShieldCheck;
  }
  if (q.includes('escalda-pés') || q.includes('pés') || q.includes('boas-vindas')) {
    return Footprints;
  }
  if (q.includes('validade') || q.includes('plano') || q.includes('voucher') || q.includes('presente')) {
    return Clock;
  }
  if (q.includes('gestante') || q.includes('gravidez') || q.includes('casal') || q.includes('amor')) {
    return Heart;
  }
  if (q.includes('head spa') || q.includes('cabelo') || q.includes('química') || q.includes('ozônio')) {
    return Sparkles;
  }
  if (q.includes('pagamento') || q.includes('parcelamento') || q.includes('pix') || q.includes('cartão')) {
    return FileText;
  }
  return HelpCircle;
};

export const FAQSection: React.FC = () => {
  const { faqs, addFaq, removeFaq, moveFaq, isEditorActive } = useEditor();
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
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
    removeFaq(id);
    setConfirmDeleteId(null);
  };

  return (
    <section id="faq" className="relative py-28 sm:py-36 bg-[#F0EAE1] text-[#2C2C2C] overflow-hidden border-t border-[#E2D9CC]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* CABEÇALHO DA SEÇÃO (ESTILO TRANQUILIDADE & TRANSPARÊNCIA)                */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#2D4536] border border-[#DDD5C7] text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4 shadow-2xs"
          >
            <EditableIcon id="faq.badge.icon" defaultIcon="ShieldCheck" className="w-3.5 h-3.5 text-[#2D4536]" />
            <EditableText id="faq.badge" defaultText="Transparência & Cuidado" as="span">
              Transparência & Cuidado
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] text-[#121C16] font-normal leading-tight tracking-tight"
          >
            <EditableText id="faq.title" defaultText="Políticas & Orientações de Atendimento" as="span">
              Políticas & Orientações de Atendimento
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-xs sm:text-sm text-[#555555] font-sans max-w-2xl mx-auto leading-relaxed"
          >
            <EditableText
              id="faq.description"
              defaultText="Regras essenciais para garantir que sua estadia no Maliviê SPA ocorra em total harmonia, pontualidade e bem-estar."
              as="span"
            >
              Regras essenciais para garantir que sua estadia no Maliviê SPA ocorra em total harmonia, pontualidade e bem-estar.
            </EditableText>
          </motion.p>
        </div>

        {/* ========================================================================= */}
        {/* LISTA DE CARDS FLUTUANTES (ACORDEOM LUXUOSO ILUMINADO)                     */}
        {/* ========================================================================= */}
        <div className="space-y-3.5 sm:space-y-4 mb-10 sm:mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = !!openItems[faq.id];
            const IconComponent = getFaqIcon(faq);

            return (
              <motion.div
                layout
                key={faq.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: EASE_ORGANIC }}
                className={`rounded-2xl sm:rounded-3xl transition-all duration-300 ${
                  confirmDeleteId === faq.id
                    ? 'relative z-50 overflow-visible'
                    : 'relative z-10 overflow-hidden'
                } ${
                  isOpen
                    ? 'bg-white border-2 border-[#2D4536]/30 shadow-[0_16px_36px_rgba(28,38,30,0.08)] ring-1 ring-[#2D4536]/10'
                    : 'bg-white hover:bg-white border border-[#EAE4D9] hover:border-[#7A8B7B]/40 shadow-[0_4px_20px_rgba(28,38,30,0.03)] hover:shadow-[0_12px_28px_rgba(28,38,30,0.06)] hover:-translate-y-0.5'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-4.5 sm:p-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    {/* Ícone Temático em Caixinha Acetinada */}
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#18251E] text-[#D4AF37] border-[#18251E] shadow-sm'
                          : 'bg-[#F8F6F2] group-hover:bg-[#F2EEE6] text-[#2D4536] border-[#EAE4D9]'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </div>

                    {/* Pergunta */}
                    <span
                      className={`font-serif text-base sm:text-lg md:text-[1.12rem] leading-snug transition-colors ${
                        isOpen
                          ? 'text-[#121C16] font-semibold'
                          : 'text-[#1C2C22] group-hover:text-[#2D4536]'
                      }`}
                    >
                      <EditableText
                        id={`faq.${faq.id}.question`}
                        defaultText={faq.question}
                        as="span"
                      >
                        {faq.question}
                      </EditableText>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Botões de Ação no Modo Editor */}
                    {isEditorActive && (
                      <div className="flex items-center gap-1.5 mr-1" onClick={(e) => e.stopPropagation()}>
                        {/* Setinhas de Direção / Reordenação */}
                        <div className="flex items-center gap-0.5 bg-[#F6F2EB] px-1.5 py-0.5 rounded-full border border-[#E8E0D5] shadow-sm">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFaq(faq.id, 'up');
                            }}
                            className="p-1 rounded-full text-[#2D4536]/80 hover:text-[#121C16] disabled:opacity-20 hover:bg-black/5 transition-all cursor-pointer"
                            title="Mover para cima"
                            aria-label="Mover para cima"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === faqs.length - 1}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFaq(faq.id, 'down');
                            }}
                            className="p-1 rounded-full text-[#2D4536]/80 hover:text-[#121C16] disabled:opacity-20 hover:bg-black/5 transition-all cursor-pointer"
                            title="Mover para baixo"
                            aria-label="Mover para baixo"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Excluir Pergunta */}
                        <div className={`relative ${confirmDeleteId === faq.id ? 'z-50' : ''}`}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId((prev) => (prev === faq.id ? null : faq.id));
                            }}
                            className="p-1.5 rounded-full border shadow-sm transition-all cursor-pointer bg-red-50 hover:bg-red-100 text-red-600 border-red-200"
                            title="Remover pergunta"
                            aria-label="Remover pergunta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <ConfirmPopover
                            isOpen={confirmDeleteId === faq.id}
                            onConfirm={() => handleDeleteFaq(faq.id)}
                            onCancel={() => setConfirmDeleteId(null)}
                            message="Deseja excluir?"
                            position="bottom"
                            align="right"
                          />
                        </div>
                      </div>
                    )}

                    {/* Botão Circular Chevron Toggle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#18251E] border-[#18251E] text-[#D4AF37] rotate-180 shadow-sm'
                          : 'bg-[#F6F2EB] group-hover:bg-[#EFE9DF] border-[#E8E0D5] text-[#7A8B7B] group-hover:text-[#2D4536]'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
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
                      <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-[14.5px] text-[#4A554D] font-sans leading-relaxed border-t border-[#F0ECE4] space-y-2">
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
              className="w-full py-4 px-6 rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] bg-white/60 hover:bg-[#D4AF37]/10 text-[#2D4536] flex items-center justify-center gap-3 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md group mt-3"
            >
              <div className="w-7 h-7 rounded-full bg-[#2D4536]/10 group-hover:bg-[#18251E] text-[#2D4536] group-hover:text-[#D4AF37] flex items-center justify-center transition-all duration-200">
                <Plus className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg text-[#121C16] group-hover:text-[#2D4536] transition-colors">
                Adicionar Nova Pergunta / Política
              </span>
            </motion.button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BANNER DE INFORMAÇÃO & SUPORTE DIRETO (MELHORADO COM BOTÃO WHATSAPP)       */}
        {/* ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_ORGANIC }}
          className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border border-[#EAE4D9] flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-[0_4px_20px_rgba(28,38,30,0.03)]"
        >
          <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 text-center md:text-left">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0 text-[#B5902B] mt-0.5 sm:mt-0">
              <Info className="w-4.5 h-4.5" />
            </div>
            <p className="text-xs sm:text-[13.5px] text-[#555555] font-sans leading-relaxed">
              <strong className="text-[#121C16] font-semibold block mb-0.5">
                <EditableText
                  id="faq.receptionCalloutTitle"
                  defaultText="Dúvidas sobre reagendamentos ou contraindicações terapêuticas?"
                  as="span"
                >
                  Dúvidas sobre reagendamentos ou contraindicações terapêuticas?
                </EditableText>
              </strong>
              <span>
                <EditableText
                  id="faq.receptionCalloutDesc"
                  defaultText="Nossa recepção está disponível no WhatsApp para esclarecer cada detalhe antes da sua visita."
                  as="span"
                >
                  Nossa recepção está disponível no WhatsApp para esclarecer cada detalhe antes da sua visita.
                </EditableText>
              </span>
            </p>
          </div>

          <a
            href={SPA_BUSINESS_DATA.whatsapp.receptionUrl}
            onClick={() => trackWhatsAppClick('faq_recepcao')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 py-2.5 px-5 rounded-full bg-[#18251E] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#121C16] text-xs font-sans font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>
              <EditableText id="faq.receptionButtonText" defaultText="Falar com a Recepção" as="span">
                Falar com a Recepção
              </EditableText>
            </span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};
