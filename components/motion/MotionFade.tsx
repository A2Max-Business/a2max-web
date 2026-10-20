"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";
import { MOTION_DURATIONS, MOTION_TRANSITIONS } from "./motionTokens";

interface MotionFadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "none";
  distance?: number;
  className?: string;
  viewportOnce?: boolean;
  viewportAmount?: number | "some" | "all";
  triggerOnScroll?: boolean;
}

export function MotionFade({
  children,
  delay = 0,
  duration = MOTION_DURATIONS.standard,
  direction = "up",
  distance = 14,
  className = "",
  viewportOnce = true,
  viewportAmount = 0.2,
  triggerOnScroll = false,
}: MotionFadeProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialY = () => {
    if (shouldReduceMotion || direction === "none") return 0;
    return direction === "up" ? distance : -distance;
  };

  const initial = {
    opacity: shouldReduceMotion ? 1 : 0,
    y: getInitialY(),
  };

  const target = {
    opacity: 1,
    y: 0,
    transition: {
      duration: shouldReduceMotion ? 0 : duration,
      ease: MOTION_TRANSITIONS.cinematic,
      delay: shouldReduceMotion ? 0 : delay,
    },
  };

  if (triggerOnScroll) {
    return (
      <motion.div
        initial={initial}
        whileInView={target}
        viewport={{ once: viewportOnce, amount: viewportAmount }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      animate={target}
      className={className}
    >
      {children}
    </motion.div>
  );
}
