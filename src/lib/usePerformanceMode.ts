import { useEffect, useState } from "react";

/**
 * Detect whether the device should use the reduced (fade) animation
 * instead of the full 3D page-turn.
 */
export const usePerformanceMode = (): "full" | "reduced" => {
  const [mode, setMode] = useState<"full" | "reduced">("full");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // @ts-expect-error - non-standard
    const deviceMemory: number | undefined = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency ?? 8;

    const lowEnd =
      reducedMotion ||
      (typeof deviceMemory === "number" && deviceMemory <= 2) ||
      cores <= 2;

    setMode(lowEnd ? "reduced" : "full");
  }, []);

  return mode;
};
