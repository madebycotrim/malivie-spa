import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { TESTIMONIALS } from '../data/spaData';
import { ReviewItem } from '../types';
import { EASE_LUXURY, EASE_ORGANIC } from '../utils/motionTransitions';
import { EditableText } from './editor/EditableText';

// Ícone Multicolorido do Google "G"
const GoogleLogoIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

export const ReviewsSection: React.FC = () => {
  // Configuração do Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'center', skipSnaps: false },
    [Autoplay({ delay: 6500, stopOnInteraction: true })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    queueMicrotask(onInit);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onInit);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onInit);
    };
  }, [emblaApi, onSelect]);

  return (
    <section id="depoimentos" className="relative py-24 sm:py-32 bg-[#121C16] text-[#F3EFE6] overflow-hidden">
      {/* Botanical ambient halos com respiração suave */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#7A8B7B]/10 rounded-full blur-[140px] pointer-events-none animate-zen-breathe" />
      <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] bg-[#D4AF37]/10 rounded-full blur-[130px] pointer-events-none animate-zen-breathe-delayed" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* CABEÇALHO COM SELO OFICIAL GOOGLE MAPS                                   */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE_ORGANIC }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#18261E] border border-[#D4AF37]/35 text-xs sm:text-sm text-[#F3EFE6] mb-5 shadow-sm"
          >
            <GoogleLogoIcon className="w-4 h-4" />
            <span className="font-semibold text-[#FBBC04]">5.0 ★★★★★</span>
            <span className="text-[#F3EFE6]/40">·</span>
            <EditableText id="reviews.badge" defaultText="117+ avaliações reais no Google Maps" as="span">
              117+ avaliações reais no Google Maps
            </EditableText>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            <EditableText id="reviews.title" defaultText="Relatos de quem se permitiu desacelerar" as="span">
              Relatos de quem se permitiu <span className="italic font-normal text-[#D4AF37]">desacelerar</span>
            </EditableText>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.85, delay: 0.15, ease: EASE_ORGANIC }}
            className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/75 font-sans max-w-xl mx-auto leading-relaxed"
          >
            <EditableText
              id="reviews.description"
              defaultText="Depoimentos 100% autênticos extraídos diretamente da ficha oficial do Google Maps de clientes que viveram a experiência Maliviê."
              as="span"
            >
              Depoimentos 100% autênticos extraídos diretamente da ficha oficial do Google Maps de clientes que viveram a experiência Maliviê.
            </EditableText>
          </motion.p>
        </div>

        {/* ========================================================================= */}
        {/* CARROSSEL DE AVALIAÇÕES                                                   */}
        {/* ========================================================================= */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((review: ReviewItem) => {
                return (
                  <div key={review.id} className="flex-[0_0_100%] min-w-0 px-2 sm:px-4">
                    <div className="rounded-3xl bg-[#18261E] border border-[#F3EFE6]/15 hover:border-[#D4AF37]/50 p-6 sm:p-9 shadow-lg hover:shadow-[0_25px_60px_rgba(0,0,0,0.55),_0_0_25px_rgba(212,175,55,0.12)] hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden relative group transition-all duration-500 ease-out">
                      
                      {/* Linha dourada suave no topo que brilha no hover */}
                      <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Varredura de luz suave ao passar o mouse */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                      {/* 1. CLIENTE NO TOPO (PADRÃO GOOGLE AVALIAÇÕES) */}
                      {/* 1. CABEÇALHO DO CARD: AVATAR + NOME/CIDADE */}
                      <div className="flex items-center gap-3.5">
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7A8B7B] to-[#18251E] border border-[#D4AF37]/50 flex items-center justify-center font-serif text-lg text-[#F3EFE6] font-semibold shadow-inner">
                            {review.avatarInitials}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-sans font-semibold text-base sm:text-lg text-[#F3EFE6]">
                            <EditableText id={`review.${review.id}.author`} defaultText={review.author} as="span">
                              {review.author}
                            </EditableText>
                          </h3>
                          <p className="text-xs text-[#F3EFE6]/60 font-sans mt-0.5">
                            <EditableText id={`review.${review.id}.location`} defaultText={review.location} as="span">
                              {review.location}
                            </EditableText>
                          </p>
                        </div>
                      </div>

                      {/* 2. ESTRELAS + DATA */}
                      <div className="pt-3 flex items-center gap-2.5">
                        <div className="flex items-center text-[#FBBC04] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#FBBC04] text-[#FBBC04] drop-shadow-[0_0_6px_rgba(251,188,4,0.35)]"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#F3EFE6]/55 font-sans ml-1">
                          <EditableText id={`review.${review.id}.date`} defaultText={review.date} as="span">
                            {review.date}
                          </EditableText>
                        </span>
                      </div>

                      {/* 3. CONTEÚDO DA AVALIAÇÃO INTEGRAL */}
                      <div className="pt-4 flex-1">
                        <p className="font-sans text-sm sm:text-base text-[#F3EFE6]/90 leading-relaxed font-normal">
                          "
                          <EditableText id={`review.${review.id}.comment`} defaultText={review.comment} as="span">
                            {review.comment}
                          </EditableText>
                          "
                        </p>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center justify-between absolute top-1/2 -left-3 sm:-left-6 -right-3 sm:-right-6 -translate-y-1/2 pointer-events-none z-20">
            <button
              type="button"
              onClick={scrollPrev}
              className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-[#18251E]/95 hover:bg-[#203328] text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#D4AF37] transition-all pointer-events-auto shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Avaliação anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center rounded-full bg-[#18251E]/95 hover:bg-[#203328] text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#D4AF37] transition-all pointer-events-auto shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Próxima avaliação"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel Dots with 48px touch-friendly target area */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                className="p-3 min-w-[48px] min-h-[48px] flex items-center justify-center cursor-pointer focus:outline-none"
                aria-label={`Ir para avaliação ${idx + 1}`}
              >
                <span
                  className={`transition-all duration-300 rounded-full block ${
                    selectedIndex === idx
                      ? 'w-8 h-2 bg-[#D4AF37]'
                      : 'w-2 h-2 bg-[#F3EFE6]/40 hover:bg-[#F3EFE6]/70'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>


      </div>


    </section>
  );
};
