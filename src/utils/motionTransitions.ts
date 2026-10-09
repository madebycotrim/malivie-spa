/**
 * motionTransitions.ts
 * Sistema de curvas de física e transições de luxo para o Maliviê SPA.
 * Inspirado em "Slow Luxury", fluidez orgânica e rituais de desaceleração.
 */

import { Variants, Transition } from 'framer-motion';

// Curvas de Beziers de luxo (desaceleração aveludada / sedosa)
export const EASE_LUXURY = [0.16, 1, 0.3, 1] as const; // Super aveludado e cinematográfico
export const EASE_ORGANIC = [0.22, 1, 0.36, 1] as const; // Fluido, calmo e orgânico
export const EASE_BREATHE = [0.37, 0, 0.63, 1] as const; // Respiração contínua senoidal

// Transições padronizadas para componentes
export const TRANSITION_LUXURY: Transition = {
  duration: 1.1,
  ease: EASE_LUXURY,
};

export const TRANSITION_SMOOTH: Transition = {
  duration: 0.85,
  ease: EASE_ORGANIC,
};

export const TRANSITION_FAST_SMOOTH: Transition = {
  duration: 0.45,
  ease: EASE_ORGANIC,
};

// Física magnética aveludada (evita o efeito tech/borracha saltitante)
export const SPRING_VELVET = {
  type: 'spring' as const,
  stiffness: 95,
  damping: 22,
  mass: 0.25,
};

// Variantes com Stagger para coleções (cards de serviço, itens de ritual)
export const containerStaggerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const itemFadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.85,
      ease: EASE_LUXURY,
    },
  },
};

export const imageDissolveVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 1.03,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASE_ORGANIC,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.99,
    transition: {
      duration: 0.45,
      ease: EASE_ORGANIC,
    },
  },
};
