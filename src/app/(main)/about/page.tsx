import { Metadata } from "next";
import Link from "next/link";
import { Shield, FlaskConical, Award, Truck, Users, Target } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about DYORWellness - your trusted source for premium research-grade peptides with 99%+ purity.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-premium text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About <span className="text-accent">DYORWellness</span>
            </h1>
            <p className="text-xl text-white/80">
              We are dedicated to providing researchers with the highest quality peptides
              for their scientific endeavors. Quality, integrity, and service are the
              pillars of our business.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-muted mb-4">
                At DYORWellness, pride in our craftsmanship is at the heart of everything
                we do. We believe that quality research deserves quality materials, which
                is why we maintain the highest standards in peptide synthesis and quality
                control.
              </p>
              <p className="text-muted mb-4">
                Our mission is to support the scientific community by providing reliable,
                high-purity peptides that researchers can trust. Every product we offer
                exceeds 99% purity, verified through rigorous HPLC and mass spectrometry
                analysis.
              </p>
              <p className="text-muted">
                We understand that reproducible results depend on consistent, high-quality
                materials. That&apos;s why we&apos;ve built our reputation on delivering peptides
                that meet and exceed industry standards.
              </p>
            </div>
            <div className="bg-background-secondary rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">99%+</div>
                  <p className="text-sm text-muted">Purity Standard</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">50+</div>
                  <p className="text-sm text-muted">Products Available</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">10K+</div>
                  <p className="text-sm text-muted">Orders Fulfilled</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">24hr</div>
                  <p className="text-sm text-muted">Same Day Shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-muted max-w-2xl mx-auto">
              These principles guide every decision we make and every product we deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality First</h3>
              <p className="text-muted text-sm">
                Every batch is tested for purity and identity. We never compromise on
                quality, because your research depends on it.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <FlaskConical className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Scientific Integrity</h3>
              <p className="text-muted text-sm">
                We maintain transparent documentation and provide accurate specifications
                for all our products.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Excellence</h3>
              <p className="text-muted text-sm">
                We continuously improve our processes and expand our product line to
                better serve the research community.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Truck className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Reliable Service</h3>
              <p className="text-muted text-sm">
                Fast shipping, secure packaging, and responsive customer support ensure
                your research stays on track.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Customer Focus</h3>
              <p className="text-muted text-sm">
                We listen to our customers and adapt our offerings to meet the evolving
                needs of researchers.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Precision</h3>
              <p className="text-muted text-sm">
                Accurate measurements, consistent formulations, and attention to detail
                in every step of our process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Control */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Quality Control Process</h2>
            <p className="text-muted mb-8">
              Every peptide we sell undergoes rigorous quality control testing to ensure
              it meets our strict standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Synthesis</h3>
              <p className="text-sm text-muted">
                High-quality raw materials and precise synthesis protocols
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Purification</h3>
              <p className="text-sm text-muted">
                HPLC purification to achieve 99%+ purity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Analysis</h3>
              <p className="text-sm text-muted">
                Mass spectrometry confirmation of molecular identity
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Packaging</h3>
              <p className="text-sm text-muted">
                Sterile, moisture-free packaging for stability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-gradient-premium text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Research?</h2>
          <p className="text-white/80 mb-8">
            Browse our catalog of premium research peptides and experience the
            DYORWellness difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="px-8 py-4 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
            >
              Shop All Peptides
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
