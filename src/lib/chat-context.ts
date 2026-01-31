/**
 * Chat context builder for AI chatbot
 * Provides different context based on authentication status
 */

import { products, categories, searchProducts } from "@/data/products";
import { Product } from "@/types";

interface UserOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  total: number;
  status: string;
  trackingNumber?: string;
}

interface AuthenticatedUser {
  firstName: string;
  email: string;
  orders: UserOrder[];
}

/**
 * Build the base system prompt for the chatbot
 */
function buildBasePrompt(): string {
  return `You are a helpful customer support assistant for DYOR Wellness, a research peptide supplier.

CRITICAL RESTRICTIONS - YOU MUST FOLLOW THESE:
1. RESEARCH ONLY: All products are strictly for RESEARCH USE ONLY and NOT for human or animal consumption. Always emphasize this.
2. NO DOSING INFORMATION: NEVER provide dosing recommendations, protocols, injection instructions, or any guidance on how to use peptides on humans or animals. If asked, respond: "I cannot provide dosing or administration information. Our products are sold strictly for research purposes. Please consult published research literature for study protocols."
3. NO COMPETITOR LINKS: NEVER link to, mention, or recommend competitor websites, other peptide suppliers, or external vendors. Only recommend DYOR Wellness products and link to our own website (dyorwellness.com or /products/...).
4. NO EXTERNAL SEARCHES: You cannot search the internet. Only use the product information and company details provided in this context. If you don't have information, say so honestly rather than making things up.
5. NO MEDICAL ADVICE: Never provide medical advice, treatment recommendations, or suggest peptides for treating any condition.

IMPORTANT GUIDELINES:
- Be professional, knowledgeable, and helpful within these restrictions
- Provide accurate information about peptides and their documented research applications
- Be concise but thorough in your responses
- If asked about something outside your knowledge, say: "I don't have information about that. I can only help with DYOR Wellness products and policies."

COMPANY INFORMATION:
- Company: DYOR Wellness (Do Your Own Research)
- Website: dyorwellness.com
- Focus: Premium research-grade lyophilized peptides with 99%+ purity
- Products: All peptides available as lyophilized (freeze-dried) powder in sealed vials
- Categories: Metabolic, Recovery, Cognitive, Growth Hormone, and Blends
- Shipping: FREE shipping on ALL orders
- Storage: Store lyophilized peptides at 2-8°C. Reconstituted solutions stable for 30 days at 2-8°C

COMMON POLICIES:
- Returns accepted within 30 days for unopened products
- All products come with Certificate of Analysis
- Shipping typically takes 3-5 business days
- Discreet packaging for all orders`;
}

/**
 * Build formatting rules for chat responses
 */
function buildFormattingRules(): string {
  // Build product slug reference table
  const productSlugs = products
    .slice(0, 20)
    .map((p) => `${p.name}: /products/${p.slug}`)
    .join("\n");

  return `

RESPONSE FORMAT FOR PRODUCTS:

**[Product Name]**
- [Key benefit 1]
- [Key benefit 2]
- [Key benefit 3]
👉 [View Product](/products/SLUG)

*For research use only.*

CRITICAL MARKDOWN RULES:
1. Bullet lists: Use "- " (dash space), NOT "•"
2. Links: [Text](url) format
3. Product links: 👉 [View Product](/products/slug) - this will auto-display a product card with price and dosage
4. Product name: **Product Name** (bold, on its own line)
5. Benefits: bullet points directly below product name
6. Do NOT include price or dosage after the product link - it's shown automatically in the product card
7. Section headers MUST be bold: Use **Header Text:** format for any section headers like "Recommended for New Researchers:", "Pro Tip:", "Additional Options:", etc.

VALID PRODUCT SLUGS (use these exact slugs in links):
${productSlugs}

MANDATORY DISCLAIMER:
Every response MUST end with:
*For research use only. Not for human consumption.*`;
}

/**
 * Build system prompt for guest users
 */
export function buildGuestSystemPrompt(): string {
  const basePrompt = buildBasePrompt();
  const formattingRules = buildFormattingRules();

  return `${basePrompt}
${formattingRules}

GUEST USER CONTEXT:
The user is not logged in. You can help with:
- Product information and recommendations
- FAQ answers about peptides and their research applications
- Shipping and return policy information
- General questions about DYOR Wellness

LIMITATIONS:
You cannot access order information for guests. If asked about orders, tracking, or account-specific questions, respond with:
"I'd be happy to help with your order! Please sign in to your account so I can look up your order details and provide personalized assistance."

Always encourage guests to create an account for order tracking and personalized support.`;
}

/**
 * Build system prompt for authenticated users
 */
