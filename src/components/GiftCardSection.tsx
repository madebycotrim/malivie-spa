import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Sparkles, MessageCircle, Check } from 'lucide-react';
import { OFFICIAL_COPIES, SPA_BUSINESS_DATA } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import giftCardImg from '../assets/images/malivie-gift-card-instagram.webp';

export const GiftCardSection: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = useState<string | null>(null);
  return (
    <section id="gift-card" className="relative py-28 sm:py-36 bg-[#FBF9F6] text-[#2C2C2C] overflow-hidden">
      {/* Rose & Nude Terracotta Ambient Glows com respiração suave */}
      <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-[#D3B8AA]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#F0EAE1] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D3B8AA]/20 text-[#2C2C2C] border border-[#D3B8AA]/40 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <Gift className="w-3.5 h-3.5 text-[#B99887]" />
            Experiência Para Quem Você Ama
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2C2C2C] font-light leading-tight"
          >
            {OFFICIAL_COPIES.giftCardTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 font-serif italic text-lg sm:text-2xl text-[#7A8B7B] max-w-2xl mx-auto leading-relaxed"
          >
            "{OFFICIAL_COPIES.giftCardTagline}"
          </motion.p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Official Instagram Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1, ease: EASE_LUXURY }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md">
              {/* Decorative Frame */}
              <div className="absolute -inset-3 rounded-3xl border border-[#D3B8AA]/40 rotate-1 pointer-events-none" />

              <div className="relative rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(211,184,170,0.35)] bg-[#121C16] border border-[#D3B8AA]/30 group">
                <img
                  loading="lazy"
                  decoding="async"
                  src={giftCardImg}
                  alt="Gift Card Maliviê SPA - O presente que não ocupa espaço na prateleira, mas sim no coração"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#121C16]/85 via-transparent to-transparent pointer-events-none" />

                {/* Floating Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-[#121C16]/90 backdrop-blur-md text-[#F3EFE6] border border-[#F3EFE6]/15 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif italic text-sm text-[#D4AF37]">
                      {OFFICIAL_COPIES.giftCardHook}
                    </span>
                    <span className="text-[10px] uppercase font-sans tracking-wider text-[#D3B8AA] font-bold">
                      Maliviê SPA
                    </span>
                  </div>
                  <p className="text-[11px] text-[#F3EFE6]/75 font-sans leading-tight">
                    {OFFICIAL_COPIES.giftCardSubTagline}
                  </p>
                </div>
              </div>

              {/* Badges below image */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#555555]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Voucher Físico ou Digital</span>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <Check className="w-3.5 h-3.5 text-[#7A8B7B]" />
                  <span>Validade de 30 dias</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Emotional Narrative & Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col space-y-7"
          >
            {/* Opening Headline */}
            <div className="space-y-2">
              <span className="text-xs uppercase font-sans font-bold tracking-[0.25em] text-[#B99887] block">
                {OFFICIAL_COPIES.giftCardHook}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2C2C2C] font-light leading-snug">
                {OFFICIAL_COPIES.giftCardForWhom}
              </h3>
            </div>

            {/* The 3 Personas - Interativas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedPersona(prev => prev === 'A Amiga' ? null : 'A Amiga')}
                className={`p-4 rounded-2xl bg-white text-left transition-all duration-300 shadow-xs flex flex-col justify-between space-y-2 cursor-pointer border ${
                  selectedPersona === 'A Amiga'
                    ? 'border-[#7A8B7B] ring-2 ring-[#7A8B7B]/30 shadow-md bg-[#F4F6F4]'
                    : 'border-[#E8E0D5] hover:border-[#7A8B7B]/50 hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#7A8B7B] font-sans">
                    A Amiga
                  </span>
                  {selectedPersona === 'A Amiga' && (
                    <span className="text-[10px] bg-[#7A8B7B] text-white px-2 py-0.5 rounded-full font-bold">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "{OFFICIAL_COPIES.giftCardPersonaAmiga}"
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPersona(prev => prev === 'A Mãe' ? null : 'A Mãe')}
                className={`p-4 rounded-2xl bg-white text-left transition-all duration-300 shadow-xs flex flex-col justify-between space-y-2 cursor-pointer border ${
                  selectedPersona === 'A Mãe'
                    ? 'border-[#B99887] ring-2 ring-[#B99887]/30 shadow-md bg-[#FAF6F4]'
                    : 'border-[#E8E0D5] hover:border-[#B99887]/60 hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#B99887] font-sans">
                    A Mãe
                  </span>
                  {selectedPersona === 'A Mãe' && (
                    <span className="text-[10px] bg-[#B99887] text-white px-2 py-0.5 rounded-full font-bold">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "{OFFICIAL_COPIES.giftCardPersonaMae}"
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPersona(prev => prev === 'A Mulher Que Você Admira' ? null : 'A Mulher Que Você Admira')}
                className={`p-4 rounded-2xl bg-white text-left transition-all duration-300 shadow-xs flex flex-col justify-between space-y-2 sm:col-span-1 cursor-pointer border ${
                  selectedPersona === 'A Mulher Que Você Admira'
                    ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/30 shadow-md bg-[#FCFAF2]'
                    : 'border-[#E8E0D5] hover:border-[#D4AF37]/60 hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37] font-sans">
                    A Mulher Admirada
                  </span>
                  {selectedPersona === 'A Mulher Que Você Admira' && (
                    <span className="text-[10px] bg-[#D4AF37] text-[#121C16] px-2 py-0.5 rounded-full font-bold">
                      Selecionado
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "{OFFICIAL_COPIES.giftCardPersonaMulher}"
                </p>
              </button>
            </div>

            {/* Core Message Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F0EAE1]/80 border border-[#D3B8AA]/40 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#7A8B7B]">
                <Heart className="w-4 h-4 text-[#D3B8AA]" />
                <span>O que você realmente entrega</span>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-[#2C2C2C] leading-relaxed">
                "{OFFICIAL_COPIES.giftCardExperience}"
              </p>

              {/* 3 Steps */}
              <div className="pt-3 border-t border-[#D3B8AA]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#7A8B7B]/15 text-[#7A8B7B] flex items-center justify-center text-[10px] font-bold">1</span>
                  <span>Ela escolhe o dia.</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#7A8B7B]/15 text-[#7A8B7B] flex items-center justify-center text-[10px] font-bold">2</span>
                  <span>Ela escolhe a experiência.</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">3</span>
                  <span>Você entende o que ela precisava.</span>
                </div>
              </div>
            </div>

            {/* Official Baseline Note */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] flex items-center gap-3 text-xs text-[#555555] shadow-xs">
              <Gift className="w-5 h-5 text-[#B99887] flex-shrink-0" />
              <p className="leading-relaxed">
                <strong className="text-[#2C2C2C]">Presenteie com autocuidado:</strong> {OFFICIAL_COPIES.giftCardOfficial}
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-4">
              <MagneticButton
                href={SPA_BUSINESS_DATA.whatsapp.giftCardUrl(selectedPersona || undefined)}
                onClick={() => trackWhatsAppClick('gift_card', selectedPersona || 'geral')}
                target="_blank"
                rel="noopener noreferrer"
                variant="rose"
                size="lg"
                className="w-full sm:w-auto"
              >
                <MessageCircle className="w-5 h-5 text-[#121C16]" />
                <span>
                  {selectedPersona
                    ? `Presentear ${selectedPersona} com Gift Card`
                    : 'Presentear com Gift Card'}
                </span>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
