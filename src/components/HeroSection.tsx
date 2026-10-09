import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { trackWhatsAppClick } from '../services/analytics';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import heroImage from '../assets/images/hero-head-spa.webp';
import logoMalivieWhite from '../assets/images/logo-malivie-white.webp';

export const HeroSection: React.FC = () => {
  const scrollToManifesto = () => {
    const el = document.getElementById('manifesto');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-[#121C16] pt-28 pb-16 px-5 sm:px-8">
      {/* Layer 0: Background Texture, Botanical Ambient Vignette and Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Maliviê Head Spa Coreano com arco hídrico e iluminação relaxante"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform motion-safe:animate-zen-breathe filter brightness-90 contrast-110"
        />
        {/* Deep Botanical Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121C16] via-[#121C16]/65 to-[#121C16]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#121C16]/50 to-[#121C16]" />

        {/* Subtle Luxury Zen Light Halos with Slow Breathing */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#7A8B7B]/15 rounded-full blur-[140px] pointer-events-none animate-zen-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-[#D4AF37]/10 rounded-full blur-[120px] pointer-events-none animate-zen-breathe-delayed" />
      </div>

      {/* Layer 1 & 2: Glass Container & High-Fashion Typography */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Animated Brand Name with Official Calligraphic Logo em Destaque */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: EASE_LUXURY }}
          className="relative mb-6 sm:mb-8 flex flex-col items-center"
        >
          <img
            src={logoMalivieWhite}
            alt={OFFICIAL_COPIES.title}
            className="w-auto h-28 sm:h-36 md:h-44 lg:h-48 object-contain filter drop-shadow-[0_8px_35px_rgba(0,0,0,0.7)] hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
          <h1 className="block text-xs sm:text-sm uppercase tracking-[0.35em] sm:tracking-[0.45em] text-[#94A595] font-sans font-medium mt-3 mb-2 leading-relaxed">
            <span className="whitespace-nowrap">{OFFICIAL_COPIES.locationSubtitle}</span>
          </h1>
        </motion.div>

        {/* Official Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: EASE_ORGANIC }}
          className="relative max-w-2xl mx-auto mb-10 sm:mb-12"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]/40" />
            <p className="font-serif italic text-2xl sm:text-3xl text-[#D4AF37] tracking-wide font-normal">
              "{OFFICIAL_COPIES.slogan}"
            </p>
            <span className="w-8 h-[1px] bg-[#D4AF37]/40" />
          </div>
        </motion.div>

        {/* Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.95, delay: 0.8, ease: EASE_LUXURY }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton
            href={SPA_BUSINESS_DATA.whatsapp.heroUrl}
            onClick={() => trackWhatsAppClick('hero')}
            target="_blank"
            rel="noopener noreferrer"
            variant="sage"
            size="lg"
            className="w-full sm:w-auto font-medium"
          >
            <MessageCircle className="w-5 h-5 text-[#121C16]" />
            <span>{OFFICIAL_COPIES.ctaButton}</span>
          </MagneticButton>

          <MagneticButton
            onClick={scrollToManifesto}
            variant="glass"
            size="lg"
            className="w-full sm:w-auto"
          >
            <span>Conhecer o Ritual de Boas-Vindas</span>
            <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
          </MagneticButton>
        </motion.div>
      </div>

      {/* Subtle Sensory Scroll Indicator (Cascata / Gota d'água suave) */}
      <motion.button
        type="button"
        onClick={scrollToManifesto}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F3EFE6]/65 hover:text-[#D4AF37] transition-colors p-2 focus:outline-none flex flex-col items-center gap-1.5 z-10 group cursor-pointer"
        aria-label="Rolar para a próxima seção"
      >
        <span className="text-[10px] uppercase tracking-widest font-sans font-medium text-[#F3EFE6]/60 group-hover:text-[#D4AF37] transition-colors">Deslize</span>
        <div className="w-5 h-8 rounded-full border border-[#F3EFE6]/25 group-hover:border-[#D4AF37]/50 flex items-start justify-center p-1 transition-colors">
          <div className="w-1.5 h-2 rounded-full bg-[#D4AF37] animate-water-drop" />
        </div>
      </motion.button>
    </section>
  );
};
