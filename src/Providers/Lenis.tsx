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
      // You can tweak options:
      smoothWheel: true,
      lerp: 0.1, // scroll speed
    });

    lenisRef.current = lenis;

    // RAF loop
    let frame: number;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default LenisProvider;
