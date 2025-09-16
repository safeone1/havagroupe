"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface ProductSearchProps {
  initialSearch?: string;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  className?: string;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: "recent" | "trending" | "category";
  count?: number;
}

/**
 * Enhanced ProductSearch component with debouncing, suggestions, and better UX
 */
export function ProductSearch({
  initialSearch = "",
  onSearchChange,
  placeholder = "Search products, brands, or categories...",
  className,
}: ProductSearchProps) {
  const [search, setSearch] = useState(initialSearch);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 300);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("productSearchHistory");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved).slice(0, 5));
        } catch (error) {
          console.warn("Failed to parse search history:", error);
        }
      }
    }
  }, []);

  // Save search to history
  const saveToHistory = useCallback(
    (searchTerm: string) => {
      if (!searchTerm.trim() || typeof window === "undefined") return;

      const newHistory = [
        searchTerm,
        ...recentSearches.filter((item) => item !== searchTerm),
      ].slice(0, 5);

      setRecentSearches(newHistory);
      localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    },
    [recentSearches]
  );

  // Mock trending searches (in real app, this would come from API)
  const trendingSearches = useMemo(
    () => [
      { term: "door handles", count: 245 },
      { term: "security locks", count: 189 },
      { term: "window hardware", count: 156 },
      { term: "hinges", count: 134 },
    ],
    []
  );

  // Generate suggestions based on input and recent/trending searches
  const generateSuggestions = useCallback(
    (query: string) => {
      if (!query.trim()) {
        const suggestions: SearchSuggestion[] = [
          ...recentSearches.slice(0, 3).map((term) => ({
            id: `recent-${term}`,
            text: term,
            type: "recent" as const,
          })),
          ...trendingSearches.slice(0, 3).map((item) => ({
            id: `trending-${item.term}`,
            text: item.term,
            type: "trending" as const,
            count: item.count,
          })),
        ];
        return suggestions;
      }

      // Filter suggestions based on query
      const filtered = [
        ...recentSearches
          .filter((term) => term.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 2)
          .map((term) => ({
            id: `recent-${term}`,
            text: term,
            type: "recent" as const,
          })),
        ...trendingSearches
          .filter((item) =>
            item.term.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 3)
          .map((item) => ({
            id: `trending-${item.term}`,
            text: item.term,
            type: "trending" as const,
            count: item.count,
          })),
      ];

      return filtered;
    },
    [recentSearches, trendingSearches]
  );

  // Handle search change with debouncing indication
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearch(value);
      setIsTyping(true);

      // Update suggestions
      setSuggestions(generateSuggestions(value));

      // Clear typing indicator after delay
      setTimeout(() => setIsTyping(false), 500);
    },
    [generateSuggestions]
  );

  // Handle search submission
  const handleSearchSubmit = useCallback(
    (searchTerm?: string) => {
      const finalTerm = searchTerm || search;
      if (finalTerm.trim()) {
        saveToHistory(finalTerm.trim());
        setIsFocused(false);
        inputRef.current?.blur();
      }
    },
    [search, saveToHistory]
  );

  // Handle suggestion click
  const handleSuggestionClick = useCallback(
    (suggestion: SearchSuggestion) => {
      setSearch(suggestion.text);
      handleSearchSubmit(suggestion.text);
    },
    [handleSearchSubmit]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Escape":
          setSearch("");
          setIsFocused(false);
          inputRef.current?.blur();
          break;
        case "Enter":
          e.preventDefault();
          handleSearchSubmit();
          break;
      }
    },
    [handleSearchSubmit]
  );

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Call onSearchChange when debounced search changes
  useEffect(() => {
    onSearchChange?.(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  // Clear search handler
  const handleClearSearch = useCallback(() => {
    setSearch("");
    setIsFocused(false);
    inputRef.current?.focus();
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setSuggestions(generateSuggestions(search));
  }, [search, generateSuggestions]);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        {/* Search Input */}
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className={cn(
            "pl-10 pr-12 transition-all",
            isFocused && "ring-2 ring-primary/20"
          )}
          aria-label="Search products"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          role="combobox"
        />

        {/* Loading/Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isTyping ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : search ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="h-6 w-6 p-0 hover:bg-muted rounded-full"
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Search Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            ref={suggestionsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
            role="listbox"
            aria-label="Search suggestions"
          >
            <div className="p-2">
              {/* Recent Searches Header */}
              {suggestions.some((s) => s.type === "recent") && (
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Recent Searches
                </div>
              )}

              {/* Recent Suggestions */}
              {suggestions
                .filter((s) => s.type === "recent")
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center gap-2"
                    role="option"
                    aria-selected="false"
                  >
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{suggestion.text}</span>
                  </button>
                ))}

              {/* Trending Searches Header */}
              {suggestions.some((s) => s.type === "trending") && (
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3" />
                  Trending Searches
                </div>
              )}

              {/* Trending Suggestions */}
              {suggestions
                .filter((s) => s.type === "trending")
                .map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors flex items-center justify-between gap-2"
                    role="option"
                    aria-selected="false"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{suggestion.text}</span>
                    </div>
                    {suggestion.count && (
                      <Badge variant="secondary" className="text-xs">
                        {suggestion.count}
                      </Badge>
                    )}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Status */}
      {debouncedSearch && (
        <motion.div
          className="mt-2 text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Searching for <strong>&ldquo;{debouncedSearch}&rdquo;</strong>
        </motion.div>
      )}
    </div>
  );
}
