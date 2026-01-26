'use client';

import { useState } from 'react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items: FAQItem[];
  title?: string;
}

/**
 * FAQ Section Component
 * Displays FAQ items with accordion functionality
 * Generates FAQ Schema for SEO
 */
export default function FAQSection({ items, title = "Frequently Asked Questions" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="my-8 sm:my-12">
      <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 sm:mb-5">
        {title}
      </h2>
      <div className="space-y-2 sm:space-y-2.5">
        {items.map((item, index) => (
          <div
            key={index}
            className="group bg-white/60 dark:bg-zinc-900/40 backdrop-blur-sm rounded-lg border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden transition-all duration-200 hover:border-emerald-300/50 dark:hover:border-emerald-700/50 hover:shadow-sm"
          >
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full flex items-center justify-between p-3 sm:p-3.5 text-left transition-colors duration-150 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${index}`}
            >
              <h3 className="text-sm sm:text-base font-medium text-zinc-900 dark:text-zinc-100 pr-3 leading-snug">
                {item.question}
              </h3>
              <svg
                className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id={`faq-answer-${index}`}
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-3 sm:px-3.5 pb-3 sm:pb-3.5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
