import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, ChevronDown, Droplets, ArrowUpRight, Sparkles } from 'lucide-react';
import { SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
import { GoogleLogoIcon } from './SocialIcons';
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
        {/* Luxury Floating Google 5.0 Rating Capsule Badge */}
        <motion.a
          href="#depoimentos"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2, scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXURY }}
          className="relative inline-flex items-center gap-2.5 sm:gap-3.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full bg-[#18251E]/90 border border-[#D4AF37]/35 hover:border-[#D4AF37]/80 backdrop-blur-xl mb-8 shadow-[0_8px_30px_rgba(0,0,0,0.4),_inset_0_1px_1px_rgba(255,255,255,0.12)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.22),_inset_0_1px_2px_rgba(255,255,255,0.2)] transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer group overflow-hidden"
          title="Ver mais de 117 avaliações 5.0 no Google Maps"
        >
          {/* Subtle Shimmer Ray */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

          {/* Google Icon Pill */}
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1 shadow-xs flex-shrink-0">
            <GoogleLogoIcon className="w-3.5 h-3.5" />
          </div>

          {/* 5 Stars Group */}
          <div className="flex items-center text-[#FBBC04] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#FBBC04] text-[#FBBC04] drop-shadow-[0_0_6px_rgba(251,188,4,0.35)]" />
            ))}
          </div>

          {/* Separator */}
          <div className="h-3.5 w-[1px] bg-[#F3EFE6]/20" />

          {/* Score & Label */}
          <div className="flex items-center gap-1.5 text-xs text-[#F3EFE6]/90 font-medium">
            <span className="font-serif font-bold text-sm text-[#F3EFE6] group-hover:text-[#D4AF37] transition-colors">5.0</span>
            <span className="tracking-wide">Avaliação no Google</span>
          </div>

          {/* Micro Social Proof Badge */}
          <span className="hidden sm:inline-flex items-center text-[10px] font-sans font-semibold tracking-wider text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
            {SPA_BUSINESS_DATA.rating.totalReviews}+ relatos
          </span>

          {/* Directional Subtle Arrow */}
          <ArrowUpRight className="w-3.5 h-3.5 text-[#7A8B7B] group-hover:text-[#D4AF37] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
        </motion.a>

        {/* Animated Brand Name with Official Calligraphic Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: EASE_LUXURY }}
          className="relative mb-5 flex flex-col items-center"
        >
          <h1 className="block text-[11px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-[#94A595] font-sans font-semibold mb-4 leading-relaxed">
            Head Spa Coreano &amp; Day Spa
            <span className="text-[#D4AF37]/70 mx-2" aria-hidden="true">·</span>
            <span className="whitespace-nowrap">{OFFICIAL_COPIES.locationSubtitle}</span>
          </h1>
          <img
            src={logoMalivieWhite}
            alt={OFFICIAL_COPIES.title}
            className="w-auto h-24 sm:h-32 md:h-40 object-contain filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)] hover:scale-[1.02] transition-transform duration-700 ease-out"
          />
        </motion.div>

        {/* Official Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE_ORGANIC }}
          className="relative max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 h-[1px] bg-[#D4AF37]/40" />
            <p className="font-serif italic text-2xl sm:text-3xl text-[#D4AF37] tracking-wide font-normal">
              "{OFFICIAL_COPIES.slogan}"
            </p>
            <span className="w-8 h-[1px] bg-[#D4AF37]/40" />
          </div>
        </motion.div>

        {/* Sensory Feature Micro-Pills */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65, ease: EASE_ORGANIC }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10 text-xs text-[#F3EFE6]/70"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10 hover:border-[#7A8B7B]/40 transition-colors">
            <Droplets className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Head SPA
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10 hover:border-[#D4AF37]/40 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Rituais de Autocuidado
          </span>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10 hover:border-[#7A8B7B]/40 transition-colors">
            <Sparkles className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Massagens Relaxantes
          </span>
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
