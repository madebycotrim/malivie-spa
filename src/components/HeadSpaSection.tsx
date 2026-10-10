import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Sparkles, MessageCircle, ShieldCheck, Check, Headphones, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { HEAD_SPA_STEPS, SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { EditableIcon } from './editor/EditableIcon';
import { ConfirmPopover } from './editor/ConfirmPopover';
import { useEditor } from '../context/EditorContext';
import headSpaTerapeutaImg from '../assets/images/head-spa-terapeuta-acolhimento.webp';
import headSpaJatosImg from '../assets/images/head-spa-jatos-agua.webp';
import headSpaArcoDouradoImg from '../assets/images/head-spa-arco-dourado.webp';
import headSpaDetalheImg from '../assets/images/head-spa-detalhe.webp';

interface StepDetailItem {
  id: string;
  text: string;
}

const DEFAULT_STEP_DETAILS: Record<number, StepDetailItem[]> = {
  0: HEAD_SPA_STEPS[0].details.map((d, i) => ({ id: `s0-d${i}`, text: d })),
  1: HEAD_SPA_STEPS[1].details.map((d, i) => ({ id: `s1-d${i}`, text: d })),
  2: HEAD_SPA_STEPS[2].details.map((d, i) => ({ id: `s2-d${i}`, text: d })),
  3: HEAD_SPA_STEPS[3].details.map((d, i) => ({ id: `s3-d${i}`, text: d })),
};

export const HeadSpaSection: React.FC = () => {
  const { isEditorActive } = useEditor();
  const [activeStep, setActiveStep] = useState<number>(0);

  // Limpeza preventiva de armazenamento local
  useEffect(() => {
    try {
      localStorage.removeItem('malivie_head_spa_details_v2');
      sessionStorage.removeItem('malivie_head_spa_details_v2');
    } catch (e) {
      console.warn('[HeadSpaSection] Falha ao purgar armazenamento legado:', e);
    }
  }, []);

  const [detailsByStep, setDetailsByStep] = useState<Record<number, StepDetailItem[]>>(DEFAULT_STEP_DETAILS);

  const [confirmDeleteDetailId, setConfirmDeleteDetailId] = useState<string | null>(null);

  const handleAddDetail = (stepIdx: number) => {
    const newId = `s${stepIdx}-d${Date.now()}`;
    setDetailsByStep((prev) => {
      const currentList = prev[stepIdx] || DEFAULT_STEP_DETAILS[stepIdx] || [];
      return {
        ...prev,
        [stepIdx]: [...currentList, { id: newId, text: 'Novo detalhe do procedimento' }],
      };
    });
  };

  const handleRemoveDetail = (stepIdx: number, detailId: string) => {
    setDetailsByStep((prev) => {
      const currentList = prev[stepIdx] || DEFAULT_STEP_DETAILS[stepIdx] || [];
      return {
        ...prev,
        [stepIdx]: currentList.filter((item) => item.id !== detailId),
      };
    });
    setConfirmDeleteDetailId(null);
  };

  const handleMoveDetail = (stepIdx: number, detailId: string, direction: 'up' | 'down') => {
    setDetailsByStep((prev) => {
      const currentList = [...(prev[stepIdx] || DEFAULT_STEP_DETAILS[stepIdx] || [])];
      const index = currentList.findIndex((item) => item.id === detailId);
      if (index === -1) return prev;

      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= currentList.length) return prev;

      const temp = currentList[index];
      currentList[index] = currentList[targetIndex];
      currentList[targetIndex] = temp;

      return {
        ...prev,
        [stepIdx]: currentList,
      };
    });
  };

  const stepImages = [
    headSpaTerapeutaImg,
    headSpaDetalheImg,
    headSpaJatosImg,
    headSpaArcoDouradoImg,
  ];

  return (
    <section id="head-spa" className="relative py-28 sm:py-36 bg-[#121C16] text-[#F3EFE6] overflow-hidden">
      {/* Background Ambience and Water Ripple Emulation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-10 w-[500px] h-[500px] bg-[#7A8B7B]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <EditableIcon id="headSpa.badge.icon" defaultIcon="Droplets" className="w-3.5 h-3.5 text-[#7A8B7B]" />
            <EditableText id="headSpa.badge" defaultText="Carro-Chefe Exclusivo" as="span">
              Carro-Chefe Exclusivo
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            <EditableText
              id="headSpa.title"
              defaultText={OFFICIAL_COPIES.headSpaTitle}
              as="span"
            >
              {OFFICIAL_COPIES.headSpaTitle}
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 text-base sm:text-lg text-[#D4AF37]/90 font-serif italic max-w-2xl mx-auto leading-relaxed"
          >
            "
            <EditableText
              id="headSpa.subtitle"
              defaultText={OFFICIAL_COPIES.headSpaSubtitle}
              as="span"
            >
              {OFFICIAL_COPIES.headSpaSubtitle}
            </EditableText>
            "
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.3, ease: EASE_ORGANIC }}
            className="mt-6 p-5 rounded-2xl bg-[#18251E]/90 border border-[#7A8B7B]/30 text-xs sm:text-sm text-[#F3EFE6]/90 max-w-3xl mx-auto leading-relaxed flex items-start gap-3 text-left shadow-lg"
          >
            <EditableIcon id="headSpa.quote.icon" defaultIcon="Headphones" className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p className="font-sans leading-relaxed">
              <EditableText
                id="headSpa.quote"
                defaultText={OFFICIAL_COPIES.headSpaQuote}
                as="span"
              >
                {OFFICIAL_COPIES.headSpaQuote}
              </EditableText>
            </p>
          </motion.div>
        </div>

        {/* 2-Column Showcase: 3D Tilt Asymmetric Gallery on Left + Unlumen Accordion on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: 3D Tilt Card (Spell.sh / GetLayers reference) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE_LUXURY }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-3xl overflow-hidden bg-[#18251E] border border-[#F3EFE6]/10 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.5)] group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#121C16]">
                <EditableImage
                  key={activeStep}
                  id={`headSpa.step.${activeStep}.image`}
                  defaultImage={stepImages[activeStep] || headSpaTerapeutaImg}
                  alt={`Head Spa Coreano Maliviê SPA - ${HEAD_SPA_STEPS[activeStep]?.title || 'Ritual'}`}
                  prefix={`head-spa-etapa-${activeStep + 1}`}
                  className="w-full h-full object-cover object-center filter contrast-105"
                  containerClassName="w-full h-full"
                />
                
                {/* Visual Gradient Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121C16] via-transparent to-black/20 pointer-events-none" />

                {/* Floating Tag inside the photo */}
                <div
                  className="absolute top-4 left-4 z-30 pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121C16]/80 backdrop-blur-md border border-[#F3EFE6]/20 text-[11px] text-[#F3EFE6]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditableIcon id="headSpa.photoBadge.icon" defaultIcon="Sparkles" className="w-3 h-3 text-[#D4AF37]" />
                  <EditableText id="headSpa.photoBadge" defaultText="Arco Hídrico Terapêutico ASMR" as="span">
                    Arco Hídrico Terapêutico ASMR
                  </EditableText>
                </div>

                {/* Bottom Overlay Info Card */}
                <div
                  className="absolute bottom-4 left-4 right-4 z-30 pointer-events-auto p-4 rounded-xl bg-[#121C16]/90 backdrop-blur-md border border-[#F3EFE6]/10 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif italic text-[#D4AF37] text-sm">
                      <EditableText id="headSpa.photoCardTitle" defaultText="Sensação da Sessão" as="span">
                        Sensação da Sessão
                      </EditableText>
                    </span>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A8B7B]">
                      <EditableText id="headSpa.photoCardDuration" defaultText="80 Minutos" as="span">
                        80 Minutos
                      </EditableText>
                    </span>
                  </div>
                  <p className="text-[#F3EFE6]/80 text-[11px] leading-relaxed">
                    "
                    <EditableText
                      id={`headSpa.step.${activeStep}.sensoryNote`}
                      defaultText={HEAD_SPA_STEPS[activeStep].sensoryNote}
                      as="span"
                    >
                      {HEAD_SPA_STEPS[activeStep].sensoryNote}
                    </EditableText>
                    "
                  </p>
                </div>
              </div>

            </div>

            {/* Micro Benefits Badge (Regulatório Seguro) */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#18251E]/60 border border-[#F3EFE6]/10 flex items-center justify-between text-xs text-[#F3EFE6]/85">
              <div className="flex items-center gap-2">
                <EditableIcon id="headSpa.benefit.icon" defaultIcon="ShieldCheck" className="w-4 h-4 text-[#7A8B7B]" />
                <EditableText
                  id="headSpa.benefitText"
                  defaultText="Alívio de tensões na cabeça, estresse e fadiga mental"
                  as="span"
                >
                  Alívio de tensões na cabeça, estresse e fadiga mental
                </EditableText>
              </div>
              <span className="text-[#D4AF37] font-semibold text-[11px] whitespace-nowrap ml-2">
                <EditableText id="headSpa.benefitHighlight" defaultText="Puro bem-estar" as="span">
                  Puro bem-estar
                </EditableText>
              </span>
            </div>
          </motion.div>

          {/* Right Column: Unlumen Style Smooth Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col space-y-4"
          >
            <div className="mb-2">
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EFE6]">
                <EditableText id="headSpa.stepsHeading" defaultText="As 4 Etapas do Ritual Completo" as="span">
                  As 4 Etapas do Ritual Completo
                </EditableText>
              </h3>
              <p className="text-xs text-[#F3EFE6]/60 font-sans uppercase tracking-widest mt-1">
                <EditableText id="headSpa.stepsSubheading" defaultText="Clique nas fases para explorar a evolução do tratamento" as="span">
                  Clique nas fases para explorar a evolução do tratamento
                </EditableText>
              </p>
            </div>

            {HEAD_SPA_STEPS.map((step, idx) => {
              const isOpen = activeStep === idx;
              return (
                <div
                  key={step.number}
                  className={`rounded-2xl transition-all duration-400 border overflow-hidden relative group/step ${
                    isOpen
                      ? 'bg-[#18251E] border-[#D4AF37]/50 shadow-[0_15px_35px_rgba(0,0,0,0.45),_0_0_20px_rgba(212,175,55,0.08)] -translate-y-0.5'
                      : 'bg-[#18251E]/40 border-[#F3EFE6]/10 hover:border-[#7A8B7B]/50 hover:bg-[#18251E]/70 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Linha dourada suave no topo */}
                  <div className={`absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent transition-opacity duration-400 pointer-events-none ${isOpen ? 'opacity-100' : 'opacity-0 group-hover/step:opacity-70'}`} />

                  <button
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <span
                        className={`font-serif text-xl sm:text-2xl font-light transition-colors ${
                          isOpen ? 'text-[#D4AF37]' : 'text-[#7A8B7B]'
                        }`}
                      >
                        {step.number}
                      </span>
                      <div>
                        <h4
                          className={`font-serif text-lg sm:text-xl transition-colors ${
                            isOpen ? 'text-[#F3EFE6]' : 'text-[#F3EFE6]/80'
                          }`}
                        >
                          <EditableText id={`headSpa.step.${idx}.title`} defaultText={step.title} as="span">
                            {step.title}
                          </EditableText>
                        </h4>
                        <span className="text-xs text-[#7A8B7B] font-sans font-medium tracking-wide">
                          <EditableText id={`headSpa.step.${idx}.subtitle`} defaultText={step.subtitle} as="span">
                            {step.subtitle}
                          </EditableText>
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen ? 'rotate-180 bg-[#7A8B7B]/20 text-[#D4AF37]' : 'text-[#F3EFE6]/60'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE_LUXURY }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#F3EFE6]/10 text-sm text-[#F3EFE6]/80 space-y-4">
                          <EditableText
                            id={`headSpa.step.${idx}.description`}
                            defaultText={step.description}
                            as="p"
                            className="leading-relaxed font-sans text-xs sm:text-sm text-[#F3EFE6]/90"
                          >
                            {step.description}
                          </EditableText>

                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4AF37] font-semibold block">
                              <EditableText id="headSpa.procedureDetailsLabel" defaultText="Detalhes do Procedimento:" as="span">
                                Detalhes do Procedimento:
                              </EditableText>
                            </span>

                            <ul className="grid grid-cols-1 gap-2">
                              {(detailsByStep[idx] || DEFAULT_STEP_DETAILS[idx] || []).map((item, itemIdx, currentArr) => (
                                <li
                                  key={item.id}
                                  className={`flex items-start gap-2.5 text-xs text-[#F3EFE6]/75 group/detail ${
                                    confirmDeleteDetailId === item.id ? 'relative z-50 overflow-visible' : 'relative z-10'
                                  }`}
                                >
                                  <EditableIcon
                                    id={`headSpa.detail.${item.id}.icon`}
                                    defaultIcon="Check"
                                    className="w-3.5 h-3.5 text-[#7A8B7B] flex-shrink-0 mt-0.5"
                                  />
                                  <span className="flex-1">
                                    <EditableText
                                      id={`headSpa.detail.${item.id}.text`}
                                      defaultText={item.text}
                                      as="span"
                                    >
                                      {item.text}
                                    </EditableText>
                                  </span>

                                  {isEditorActive && (
                                    <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                                      {/* Setinhas de Direção / Reordenação (Pílula dourada idêntica ao card) */}
                                      <div className="flex items-center gap-0.5 bg-[#121C16]/90 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-[#D4AF37]/40 shadow-md">
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveDetail(idx, item.id, 'up');
                                          }}
                                          disabled={itemIdx === 0}
                                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] disabled:opacity-20 disabled:hover:text-[#F3EFE6]/80 hover:bg-white/10 transition-all cursor-pointer"
                                          title="Mover para cima"
                                          aria-label="Mover para cima"
                                        >
                                          <ArrowUp className="w-3 h-3" />
                                        </button>

                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMoveDetail(idx, item.id, 'down');
                                          }}
                                          disabled={itemIdx === currentArr.length - 1}
                                          className="p-1 rounded-full text-[#F3EFE6]/80 hover:text-[#D4AF37] disabled:opacity-20 disabled:hover:text-[#F3EFE6]/80 hover:bg-white/10 transition-all cursor-pointer"
                                          title="Mover para baixo"
                                          aria-label="Mover para baixo"
                                        >
                                          <ArrowDown className="w-3 h-3" />
                                        </button>
                                      </div>

                                      {/* Excluir Detalhe (Botão circular idêntico ao card) */}
                                      <div className={`relative ${confirmDeleteDetailId === item.id ? 'z-50' : ''}`}>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setConfirmDeleteDetailId((prev) => (prev === item.id ? null : item.id));
                                          }}
                                          className="p-1.5 rounded-full border shadow-md transition-all cursor-pointer bg-[#121C16]/85 hover:bg-red-950 text-[#94A595] hover:text-red-200 border-white/20 hover:border-red-500/50"
                                          title="Remover este detalhe"
                                          aria-label="Remover este detalhe"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>

                                        <ConfirmPopover
                                          isOpen={confirmDeleteDetailId === item.id}
                                          onConfirm={() => handleRemoveDetail(idx, item.id)}
                                          onCancel={() => setConfirmDeleteDetailId(null)}
                                          message="Deseja excluir?"
                                          position="bottom"
                                          align="right"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>

                            {isEditorActive && (
                              <div className="pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddDetail(idx);
                                  }}
                                  className="w-full py-2 px-3 rounded-xl border border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-[#D4AF37]/5 hover:bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-sans font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>Adicionar mais detalhe a esta etapa</span>
                                </button>
                              </div>
                            )}
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#F3EFE6]/5">
                            <span className="text-[#D4AF37] font-serif italic text-sm">
                              <EditableText
                                id={`headSpa.step.${idx}.therapists`}
                                defaultText="Terapeutas Especialistas: Andressa & Luciana"
                                as="span"
                              >
                                Terapeutas Especialistas: Andressa & Luciana
                              </EditableText>
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Modalidades Oficiais Head Spa & Oferta Especial */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-[#18251E] border border-[#D4AF37]/30 space-y-4 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F3EFE6]/10 pb-3">
                <span className="text-xs uppercase font-sans font-bold tracking-widest text-[#D4AF37]">
                  <EditableText
                    id="headSpa.pricing.headerTitle"
                    defaultText="Escolha Sua Experiência Head SPA"
                    as="span"
                  >
                    Escolha Sua Experiência Head SPA
                  </EditableText>
                </span>
                <span className="text-[11px] text-[#7A8B7B] font-medium">
                  <EditableText
                    id="headSpa.pricing.headerSubtitle"
                    defaultText="Aromaterapia Inclusa • Escalda-pés cortesia com antecedência*"
                    as="span"
                  >
                    Aromaterapia Inclusa • Escalda-pés cortesia com antecedência*
                  </EditableText>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#F3EFE6]/10 flex flex-col justify-between">
                  <div>
                    <EditableText
                      id="headSpa.pricing.card1.name"
                      defaultText="Head Spa Essencial"
                      as="span"
                      className="text-xs font-semibold text-[#F3EFE6] block"
                    >
                      Head Spa Essencial
                    </EditableText>
                    <EditableText
                      id="headSpa.pricing.card1.desc"
                      defaultText="Couro cabeludo & fios com ozonioterapia"
                      as="span"
                      className="text-[11px] text-[#F3EFE6]/60 block mt-0.5"
                    >
                      Couro cabeludo & fios com ozonioterapia
                    </EditableText>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <EditableText
                      id="headSpa.pricing.card1.duration"
                      defaultText="45' min"
                      as="span"
                      className="text-[11px] text-[#7A8B7B]"
                    >
                      45' min
                    </EditableText>
                    <EditableText
                      id="headSpa.pricing.card1.price"
                      defaultText="R$ 239,00"
                      as="span"
                      className="text-sm font-serif font-bold text-[#D4AF37]"
                    >
                      R$ 239,00
                    </EditableText>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#7A8B7B]/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <EditableText
                        id="headSpa.pricing.card2.name"
                        defaultText="Head Spa Harmonia"
                        as="span"
                        className="text-xs font-semibold text-[#F3EFE6] block"
                      >
                        Head Spa Harmonia
                      </EditableText>
                    </div>
                    <EditableText
                      id="headSpa.pricing.card2.desc"
                      defaultText="Essencial + Revitalização Facial"
                      as="span"
                      className="text-[11px] text-[#F3EFE6]/60 block mt-0.5"
                    >
                      Essencial + Revitalização Facial
                    </EditableText>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <EditableText
                      id="headSpa.pricing.card2.duration"
                      defaultText="80' min"
                      as="span"
                      className="text-[11px] text-[#7A8B7B]"
                    >
                      80' min
                    </EditableText>
                    <EditableText
                      id="headSpa.pricing.card2.price"
                      defaultText="R$ 349,00"
                      as="span"
                      className="text-sm font-serif font-bold text-[#D4AF37]"
                    >
                      R$ 349,00
                    </EditableText>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#D4AF37]/40 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#D4AF37] text-[#121C16] text-[9px] font-bold uppercase tracking-wider rounded-bl">
                    <EditableText
                      id="headSpa.pricing.card3.badge"
                      defaultText="Completo"
                      as="span"
                      darkBorder={true}
                    >
                      Completo
                    </EditableText>
                  </div>
                  <div>
                    <EditableText
                      id="headSpa.pricing.card3.name"
                      defaultText="Head Spa Plenitude"
                      as="span"
                      className="text-xs font-semibold text-[#F3EFE6] block"
                    >
                      Head Spa Plenitude
                    </EditableText>
                    <EditableText
                      id="headSpa.pricing.card3.desc"
                      defaultText="Head Spa + Facial + Esfoliação + Pedras Quentes"
                      as="span"
                      className="text-[11px] text-[#F3EFE6]/60 block mt-0.5"
                    >
                      Head Spa + Facial + Esfoliação + Pedras Quentes
                    </EditableText>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <EditableText
                      id="headSpa.pricing.card3.duration"
                      defaultText="160' min"
                      as="span"
                      className="text-[11px] text-[#7A8B7B]"
                    >
                      160' min
                    </EditableText>
                    <EditableText
                      id="headSpa.pricing.card3.price"
                      defaultText="R$ 577,00"
                      as="span"
                      className="text-sm font-serif font-bold text-[#D4AF37]"
                    >
                      R$ 577,00
                    </EditableText>
                  </div>
                </div>
              </div>

              {/* Special Upsell Callout from Catalog page 10 */}
              <div className="p-3 rounded-xl bg-[#7A8B7B]/15 border border-[#7A8B7B]/30 flex items-center gap-2.5 text-xs text-[#F3EFE6]/90">
                <EditableIcon id="headSpa.upsell.icon" defaultIcon="Sparkles" className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="font-sans leading-tight flex-1">
                  <EditableText
                    id="headSpa.pricing.upsell"
                    defaultText="**Dica Especial:** Adicione o Spa dos Pés por **50% do valor** e torne sua experiência ainda mais especial."
                    as="span"
                  >
                    **Dica Especial:** Adicione o Spa dos Pés por **50% do valor** e torne sua experiência ainda mais especial.
                  </EditableText>
                </span>
              </div>
            </div>

            {/* Direct Official Booking CTA for Head Spa */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <MagneticButton
                href={SPA_BUSINESS_DATA.whatsapp.headSpaUrl}
                onClick={() => trackWhatsAppClick('head_spa')}
                target="_blank"
                rel="noopener noreferrer"
                variant="sage"
                size="lg"
                className="w-full sm:w-auto"
              >
                <EditableIcon id="headSpa.cta.icon" defaultIcon="MessageCircle" className="w-5 h-5 text-[#121C16]" />
                <EditableText id="headSpa.cta" defaultText={OFFICIAL_COPIES.ctaButton} as="span">
                  {OFFICIAL_COPIES.ctaButton}
                </EditableText>
              </MagneticButton>

              <span className="text-xs text-[#F3EFE6]/60 font-serif italic text-center sm:text-left">
                <EditableText id="headSpa.slogan" defaultText={SPA_BUSINESS_DATA.slogan} as="span">
                  {SPA_BUSINESS_DATA.slogan}
                </EditableText>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
