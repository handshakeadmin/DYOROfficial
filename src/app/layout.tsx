import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AgeVerification } from "@/components/AgeVerification";

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
    default: "DYORWellness - Premium Research Peptides",
    template: "%s | DYORWellness",
  },
  description:
    "DYORWellness offers premium research-grade peptides with 99%+ purity. Shop lyophilized peptides, capsules, nasal sprays, and serums for laboratory research purposes.",
  keywords: [
    "research peptides",
    "peptides",
    "BPC-157",
    "Semaglutide",
    "Tirzepatide",
    "laboratory research",
    "research chemicals",
  ],
  authors: [{ name: "DYORWellness" }],
  creator: "DYORWellness",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dyorwellness.com",
    siteName: "DYORWellness",
    title: "DYORWellness - Premium Research Peptides",
    description:
      "Premium research-grade peptides with 99%+ purity for laboratory research purposes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DYORWellness - Premium Research Peptides",
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
      <body className={`${inter.variable} ${ibmPlexMono.variable} antialiased min-h-screen flex flex-col`} suppressHydrationWarning>
        <AgeVerification />
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
