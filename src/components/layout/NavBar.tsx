
"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import {
  Search as SearchIcon,
  Menu,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  Store,
  Package,
  Tags,
  BookOpen,
  MapPin,
  PhoneCall,
  Quote,
  X,
  Globe,
  Loader2,
  ArrowRight,
  Sparkles,
  Info,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { searchAll, SearchResults } from "@/lib/actions/products";

interface Props {
  className?: string;
  isHome?: boolean;
}

const NavBar = ({ className, isHome = false }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const id = useId();
  const [openSearch, setOpenSearch] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  // Shadow/backdrop on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // GSAP animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(
        ".header-content",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }
      );

      // Logo animation
      gsap.fromTo(
        ".logo",
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );

      // Navigation items stagger animation
      gsap.fromTo(
        ".nav-item",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          delay: 0.7,
        }
      );
    }, headerRef);

    return () => ctx.revert();
  }, []);

  // "/" focuses inline search, ⌘K opens command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpenSearch((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Handle search functionality
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const searchUrl = `/products?search=${encodeURIComponent(query.trim())}`;
      setOpenSearch(false);
      setSearchQuery("");
      setSearchResults(null);
      router.push(searchUrl);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery);
    }
  };

  // Debounced search function using server action
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchAll(query.trim(), 5);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Effect for debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(searchQuery);
      }, 300); // 300ms debounce
    } else {
      setSearchResults(null);
      setIsSearching(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    if (!openSearch) {
      setSearchQuery("");
      setSearchResults(null);
      setIsSearching(false);
    }
  }, [openSearch]);

  const navigationLinks = [
    { href: "/", label: "Accueil" },
    { href: "/brands", label: "Marques" },
    { href: "/products", label: "Produits" },
    { href: "/#about", label: "À propos" },
    { href: "/#contact", label: "Contact" },
  ];

  const isLinkActive = (linkHref: string) => {
    if (linkHref === "/") return pathname === "/";
    if (linkHref === "/products") return pathname.startsWith("/products");
    if (linkHref === "/brands") return pathname.startsWith("/brands");
    if (linkHref === "/#about") return pathname === "/";
    if (linkHref === "/#contact") return pathname === "/";
    return pathname === linkHref;
  };

  const createFilterURL = (params: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.set(key, String(value));
      }
    });
    return `/products?${searchParams.toString()}`;
  };

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
        scrolled 
          ? "shadow-xl backdrop-blur-xl bg-white/98 border-b border-gray-100/50" 
          : "bg-transparent",
        className
      )}
    >
      {/* Top utility bar */}
      <div
        className={cn(
          "hidden lg:block border-b text-xs transition-all duration-500",
          isHome && !scrolled 
            ? "bg-transparent border-transparent" 
            : "bg-gradient-to-r from-gray-50/90 to-white/90 backdrop-blur-sm border-gray-200/50"
        )}
      >
        <div className="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-muted-foreground">
              <a
                href="tel:+212666973842"
                className="inline-flex items-center gap-2 hover:text-[#911828] transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                  <Phone className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium">+212 520 404 456</span>
              </a>
              <Separator orientation="vertical" className="h-4" />
              <a
                href="mailto:contact@havanegoce.com"
                className="inline-flex items-center gap-2 hover:text-[#911828] transition-all duration-300 group"
              >
                <div className="p-1.5 rounded-full bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                  <Mail className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                </div>
                <span className="text-sm font-medium">contact@havanegoce.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3 text-[#911828]" />
                <span>Solutions professionnelles de quincaillerie</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/hava.hard.trade/?igsh=MTkxM2Q4ZGNzZzh4Ng%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#911828] transition-all duration-300 p-2 rounded-lg hover:bg-[#911828]/10 group"
                  aria-label="Suivez-nous sur Instagram"
                >
                  <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/people/HAVA-HARD-TRADE/61572442665722"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#911828] transition-all duration-300 p-2 rounded-lg hover:bg-[#911828]/10 group"
                  aria-label="Suivez-nous sur Facebook"
                >
                  <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div
        className={cn(
          "backdrop-blur-xl supports-[backdrop-filter]:bg-background/95 transition-all duration-500",
          isHome && !scrolled ? "bg-transparent" : "bg-white/95"
        )}
      >
        <div className="header-content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center gap-4">
            {/* Mobile menu */}
            <Sheet open={openMobile} onOpenChange={setOpenMobile}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden hover:bg-[#911828]/10 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SheetHeader className="px-6 py-6 border-b bg-gradient-to-r from-[#911828]/5 to-white">
                  <SheetTitle className="flex items-center gap-3">
                    <Image src="/hava_logo.svg" alt="Logo" width={40} height={40} />
                    <div>
                      <span className="text-xl font-bold text-[#911828]">HAVA HARD TRADE</span>
                      <p className="text-sm text-muted-foreground">Quincaillerie professionnelle</p>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="px-4 py-6 space-y-1">
                  {navigationLinks.map(({ href, label }) => (
                    <Button
                      key={href}
                      asChild
                      variant="ghost"
                      className={cn(
                        "w-full justify-start h-14 text-left group",
                        isLinkActive(href) && "bg-[#911828]/10 text-[#911828]"
                      )}
                      onClick={() => setOpenMobile(false)}
                    >
                      <Link href={href}>
                        <div className="flex-1">
                          <span className="font-semibold text-base">{label}</span>
                          <p className="text-sm text-muted-foreground">
                            {href === "/" && "Page d'accueil"}
                            {href === "/brands" && "Découvrez nos marques"}
                            {href === "/products" && "Catalogue complet"}
                            {href === "/#about" && "Notre histoire"}
                            {href === "/#contact" && "Nous contacter"}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link href="/" className="logo flex items-center shrink-0 group">
              <div className="relative">
                <Image
                  src="/hava_logo.svg"
                  alt="HAVA HARD TRADE"
                  width={140} 
                  height={45}
                  className="h-12 w-auto transform group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#911828] group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2 ml-8">
              <NavigationMenu>
                <NavigationMenuList>
                  {navigationLinks.slice(1).map(({ href, label }) => (
                    <NavigationMenuItem key={href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={href}
                          className={cn(
                            "nav-item group relative px-6 py-3 text-sm font-semibold transition-all duration-300",
                            isLinkActive(href)
                              ? "text-[#911828] border-b-2 border-[#911828]"
                              : "text-gray-700 hover:text-[#911828] hover:border-b-2 hover:border-[#911828]/50"
                          )}
                        >
                          {label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Spacer */}
            <div className="grow" />

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Search button */}
              <button
                onClick={() => setOpenSearch(true)}
                className="group relative inline-flex items-center gap-3 h-12 pl-5 pr-5 text-sm rounded-xl border border-gray-200 bg-white/80 hover:bg-white hover:border-[#911828]/30 transition-all duration-300 shadow-sm hover:shadow-lg"
                aria-label="Ouvrir la recherche"
              >
                <SearchIcon className="h-5 w-5 text-gray-400 group-hover:text-[#911828] transition-colors" />
                <span className="text-gray-500 group-hover:text-gray-700 font-medium">Rechercher...</span>
                <kbd className="ml-2 hidden lg:inline-flex text-[10px] px-2 py-1 rounded-md border bg-gray-100 text-gray-500 group-hover:bg-[#911828]/10 group-hover:text-[#911828] transition-colors">
                  ⌘K
                </kbd>
              </button>

              {/* Contact CTA */}
              <Button
                asChild
                className="h-12 px-6 rounded-xl bg-[#911828] hover:bg-[#911828]/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/#contact">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  Nous contacter
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Command Palette Search */}
      {openSearch && (
        <div 
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300" 
          onClick={() => setOpenSearch(false)} 
        />
      )}
      {openSearch && (
        <div className="fixed left-1/2 top-28 z-[61] w-[95vw] max-w-3xl -translate-x-1/2 animate-in fade-in-0 zoom-in-95 duration-300">
          <div className="rounded-2xl border border-gray-200/50 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100/50 bg-gradient-to-r from-[#911828]/5 to-white">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#911828]/10">
                  <SearchIcon className="h-4 w-4 text-[#911828]" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">Recherche intelligente</span>
                  <p className="text-xs text-gray-500">Trouvez rapidement vos produits</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setOpenSearch(false)} 
                className="h-9 w-9 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Command shouldFilter={false} className="max-h-[500px]">
              <CommandInput
                placeholder="Découvrir nos produits: serrures, cylindres, quincaillerie..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                onKeyDown={handleSearchKeyDown}
                className="border-0 focus:ring-0 text-base py-6 px-6 placeholder:text-gray-400"
              />
              <CommandList className="max-h-96">
                <CommandEmpty>
                  {isSearching ? (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                      <div className="relative">
                        <Loader2 className="h-8 w-8 animate-spin text-[#911828]" />
                        <div className="absolute inset-0 rounded-full border-2 border-[#911828]/20"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">Recherche en cours...</p>
                        <p className="text-sm text-gray-500">Veuillez patienter</p>
                      </div>
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="flex flex-col items-center gap-6 py-12">
                      <div className="text-center">
                        <div className="p-4 rounded-full bg-gray-100 mx-auto mb-4 w-fit">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-700 font-semibold text-lg">Aucun résultat trouvé</p>
                        <p className="text-gray-500 mt-1">Essayez avec d'autres mots-clés ou explorez nos catégories</p>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          onClick={() => handleSearch(searchQuery)}
                          className="bg-[#911828] hover:bg-[#911828]/90 text-white px-6"
                        >
                          Rechercher "{searchQuery}"
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSearchQuery("")}
                          className="px-6"
                        >
                          Effacer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 py-12">
                      <div className="p-4 rounded-full bg-[#911828]/10 mx-auto">
                        <SearchIcon className="h-8 w-8 text-[#911828]" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-semibold text-lg">Découvrez nos produits</p>
                        <p className="text-gray-500 mt-1">Explorez notre gamme de quincaillerie professionnelle</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center max-w-md">
                        {["Serrures", "Cylindres", "Tesa", "Yale", "Quincaillerie"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-[#911828]/10 text-gray-600 hover:text-[#911828] rounded-full transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CommandEmpty>

                {/* Enhanced Search Results */}
                {searchResults && !isSearching && (
                  <>
                    {/* Debug info */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="px-4 py-2 text-xs text-gray-500 border-b bg-gray-50/50">
                        Debug: Found {searchResults.products?.length || 0} products, {searchResults.brands?.length || 0} brands, {searchResults.categories?.length || 0} categories
                      </div>
                    )}
                    
                    {/* Show message if no results found */}
                    {(!searchResults.products || searchResults.products.length === 0) && 
                     (!searchResults.brands || searchResults.brands.length === 0) && 
                     (!searchResults.categories || searchResults.categories.length === 0) && (
                      <div className="p-6 text-center text-gray-500">
                        <Package className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p>Aucun résultat trouvé pour "{searchQuery}"</p>
                      </div>
                    )}
                    
                    {/* Products */}
                    {searchResults.products && searchResults.products.length > 0 && (
                      <CommandGroup heading={
                        <div className="flex items-center gap-2 px-2 py-2">
                          <Package className="h-4 w-4 text-[#911828]" />
                          <span className="font-semibold text-gray-900">Produits</span>
                          <Badge variant="secondary" className="text-xs">
                            {searchResults.products.length}
                          </Badge>
                        </div>
                      } className="px-2">
                        {searchResults.products.map((product) => (
                          <CommandItem
                            key={product.id}
                            onSelect={() => {
                              setOpenSearch(false);
                              router.push(`/products/${product.slug}`);
                            }}
                            className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                              <Package className="h-4 w-4 text-[#911828]" />
                            </div>
                            <div className="flex flex-col flex-1 ml-3">
                              <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                                {product.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                {product.brand && (
                                  <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-[#911828]/10 text-[#911828]">
                                    {product.brand.name}
                                  </Badge>
                                )}
                                {product.category && (
                                  <span className="text-xs text-gray-500">{product.category.name}</span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Brands */}
                    {searchResults.brands && searchResults.brands.length > 0 && (
                      <CommandGroup heading={
                        <div className="flex items-center gap-2 px-2 py-2">
                          <Tags className="h-4 w-4 text-[#911828]" />
                          <span className="font-semibold text-gray-900">Marques</span>
                          <Badge variant="secondary" className="text-xs">
                            {searchResults.brands.length}
                          </Badge>
                        </div>
                      } className="px-2">
                        {searchResults.brands.map((brand) => (
                          <CommandItem
                            key={brand.id}
                            onSelect={() => {
                              const searchUrl = createFilterURL({ brandId: brand.id });
                              setOpenSearch(false);
                              router.push(searchUrl);
                            }}
                            className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                              <Tags className="h-4 w-4 text-[#911828]" />
                            </div>
                            <div className="flex flex-col flex-1 ml-3">
                              <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                                {brand.name}
                              </span>
                              <span className="text-xs text-gray-500 mt-1">
                                {brand._count?.products || 0} produit{(brand._count?.products || 0) !== 1 ? 's' : ''}
                              </span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Categories */}
                    {searchResults.categories && searchResults.categories.length > 0 && (
                      <CommandGroup heading={
                        <div className="flex items-center gap-2 px-2 py-2">
                          <BookOpen className="h-4 w-4 text-[#911828]" />
                          <span className="font-semibold text-gray-900">Catégories</span>
                          <Badge variant="secondary" className="text-xs">
                            {searchResults.categories.length}
                          </Badge>
                        </div>
                      } className="px-2">
                        {searchResults.categories.map((category) => (
                          <CommandItem
                            key={category.id}
                            onSelect={() => {
                              const searchUrl = createFilterURL({
                                categoryId: category.parent ? category.id : category.id,
                                subcategoryId: category.parent ? category.id : undefined
                              });
                              setOpenSearch(false);
                              router.push(searchUrl);
                            }}
                            className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                          >
                            <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                              <BookOpen className="h-4 w-4 text-[#911828]" />
                            </div>
                            <div className="flex flex-col flex-1 ml-3">
                              <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                                {category.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                {category.parent && (
                                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-[#911828]/20 text-[#911828]">
                                    {category.parent.name}
                                  </Badge>
                                )}
                                <span className="text-xs text-gray-500">
                                  {category._count?.products || 0} produit{(category._count?.products || 0) !== 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </>
                )}

                {/* Enhanced Quick Access */}
                {(!searchQuery.trim() || (!searchResults && !isSearching)) && (
                  <CommandGroup heading={
                    <div className="flex items-center gap-2 px-2 py-2">
                      <Sparkles className="h-4 w-4 text-[#911828]" />
                      <span className="font-semibold text-gray-900">Accès rapide</span>
                    </div>
                  } className="px-2">
                    <CommandItem 
                      onSelect={() => { setOpenSearch(false); router.push("/products"); }}
                      className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                        <Package className="h-4 w-4 text-[#911828]" />
                      </div>
                      <div className="flex flex-col flex-1 ml-3">
                        <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                          Tous les produits
                        </span>
                        <span className="text-xs text-gray-500">Découvrir notre gamme complète</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => { setOpenSearch(false); router.push("/brands"); }}
                      className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                        <Tags className="h-4 w-4 text-[#911828]" />
                      </div>
                      <div className="flex flex-col flex-1 ml-3">
                        <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                          Nos marques
                        </span>
                        <span className="text-xs text-gray-500">Découvrir nos partenaires de confiance</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => { setOpenSearch(false); router.push("/#about"); }}
                      className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                        <BookOpen className="h-4 w-4 text-[#911828]" />
                      </div>
                      <div className="flex flex-col flex-1 ml-3">
                        <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                          À propos
                        </span>
                        <span className="text-xs text-gray-500">Notre expertise en quincaillerie</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                    </CommandItem>
                    <CommandItem 
                      onSelect={() => { setOpenSearch(false); router.push("/#contact"); }}
                      className="cursor-pointer px-4 py-4 rounded-xl hover:bg-[#911828]/5 transition-all duration-200 group"
                    >
                      <div className="p-2 rounded-lg bg-[#911828]/10 group-hover:bg-[#911828]/20 transition-colors">
                        <Quote className="h-4 w-4 text-[#911828]" />
                      </div>
                      <div className="flex flex-col flex-1 ml-3">
                        <span className="font-semibold text-gray-900 group-hover:text-[#911828] transition-colors">
                          Contact
                        </span>
                        <span className="text-xs text-gray-500">Demander un devis ou informations</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#911828] group-hover:translate-x-1 transition-all" />
                    </CommandItem>
                  </CommandGroup>
                )}
              </CommandList>
            </Command>
            </div>
          </div>
        )}
    </header>
  );
};

export default NavBar;