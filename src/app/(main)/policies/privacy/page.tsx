import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | DYOR Wellness",
  description: "How we protect and handle your personal information",
};

export default function PrivacyPolicyPage(): React.ReactElement {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-primary-foreground/80">
            How we protect and handle your personal information
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
            <li><a href="#information-collection" className="text-accent hover:underline">1. Information Collection</a></li>
            <li><a href="#use-of-information" className="text-accent hover:underline">2. Use of Information</a></li>
            <li><a href="#data-sharing" className="text-accent hover:underline">3. Data Sharing</a></li>
            <li><a href="#security" className="text-accent hover:underline">4. Security Measures</a></li>
            <li><a href="#your-rights" className="text-accent hover:underline">5. Your Rights</a></li>
            <li><a href="#cookies" className="text-accent hover:underline">6. Cookies & Tracking</a></li>
            <li><a href="#contact" className="text-accent hover:underline">7. Contact Us</a></li>
          </ul>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          <h2 id="information-collection" className="text-xl font-semibold mt-8 mb-4">1. Information Collection</h2>
          <p className="mb-4">
            At DYOR Wellness, we believe in transparency. We collect personal information only when you voluntarily provide it to us. This includes:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Contact Information:</strong> Name, email address, phone number</li>
            <li><strong>Shipping Information:</strong> Mailing address, delivery instructions</li>
            <li><strong>Payment Information:</strong> Credit card data, billing address (processed securely through payment processors)</li>
            <li><strong>Account Information:</strong> Usernames, passwords, preferences</li>
          </ul>

          <h2 id="use-of-information" className="text-xl font-semibold mt-8 mb-4">2. Use of Information</h2>
          <p className="mb-4">We use the information you provide exclusively for:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Processing and fulfilling your orders</li>
            <li>Sending order confirmations and shipping updates</li>
            <li>Providing customer support and responding to inquiries</li>
            <li>Sending newsletters and product catalogs (only if you&apos;ve opted in)</li>
            <li>Improving our website and services</li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 id="data-sharing" className="text-xl font-semibold mt-8 mb-4">3. Data Sharing</h2>
          <p className="mb-4">
            <strong>We do not sell, rent, or share your personal information with third parties</strong> without your explicit written consent, with the following exceptions:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Payment Processors:</strong> Credit card data is shared with PCI-DSS compliant payment processors to process your order</li>
            <li><strong>Shipping Partners:</strong> Your shipping address is shared with carriers necessary to deliver your order</li>
            <li><strong>Legal Requirements:</strong> We may disclose information when required by law or government requests</li>
          </ul>

          <h2 id="security" className="text-xl font-semibold mt-8 mb-4">4. Security Measures</h2>
          <p className="mb-4">Your data security is paramount. We employ:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>SSL Encryption:</strong> All transactions are encrypted using industry-standard SSL technology</li>
            <li><strong>Secure Storage:</strong> Customer information is stored on secure, encrypted servers with limited access</li>
            <li><strong>Password Protection:</strong> Strong password requirements for all accounts</li>
            <li><strong>Regular Audits:</strong> We regularly review our security practices</li>
          </ul>

          <h2 id="your-rights" className="text-xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
            <li><strong>Correction:</strong> Request that we update or correct inaccurate information</li>
            <li><strong>Deletion:</strong> Request that we delete your personal information</li>
            <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
            <li><strong>Data Portability:</strong> Request your data in a portable format</li>
          </ul>
          <p className="mb-6">To exercise these rights, contact us using the information in Section 7.</p>

          <h2 id="cookies" className="text-xl font-semibold mt-8 mb-4">6. Cookies & Tracking</h2>
          <p className="mb-4">Our website uses cookies to:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Remember your preferences and login information</li>
            <li>Analyze website traffic and user behavior</li>
            <li>Improve user experience</li>
          </ul>
          <p className="mb-6">
            You can disable cookies in your browser settings, though this may affect website functionality. We do not share tracking data with third parties without consent.
          </p>

          <h2 id="contact" className="text-xl font-semibold mt-8 mb-4">7. Contact Us</h2>
          <p className="mb-4">For privacy inquiries or to exercise your data rights, please contact us at:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>support@dyorwellness.com</li>
            <li>Response time: Within 30 days of receipt</li>
          </ul>

          <h3 className="text-lg font-semibold mt-6 mb-3">Policy Updates</h3>
          <p className="mb-6">
            We review and update this privacy policy annually. Significant changes will be communicated via email to registered users. Your continued use of our website indicates acceptance of our privacy practices.
          </p>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mt-8">
            <p className="text-sm">
              <strong>Important Note:</strong> This policy applies to our website and services. We recommend reviewing this privacy policy regularly as it may be updated without notice. If you have questions about our privacy practices, please contact us using the information above.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
