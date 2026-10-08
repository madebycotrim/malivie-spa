import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Sparkles, ChevronDown, Droplets } from 'lucide-react';
import { SPA_BUSINESS_DATA, OFFICIAL_COPIES } from '../data/spaData';
import { MagneticButton } from './MagneticButton';
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
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform motion-safe:animate-pulse-slow filter brightness-90 contrast-110"
        />
        {/* Deep Botanical Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121C16] via-[#121C16]/65 to-[#121C16]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#121C16]/50 to-[#121C16]" />
        
        {/* Subtle Luxury Gold Shimmer Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#7A8B7B]/15 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[110px] pointer-events-none" />
      </div>

      {/* Layer 1 & 2: Glass Container & High-Fashion Typography */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Floating Google 5.0 Star Badge */}
        <motion.a
          href="#depoimentos"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#18251E]/80 border border-[#D4AF37]/30 backdrop-blur-md mb-8 shadow-[0_4px_25px_rgba(0,0,0,0.3)] hover:border-[#D4AF37]/80 hover:bg-[#1E2E25] transition-all cursor-pointer group"
          title="Ver avaliações no Google Maps"
        >
          <div className="flex items-center text-[#D4AF37] gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            ))}
          </div>
          <div className="h-3 w-[1px] bg-[#F3EFE6]/20" />
          <span className="text-xs text-[#F3EFE6] font-medium tracking-wide group-hover:text-[#D4AF37] transition-colors">
            {OFFICIAL_COPIES.googleRatingBadge}
          </span>
          <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
        </motion.a>

        {/* Animated Brand Name with Official Calligraphic Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative mb-5 flex flex-col items-center"
        >
          <span className="block text-xs uppercase tracking-[0.4em] text-[#7A8B7B] font-sans font-semibold mb-4">
            {OFFICIAL_COPIES.locationSubtitle}
          </span>
          <h1 className="sr-only">{OFFICIAL_COPIES.title}</h1>
          <img
            src={logoMalivieWhite}
            alt={OFFICIAL_COPIES.title}
            className="w-auto h-24 sm:h-32 md:h-40 object-contain filter drop-shadow-[0_4px_30px_rgba(0,0,0,0.7)]"
          />
        </motion.div>

        {/* Official Slogan */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 mb-10 text-xs text-[#F3EFE6]/70"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10">
            <Droplets className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Head SPA
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Rituais de Autocuidado
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18251E]/60 border border-[#F3EFE6]/10">
            <Sparkles className="w-3.5 h-3.5 text-[#7A8B7B]" />
            Massagens Relaxantes
          </span>
        </motion.div>

        {/* Magnetic CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton
            href={SPA_BUSINESS_DATA.social.linktree}
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

      {/* Subtle Scroll Indicator */}
      <motion.button
        type="button"
        onClick={scrollToManifesto}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#F3EFE6]/40 hover:text-[#D4AF37] transition-colors p-2 focus:outline-none flex flex-col items-center gap-1 z-10"
        aria-label="Rolar para a próxima seção"
      >
        <span className="text-[10px] uppercase tracking-widest font-sans">Deslize</span>
        <ChevronDown className="w-4 h-4" />
      </motion.button>
    </section>
  );
};
