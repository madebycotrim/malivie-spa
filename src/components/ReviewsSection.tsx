import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  X 
} from 'lucide-react';
import { TESTIMONIALS } from '../data/spaData';
import { ReviewItem } from '../types';

// Ícone Oficial Multicolorido do Google "G"
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

// Ícone Oficial de Local Guide do Google (Estrela Laranja de 6 pontas)
const LocalGuideStarIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="#FF7A00" aria-hidden="true">
    <path d="M12 2l2.4 6.6 7 .6-5.3 4.6 1.6 6.9-5.7-3.6-5.7 3.6 1.6-6.9-5.3-4.6 7-.6z" />
  </svg>
);

export const ReviewsSection: React.FC = () => {
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

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

  const toggleExpand = (id: string) => {
    setExpandedComments((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="depoimentos" className="relative py-24 sm:py-32 bg-[#121C16] text-[#F3EFE6] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* ========================================================================= */}
        {/* CABEÇALHO OFICIAL                                                         */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#F3EFE6] font-light leading-tight"
          >
            Relatos de quem se permitiu <span className="italic font-normal text-[#D4AF37]">desacelerar</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-xs sm:text-sm text-[#F3EFE6]/75 font-sans max-w-xl mx-auto leading-relaxed"
          >
            "Sabe aquele lembrete de que a vida não precisa ser uma corrida o tempo todo? Conheça a experiência de quem encontrou no Maliviê o lugar ideal para renovar suas energias."
          </motion.p>
        </div>

        {/* ========================================================================= */}
        {/* CARROSSEL DE AVALIAÇÕES                                                   */}
        {/* ========================================================================= */}
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden py-2" ref={emblaRef}>
            <div className="flex">
              {TESTIMONIALS.map((review: ReviewItem) => {
                const isExpanded = !!expandedComments[review.id];

                return (
                  <div key={review.id} className="flex-[0_0_100%] min-w-0 px-2 sm:px-4">
                    <div className="rounded-3xl bg-[#18261E] border border-[#F3EFE6]/15 hover:border-[#D4AF37]/35 p-6 sm:p-9 shadow-lg flex flex-col justify-between overflow-hidden relative group transition-all duration-300">
                      
                      {/* Linha dourada suave no topo */}
                      <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

                      {/* 1. CLIENTE NO TOPO (PADRÃO GOOGLE AVALIAÇÕES) */}
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#F3EFE6]/10">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar com Badge de Local Guide se houver */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7A8B7B] to-[#18251E] border border-[#D4AF37]/50 flex items-center justify-center font-serif text-lg text-[#F3EFE6] font-semibold shadow-inner">
                              {review.avatarInitials}
                            </div>
                            {review.isLocalGuide && (
                              <div
                                className="absolute -bottom-1 -right-1 bg-[#121C16] p-0.5 rounded-full border border-[#FF7A00]"
                                title="Google Local Guide"
                              >
                                <LocalGuideStarIcon className="w-3.5 h-3.5" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-sans font-semibold text-base sm:text-lg text-[#F3EFE6]">
                                {review.author}
                              </h4>
                              {review.isLocalGuide && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-[#FF7A00] font-sans font-medium">
                                  <LocalGuideStarIcon className="w-3 h-3" />
                                  <span>Local Guide</span>
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#F3EFE6]/60 font-sans mt-0.5">
                              {review.localGuideDetails || review.location}
                            </p>
                          </div>
                        </div>

                        {/* Selo oficial discreto do Google no canto superior direito */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121C16] border border-[#F3EFE6]/10 text-[11px] text-[#F3EFE6]/75 flex-shrink-0">
                          <GoogleLogoIcon className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Google Avaliações</span>
                        </div>
                      </div>

                      {/* 2. ESTRELAS + DATA */}
                      <div className="pt-3.5 flex items-center gap-2.5">
                        <div className="flex items-center text-[#FBBC04] gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-[#FBBC04] text-[#FBBC04] drop-shadow-[0_0_6px_rgba(251,188,4,0.35)]"
                            />
                          ))}
                        </div>
                        <span className="text-xs text-[#F3EFE6]/55 font-sans ml-1">
                          {review.date}
                        </span>
                      </div>

                      {/* 3. CONTEÚDO DA AVALIAÇÃO (DESTAQUE + COMENTÁRIO + FOTOS) */}
                      <div className="pt-4 space-y-4 flex-1">
                        {/* Highlight Quote */}
                        <blockquote className="font-serif italic text-lg sm:text-xl text-[#D4AF37] font-light leading-snug">
                          "{review.highlight}"
                        </blockquote>

                        {/* Full / Truncated Comment */}
                        <p className="font-sans text-sm sm:text-base text-[#F3EFE6]/85 leading-relaxed font-light">
                          {isExpanded || review.comment.length <= 180
                            ? review.comment
                            : `${review.comment.slice(0, 180)}... `}
                          {review.comment.length > 180 && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(review.id)}
                              className="text-[#D4AF37] hover:underline font-semibold ml-1 cursor-pointer"
                            >
                              {isExpanded ? 'Menos' : 'Mais'}
                            </button>
                          )}
                        </p>

                        {/* Customer Photos if present */}
                        {review.photos && review.photos.length > 0 && (
                          <div className="pt-1">
                            <span className="text-[11px] text-[#F3EFE6]/50 uppercase tracking-wider block mb-2 font-sans font-medium">
                              Fotos publicadas pelo cliente:
                            </span>
                            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
                              {review.photos.map((photoUrl, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => setSelectedModalImage(photoUrl)}
                                  className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-[#F3EFE6]/20 hover:border-[#D4AF37] transition-all group cursor-pointer flex-shrink-0 shadow-md"
                                >
                                  <img
                                    src={photoUrl}
                                    alt={`Foto de avaliação de ${review.author}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
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
              className="p-3 rounded-full bg-[#18251E]/95 hover:bg-[#203328] text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#D4AF37] transition-all pointer-events-auto shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Avaliação anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="p-3 rounded-full bg-[#18251E]/95 hover:bg-[#203328] text-[#F3EFE6] border border-[#F3EFE6]/20 hover:border-[#D4AF37] transition-all pointer-events-auto shadow-md cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Próxima avaliação"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {scrollSnaps.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollTo(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  selectedIndex === idx
                    ? 'w-8 h-2 bg-[#D4AF37]'
                    : 'w-2 h-2 bg-[#F3EFE6]/20 hover:bg-[#F3EFE6]/50'
                }`}
                aria-label={`Ir para avaliação ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL LIGHTBOX PARA FOTOS DO CLIENTE                                      */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedModalImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelectedModalImage(null)}
          >
            <div
              className="relative max-w-3xl w-full max-h-[85vh] rounded-2xl overflow-hidden bg-[#18261E] border border-[#D4AF37]/40 shadow-2xl p-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedModalImage(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="Fechar foto"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedModalImage}
                alt="Foto em tamanho ampliado da avaliação do Google"
                className="w-full h-auto max-h-[80vh] object-contain rounded-xl mx-auto"
              />
              <div className="p-3 text-center text-xs text-[#F3EFE6]/80 font-sans">
                Foto autêntica postada por cliente na avaliação do Google Maps
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
