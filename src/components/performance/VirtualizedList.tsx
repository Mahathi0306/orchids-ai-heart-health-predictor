"use client";

import { useRef, useState, useEffect, ReactNode, CSSProperties } from "react";

interface VirtualizedListProps<T> {
  /** Array of items to render */
  items: T[];
  /** Height of each item in pixels */
  itemHeight: number;
  /** Height of the container in pixels */
  containerHeight: number;
  /** Render function for each item */
  renderItem: (item: T, index: number) => ReactNode;
  /** Number of items to render above/below the visible area */
  overscan?: number;
  /** Additional className for the container */
  className?: string;
  /** Gap between items in pixels */
  gap?: number;
}

/**
 * A lightweight virtualized list component for rendering large lists efficiently
 * Only renders items that are visible in the viewport plus overscan
 * 
 * @example
 * <VirtualizedList
 *   items={healthRecords}
 *   itemHeight={80}
 *   containerHeight={500}
 *   renderItem={(record) => <HealthRecordCard record={record} />}
 * />
 */
export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 3,
  className = "",
  gap = 0,
}: VirtualizedListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const effectiveItemHeight = itemHeight + gap;
  const totalHeight = items.length * effectiveItemHeight - gap;
  
  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / effectiveItemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / effectiveItemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop(container.scrollTop);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          const style: CSSProperties = {
            position: "absolute",
            top: actualIndex * effectiveItemHeight,
            left: 0,
            right: 0,
            height: itemHeight,
          };

          return (
            <div key={actualIndex} style={style}>
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
