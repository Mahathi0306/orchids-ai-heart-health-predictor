import { useEffect, useState } from "react";

interface PerformanceProfile {
  /** Whether the device can handle heavy animations */
  canHandleAnimations: boolean;
  /** Whether the device can handle 3D graphics */
  canHandle3D: boolean;
  /** Whether the device can handle particle effects */
  canHandleParticles: boolean;
  /** Whether user is on a mobile device */
  isMobile: boolean;
  /** Whether user is on a low-end device */
  isLowEnd: boolean;
  /** Number of CPU cores */
  cpuCores: number;
  /** Amount of device memory in GB (if available) */
  deviceMemory: number | null;
  /** Whether the user has a slow connection */
  isSlowConnection: boolean;
}

/**
 * Hook to detect device performance capabilities
 * Used to conditionally render heavy components like 3D graphics or particles
 */
export function usePerformance(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    canHandleAnimations: true,
    canHandle3D: true,
    canHandleParticles: true,
    isMobile: false,
    isLowEnd: false,
    cpuCores: 4,
    deviceMemory: null,
    isSlowConnection: false,
  });

  useEffect(() => {
    const checkPerformance = () => {
      // Check CPU cores
      const cpuCores = navigator.hardwareConcurrency || 4;

      // Check device memory (Chrome only)
      const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || null;

      // Check if mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

      // Check connection speed
      const connection = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
      const isSlowConnection = connection?.effectiveType === "slow-2g" || 
                               connection?.effectiveType === "2g" || 
                               connection?.saveData === true;

      // Determine if low-end device
      const isLowEnd = cpuCores <= 2 || 
                       (deviceMemory !== null && deviceMemory <= 2) || 
                       isSlowConnection;

      // Calculate capabilities
      const canHandleAnimations = !isLowEnd && cpuCores >= 2;
      const canHandle3D = !isMobile && !isLowEnd && cpuCores >= 4 && (deviceMemory === null || deviceMemory >= 4);
      const canHandleParticles = !isMobile && !isLowEnd && cpuCores >= 4;

      setProfile({
        canHandleAnimations,
        canHandle3D,
        canHandleParticles,
        isMobile,
        isLowEnd,
        cpuCores,
        deviceMemory,
        isSlowConnection,
      });
    };

    checkPerformance();

    // Re-check on resize (for mobile detection)
    window.addEventListener("resize", checkPerformance);
    return () => window.removeEventListener("resize", checkPerformance);
  }, []);

  return profile;
}
