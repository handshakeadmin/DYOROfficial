"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ["BPC-157", "Retatrutide", "Tirzepatide", "Ipamorelin", "KLOW Blend"];

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps): React.JSX.Element | null {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const searchProducts = useCallback((searchQuery: string): Product[] => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();

    return products
      .filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(lowerQuery);
        const descMatch = product.description.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.categoryDisplay.toLowerCase().includes(lowerQuery);
        const skuMatch = product.sku.toLowerCase().includes(lowerQuery);
        return nameMatch || descMatch || categoryMatch || skuMatch;
      })
      .slice(0, 6);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchProducts(query);
      setResults(searchResults);
      setIsSearching(false);
      setSelectedIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, searchProducts]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        router.push(`/products/${results[selectedIndex].slug}`);
        onClose();
      } else if (query.trim()) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
        onClose();
      }
    }
  };

  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedEl = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 sm:pt-28 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Search Card */}
      <div
        className={cn(
          "relative w-full max-w-lg bg-white rounded-xl shadow-2xl",
          "animate-in fade-in slide-in-from-top-4 duration-200"
        )}
      >
        {/* Search Input */}
        <div className="relative flex items-center border-b border-border">
          <Search className="absolute left-4 w-5 h-5 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search peptides..."
            className="w-full pl-12 pr-12 py-4 text-foreground placeholder:text-muted rounded-t-xl focus:outline-none"
          />
          <button
            onClick={onClose}
            className="absolute right-3 p-1.5 text-muted hover:text-foreground hover:bg-background-secondary rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          )}

          {/* Results */}
          {!isSearching && results.length > 0 && (
            <div ref={resultsRef}>
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 hover:bg-background-secondary transition-colors",
                    selectedIndex === index && "bg-background-secondary"
                  )}
                >
                  <div className="relative w-12 h-12 bg-white rounded-lg border border-border flex-shrink-0">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted truncate">
                      {product.categoryDisplay} &bull; {product.dosage}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-primary text-sm">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}

              {/* View All Results */}
              <Link
                href={`/products?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-accent hover:bg-background-secondary transition-colors border-t border-border"
              >
                View all results for &quot;{query}&quot;
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* No Results */}
          {!isSearching && query.trim() && results.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-muted text-sm">No products found for &quot;{query}&quot;</p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-block mt-2 text-sm text-accent hover:underline"
              >
                Browse all products
              </Link>
            </div>
          )}

          {/* Popular Searches - show when no query */}
          {!query.trim() && !isSearching && (
            <div className="p-4">
              <p className="text-xs text-muted uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 text-sm bg-background-secondary text-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
