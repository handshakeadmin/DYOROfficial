"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  questions: FAQ[];
}

export function FAQAccordion({ questions }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {questions.map((faq, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between p-4 text-left hover:bg-background-secondary transition-colors"
            onClick={() => toggleQuestion(index)}
          >
            <span className="font-medium pr-4">{faq.question}</span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted shrink-0 transition-transform",
                openIndex === index && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              openIndex === index ? "max-h-96" : "max-h-0"
            )}
          >
            <div className="p-4 pt-0 text-muted">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
