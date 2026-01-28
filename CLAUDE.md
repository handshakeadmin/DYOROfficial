# PeptideSource - Project Instructions

## Project Overview
B2B e-commerce platform for research-grade peptides. Frontend-only Next.js application with React Context for state management. All product data is static (no backend integration yet).

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
- **ProductType**: `"lyophilized" | "capsules" | "nasal-spray" | "serum"`
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

## Current Status & TODOs
**Implemented:**
- Product catalog with filtering/sorting
- Cart with drawer and persistence
- Wishlist with persistence
- Product detail pages
- Static pages (About, FAQ, Contact)

**Not Yet Implemented:**
- Checkout flow (`/checkout` page)
- Payment integration
- User authentication
- Backend API
- Database integration
- Order management
- Tests

## Business Domain Notes
- All products are "Research Use Only - Not For Human Consumption"
- Products include: BPC-157, Semaglutide, Tirzepatide, TB-500, Ipamorelin, etc.
- Purity standard: 99%+
- Free shipping threshold: $500+
- Product categories: Lyophilized, Capsules, Nasal Sprays, Serums
