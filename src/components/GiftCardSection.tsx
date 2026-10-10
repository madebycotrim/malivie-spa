import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Sparkles, MessageCircle, Check } from 'lucide-react';
import { OFFICIAL_COPIES, SPA_BUSINESS_DATA } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { trackWhatsAppClick } from '../services/analytics';
import { EditableText } from './editor/EditableText';
import { EditableImage } from './editor/EditableImage';
import { EditableIcon } from './editor/EditableIcon';
import giftCardImg from '../assets/images/malivie-gift-card-instagram.webp';

export const GiftCardSection: React.FC = () => {
  return (
    <section id="gift-card" className="relative py-28 sm:py-36 bg-[#FBF9F6] text-[#2C2C2C] overflow-hidden">
      {/* Rose & Nude Terracotta Ambient Glows com respiração suave */}
      <div className="absolute top-1/3 right-0 w-[550px] h-[550px] bg-[#D3B8AA]/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#F0EAE1] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D3B8AA]/20 text-[#2C2C2C] border border-[#D3B8AA]/40 text-xs font-sans font-semibold uppercase tracking-[0.25em] mb-4"
          >
            <EditableIcon id="giftCard.badge.icon" defaultIcon="Gift" className="w-3.5 h-3.5 text-[#B99887]" />
            <EditableText id="giftCard.badge" defaultText="Experiência Para Quem Você Ama" as="span">
              Experiência Para Quem Você Ama
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
            className="font-serif text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2C2C2C] font-light leading-tight tracking-tight"
          >
            <EditableText
              id="giftCard.title"
              defaultText={OFFICIAL_COPIES.giftCardTitle}
              as="span"
            >
              {OFFICIAL_COPIES.giftCardTitle}
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.2, ease: EASE_ORGANIC }}
            className="mt-4 font-serif italic text-lg sm:text-2xl text-[#2D4536] max-w-2xl mx-auto leading-relaxed"
          >
            "
            <EditableText
              id="giftCard.tagline"
              defaultText={OFFICIAL_COPIES.giftCardTagline}
              as="span"
            >
              {OFFICIAL_COPIES.giftCardTagline}
            </EditableText>
            "
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
                <EditableImage
                  id="giftCard.image"
                  defaultImage={giftCardImg}
                  alt="Gift Card Maliviê SPA - O presente que não ocupa espaço na prateleira, mas sim no coração"
                  prefix="gift-card"
                  className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
                />

              </div>

              {/* Badges below image */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-[#555555]">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <EditableIcon id="giftCard.badgeFormat.icon" defaultIcon="Sparkles" className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <EditableText id="giftCard.badgeFormat" defaultText="Voucher Físico ou Digital" as="span">
                    Voucher Físico ou Digital
                  </EditableText>
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <EditableIcon id="giftCard.badgeValidity.icon" defaultIcon="Check" className="w-3.5 h-3.5 text-[#7A8B7B]" />
                  <EditableText id="giftCard.badgeValidity" defaultText="Validade de 60 dias" as="span">
                    Validade de 60 dias
                  </EditableText>
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
                <EditableText id="giftCard.hook" defaultText={OFFICIAL_COPIES.giftCardHook} as="span">
                  {OFFICIAL_COPIES.giftCardHook}
                </EditableText>
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#2C2C2C] font-light leading-snug">
                <EditableText id="giftCard.forWhom" defaultText={OFFICIAL_COPIES.giftCardForWhom} as="span">
                  {OFFICIAL_COPIES.giftCardForWhom}
                </EditableText>
              </h3>
            </div>

            {/* The 3 Personas - Inspiração Editorial */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#2D4536]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(211,184,170,0.18)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between space-y-2 cursor-default">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#2D4536] font-sans">
                  <EditableText id="giftCard.personaAmiga.label" defaultText="A Amiga" as="span">
                    A Amiga
                  </EditableText>
                </span>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "
                  <EditableText id="giftCard.personaAmiga" defaultText={OFFICIAL_COPIES.giftCardPersonaAmiga} as="span">
                    {OFFICIAL_COPIES.giftCardPersonaAmiga}
                  </EditableText>
                  "
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#B99887]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(211,184,170,0.18)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between space-y-2 cursor-default">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#966B57] font-sans">
                  <EditableText id="giftCard.personaMae.label" defaultText="A Mãe" as="span">
                    A Mãe
                  </EditableText>
                </span>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "
                  <EditableText id="giftCard.personaMae" defaultText={OFFICIAL_COPIES.giftCardPersonaMae} as="span">
                    {OFFICIAL_COPIES.giftCardPersonaMae}
                  </EditableText>
                  "
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] hover:border-[#D4AF37]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_28px_rgba(211,184,170,0.18)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between space-y-2 cursor-default">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8A7020] font-sans">
                  <EditableText id="giftCard.personaMulher.label" defaultText="A Mulher Admirada" as="span">
                    A Mulher Admirada
                  </EditableText>
                </span>
                <p className="text-xs text-[#555555] font-sans leading-relaxed">
                  "
                  <EditableText id="giftCard.personaMulher" defaultText={OFFICIAL_COPIES.giftCardPersonaMulher} as="span">
                    {OFFICIAL_COPIES.giftCardPersonaMulher}
                  </EditableText>
                  "
                </p>
              </div>
            </div>

            {/* Core Message Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#F0EAE1]/80 border border-[#D3B8AA]/40 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2D4536]">
                <EditableIcon id="giftCard.deliveryTitle.icon" defaultIcon="Heart" className="w-4 h-4 text-[#D3B8AA]" />
                <EditableText id="giftCard.deliveryTitle" defaultText="O que você realmente entrega" as="span">
                  O que você realmente entrega
                </EditableText>
              </div>

              <p className="font-serif italic text-base sm:text-lg text-[#2C2C2C] leading-relaxed">
                "
                <EditableText id="giftCard.experience" defaultText={OFFICIAL_COPIES.giftCardExperience} as="span">
                  {OFFICIAL_COPIES.giftCardExperience}
                </EditableText>
                "
              </p>

              {/* 3 Steps */}
              <div className="pt-3 border-t border-[#D3B8AA]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#2D4536]/15 text-[#213529] flex items-center justify-center text-[10px] font-bold">1</span>
                  <EditableText id="giftCard.deliveryStep1" defaultText="Ela escolhe o dia." as="span">
                    Ela escolhe o dia.
                  </EditableText>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#2D4536]/15 text-[#213529] flex items-center justify-center text-[10px] font-bold">2</span>
                  <EditableText id="giftCard.deliveryStep2" defaultText="Ela escolhe a experiência." as="span">
                    Ela escolhe a experiência.
                  </EditableText>
                </div>
                <div className="flex items-center gap-2 text-[#2C2C2C] font-medium">
                  <span className="w-5 h-5 rounded-full bg-[#D4AF37]/20 text-[#8A7020] flex items-center justify-center text-[10px] font-bold">3</span>
                  <EditableText id="giftCard.deliveryStep3" defaultText="Você entende o que ela precisava." as="span">
                    Você entende o que ela precisava.
                  </EditableText>
                </div>
              </div>
            </div>

            {/* Official Baseline Note */}
            <div className="p-4 rounded-2xl bg-white border border-[#E8E0D5] flex items-center gap-3 text-xs text-[#555555] shadow-xs">
              <EditableIcon id="giftCard.officialNote.icon" defaultIcon="Gift" className="w-5 h-5 text-[#B99887] flex-shrink-0" />
              <EditableText
                id="giftCard.officialNote"
                defaultText={OFFICIAL_COPIES.giftCardOfficial}
                as="p"
                className="leading-relaxed"
              >
                {OFFICIAL_COPIES.giftCardOfficial}
              </EditableText>
            </div>

            {/* CTA Button */}
            <div className="pt-1 flex flex-col sm:flex-row items-center gap-4">
              <MagneticButton
                href={SPA_BUSINESS_DATA.whatsapp.giftCardUrl()}
                onClick={() => trackWhatsAppClick('gift_card', 'geral')}
                target="_blank"
                rel="noopener noreferrer"
                variant="rose"
                size="lg"
                className="w-full sm:w-auto"
              >
                <EditableIcon id="giftCard.ctaButton.icon" defaultIcon="MessageCircle" className="w-5 h-5 text-[#121C16]" />
                <EditableText id="giftCard.ctaButton" defaultText="Presentear com Gift Card" as="span">
                  Presentear com Gift Card
                </EditableText>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
