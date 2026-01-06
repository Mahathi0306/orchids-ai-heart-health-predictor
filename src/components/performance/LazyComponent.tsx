"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface LazyComponentOptions {
  /** Height of the skeleton loader */
  height?: string | number;
  /** Width of the skeleton loader */
  width?: string | number;
  /** Custom loading component */
  loading?: ReactNode;
  /** Whether to disable SSR */
  ssr?: boolean;
  /** Additional className for the skeleton */
  className?: string;
}

/**
 * Factory function to create lazily loaded components
 * Uses Next.js dynamic imports for code splitting
 * 
 * @example
 * const LazyChart = createLazyComponent(
 *   () => import("@/components/HeavyChart"),
 *   { height: 300 }
 * );
 */
export function createLazyComponent<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: LazyComponentOptions = {}
): ComponentType<T> {
  const {
    height = 200,
    width = "100%",
    loading,
    ssr = false,
    className = "",
  } = options;

  return dynamic(importFn, {
    ssr,
    loading: () =>
      loading || (
        <div
          className={`animate-pulse bg-slate-800/50 rounded-xl flex items-center justify-center ${className}`}
          style={{ height, width }}
        >
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      ),
  });
}

/**
 * Default loading skeleton for lazy components
 */
export function LazyLoadingSkeleton({ 
  height = 200, 
  className = "" 
}: { 
  height?: number | string; 
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse bg-slate-800/50 rounded-xl ${className}`}
      style={{ height }}
    >
      <Skeleton className="w-full h-full rounded-xl" />
    </div>
  );
}
