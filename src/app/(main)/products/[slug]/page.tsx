import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, Star, Shield, Truck, Clock, FlaskConical } from "lucide-react";
import { products, getProductBySlug } from "@/data/products";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { WishlistButton } from "@/components/product/WishlistButton";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductTabs } from "@/components/product/ProductTabs";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-background-secondary border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted hover:text-accent">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 text-muted" />
            <Link href="/products" className="text-muted hover:text-accent">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-muted" />
            <span className="text-foreground font-medium truncate">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] max-h-[450px] bg-white rounded-xl overflow-hidden">
              <Image
                src={product.images[0] || "/images/placeholder.jpg"}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
              {product.bestSeller && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-accent-foreground text-sm font-semibold rounded">
                  Best Seller
                </span>
              )}
            </div>
            {/* Thumbnail Gallery would go here */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & SKU */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted uppercase tracking-wide">
                {product.category}
              </span>
              <span className="text-sm text-muted">SKU: {product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold">{product.name}</h1>

            {/* Purity Badge */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 text-accent fill-accent" />
                <Star className="h-5 w-5 text-accent fill-accent" />
                <Star className="h-5 w-5 text-accent fill-accent" />
                <Star className="h-5 w-5 text-accent fill-accent" />
                <Star className="h-5 w-5 text-accent fill-accent" />
              </div>
              <span className="text-sm font-medium">{product.purity} Purity</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-accent">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-muted">{product.shortDescription}</p>

            {/* Product Specs */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y">
              <div>
                <span className="text-sm text-muted">Dosage</span>
                <p className="font-medium">{product.dosage}</p>
              </div>
              <div>
                <span className="text-sm text-muted">Form</span>
                <p className="font-medium">{product.form}</p>
              </div>
              {product.molecularWeight && (
                <div>
                  <span className="text-sm text-muted">Molecular Weight</span>
                  <p className="font-medium">{product.molecularWeight}</p>
                </div>
              )}
              <div>
                <span className="text-sm text-muted">Availability</span>
                <p className={`font-medium ${product.inStock ? "text-success" : "text-error"}`}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="flex items-center gap-4">
              <AddToCartButton product={product} />
              <WishlistButton product={product} />
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-sm">Lab Tested Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-sm">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent" />
                <span className="text-sm">Same Day Dispatch</span>
              </div>
              <div className="flex items-center gap-3">
                <FlaskConical className="h-5 w-5 text-accent" />
                <span className="text-sm">Research Grade</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs - 5 Sections */}
        <ProductTabs product={product} />

        {/* Disclaimer */}
        <div className="bg-background-secondary rounded-xl p-6 mt-8">
          <h4 className="font-semibold mb-2">Research Use Only</h4>
          <p className="text-sm text-muted">
            This product is intended for research, laboratory, and analytical purposes ONLY.
            Not intended for human or veterinary use. Not for use in food, drugs, cosmetics,
            or any commercial application. By purchasing, you confirm you are a qualified
            researcher and these products will only be used for legitimate research purposes.
          </p>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
