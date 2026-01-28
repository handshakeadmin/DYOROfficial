"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products } from "@/data/products";
import { ProductType, SortOption } from "@/types";
import { cn } from "@/lib/utils";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

const productTypes: { value: ProductType; label: string }[] = [
  { value: "lyophilized", label: "Lyophilized" },
  { value: "capsules", label: "Capsules" },
  { value: "nasal-spray", label: "Nasal Sprays" },
  { value: "serum", label: "Serums" },
];

const priceRanges = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: Infinity, label: "$200+" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") as ProductType | null;

  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ProductType[]>(
    initialType ? [initialType] : []
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [inStockOnly, setInStockOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((p) => selectedTypes.includes(p.type));
    }

    // Filter by price range
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      filtered = filtered.filter((p) => p.price >= range.min && p.price < range.max);
    }

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "featured":
      default:
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          if (a.bestSeller && !b.bestSeller) return -1;
          if (!a.bestSeller && b.bestSeller) return 1;
          return 0;
        });
    }

    return filtered;
  }, [selectedTypes, selectedPriceRange, sortBy, inStockOnly]);

  const toggleType = (type: ProductType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setSelectedPriceRange(null);
    setInStockOnly(false);
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedPriceRange !== null || inStockOnly;

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-premium text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-bold">All Research Peptides</h1>
          <p className="text-white/80 mt-2">
            Browse our complete catalog of premium research-grade peptides
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Button */}
            <button
              type="button"
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-background-secondary transition-colors"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <span className="h-5 w-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                  {selectedTypes.length + (selectedPriceRange !== null ? 1 : 0) + (inStockOnly ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Results Count */}
            <p className="text-sm text-muted">
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-10 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="text-sm text-accent hover:underline"
                    onClick={clearFilters}
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Product Type Filter */}
              <div>
                <h3 className="font-medium mb-3">Product Type</h3>
                <div className="space-y-2">
                  {productTypes.map((type) => (
                    <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type.value)}
                        onChange={() => toggleType(type.value)}
                        className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-2">
                  {priceRanges.map((range, index) => (
                    <label key={index} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={selectedPriceRange === index}
                        onChange={() => setSelectedPriceRange(index)}
                        className="w-4 h-4 border-border text-accent focus:ring-accent"
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                  {selectedPriceRange !== null && (
                    <button
                      type="button"
                      className="text-sm text-accent hover:underline"
                      onClick={() => setSelectedPriceRange(null)}
                    >
                      Clear price filter
                    </button>
                  )}
                </div>
              </div>

              {/* In Stock Filter */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-muted mb-4">Try adjusting your filters</p>
                <button
                  type="button"
                  className="text-accent hover:underline"
                  onClick={clearFilters}
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          filterOpen ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "fixed inset-0 bg-black/50 transition-opacity",
            filterOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setFilterOpen(false)}
        />
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-full max-w-sm bg-white shadow-xl transition-transform duration-300 overflow-y-auto",
            filterOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Mobile Filter Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
            <h2 className="font-semibold flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h2>
            <button
              type="button"
              className="p-2 text-muted hover:text-foreground"
              onClick={() => setFilterOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Filter Content */}
          <div className="p-4 space-y-6">
            {/* Product Type */}
            <div>
              <h3 className="font-medium mb-3">Product Type</h3>
              <div className="space-y-2">
                {productTypes.map((type) => (
                  <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type.value)}
                      onChange={() => toggleType(type.value)}
                      className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                {priceRanges.map((range, index) => (
                  <label key={index} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobilepriceRange"
                      checked={selectedPriceRange === index}
                      onChange={() => setSelectedPriceRange(index)}
                      className="w-4 h-4 border-border text-accent focus:ring-accent"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                />
                <span className="text-sm">In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Mobile Filter Footer */}
          <div className="p-4 border-t sticky bottom-0 bg-white space-y-2">
            <button
              type="button"
              className="w-full py-3 bg-accent text-accent-foreground font-medium rounded-lg"
              onClick={() => setFilterOpen(false)}
            >
              Show {filteredProducts.length} Products
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                className="w-full py-3 border font-medium rounded-lg"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductsLoading() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-premium text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-96 bg-white/10 rounded mt-2 animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border overflow-hidden animate-pulse">
              <div className="aspect-square bg-background-secondary" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-20 bg-border rounded" />
                <div className="h-6 w-full bg-border rounded" />
                <div className="h-4 w-32 bg-border rounded" />
                <div className="h-6 w-24 bg-border rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
