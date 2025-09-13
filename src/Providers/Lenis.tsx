"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

interface Props {
  children: React.ReactNode;
}

const LenisProvider = ({ children }: Props) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.07, // Slightly faster for better responsiveness
      wheelMultiplier: 1,
      touchMultiplier: 2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
    });

    lenisRef.current = lenis;

    // Optimized RAF loop with throttling
    let frame: number;
    let lastTime = 0;
    const targetFPS = 60;
    const interval = 1000 / targetFPS;

    const raf = (time: number) => {
      if (time - lastTime >= interval) {
        lenis.raf(time);
        lastTime = time;
      }
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Pause lenis when page is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
