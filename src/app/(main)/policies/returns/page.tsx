import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Returns & Refund Policy | DYOR Wellness",
  description: "Return conditions and refund policy details",
};

export default function ReturnsPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Returns & Refund Policy</h1>
          <p className="text-primary-foreground/80">
            Return conditions and refund policy details
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-accent hover:underline mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <p className="text-sm text-muted mb-8">Last updated: January 2026</p>

        {/* Table of Contents */}
        <div className="bg-background-secondary rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">Table of Contents</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#overview" className="text-accent hover:underline">1. Policy Overview</a></li>
            <li><a href="#return-window" className="text-accent hover:underline">2. Return Window</a></li>
            <li><a href="#conditions" className="text-accent hover:underline">3. Return Conditions</a></li>
            <li><a href="#damaged-defective" className="text-accent hover:underline">4. Damaged or Defective Products</a></li>
            <li><a href="#shipping-costs" className="text-accent hover:underline">5. Shipping Costs</a></li>
            <li><a href="#refund-timeline" className="text-accent hover:underline">6. Refund Timeline</a></li>
            <li><a href="#exceptions" className="text-accent hover:underline">7. Exceptions & Non-Returnable Items</a></li>
            <li><a href="#contact" className="text-accent hover:underline">8. Contact Us</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2 id="overview" className="text-xl font-semibold mt-8 mb-4">1. Policy Overview</h2>
          <p className="mb-4">
            At DYOR Wellness, we stand behind the quality of our products. This policy outlines the terms for returns and refunds.
          </p>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 my-6">
            <strong>Research-Grade Products:</strong> Because peptides are sensitive, sterile research materials, we maintain a strict returns policy balanced with our commitment to customer satisfaction.
          </div>

          <h2 id="return-window" className="text-xl font-semibold mt-8 mb-4">2. Return Window</h2>
          <p className="mb-4">
            You may request a return or refund for unused, unopened products within <strong>30 days of delivery</strong>.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Return window begins from delivery date, not order date</li>
            <li>Requests submitted after 30 days will not be accepted</li>
            <li>Damaged or defective products can be reported up to 7 days after delivery</li>
          </ul>

          <h2 id="conditions" className="text-xl font-semibold mt-8 mb-4">3. Return Conditions</h2>
          <p className="mb-4">To qualify for return, products must meet all of the following conditions:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Unopened Seal:</strong> Vial seals must be intact and unopened</li>
            <li><strong>Original Packaging:</strong> Product must be in original, undamaged packaging</li>
            <li><strong>No Contamination:</strong> No signs of contamination, damage, or tampering</li>
            <li><strong>Original Receipt:</strong> Return must include original order number or receipt</li>
            <li><strong>Proper Storage:</strong> Must have been stored as recommended</li>
          </ul>

          <h2 id="damaged-defective" className="text-xl font-semibold mt-8 mb-4">4. Damaged or Defective Products</h2>
          <p className="mb-4">If you receive a damaged, defective, or mislabeled product, we will make it right.</p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Damage Reporting Process:</h3>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>Report Promptly:</strong> Contact support@dyorwellness.com within 7 days of delivery</li>
            <li><strong>Provide Evidence:</strong> Include clear photos of damage, vial, packaging, and seal</li>
            <li><strong>Include Details:</strong> Provide your order number, date received, and product name</li>
            <li><strong>Await Response:</strong> We will respond within 24 hours with resolution</li>
          </ol>

          <h3 className="text-lg font-semibold mt-6 mb-3">Damage Resolution:</h3>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Replacement:</strong> We will ship replacement product at no charge</li>
            <li><strong>Full Refund:</strong> Full refund to original payment method (no restocking fee)</li>
            <li><strong>Return Shipping:</strong> We provide prepaid return label</li>
          </ul>

          <h2 id="shipping-costs" className="text-xl font-semibold mt-8 mb-4">5. Shipping Costs</h2>
          <p className="mb-4">Please understand the following regarding shipping costs:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Return Shipping:</strong> Customer is responsible for return shipping costs (unless product is defective)</li>
            <li><strong>Original Shipping:</strong> Non-refundable</li>
            <li><strong>Defective Items:</strong> We cover all return shipping costs</li>
            <li><strong>Refund Amount:</strong> Refund covers product cost only</li>
          </ul>

          <h2 id="refund-timeline" className="text-xl font-semibold mt-8 mb-4">6. Refund Timeline</h2>
          <p className="mb-4">Once we receive and inspect your returned product:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Inspection:</strong> 2-3 business days</li>
            <li><strong>Approval:</strong> We will notify you of approval or denial</li>
            <li><strong>Processing:</strong> Refunds are processed to original payment method</li>
            <li><strong>Timeline:</strong> 5-10 business days after approval</li>
            <li><strong>Crypto Refunds:</strong> May take additional time depending on blockchain confirmation</li>
          </ul>

          <h2 id="exceptions" className="text-xl font-semibold mt-8 mb-4">7. Exceptions & Non-Returnable Items</h2>

          <h3 className="text-lg font-semibold mt-6 mb-3">Non-Returnable Products:</h3>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Opened or partially used vials</li>
            <li>Products exceeding 30-day return window</li>
            <li>Damaged packaging caused by customer mishandling</li>
            <li>Items purchased on clearance or sale (final sale)</li>
            <li>Custom or special order products</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Special Circumstances:</h3>
          <p className="mb-4">In certain situations, we may consider exceptions to this policy:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Bulk orders (contact support@dyorwellness.com)</li>
            <li>Research institution agreements (special terms may apply)</li>
            <li>Documentation of product quality issues</li>
          </ul>
          <p className="mb-6">
            For special circumstances, email support@dyorwellness.com with detailed explanation and supporting documentation.
          </p>

          <h2 id="contact" className="text-xl font-semibold mt-8 mb-4">8. Contact Us for Returns</h2>
          <p className="mb-4">To initiate a return or report a damaged/defective product:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>support@dyorwellness.com</li>
            <li><strong>Subject Line:</strong> &quot;Return Request - [Your Order Number]&quot;</li>
            <li><strong>Response Time:</strong> 24 business hours</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Return Shipping Address:</h3>
          <p className="mb-6">
            We will provide specific return address instructions after your return is approved. Do not ship returns without authorization and specific address details.
          </p>

          <h3 className="text-lg font-semibold mt-6 mb-3">Required Information:</h3>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Full name and order number</li>
            <li>Product name and quantity</li>
            <li>Reason for return</li>
            <li>Proof of damage (photos for defective items)</li>
          </ul>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-8">
            <p className="text-sm">
              <strong>Important:</strong> This returns policy applies to direct purchases from DYOR Wellness only. Returns cannot be processed for products purchased from third-party retailers. Please verify your purchase source before initiating a return. All returns are processed at our discretion, and the decision is final. Refund amounts are calculated based on the product cost only and do not include shipping fees or taxes.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
