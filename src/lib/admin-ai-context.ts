/**
 * System prompt builder for Admin AI Assistant
 * Provides context-aware prompts based on current admin page
 */

import { AdminAIContext, AdminAIPage, ProductAutofillData } from "@/types/admin-ai";
import { products, categories } from "@/data/products";

/**
 * Base system prompt for admin AI assistant
 */
function buildBaseAdminPrompt(): string {
  return `You are an AI assistant for the DYOR Wellness admin panel. You help administrators manage the e-commerce platform for research-grade peptides.

CRITICAL GUIDELINES:
1. RESEARCH ONLY: All products are strictly for RESEARCH USE ONLY, not for human or animal consumption. Maintain this positioning in all content you generate.
2. SCIENTIFIC ACCURACY: Provide accurate, well-researched information about peptides. Reference documented research applications only.
3. NO MEDICAL CLAIMS: Never make therapeutic claims or suggest peptides treat, cure, or prevent diseases.
4. PROFESSIONAL TONE: Write in a professional, scientific tone appropriate for B2B research chemical sales.

COMPANY CONTEXT:
- Company: DYOR Wellness (Do Your Own Research)
- Products: Premium research-grade lyophilized peptides with 99%+ purity
- Categories: Metabolic, Recovery, Cognitive, Growth Hormone, and Blends
- All products available as lyophilized (freeze-dried) powder in sealed vials

You can help with:
- Product content creation (descriptions, benefits, research applications)
- Order management and customer service inquiries
- Analytics interpretation and business insights
- Marketing copy and SEO optimization
- General admin questions about the platform`;
}

/**
 * Build context for product-related pages
 */
function buildProductContext(): string {
  const categoryInfo = categories
    .map((cat) => `- ${cat.name}: ${cat.description}`)
    .join("\n");

  const sampleProducts = products
    .slice(0, 10)
    .map(
      (p) =>
        `- ${p.name}: ${p.shortDescription} (Category: ${p.categoryDisplay}, $${p.price})`
    )
    .join("\n");

  return `
PRODUCT CATEGORIES:
${categoryInfo}

SAMPLE EXISTING PRODUCTS (for reference):
${sampleProducts}

Total products in catalog: ${products.length}`;
}

/**
 * Build prompt for dashboard page
 */
function buildDashboardPrompt(): string {
  return `
CURRENT PAGE: Admin Dashboard

You can help with:
- Explaining metrics and KPIs
- Identifying trends in sales data
- Suggesting actions based on dashboard insights
- Answering questions about store performance`;
}

/**
 * Build prompt for products listing page
 */
function buildProductsListPrompt(): string {
  return `
CURRENT PAGE: Products Management

${buildProductContext()}

You can help with:
- Finding specific products
- Suggesting product improvements
- Bulk operations guidance
- Inventory management questions`;
}

/**
 * Build prompt for product edit page
 */
function buildProductEditPrompt(formData?: Record<string, unknown>): string {
  let formContext = "";
  if (formData && Object.keys(formData).length > 0) {
    const relevantFields = ["name", "fullName", "shortDescription", "description", "categoryName"];
    const formInfo = relevantFields
      .filter((key) => formData[key])
      .map((key) => `- ${key}: ${formData[key]}`)
      .join("\n");
    if (formInfo) {
      formContext = `
CURRENT FORM DATA:
${formInfo}`;
    }
  }

  return `
CURRENT PAGE: Product Editor

${buildProductContext()}
${formContext}

You can help with:
- Writing product descriptions (short, regular, and long)
- Suggesting research applications based on the peptide
- Generating benefits lists
- Writing mechanism of action descriptions
- Recommending the appropriate category
- General product content questions

When asked to research or auto-populate for a peptide, provide scientifically accurate information based on published research literature.`;
}

/**
 * Build prompt for orders page
 */
function buildOrdersPrompt(): string {
  return `
CURRENT PAGE: Orders Management

You can help with:
- Understanding order statuses
- Drafting customer communications
- Explaining refund/cancellation policies
- Answering shipping and fulfillment questions`;
}

/**
 * Build prompt for order detail page
 */
