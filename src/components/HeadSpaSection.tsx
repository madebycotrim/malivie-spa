import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Sparkles, MessageCircle, ShieldCheck, Check, Headphones } from 'lucide-react';
import { HEAD_SPA_STEPS, SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { EditableIcon } from './editor/EditableIcon';
import headSpaTerapeutaImg from '../assets/images/head-spa-terapeuta-acolhimento.webp';
import headSpaJatosImg from '../assets/images/head-spa-jatos-agua.webp';
import headSpaArcoDouradoImg from '../assets/images/head-spa-arco-dourado.webp';
import headSpaDetalheImg from '../assets/images/head-spa-detalhe.webp';

export const HeadSpaSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

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
            <Headphones className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
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
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
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
                  className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
                    isOpen
                      ? 'bg-[#18251E] border-[#7A8B7B]/60 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                      : 'bg-[#18251E]/40 border-[#F3EFE6]/10 hover:border-[#F3EFE6]/25'
                  }`}
                >
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
                              {step.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2.5 text-xs text-[#F3EFE6]/75">
                                  <Check className="w-3.5 h-3.5 text-[#7A8B7B] flex-shrink-0 mt-0.5" />
                                  <EditableText
                                    id={`headSpa.step.${idx}.detail.${dIdx}`}
                                    defaultText={detail}
                                    as="span"
                                  >
                                    {detail}
                                  </EditableText>
                                </li>
                              ))}
                            </ul>
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
                  Escolha Sua Experiência Head SPA
                </span>
                <span className="text-[11px] text-[#7A8B7B] font-medium">
                  Aromaterapia Inclusa • Escalda-pés cortesia com antecedência*
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#F3EFE6]/10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#F3EFE6] block">Head Spa Essencial</span>
                    <span className="text-[11px] text-[#F3EFE6]/60 block mt-0.5">Couro cabeludo & fios com ozonioterapia</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <span className="text-[11px] text-[#7A8B7B]">45' min</span>
                    <span className="text-sm font-serif font-bold text-[#D4AF37]">R$ 239,00</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#7A8B7B]/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-[#F3EFE6] block">Head Spa Harmonia</span>
                    </div>
                    <span className="text-[11px] text-[#F3EFE6]/60 block mt-0.5">Essencial + Revitalização Facial</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <span className="text-[11px] text-[#7A8B7B]">80' min</span>
                    <span className="text-sm font-serif font-bold text-[#D4AF37]">R$ 349,00</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#121C16]/80 border border-[#D4AF37]/40 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-[#D4AF37] text-[#121C16] text-[9px] font-bold uppercase tracking-wider rounded-bl">
                    Completo
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#F3EFE6] block">Head Spa Plenitude</span>
                    <span className="text-[11px] text-[#F3EFE6]/60 block mt-0.5">Head Spa + Facial + Esfoliação + Pedras Quentes</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F3EFE6]/5 flex items-baseline justify-between">
                    <span className="text-[11px] text-[#7A8B7B]">160' min</span>
                    <span className="text-sm font-serif font-bold text-[#D4AF37]">R$ 577,00</span>
                  </div>
                </div>
              </div>

              {/* Special Upsell Callout from Catalog page 10 */}
              <div className="p-3 rounded-xl bg-[#7A8B7B]/15 border border-[#7A8B7B]/30 flex items-center gap-2.5 text-xs text-[#F3EFE6]/90">
                <Sparkles className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span className="font-sans leading-tight">
                  <strong className="text-[#D4AF37]">Dica Especial:</strong> Adicione o Spa dos Pés por <strong>50% do valor</strong> e torne sua experiência ainda mais especial.
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
