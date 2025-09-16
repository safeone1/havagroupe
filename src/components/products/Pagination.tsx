"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  className?: string;
}

/**
 * Enhanced Pagination component with better accessibility and UX
 */
export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  className,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoized navigation function
  const navigateToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return;

      const params = new URLSearchParams(searchParams.toString());

      if (page === 1) {
        params.delete("page");
      } else {
        params.set("page", page.toString());
      }

      const newURL = `/products?${params.toString()}`;
      router.push(newURL, { scroll: false });
    },
    [currentPage, totalPages, searchParams, router]
  );

  // Keyboard navigation handler
  const handleKeyNavigation = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          if (hasPreviousPage) {
            event.preventDefault();
            navigateToPage(currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (hasNextPage) {
            event.preventDefault();
            navigateToPage(currentPage + 1);
          }
          break;
        case "Home":
          event.preventDefault();
          navigateToPage(1);
          break;
        case "End":
          event.preventDefault();
          navigateToPage(totalPages);
          break;
      }
    },
    [currentPage, hasNextPage, hasPreviousPage, totalPages, navigateToPage]
  );

  // Memoized page numbers generation
  const pageNumbers = useMemo(() => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // For mobile, show fewer pages
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const actualDelta = isMobile ? 1 : delta;

    // Calculate start and end
    const start = Math.max(1, currentPage - actualDelta);
    const end = Math.min(totalPages, currentPage + actualDelta);

    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    // Add first page and dots if necessary
    if (start > 1) {
      if (start > 2) {
        rangeWithDots.push(1, "start-ellipsis");
      } else {
        rangeWithDots.push(1);
      }
    }

    // Add the range
    rangeWithDots.push(...range);

    // Add last page and dots if necessary
    if (end < totalPages) {
      if (end < totalPages - 1) {
        rangeWithDots.push("end-ellipsis", totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  // Early return if no pagination needed
  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.nav
      className={cn("flex items-center justify-center", className)}
      role="navigation"
      aria-label="Pagination navigation"
      onKeyDown={handleKeyNavigation}
      tabIndex={0}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-1">
        {/* First page button (desktop only) */}
        <div className="hidden sm:block">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(1)}
            disabled={currentPage === 1}
            className="h-9 w-9 p-0"
            aria-label="Go to first page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage - 1)}
          disabled={!hasPreviousPage}
          className="h-9 w-9 p-0"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNumber) => {
            // Handle ellipsis
            if (typeof pageNumber === "string") {
              return (
                <div
                  key={pageNumber}
                  className="flex h-9 w-9 items-center justify-center"
                  aria-hidden="true"
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </div>
              );
            }

            const page = pageNumber as number;
            const isCurrentPage = page === currentPage;

            return (
              <Button
                key={page}
                variant={isCurrentPage ? "default" : "outline"}
                size="sm"
                onClick={() => navigateToPage(page)}
                className={cn(
                  "h-9 w-9 p-0 transition-all",
                  isCurrentPage && "shadow-md"
                )}
                aria-label={`Go to page ${page}`}
                aria-current={isCurrentPage ? "page" : undefined}
              >
                {page}
              </Button>
            );
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigateToPage(currentPage + 1)}
          disabled={!hasNextPage}
          className="h-9 w-9 p-0"
          aria-label="Go to next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page button (desktop only) */}
        <div className="hidden sm:block">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-9 w-9 p-0"
            aria-label="Go to last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page info for screen readers */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Page {currentPage} of {totalPages}
      </div>

      {/* Mobile page info */}
      <div className="ml-4 text-sm text-muted-foreground sm:hidden">
        {currentPage} / {totalPages}
      </div>
    </motion.nav>
  );
}