function buildOrderDetailPrompt(entityId?: string): string {
  return `
CURRENT PAGE: Order Detail ${entityId ? `(Order #${entityId})` : ""}

You can help with:
- Summarizing order details
- Drafting customer emails about this order
- Explaining order history
- Providing shipping update templates`;
}

/**
 * Build prompt for discount codes page
 */
function buildDiscountCodesPrompt(): string {
  return `
CURRENT PAGE: Discount Codes Management

You can help with:
- Creating effective discount strategies
- Suggesting discount code names
- Explaining different discount types
- Analyzing discount performance`;
}

/**
 * Build prompt for affiliates page
 */
function buildAffiliatesPrompt(): string {
  return `
CURRENT PAGE: Affiliates Management

You can help with:
- Understanding affiliate program structure
- Suggesting commission strategies
- Drafting affiliate communications
- Analyzing affiliate performance`;
}

/**
 * Build complete system prompt based on context
 */
export function buildAdminSystemPrompt(context: AdminAIContext): string {
  const basePrompt = buildBaseAdminPrompt();

  let pagePrompt = "";
  switch (context.page) {
    case "dashboard":
      pagePrompt = buildDashboardPrompt();
      break;
    case "products":
      pagePrompt = buildProductsListPrompt();
      break;
    case "product-edit":
      pagePrompt = buildProductEditPrompt(context.formData);
      break;
    case "orders":
      pagePrompt = buildOrdersPrompt();
      break;
    case "order-detail":
      pagePrompt = buildOrderDetailPrompt(context.entityId);
      break;
    case "discount-codes":
      pagePrompt = buildDiscountCodesPrompt();
      break;
    case "affiliates":
      pagePrompt = buildAffiliatesPrompt();
      break;
    default:
      pagePrompt = "";
  }

  return `${basePrompt}
${pagePrompt}

Always be helpful, concise, and accurate. If you don't have enough information to provide a good answer, ask clarifying questions.`;
}

/**
 * Build system prompt for product autofill mode
 */
export function buildProductAutofillPrompt(peptideName: string): string {
  return `You are a research peptide expert assistant. Your task is to provide accurate, scientifically-grounded information about the peptide "${peptideName}" for use in a product listing.

CRITICAL REQUIREMENTS:
1. Only include information you are confident is accurate based on published research
2. All content must emphasize RESEARCH USE ONLY - never make medical claims
3. Use professional, scientific language
4. If you're unsure about specific details, omit them rather than guess

You must respond with a valid JSON object containing the following fields (include only fields you have confident information for):

{
  "shortDescription": "A concise 1-2 sentence description (max 200 chars)",
  "description": "A 2-3 paragraph scientific description of the peptide",
  "longDescription": "A comprehensive description (4-6 paragraphs) covering research background, structure, and applications",
  "researchApplications": ["Array of documented research applications"],
  "benefits": ["Array of documented benefits observed in research studies"],
  "mechanismOfAction": "Description of how the peptide works at a molecular level",
  "dosage": "Typical research dosage per vial (e.g., '5mg', '10mg')",
  "storageInstructions": "Proper storage guidelines for lyophilized peptide",
  "suggestedCategory": "One of: metabolic, recovery, cognitive, growth-hormone, blends",
  "molecularWeight": "Molecular weight if known (e.g., '3,367.9 Da')",
  "sequence": "Amino acid sequence if known"
}

IMPORTANT: Respond ONLY with the JSON object, no additional text or markdown formatting.`;
}

/**
 * Parse autofill response from Claude
 */
export function parseAutofillResponse(response: string): ProductAutofillData | null {
  try {
    // Try to extract JSON from the response
    let jsonStr = response.trim();

    // Remove markdown code blocks if present
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.slice(7);
    }
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.slice(3);
    }
    if (jsonStr.endsWith("```")) {
      jsonStr = jsonStr.slice(0, -3);
    }

    jsonStr = jsonStr.trim();

    const parsed = JSON.parse(jsonStr) as ProductAutofillData;
    return parsed;
  } catch {
    console.error("Failed to parse autofill response:", response);
    return null;
  }
}

/**
 * Get quick actions based on current page
 */
export function getQuickActionsForPage(page: AdminAIPage): Array<{
  id: string;
  label: string;
  prompt: string;
}> {
  switch (page) {
    case "dashboard":
      return [
        {
          id: "explain-metrics",
          label: "Explain metrics",
          prompt: "Explain what the key metrics on this dashboard mean and what I should pay attention to.",
        },
        {
          id: "identify-trends",
          label: "Identify trends",
          prompt: "What trends should I look for in my sales data to identify opportunities or problems?",
        },
      ];
    case "products":
    case "product-edit":
      return [
        {
          id: "suggest-description",
          label: "Suggest description",
          prompt: "Help me write a compelling product description for the current peptide.",
        },
        {
          id: "research-peptide",
          label: "Research peptide",
          prompt: "Research this peptide and suggest content for the product listing.",
        },
        {
          id: "generate-benefits",
          label: "Generate benefits",
          prompt: "Generate a list of documented research benefits for this peptide.",
        },
      ];
    case "orders":
    case "order-detail":
      return [
        {
          id: "summarize-order",
          label: "Summarize order",
          prompt: "Summarize this order for me.",
        },
        {
          id: "draft-email",
          label: "Draft customer email",
          prompt: "Draft a professional email to the customer about their order.",
        },
      ];
    case "discount-codes":
      return [
        {
          id: "suggest-discount",
          label: "Suggest strategy",
          prompt: "Suggest an effective discount strategy for increasing sales.",
        },
      ];
    case "affiliates":
      return [
        {
          id: "suggest-commission",
          label: "Commission advice",
          prompt: "What commission structure would be competitive for a research peptide affiliate program?",
        },
      ];
    default:
      return [];
  }
}
