import Link from "next/link";
import { ArrowRight, Shield, Truck, Award, FlaskConical } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { products, categories, getFeaturedProducts, getBestSellers } from "@/data/products";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-premium text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full text-accent mb-6">
              <FlaskConical className="h-4 w-4" />
              <span className="text-sm font-medium">Research Grade Quality</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Premium Research
              <span className="block text-accent">Peptides</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl">
              Discover our extensive collection of high-purity research peptides.
              Every product exceeds 99% purity, verified through HPLC and mass spectrometry analysis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
              >
                Shop All Peptides
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Image Decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-full opacity-20 hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-primary" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">99%+ Purity</h3>
                <p className="text-xs text-muted">HPLC Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Free Shipping</h3>
                <p className="text-xs text-muted">Orders $500+</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Lab Tested</h3>
                <p className="text-xs text-muted">Quality Assured</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <FlaskConical className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Research Grade</h3>
                <p className="text-xs text-muted">Professional Quality</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Browse our comprehensive selection of research peptides in various formulations
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?type=${category.slug}`}
                className="group relative bg-card rounded-xl border overflow-hidden card-hover"
              >
                <div className="aspect-square bg-gradient-to-br from-background-secondary to-background p-6 flex flex-col justify-end">
                  <h3 className="font-semibold text-lg group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted mt-1">
                    {category.productCount} Products
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted">Our most popular research peptides</p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-accent font-medium"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Best Sellers</h2>
              <p className="text-muted">Top choices from researchers worldwide</p>
            </div>
            <Link
              href="/products?sort=best-selling"
              className="hidden sm:inline-flex items-center gap-2 text-accent font-medium hover:underline"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 lg:py-24 bg-gradient-premium text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Quality. <span className="text-accent">Service.</span> Value.
            </h2>
            <p className="text-lg text-white/80 mb-8">
              At PeptideSource, pride in our craftsmanship is at the heart of everything we do.
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
      <section className="py-16 lg:py-24">
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
      <section className="py-16 lg:py-24 bg-background-secondary">
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
