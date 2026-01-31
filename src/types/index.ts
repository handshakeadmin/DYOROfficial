export type ProductType = "lyophilized" | "capsules" | "nasal-spray" | "serum" | "injectable" | "blend";

export type ProductCategory = "metabolic" | "recovery" | "cognitive" | "growth-hormone" | "blends";

export interface ResearchReference {
  title: string;
  url: string;
  source: string;
}

export interface Product {
  id: string;
  name: string;
  fullName?: string;
  slug: string;
  description: string;
  shortDescription: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  sku: string;
  type: ProductType;
  category: ProductCategory;
  categoryDisplay: string;
  dosage: string;
  form: string;
  purity: string;
  molecularWeight?: string;
  sequence?: string;
  storageInstructions: string;
  researchApplications: string[];
  benefits?: string[];
  mechanismOfAction?: string;
  specifications?: string;
  researchReferences?: ResearchReference[];
  images: string[];
  inStock: boolean;
  featured: boolean;
  bestSeller: boolean;
  onSale?: boolean;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  author: string;
  verified: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export interface FilterState {
  categories: string[];
  priceRange: [number, number];
  types: ProductType[];
  inStock: boolean;
  sortBy: SortOption;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";
