import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PeptideSource - Premium Research Peptides",
    template: "%s | PeptideSource",
  },
  description:
    "PeptideSource offers premium research-grade peptides with 99%+ purity. Shop lyophilized peptides, capsules, nasal sprays, and serums for laboratory research purposes.",
  keywords: [
    "research peptides",
    "peptides",
    "BPC-157",
    "Semaglutide",
    "Tirzepatide",
    "laboratory research",
    "research chemicals",
  ],
  authors: [{ name: "PeptideSource" }],
  creator: "PeptideSource",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://peptidesource.com",
    siteName: "PeptideSource",
    title: "PeptideSource - Premium Research Peptides",
    description:
      "Premium research-grade peptides with 99%+ purity for laboratory research purposes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeptideSource - Premium Research Peptides",
    description:
      "Premium research-grade peptides with 99%+ purity for laboratory research purposes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {/* Research Disclaimer Banner */}
              <div className="disclaimer-banner py-2 text-center">
                <p className="uppercase tracking-wider">
                  For Research &amp; Laboratory Use Only • Not For Human Consumption
                </p>
              </div>

              <Header />

              <main className="flex-1">
                {children}
              </main>

              <Footer />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
