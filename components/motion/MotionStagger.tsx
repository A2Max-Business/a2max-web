"use client";

import { motion, useReducedMotion } from "motion/react";
import React from "react";
import { MOTION_DURATIONS, MOTION_STAGGER, MOTION_TRANSITIONS } from "./motionTokens";

interface MotionStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  initialDelay?: number;
  className?: string;
  triggerOnScroll?: boolean;
  viewportOnce?: boolean;
  viewportAmount?: number | "some" | "all";
}

export function MotionStagger({
  children,
  staggerDelay = MOTION_STAGGER.standard,
  initialDelay = 0,
  className = "",
  triggerOnScroll = false,
  viewportOnce = true,
  viewportAmount = 0.2,
}: MotionStaggerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: shouldReduceMotion ? 0 : initialDelay,
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
      },
    },
  };

  if (triggerOnScroll) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: viewportOnce, amount: viewportAmount }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MotionItemProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  direction?: "up" | "down" | "none";
  duration?: number;
}

export function MotionItem({
  children,
  className = "",
  distance = 12,
  direction = "up",
  duration = MOTION_DURATIONS.standard,
}: MotionItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialY = () => {
    if (shouldReduceMotion || direction === "none") return 0;
    return direction === "up" ? distance : -distance;
  };

  const itemVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: getInitialY(),
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : duration,
        ease: MOTION_TRANSITIONS.cinematic,
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
