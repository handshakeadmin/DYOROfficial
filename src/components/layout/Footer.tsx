import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Clock } from "lucide-react";

const productLinks = [
  { name: "All Peptides", href: "/products" },
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
  { name: "Shipping Policy", href: "/policies/shipping" },
  { name: "Return Policy", href: "/policies/returns" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Privacy Policy", href: "/policies/privacy" },
];

export function Footer(): React.JSX.Element {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/dyorlogo.jpeg"
                alt="DYOR Wellness"
                width={36}
                height={36}
                className="h-9 w-9"
              />
              <span className="text-2xl font-bold">
                DYOR<span className="text-accent">Wellness</span>
              </span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Premium research-grade peptides with 99%+ purity. Quality you can trust
              for your laboratory research needs.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@dyorwellness.com"
                className="flex items-center gap-3 text-sm hover:text-accent transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                <span>info@dyorwellness.com</span>
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

          {/* Company */}
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
        </div>
      </div>

      {/* Disclaimer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-xs text-primary-foreground/60 space-y-2">
            <p>
              <strong>DISCLAIMER:</strong> All products sold by DYORWellness are intended
              for research, laboratory, and analytical purposes ONLY. Products are NOT
              intended for human or veterinary use. DYORWellness is NOT a compounding
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
          <p className="text-xs text-primary-foreground/60 text-center">
            &copy; {new Date().getFullYear()} DYORWellness. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
