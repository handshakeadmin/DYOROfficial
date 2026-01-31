"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-success/10 rounded flex items-center justify-center mx-auto mb-4">
          <Send className="h-8 w-8 text-success" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
        <p className="text-muted mb-6">
          Thank you for contacting us. We&apos;ll get back to you within 24 hours.
        </p>
        <button
          type="button"
          className="text-accent hover:underline"
          onClick={() => setIsSubmitted(false)}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-2">
            First Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-2">
            Last Name <span className="text-error">*</span>
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email Address <span className="text-error">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label htmlFor="organization" className="block text-sm font-medium mb-2">
          Organization / Institution
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Research Lab, University, etc."
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium mb-2">
          Subject <span className="text-error">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary bg-white"
        >
          <option value="">Select a subject</option>
          <option value="product">Product Inquiry</option>
          <option value="order">Order Status / Issue</option>
          <option value="bulk">Bulk / Wholesale Pricing</option>
          <option value="coa">COA Request</option>
          <option value="technical">Technical Question</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
          Order Number (if applicable)
        </label>
        <input
          type="text"
          id="orderNumber"
          name="orderNumber"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="PS-XXXXX"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message <span className="text-error">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full px-3 py-2 border rounded focus:outline-none focus:border-primary resize-none"
          placeholder="How can we help you?"
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="confirm"
          name="confirm"
          required
          className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary"
        />
        <label htmlFor="confirm" className="text-sm text-muted">
          I confirm that I am a qualified researcher and any products purchased will
          be used for legitimate research purposes only. I understand that these
          products are not intended for human or veterinary use.
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded hover:bg-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Submit Inquiry
          </>
        )}
      </button>
    </form>
  );
}
