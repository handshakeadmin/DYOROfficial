import { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with DYORWellness. We're here to help with your research peptide needs.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-premium text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Have questions about our products or need assistance with your order?
            We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="text-muted mb-8">
                  Our customer support team is available Monday through Friday,
                  9am to 6pm PST. We typically respond to inquiries within 24 hours.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <a
                      href="mailto:info@dyorwellness.com"
                      className="text-muted hover:text-accent transition-colors"
                    >
                      info@dyorwellness.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-muted">
                      123 Research Blvd, Suite 100
                      <br />
                      Irvine, CA 92602
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Business Hours</h3>
                    <p className="text-muted">
                      Monday - Friday: 9am - 6pm PST
                      <br />
                      Shipping: Mon - Thu (excluding holidays)
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-background-secondary rounded-xl p-6">
                <h3 className="font-semibold mb-3">Quick Information</h3>
                <ul className="text-sm text-muted space-y-2">
                  <li>
                    <strong>Order Issues:</strong> Include your order number in
                    all correspondence
                  </li>
                  <li>
                    <strong>COA Requests:</strong> Specify product name and lot
                    number if available
                  </li>
                  <li>
                    <strong>Bulk Orders:</strong> Contact us for wholesale
                    pricing
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl border p-6 lg:p-8">
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
