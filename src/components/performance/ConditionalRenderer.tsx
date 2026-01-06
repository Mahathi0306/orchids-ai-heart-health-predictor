"use client";

import { ReactNode } from "react";
import { usePerformance } from "@/hooks/use-performance";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ConditionalRendererProps {
  /** Content to render on capable devices */
  children: ReactNode;
  /** Fallback content for low-end devices */
  fallback?: ReactNode;
  /** Require 3D capability */
  requires3D?: boolean;
  /** Require particle effects capability */
  requiresParticles?: boolean;
  /** Require animation capability */
  requiresAnimations?: boolean;
  /** Require desktop device */
  requiresDesktop?: boolean;
  /** Force render regardless of capabilities */
  forceRender?: boolean;
}

/**
 * Conditionally renders content based on device performance capabilities
 * 
 * @example
 * <ConditionalRenderer requires3D fallback={<StaticImage />}>
 *   <Heavy3DGlobe />
 * </ConditionalRenderer>
 */
export function ConditionalRenderer({
  children,
  fallback = null,
  requires3D = false,
  requiresParticles = false,
  requiresAnimations = false,
  requiresDesktop = false,
  forceRender = false,
}: ConditionalRendererProps) {
  const performance = usePerformance();
  const prefersReducedMotion = useReducedMotion();

  if (forceRender) {
    return <>{children}</>;
  }

  // Check each requirement
  if (requires3D && !performance.canHandle3D) {
    return <>{fallback}</>;
  }

  if (requiresParticles && !performance.canHandleParticles) {
    return <>{fallback}</>;
  }

  if (requiresAnimations && (!performance.canHandleAnimations || prefersReducedMotion)) {
    return <>{fallback}</>;
  }

  if (requiresDesktop && performance.isMobile) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
