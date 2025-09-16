"use client";

import { useEffect } from "react";

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development or when explicitly enabled
    if (
      process.env.NODE_ENV !== "development" &&
      !process.env.NEXT_PUBLIC_ENABLE_PERF_MONITOR
    ) {
      return;
    }

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metricName = entry.name;
        const value = Math.round(
          (entry as PerformanceEntry & { value?: number }).value ||
            entry.duration
        );

        // Log performance metrics
        console.log(`🚀 ${metricName}: ${value}ms`);

        // You can send these to analytics services
        if (
          typeof window !== "undefined" &&
          (window as typeof window & { gtag?: unknown }).gtag
        ) {
          (
            window as typeof window & { gtag: (...args: unknown[]) => void }
          ).gtag("event", metricName, {
            value: value,
            metric_id:
              (entry as PerformanceEntry & { id?: string }).id || entry.name,
          });
        }
      }
    });

    // Observe various performance metrics
    try {
      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });
    } catch {
      // Browser doesn't support all metrics
      console.log("Some performance metrics not supported");
    }

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn(`⚠️ Long task detected: ${Math.round(entry.duration)}ms`);
      }
    });

    try {
      longTaskObserver.observe({ entryTypes: ["longtask"] });
    } catch {
      // Browser doesn't support long task monitoring
    }

    // Monitor memory usage if available
    if ("memory" in performance) {
      const checkMemory = () => {
        const memory = (
          performance as Performance & {
            memory?: { usedJSHeapSize: number; jsHeapSizeLimit: number };
          }
        ).memory;
        if (memory && memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn("⚠️ High memory usage detected");
        }
      };

      const memoryInterval = setInterval(checkMemory, 30000); // Check every 30 seconds

      return () => {
        observer.disconnect();
        longTaskObserver.disconnect();
        clearInterval(memoryInterval);
      };
    }

    return () => {
      observer.disconnect();
      longTaskObserver.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceMonitor;
