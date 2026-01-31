import Link from "next/link";
import Image from "next/image";
import { ArrowRight, FlaskConical, Flame, Heart, Brain, TrendingUp } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products, categories, getFeaturedProducts, getBestSellers } from "@/data/products";

const categoryIcons: Record<string, typeof Flame> = {
  metabolic: Flame,
  recovery: Heart,
  cognitive: Brain,
  "growth-hormone": TrendingUp,
  blends: FlaskConical,
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white overflow-hidden bg-[#0a1628] min-h-[600px] sm:min-h-[500px] lg:min-h-[520px]">
        {/* Mobile Background Image */}
        <div className="absolute inset-0 md:hidden">
          <Image
            src="/images/mobilehero.jpeg"
            alt="DYOR Wellness Premium Research Peptides"
            fill
            className="object-cover object-bottom"
            priority
            quality={90}
          />
          {/* Mobile overlay - gradient from top for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/80 via-transparent via-50% to-transparent" />
        </div>

        {/* Desktop Background Image */}
        <div className="absolute inset-0 hidden md:block">
          <Image
            src="/images/desktophero.jpeg"
            alt="DYOR Wellness Premium Research Peptides with Certificate of Analysis"
            fill
            className="object-cover object-right"
            priority
            quality={90}
          />
          {/* Desktop overlay - gradient from left for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/40 via-40% to-transparent" />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-24 flex items-start lg:items-center min-h-[600px] sm:min-h-[500px] lg:min-h-[520px]">
          <div className="max-w-xl w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-accent mb-3 lg:mb-6 border border-white/20">
              <FlaskConical className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              <span className="text-xs lg:text-sm font-medium tracking-wide">Research Grade Quality</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-[1.1] mb-3 lg:mb-6 tracking-tight">
              Premium Research
              <span className="block text-accent mt-1">Peptides</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-xl text-white/90 mb-5 lg:mb-8 max-w-xs sm:max-w-md leading-relaxed">
              High-purity compounds for advanced research. 99%+ purity, HPLC verified.
            </p>

            <div className="flex flex-row gap-3 lg:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-5 lg:px-8 py-2.5 lg:py-3.5 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-all hover:scale-105 shadow-lg shadow-accent/25 text-sm lg:text-base"
              >
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-5 lg:px-8 py-2.5 lg:py-3.5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/30 text-sm lg:text-base"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Research-grade peptides organized by application
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug] || FlaskConical;
              return (
                <Link
                  key={category.id}
                  href={`/products?type=${category.slug}`}
                  className="group flex flex-col items-center p-6 bg-white border border-border rounded-lg hover:border-accent hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent transition-colors">
                    <Icon className="h-6 w-6 text-accent group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-center group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {category.productCount} Products
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 lg:py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted max-w-2xl mx-auto">Our most popular research peptides</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Best Sellers</h2>
            <p className="text-muted max-w-2xl mx-auto">Top choices from researchers worldwide</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/products?sort=best-selling"
              className="inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              View All Best Sellers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-12 lg:py-16 bg-gradient-premium text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Quality. <span className="text-accent">Service.</span> Value.
            </h2>
            <p className="text-lg text-white/80 mb-8">
              At DYORWellness, pride in our craftsmanship is at the heart of everything we do.
              Every peptide we offer exceeds 99% purity, rigorously tested through HPLC and
              mass spectrometry analysis to ensure the highest quality for your research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
              >
                Our Quality Promise
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">All Research Peptides</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Browse our complete catalog of premium research-grade peptides
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 lg:py-16 bg-background-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted mb-8">
            Subscribe to receive updates on new products, research news, and exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-accent"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-muted mt-4">
            By subscribing, you agree to our Privacy Policy and consent to receive updates.
          </p>
        </div>
      </section>
    </div>
  );
}