export function buildAuthenticatedSystemPrompt(user: AuthenticatedUser): string {
  const basePrompt = buildBasePrompt();
  const formattingRules = buildFormattingRules();

  const orderSummary =
    user.orders.length > 0
      ? user.orders
          .slice(0, 5)
          .map((order) => {
            const status = order.status.charAt(0).toUpperCase() + order.status.slice(1);
            const date = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const tracking = order.trackingNumber ? ` - Tracking: ${order.trackingNumber}` : "";
            return `  - Order #${order.orderNumber} - ${date} - $${order.total.toFixed(2)} - ${status}${tracking}`;
          })
          .join("\n")
      : "  No orders found";

  return `${basePrompt}
${formattingRules}

AUTHENTICATED USER CONTEXT:
The user is logged in as: ${user.firstName || "Customer"}
Email: ${user.email}

RECENT ORDERS:
${orderSummary}

CAPABILITIES:
You can help with all guest features plus:
- Order status and tracking information
- Order history questions
- Account-related questions
- Personalized product recommendations based on order history

When discussing orders, always reference the order number (e.g., "Order #PS-12345").
If asked about an order not in the list, explain you can only see recent orders and suggest they check their email for older order confirmations.`;
}

/**
 * Build product catalog context (summary)
 */
export function buildProductContext(): string {
  const categoryInfo = categories
    .map((cat) => `- ${cat.name}: ${cat.description} (${cat.productCount} products)`)
    .join("\n");

  const featuredProducts = products
    .filter((p) => p.featured)
    .slice(0, 8)
    .map((p) => `- ${p.name} ($${p.price}) - ${p.shortDescription}`)
    .join("\n");

  const bestSellers = products
    .filter((p) => p.bestSeller)
    .map((p) => p.name)
    .join(", ");

  return `
PRODUCT CATALOG SUMMARY:

CATEGORIES:
${categoryInfo}

FEATURED PRODUCTS:
${featuredProducts}

BEST SELLERS: ${bestSellers}

Total products available: ${products.length}

For specific product details, the user can visit /products or /products/[product-slug]`;
}

/**
 * Find products relevant to a user query
 */
export function findRelevantProducts(query: string): Product[] {
  // Search using existing search function
  const searchResults = searchProducts(query);

  if (searchResults.length > 0) {
    return searchResults.slice(0, 5);
  }

  // Also check for specific keywords
  const lowerQuery = query.toLowerCase();
  const keywords = [
    { terms: ["weight", "fat", "metabolic", "diet", "lose"], category: "metabolic" },
    { terms: ["heal", "repair", "recover", "injury", "wound"], category: "recovery" },
    { terms: ["brain", "cognitive", "memory", "focus", "mental"], category: "cognitive" },
    { terms: ["growth", "muscle", "strength", "gh"], category: "growth-hormone" },
    { terms: ["blend", "stack", "combo", "combination"], category: "blends" },
  ];

  for (const keyword of keywords) {
    if (keyword.terms.some((term) => lowerQuery.includes(term))) {
      return products.filter((p) => p.category === keyword.category).slice(0, 5);
    }
  }

  return [];
}

/**
 * Build focused context for a specific query
 */
export function buildQueryContext(query: string): string {
  const relevantProducts = findRelevantProducts(query);

  if (relevantProducts.length === 0) {
    return "";
  }

  const productDetails = relevantProducts
    .map((p) => {
      const benefits = p.benefits?.slice(0, 3).join("; ") || p.shortDescription;
      return `
PRODUCT: ${p.name} (${p.fullName || p.name})
- Price: $${p.price}${p.originalPrice ? ` (was $${p.originalPrice})` : ""}
- Category: ${p.categoryDisplay}
- Dosage: ${p.dosage}
- Purity: ${p.purity}
- Description: ${p.shortDescription}
- Key Benefits: ${benefits}
- URL: /products/${p.slug}`;
    })
    .join("\n");

  return `
RELEVANT PRODUCTS FOR THIS QUERY:
${productDetails}`;
}

/**
 * Build order context for authenticated users
 */
export function buildOrderContext(orders: UserOrder[]): string {
  if (orders.length === 0) {
    return "\nNo order history available.";
  }

  const orderDetails = orders
    .map((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const tracking = order.trackingNumber
        ? `\n  Tracking: ${order.trackingNumber}`
        : "";

      return `Order #${order.orderNumber}
  Date: ${date}
  Total: $${order.total.toFixed(2)}
  Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}${tracking}`;
    })
    .join("\n\n");

  return `
ORDER HISTORY:
${orderDetails}`;
}

/**
 * Format a single product for chat response
 */
export function formatProductForChat(product: Product): string {
  return `**${product.name}** - $${product.price}
${product.shortDescription}
[View Product](/products/${product.slug})`;
}
