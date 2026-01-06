"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { usePerformance } from "@/hooks/use-performance";
import { forwardRef, HTMLAttributes, ReactNode } from "react";

export interface PerformanceAwareMotionProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  /** Animation variant for initial state */
  initial?: Record<string, unknown> | boolean;
  /** Animation variant for animate state */
  animate?: Record<string, unknown> | boolean;
  /** Animation variant for exit state */
  exit?: Record<string, unknown>;
  /** Transition configuration */
  transition?: Record<string, unknown>;
  /** Fallback for when animations are disabled */
  fallbackClassName?: string;
  /** Force animations even on low-end devices */
  forceAnimation?: boolean;
  /** Motion variants */
  variants?: Record<string, unknown>;
  /** whileHover animation */
  whileHover?: Record<string, unknown>;
  /** whileTap animation */
  whileTap?: Record<string, unknown>;
}

/**
 * A performance-aware wrapper around framer-motion's motion.div
 * Automatically disables animations for:
 * - Users who prefer reduced motion
 * - Low-end devices
 * - Mobile devices (optional heavy animations)
 */
export const PerformanceAwareMotion = forwardRef<HTMLDivElement, PerformanceAwareMotionProps>(
  function PerformanceAwareMotion(
    { 
      children, 
      initial, 
      animate,
      exit,
      transition, 
      fallbackClassName,
      forceAnimation = false,
      variants,
      whileHover,
      whileTap,
      className,
      ...props 
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion();
    const { canHandleAnimations } = usePerformance();

    const shouldAnimate = forceAnimation || (!prefersReducedMotion && canHandleAnimations);

    if (!shouldAnimate) {
      // Render static div without animations
      return (
        <div ref={ref} className={fallbackClassName || className} {...props}>
          {children}
        </div>
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const MotionDiv = motion.div as any;

    return (
      <MotionDiv
        ref={ref}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        variants={variants}
        whileHover={whileHover}
        whileTap={whileTap}
        className={className}
        {...props}
      >
        {children}
      </MotionDiv>
    );
  }
);
