import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | DYOR Wellness",
  description: "Important terms and conditions for using our service",
};

export default function TermsPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-primary-foreground/80">
            Important terms and conditions for using our service
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

        {/* Content */}
        <div className="prose prose-gray max-w-none space-y-8">
          {/* Research Use Only */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Research Use Only</h2>
            <p className="mb-4">
              All products sold by DYOR Wellness are intended for laboratory research purposes only.
              They are NOT intended for human or veterinary consumption, ingestion, inhalation, or any
              other use that would introduce them into the human or animal body.
            </p>
            <p>
              Products are strictly for use by trained professionals in controlled laboratory settings
              with appropriate equipment and safety protocols.
            </p>
          </section>

          {/* Age Verification */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Age Verification</h2>
            <p className="mb-4">
              By placing an order, you confirm that you are at least 18 years of age and legally able
              to purchase research chemicals in your jurisdiction.
            </p>
            <p>
              DYOR Wellness reserves the right to request proof of age and to cancel orders from
              customers who cannot verify their age.
            </p>
          </section>

          {/* Legal Responsibility */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Responsibility</h2>
            <p className="mb-4">
              You are solely responsible for understanding local, state, and federal regulations
              regarding the purchase and possession of research chemicals.
            </p>
            <p className="mb-4">
              DYOR Wellness is not liable for any illegal use of products or violations of local
              regulations by the customer.
            </p>
            <p>
              You assume all responsibility for proper handling, storage, and use of purchased products
              in accordance with laboratory safety standards and applicable laws.
            </p>
          </section>

          {/* Product Quality */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Product Quality & Purity</h2>
            <p className="mb-4">All DYOR Wellness products are:</p>
            <ul className="list-disc pl-6 mb-4 space-y-2">
              <li>Laboratory-grade quality with 99%+ purity certification</li>
              <li>Tested and verified by third-party laboratories</li>
              <li>Manufactured in cGMP-compliant facilities</li>
              <li>Accompanied by Certificate of Analysis (CoA)</li>
            </ul>
            <p>
              We stand behind the quality of our products. If you receive a product that does not
              meet stated specifications, contact us immediately.
            </p>
          </section>

          {/* Returns & Refunds */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Returns & Refunds</h2>
            <p className="mb-4">
              Products may be returned within 30 days of purchase in original, sealed condition for
              a full refund. Returns shipping is the customer&apos;s responsibility.
            </p>
            <p className="mb-4">
              Opened, unsealed, or used products cannot be returned.
            </p>
            <p>
              To initiate a return, contact us with your order number and reason for return.
              See our full <Link href="/policies/returns" className="text-accent hover:underline">Returns Policy</Link> for details.
            </p>
          </section>

          {/* Shipping & Handling */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Shipping & Handling</h2>
            <p className="mb-4">
              Orders are packaged discreetly and securely. We are not responsible for packages lost
              or damaged in transit after they leave our facility.
            </p>
            <p className="mb-4">
              Tracking information will be provided. Insurance options are available for high-value orders.
            </p>
            <p>
              Orders to certain jurisdictions may not be available due to local regulations.
              See our full <Link href="/policies/shipping" className="text-accent hover:underline">Shipping Policy</Link> for details.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Privacy & Data Protection</h2>
            <p className="mb-4">
              Your personal and payment information is protected with industry-standard encryption.
              We do not share your information with third parties without your consent, except as
              required by law.
            </p>
            <p>
              For our complete privacy practices, please see our <Link href="/policies/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
            <p className="mb-4">
              DYOR Wellness provides information for educational and research purposes only. We do
              not provide medical, legal, or safety advice. You must conduct your own research and
              consult with appropriate professionals.
            </p>
            <p>
              Users assume all liability for their use or misuse of products purchased from
              DYOR Wellness. We are not responsible for any personal injury, property damage,
              or legal consequences resulting from product use.
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              DYOR Wellness reserves the right to modify these terms at any time. Continued use of
              our website and services constitutes acceptance of any changes.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Questions?</h2>
            <p>
              If you have questions about these terms and conditions, please <Link href="/contact" className="text-accent hover:underline">contact us</Link> at your earliest convenience.
            </p>
          </section>

          {/* Acceptance Box */}
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mt-8">
            <p className="font-semibold mb-2">
              By proceeding with checkout, you acknowledge that you have read, understood,
              and agree to these Terms & Conditions.
            </p>
            <p className="text-sm">
              You confirm that the products are for laboratory research only and that you are at
              least 18 years of age.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
