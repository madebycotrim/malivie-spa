import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Droplets, Sparkles, MessageCircle, ShieldCheck, Check, Headphones } from 'lucide-react';
import { HEAD_SPA_STEPS, SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import headSpaTerapeutaImg from '../assets/images/head-spa-terapeuta-acolhimento.webp';
import headSpaJatosImg from '../assets/images/head-spa-jatos-agua.webp';
import headSpaArcoDouradoImg from '../assets/images/head-spa-arco-dourado.webp';
import headSpaDetalheImg from '../assets/images/head-spa-detalhe.webp';

export const HeadSpaSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const tiltCardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 });

  const stepImages = [
    headSpaTerapeutaImg,
    headSpaDetalheImg,
    headSpaJatosImg,
    headSpaArcoDouradoImg,
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltCardRef.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTiltStyle({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTiltStyle({ rotateX: 0, rotateY: 0 });
  };

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
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18251E] text-[#D4AF37] border border-[#D4AF37]/30 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Droplets className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Carro-Chefe Exclusivo
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            {OFFICIAL_COPIES.headSpaTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-[#D4AF37]/90 font-serif italic max-w-2xl mx-auto leading-relaxed"
          >
            "{OFFICIAL_COPIES.headSpaSubtitle}"
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 p-5 rounded-2xl bg-[#18251E]/90 border border-[#7A8B7B]/30 text-xs sm:text-sm text-[#F3EFE6]/90 max-w-3xl mx-auto leading-relaxed flex items-start gap-3 text-left shadow-lg"
          >
            <Headphones className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <p className="font-sans leading-relaxed">
              {OFFICIAL_COPIES.headSpaQuote}
            </p>
          </motion.div>
        </div>

        {/* 2-Column Showcase: 3D Tilt Asymmetric Gallery on Left + Unlumen Accordion on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: 3D Tilt Card (Spell.sh / GetLayers reference) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="lg:col-span-5"
          >
            <div
              ref={tiltCardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tiltStyle.rotateX}deg) rotateY(${tiltStyle.rotateY}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="relative rounded-3xl overflow-hidden bg-[#18251E] border border-[#F3EFE6]/10 p-3 shadow-[0_25px_60px_rgba(0,0,0,0.5)] group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#121C16]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeStep}
                    src={stepImages[activeStep] || headSpaTerapeutaImg}
                    alt={`Head Spa Coreano Maliviê SPA - ${HEAD_SPA_STEPS[activeStep]?.title || 'Ritual'}`}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-full h-full object-cover object-center filter contrast-105"
                  />
                </AnimatePresence>
                
                {/* Visual Gradient Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#121C16] via-transparent to-black/20 pointer-events-none" />

                {/* Floating Tag inside the photo */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121C16]/80 backdrop-blur-md border border-[#F3EFE6]/20 text-[11px] text-[#F3EFE6]">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Arco Hídrico Terapêutico ASMR</span>
                </div>

                {/* Bottom Overlay Info Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#121C16]/90 backdrop-blur-md border border-[#F3EFE6]/10 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif italic text-[#D4AF37] text-sm">
                      Sensação da Sessão
                    </span>
                    <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A8B7B]">
                      80 Minutos
                    </span>
                  </div>
                  <p className="text-[#F3EFE6]/80 text-[11px] leading-relaxed">
                    "{HEAD_SPA_STEPS[activeStep].sensoryNote}"
                  </p>
                </div>
              </div>

              {/* Physical interaction hint */}
              <div className="pt-3 pb-1 text-center">
                <span className="text-[10px] uppercase tracking-widest text-[#F3EFE6]/40 font-sans">
                  Passe o mouse ou toque para inclinar em 3D
                </span>
              </div>
            </div>

            {/* Micro Benefits Badge */}
            <div className="mt-6 p-4 rounded-2xl bg-[#18251E]/50 border border-[#F3EFE6]/10 flex items-center justify-between text-xs text-[#F3EFE6]/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#7A8B7B]" />
                <span>Alívio de enxaquecas, bruxismo e tensão ocular</span>
              </div>
              <span className="text-[#D4AF37] font-semibold">100% relaxante</span>
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
                As 4 Etapas do Ritual Completo
              </h3>
              <p className="text-xs text-[#F3EFE6]/60 font-sans uppercase tracking-widest mt-1">
                Clique nas fases para explorar a evolução do tratamento
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
                          {step.title}
                        </h4>
                        <span className="text-xs text-[#7A8B7B] font-sans font-medium tracking-wide">
                          {step.subtitle}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`p-2 rounded-full transition-transform duration-300 ${
                        isOpen ? 'rotate-180 bg-[#7A8B7B]/20 text-[#D4AF37]' : 'text-[#F3EFE6]/40'
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
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                      >
                        <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#F3EFE6]/10 text-sm text-[#F3EFE6]/80 space-y-4">
                          <p className="leading-relaxed font-sans text-xs sm:text-sm text-[#F3EFE6]/90">
                            {step.description}
                          </p>

                          <div className="space-y-2 pt-1">
                            <span className="text-[11px] font-sans uppercase tracking-widest text-[#D4AF37] font-semibold block">
                              Detalhes do Procedimento:
                            </span>
                            <ul className="grid grid-cols-1 gap-2">
                              {step.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2.5 text-xs text-[#F3EFE6]/75">
                                  <Check className="w-3.5 h-3.5 text-[#7A8B7B] flex-shrink-0 mt-0.5" />
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#F3EFE6]/5">
                            <span className="text-[#D4AF37] font-serif italic text-sm">
                              Terapeutas Especialistas: Andressa & Luciana
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {/* Direct Official Booking CTA for Head Spa */}
            <div className="pt-6 flex flex-col sm:flex-row items-center gap-4">
              <MagneticButton
                href={SPA_BUSINESS_DATA.social.linktree}
                target="_blank"
                rel="noopener noreferrer"
                variant="sage"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 text-[#121C16]" />
                <span>{OFFICIAL_COPIES.ctaButton}</span>
              </MagneticButton>

              <span className="text-xs text-[#F3EFE6]/60 font-serif italic text-center sm:text-left">
                {SPA_BUSINESS_DATA.slogan}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
