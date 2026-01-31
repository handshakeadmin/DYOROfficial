import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | DYOR Wellness",
  description: "Delivery information and shipping policies for your orders",
};

export default function ShippingPolicyPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Shipping Policy</h1>
          <p className="text-primary-foreground/80">
            Delivery information and shipping policies for your orders
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
            <li><a href="#processing" className="text-accent hover:underline">1. Order Processing</a></li>
            <li><a href="#shipping-methods" className="text-accent hover:underline">2. Shipping Methods</a></li>
            <li><a href="#shipping-times" className="text-accent hover:underline">3. Shipping Times</a></li>
            <li><a href="#free-shipping" className="text-accent hover:underline">4. Free Shipping</a></li>
            <li><a href="#packaging" className="text-accent hover:underline">5. Packaging & Handling</a></li>
            <li><a href="#tracking" className="text-accent hover:underline">6. Tracking & Delivery</a></li>
            <li><a href="#damaged" className="text-accent hover:underline">7. Damaged Orders</a></li>
            <li><a href="#international" className="text-accent hover:underline">8. International Shipping</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2 id="processing" className="text-xl font-semibold mt-8 mb-4">1. Order Processing</h2>
          <p className="mb-4">
            All orders are processed within 1-3 business days after payment is confirmed. Processing times do not include weekends or holidays.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Same-Day Processing:</strong> Orders placed before 2 PM PST may be processed same-day</li>
            <li><strong>Order Confirmation:</strong> You will receive an order confirmation email with your order details</li>
            <li><strong>Shipping Notification:</strong> A shipping confirmation with tracking information will be sent when your order ships</li>
          </ul>

          <h2 id="shipping-methods" className="text-xl font-semibold mt-8 mb-4">2. Shipping Methods</h2>
          <p className="mb-4">We offer several domestic shipping options:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>USPS Priority Mail:</strong> 3-5 business days (standard option)</li>
            <li><strong>USPS Priority Mail Express:</strong> 1-2 business days</li>
            <li><strong>FedEx 2-Day:</strong> 2 business days</li>
            <li><strong>FedEx Overnight:</strong> Next business day delivery</li>
          </ul>

          <h2 id="shipping-times" className="text-xl font-semibold mt-8 mb-4">3. Shipping Times & Processing</h2>
          <p className="mb-4">
            Estimated delivery times are calculated from the ship date, not the order date. Standard shipping typically takes 3-5 business days total (including processing time).
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Processing:</strong> 1-3 business days</li>
            <li><strong>Standard Shipping:</strong> 3-5 business days after processing</li>
            <li><strong>Total Time:</strong> 4-8 business days typical</li>
          </ul>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 my-6">
            <strong>Note:</strong> Estimates are not guaranteed. Delivery times depend on carrier performance, destination, and weather conditions. Peak seasons may cause delays.
          </div>

          <h2 id="free-shipping" className="text-xl font-semibold mt-8 mb-4">4. Free Shipping</h2>
          <p className="mb-4">
            Orders totaling $150 or more qualify for free standard USPS Priority Mail shipping within the continental United States.
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Free shipping applies to standard USPS Priority Mail only</li>
            <li>Expedited shipping options are available for an additional fee</li>
            <li>Free shipping discount cannot be combined with other promotions</li>
          </ul>

          <h2 id="packaging" className="text-xl font-semibold mt-8 mb-4">5. Packaging & Handling</h2>
          <p className="mb-4">All peptides are carefully packaged to ensure integrity during transit:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Format:</strong> Products ship in lyophilized (freeze-dried) form</li>
            <li><strong>Temperature:</strong> Room temperature stable; no refrigeration required during shipping</li>
            <li><strong>Protection:</strong> Desiccant packets included to control moisture</li>
            <li><strong>Stability:</strong> Products remain stable at room temperature for several weeks during transit</li>
            <li><strong>Packaging Quality:</strong> All orders include protective padding and secure packaging</li>
          </ul>

          <h2 id="tracking" className="text-xl font-semibold mt-8 mb-4">6. Tracking & Delivery</h2>
          <p className="mb-4">Once your order ships, you will receive:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Shipping confirmation email with tracking number</li>
            <li>Tracking link to monitor delivery status</li>
            <li>Delivery updates via USPS, FedEx, or carrier of your choice</li>
          </ul>
          <p className="mb-6">
            You are responsible for monitoring your delivery. If you are not available at delivery, the carrier will attempt redelivery or hold the package.
          </p>

          <h2 id="damaged" className="text-xl font-semibold mt-8 mb-4">7. Damaged or Lost Orders</h2>
          <p className="mb-4">If you receive a damaged, incomplete, or missing order:</p>
          <ol className="list-decimal pl-6 mb-6 space-y-2">
            <li><strong>Report Within 7 Days:</strong> Contact us within 7 days of delivery</li>
            <li><strong>Provide Proof:</strong> Include photos of the damage or packaging</li>
            <li><strong>Resolution:</strong> We will provide a replacement or refund at our discretion</li>
            <li><strong>Shipping Costs:</strong> We cover return shipping for defective orders</li>
          </ol>

          <p className="mb-4">If a package is marked delivered but not received:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Check with neighbors and household members</li>
            <li>Contact your carrier to locate the package</li>
            <li>Notify us within 7 days with delivery proof from the carrier</li>
            <li>We will file a claim with the carrier and provide a replacement or refund</li>
          </ul>

          <h2 id="international" className="text-xl font-semibold mt-8 mb-4">8. International Shipping</h2>
          <p className="mb-4">
            <strong>Currently, DYOR Wellness ships to the United States only.</strong> We do not offer international shipping at this time.
          </p>
          <p className="mb-6">
            If you have special shipping requests or questions, please contact us at support@dyorwellness.com for assistance.
          </p>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-8">
            <p className="text-sm">
              <strong>Important:</strong> Shipping costs, delivery times, and availability are subject to change. We are not responsible for delays caused by carrier performance, customs, weather, or other factors beyond our control. Please allow additional time during holiday seasons and peak shipping periods.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
