import Link from "next/link";
import { Mail, Phone, MapPin, Clock, Shield, FlaskConical, Award, FileCheck } from "lucide-react";

const productLinks = [
  { name: "All Peptides", href: "/products" },
  { name: "Lyophilized", href: "/products?type=lyophilized" },
  { name: "Capsules", href: "/products?type=capsules" },
  { name: "Nasal Sprays", href: "/products?type=nasal-spray" },
  { name: "Serums", href: "/products?type=serum" },
];

const popularProducts = [
  { name: "BPC-157", href: "/products/bpc-157" },
  { name: "Semaglutide", href: "/products/semaglutide-10mg" },
  { name: "Tirzepatide", href: "/products/tirzepatide-10mg" },
  { name: "TB-500", href: "/products/tb-500" },
  { name: "GHK-Cu", href: "/products/ghk-cu" },
  { name: "Ipamorelin", href: "/products/ipamorelin" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "FAQ", href: "/faq" },
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
];

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold">
                Peptide<span className="text-accent">Source</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Premium research-grade peptides with 99%+ purity. Quality you can trust
              for your laboratory research needs.
            </p>
            <div className="space-y-3">
              <a
                href="tel:1-888-555-0123"
                className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
              >
                <Phone className="h-4 w-4 text-accent" />
                <span>1-888-555-0123</span>
              </a>
              <a
                href="mailto:info@peptidesource.com"
                className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                <span>info@peptidesource.com</span>
              </a>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>123 Research Blvd, Suite 100<br />Irvine, CA 92602</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-accent" />
                <span>Mon-Fri: 9am-6pm PST</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Products
            </h3>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
              Popular Peptides
            </h3>
            <ul className="space-y-2">
              {popularProducts.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/80 hover:text-accent transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-primary-foreground/80 mb-3">
                Stay updated with new products and research news.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:bg-accent-hover transition-colors"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-center text-accent mb-6">
            Quality Certifications
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary-foreground">GMP</p>
                <p className="text-xs text-primary-foreground/60">Certified</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <Award className="w-5 h-5 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary-foreground">ISO 9001</p>
                <p className="text-xs text-primary-foreground/60">Quality Management</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <FlaskConical className="w-5 h-5 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary-foreground">HPLC</p>
                <p className="text-xs text-primary-foreground/60">Purity Verified</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-accent" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-primary-foreground">Third-Party</p>
                <p className="text-xs text-primary-foreground/60">Lab Tested</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-xs text-primary-foreground/60 space-y-2">
            <p>
              <strong>DISCLAIMER:</strong> All products sold by PeptideSource are intended
              for research, laboratory, and analytical purposes ONLY. Products are NOT
              intended for human or veterinary use. PeptideSource is NOT a compounding
              pharmacy or pharmaceutical company.
            </p>
            <p>
              These products are not intended to diagnose, treat, cure, or prevent any
              disease. The statements made regarding these products have not been evaluated
              by the Food and Drug Administration. By purchasing, you confirm you are a
              qualified researcher and these products will only be used for legitimate
              research purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-primary-foreground/60">
              &copy; {new Date().getFullYear()} PeptideSource. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <img src="/images/payment/visa.svg" alt="Visa" className="h-6 opacity-60" />
              <img src="/images/payment/mastercard.svg" alt="Mastercard" className="h-6 opacity-60" />
              <img src="/images/payment/amex.svg" alt="American Express" className="h-6 opacity-60" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
