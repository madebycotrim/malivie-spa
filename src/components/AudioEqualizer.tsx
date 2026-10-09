import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { asmrEngine } from '../services/soundEngine';
import { EASE_ORGANIC } from '../utils/motionTransitions';

export const AudioEqualizer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteractedOnce, setHasInteractedOnce] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const [frequencies, setFrequencies] = useState<number[]>([15, 25, 40, 20, 30]);

  useEffect(() => {
    const unsubscribe = asmrEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });

    return () => {
      unsubscribe();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      const timer = setTimeout(() => {
        setFrequencies([12, 16, 10, 18, 14]);
      }, 0);
      return () => clearTimeout(timer);
    }

    const updateFrequencies = () => {
      const data = asmrEngine.getAnalyserData();
      if (data && data.length >= 8) {
        const f0 = Math.max(12, (data[2] / 255) * 36);
        const f1 = Math.max(16, (data[4] / 255) * 44);
        const f2 = Math.max(20, (data[6] / 255) * 48);
        const f3 = Math.max(14, (data[8] / 255) * 38);
        const f4 = Math.max(10, (data[10] / 255) * 32);
        setFrequencies([f0, f1, f2, f3, f4]);
      } else {
        // Fallback smooth random oscillation if analyser buffer is stabilizing
        const t = Date.now() / 300;
        setFrequencies([
          18 + Math.sin(t) * 10,
          26 + Math.cos(t * 1.2) * 14,
          32 + Math.sin(t * 0.8) * 12,
          22 + Math.cos(t * 1.5) * 12,
          16 + Math.sin(t * 1.1) * 8,
        ]);
      }
      animFrameRef.current = requestAnimationFrame(updateFrequencies);
    };

    animFrameRef.current = requestAnimationFrame(updateFrequencies);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handleToggle = () => {
    setHasInteractedOnce(true);
    asmrEngine.toggle();
  };

  return (
    <div className="hidden md:flex fixed md:bottom-8 md:right-8 z-40 flex-col items-end">
      {/* Gentle Luxury Pulse Tooltip (only on initial load if not clicked yet) */}
      <AnimatePresence>
        {!hasInteractedOnce && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ delay: 2.2, duration: 0.7, ease: EASE_ORGANIC }}
            className="mb-3 px-3.5 py-1.5 rounded-full bg-[#18251E]/95 border border-[#D4AF37]/30 text-xs text-[#F3EFE6] shadow-[0_10px_25px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span className="font-serif italic text-sm tracking-wide">Ouça o ASMR do Head Spa</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Glassmorphic Equalizer Button */}
      <motion.button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label={isPlaying ? 'Pausar áudio ASMR relaxante' : 'Ouvir áudio ambiente ASMR do Head Spa'}
        className={`group relative flex items-center gap-3 px-4 py-3 rounded-full backdrop-blur-xl transition-all duration-500 border cursor-pointer ${
          isPlaying
            ? 'bg-[#18251E]/90 border-[#7A8B7B] shadow-[0_0_30px_rgba(122,139,123,0.35)] ring-1 ring-[#7A8B7B]/40'
            : 'bg-[#121C16]/80 hover:bg-[#18251E] border-[#F3EFE6]/15 hover:border-[#D4AF37]/40 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
        }`}
      >
        {/* Glow ambient background aura com respiração suave */}
        {isPlaying && (
          <motion.div
            layoutId="equalizer-glow"
            className="absolute inset-0 rounded-full bg-[#7A8B7B]/25 blur-md pointer-events-none"
            animate={{ opacity: [0.35, 0.75, 0.35] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />
        )}

        {/* Dynamic SVG Equalizer Bars */}
        <div className="relative w-7 h-6 flex items-end justify-between gap-[3px] py-0.5">
          {frequencies.map((height, i) => (
            <motion.span
              key={i}
              className={`w-[3px] rounded-full transition-all duration-150 ease-out ${
                isPlaying
                  ? 'bg-gradient-to-t from-[#7A8B7B] to-[#D4AF37]'
                  : 'bg-[#F3EFE6]/40 group-hover:bg-[#F3EFE6]/70'
              }`}
              style={{
                height: `${Math.min(22, Math.max(4, height * 0.5))}px`,
              }}
            />
          ))}
        </div>

        {/* Audio Icon & Text */}
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            {isPlaying ? (
              <Volume2 className="w-3.5 h-3.5 text-[#7A8B7B]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#F3EFE6]/65 group-hover:text-[#F3EFE6]/80" />
            )}
            <span className="text-[11px] font-sans uppercase tracking-widest font-semibold text-[#F3EFE6]">
              {isPlaying ? 'ASMR Ativo' : 'ASMR Head Spa'}
            </span>
          </div>
          <span className="text-[10px] text-[#F3EFE6]/60 font-serif italic">
            {isPlaying ? 'Água morna em cascata' : 'Toque para relaxar'}
          </span>
        </div>

        {/* Ping status ring when active */}
        {isPlaying && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8B7B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A8B7B]"></span>
          </span>
        )}
      </motion.button>

      {/* Hover Info Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute bottom-full right-0 mb-2 w-64 p-3 rounded-xl bg-[#121C16]/95 border border-[#D4AF37]/20 text-[#F3EFE6] text-xs shadow-2xl backdrop-blur-md pointer-events-none hidden md:block"
          >
            <p className="font-serif italic text-sm text-[#D4AF37] mb-1">Ritual Sonoro Binaural</p>
            <p className="text-[#F3EFE6]/80 leading-relaxed text-[11px]">
              Fluxo hídrico relaxante e massagem capilar para desacelerar seus batimentos e induzir calma imediata.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
