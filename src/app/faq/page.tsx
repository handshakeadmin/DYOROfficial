import { Metadata } from "next";
import Link from "next/link";
import { FAQAccordion } from "@/components/ui/FAQAccordion";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about PeptideSource products, shipping, and research peptides.",
};

const faqCategories = [
  {
    name: "Products & Quality",
    questions: [
      {
        question: "What is the purity of your peptides?",
        answer: "All PeptideSource peptides exceed 99% purity. Each batch undergoes rigorous testing via HPLC (High-Performance Liquid Chromatography) and mass spectrometry to verify purity and molecular identity. Certificates of Analysis are available upon request.",
      },
      {
        question: "What forms are your peptides available in?",
        answer: "We offer peptides in four main formulations: Lyophilized (freeze-dried powder requiring reconstitution), Capsules (oral formulations), Nasal Sprays (ready-to-use), and Serums (topical applications). Each form is designed for specific research applications.",
      },
      {
        question: "How should I store my peptides?",
        answer: "Lyophilized peptides should be stored at -20°C for long-term storage. Once reconstituted, solutions should be stored at 2-8°C and used within 30 days. Capsules and nasal sprays should be stored in a cool, dry place away from direct sunlight. Always follow the specific storage instructions provided with each product.",
      },
      {
        question: "Are your peptides research-grade?",
        answer: "Yes, all our peptides are manufactured to research-grade specifications. They are intended for research, laboratory, and analytical purposes only. They are not intended for human or veterinary use.",
      },
      {
        question: "Do you provide Certificates of Analysis (COA)?",
        answer: "Yes, we maintain detailed COAs for all our products. You can request a COA by contacting our customer support team with your order number and product details.",
      },
    ],
  },
  {
    name: "Ordering & Payment",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept major credit cards (Visa, Mastercard, American Express, Discover), ACH direct debit, and various buy-now-pay-later options. All transactions are processed through secure, PCI-compliant payment processors.",
      },
      {
        question: "Is my payment information secure?",
        answer: "Yes, we use industry-standard SSL encryption and work with PCI-compliant payment processors to ensure your payment information is always protected.",
      },
      {
        question: "Can I modify or cancel my order?",
        answer: "Orders can be modified or cancelled before they are shipped. Once an order has been dispatched, it cannot be cancelled. Please contact us immediately at info@peptidesource.com if you need to make changes.",
      },
      {
        question: "Do you offer bulk or wholesale pricing?",
        answer: "Yes, we offer competitive pricing for bulk orders. Please contact our sales team at info@peptidesource.com with your requirements for a custom quote.",
      },
    ],
  },
  {
    name: "Shipping & Delivery",
    questions: [
      {
        question: "How long does shipping take?",
        answer: "Orders placed and paid for before 12 PM PST Monday through Thursday ship the same day. Orders placed after 12 PM PST ship the following business day. Standard delivery times vary by location but typically range from 2-5 business days within the continental US.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes, we offer free shipping on orders over $500 within the USA. International shipping rates vary by destination.",
      },
      {
        question: "How are peptides shipped?",
        answer: "All peptides are shipped with appropriate cold packs and insulated packaging to maintain product integrity. Lyophilized products are stable at room temperature during transit, but we take extra precautions to ensure quality.",
      },
      {
        question: "Do you ship internationally?",
        answer: "Currently, we primarily ship within the United States. International shipping may be available for select destinations. Please contact us for international shipping inquiries.",
      },
    ],
  },
  {
    name: "Returns & Refunds",
    questions: [
      {
        question: "What is your return policy?",
        answer: "Due to the nature of our products, we cannot accept returns on opened or used items. If you receive damaged, incorrect, or missing items, please contact us within 48 hours of delivery with photos, and we will make it right.",
      },
      {
        question: "How do I report a problem with my order?",
        answer: "Please email info@peptidesource.com with your order number, a description of the issue, and any relevant photos. Our team will respond within 24 business hours.",
      },
      {
        question: "What if my package is lost in transit?",
        answer: "If your package shows as delivered but you haven't received it, please first check with neighbors and your local post office. If still not found, contact us and we will work with the carrier to locate your package or arrange a replacement.",
      },
    ],
  },
  {
    name: "Research & Peptide Science",
    questions: [
      {
        question: "What are peptides?",
        answer: "Peptides are short chains of amino acids linked by peptide bonds. They are smaller than proteins, typically consisting of 2-50 amino acids. Peptides play crucial roles in biological processes and are valuable tools for scientific research in areas like cell signaling, drug development, and biomarker research.",
      },
      {
        question: "What is the difference between research peptides and prescription peptides?",
        answer: "Research peptides are manufactured for laboratory and scientific research purposes only. They are not FDA-approved for human use. Prescription peptides have undergone rigorous clinical trials and received FDA approval for specific medical applications and must be prescribed by a licensed healthcare provider.",
      },
      {
        question: "Can I use these peptides on myself?",
        answer: "No. All products sold by PeptideSource are strictly for research, laboratory, and analytical purposes only. They are not intended for human or veterinary use. By purchasing, you confirm you are a qualified researcher using these products for legitimate research purposes only.",
      },
      {
        question: "What does lyophilized mean?",
        answer: "Lyophilization (freeze-drying) is a process that removes water from peptides while preserving their structure and activity. Lyophilized peptides are stable at room temperature for extended periods and must be reconstituted with appropriate solvents (like bacteriostatic water) before use in research.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-premium text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-white/80 max-w-2xl">
            Find answers to common questions about our products, ordering, shipping,
            and research peptides in general.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqCategories.map((category) => (
            <div key={category.name} className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">
                {category.name}
              </h2>
              <FAQAccordion questions={category.questions} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-muted mb-6">
            Our team is here to help. Contact us and we&apos;ll get back to you as soon
            as possible.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-8 py-3 bg-accent text-accent-foreground font-semibold rounded-full hover:bg-accent-hover transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
