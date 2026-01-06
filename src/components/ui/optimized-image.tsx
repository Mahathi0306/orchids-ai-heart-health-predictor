"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoadingComplete"> {
  /** Fallback content to show while loading */
  fallback?: React.ReactNode;
  /** Additional className for the wrapper */
  wrapperClassName?: string;
  /** Whether to show a blur placeholder */
  showBlur?: boolean;
  /** Aspect ratio for the wrapper (e.g., "16/9", "4/3", "1/1") */
  aspectRatio?: string;
}

/**
 * Optimized image component with:
 * - Automatic lazy loading
 * - Blur placeholder
 * - Error handling
 * - Proper responsive sizing
 * 
 * @example
 * <OptimizedImage
 *   src="/health-hero.jpg"
 *   alt="Health dashboard"
 *   aspectRatio="16/9"
 *   sizes="(max-width: 768px) 100vw, 50vw"
 * />
 */
export function OptimizedImage({
  src,
  alt,
  fallback,
  wrapperClassName,
  showBlur = true,
  aspectRatio,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={cn(
          "bg-slate-800/50 flex items-center justify-center text-slate-500",
          wrapperClassName
        )}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {fallback || (
          <span className="text-sm">Failed to load image</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", wrapperClassName)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isLoading && showBlur && (
        <div className="absolute inset-0 animate-pulse bg-slate-800/50" />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
}
