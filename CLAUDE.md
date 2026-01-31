# PeptideSource - Project Instructions

## Project Overview
B2B e-commerce platform for research-grade peptides. Next.js application with React Context for state management, Supabase for auth, and PayPal for payments.

**Directory**: `/Users/matthewschwen/projects/DYORofficial/` (also referenced as PeptideSource)

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **React**: 19.2
- **TypeScript**: 5 (strict mode)
- **Styling**: Tailwind CSS 4 + class-variance-authority
- **UI**: Headless UI for accessible components, Lucide icons
- **State**: React Context + useReducer (Cart, Wishlist)
- **Data**: Static JSON in `src/data/products.ts`

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (CartProvider > WishlistProvider)
│   ├── page.tsx            # Homepage
│   ├── products/           # Product listing & detail pages
│   ├── cart/               # Cart page
│   ├── wishlist/           # Wishlist page
│   ├── about/              # About page
│   ├── faq/                # FAQ page
│   └── contact/            # Contact page
├── components/
│   ├── layout/             # Header, Footer
│   ├── product/            # ProductCard, AddToCartButton, WishlistButton
│   ├── cart/               # CartDrawer
│   ├── forms/              # ContactForm
│   └── ui/                 # FAQAccordion
├── context/                # CartContext, WishlistContext
├── data/                   # Static product data (50+ peptides)
├── lib/                    # Utilities
│   └── utils.ts            # cn(), formatPrice(), slugify()
└── types/                  # TypeScript interfaces
    └── index.ts            # Product, CartItem, Order, User, etc.
```

## Key Patterns

### Path Alias
Use `@/*` for imports from `src/`:
```typescript
import { Product } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
```

### Component Styling
Use `cn()` utility for conditional Tailwind classes:
```typescript
className={cn("base-classes", condition && "conditional-classes")}
```

### State Management
- **CartContext**: items, isOpen, addItem, removeItem, updateQuantity
- **WishlistContext**: items, addItem, removeItem, toggleItem, isInWishlist
- Both persist to localStorage (`peptidesource-cart`, `peptidesource-wishlist`)

### Data Access
Products are exported from `@/data/products.ts`:
```typescript
import { products, categories } from "@/data/products";
// Or use helper functions:
getProductBySlug(slug)
getFeaturedProducts()
getBestSellers()
searchProducts(query)
```

## Domain Types
- **ProductType**: `"lyophilized"` (all products are lyophilized vials)
- **Product**: Core product with price, dosage, purity, sequence, researchApplications
- **CartItem**: Product + quantity
- **Order**: Full order with items, addresses, status
- **OrderStatus**: `"pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"`

## Development Commands
```bash
npm run dev    # Start development server
npm run build  # Production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Image Standards
All cart-related product images use consistent sizing:
- **CartDrawer**: 64×64px (`h-16 w-16`)
- **Cart Page**: 64×64px (`h-16 w-16`)
- **Checkout Order Summary**: 56×56px (`w-14 h-14`)
- All use `object-contain` with white background for full product visibility (no cropping)

## Current Status & TODOs
**Implemented:**
- Product catalog with filtering/sorting
- Cart with drawer and persistence
- Wishlist with persistence
- Product detail pages
- Static pages (About, FAQ, Contact)
- Checkout flow with PayPal integration
- Discount code system
- User authentication (Supabase)

**Not Yet Implemented:**
- Backend API for orders
- Database integration for orders
- Order management dashboard
- Tests

## Business Domain Notes
- All products are "Research Use Only - Not For Human Consumption"
- All products are lyophilized (freeze-dried) peptides in sealed vials
- Products include: BPC-157, Semaglutide, Tirzepatide, TB-500, Ipamorelin, etc.
- Purity standard: 99%+
- FREE shipping on ALL orders (no minimum)

## Recent Changes (Jan 2026)
- Fixed cart image sizing across all cart-related components
- Standardized to `object-contain` with white backgrounds
- Key files modified:
  - `src/components/cart/CartDrawer.tsx`
  - `src/app/cart/page.tsx`
  - `src/app/checkout/page.tsx`
