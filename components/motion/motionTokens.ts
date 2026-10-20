/**
 * A2Max Motion System v1.0
 * Tokens de movimento cinematográfico refinado
 */

export const MOTION_TRANSITIONS = {
  // Curva cinematográfica suave com desaceleração orgânica
  cinematic: [0.22, 1, 0.36, 1] as const,
  // Curva para microinterações táteis rápidas
  interaction: [0.16, 1, 0.3, 1] as const,
};

export const MOTION_DURATIONS = {
  subtle: 0.45,
  standard: 0.65,
  cinematic: 0.85,
  scenic: 1.0,
};

export const MOTION_STAGGER = {
  tight: 0.08,
  standard: 0.12,
  relaxed: 0.18,
};

// Variantes base de Fade In com elevação vertical discreta (sem layout shift)
export const fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: MOTION_DURATIONS.standard,
      ease: MOTION_TRANSITIONS.cinematic,
      delay: customDelay,
    },
  }),
};

// Variantes puras de Opacidade (para backgrounds, vinhetas, divisores)
export const fadeOnlyVariants = {
  hidden: {
    opacity: 0,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: MOTION_DURATIONS.cinematic,
      ease: MOTION_TRANSITIONS.cinematic,
      delay: customDelay,
    },
  }),
};
