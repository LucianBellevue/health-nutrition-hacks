import { FAQItem } from '@/components/FAQSection';

/**
 * Generate FAQ Schema for structured data
 * Helps with Google's FAQ rich snippets in search results
 */
export function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Extract FAQ items from post frontmatter
 * Supports both structured FAQ data and inline markdown FAQs
 */
export function extractFAQItems(faqs: Array<{ question?: string; answer?: string }>): FAQItem[] {
  if (!faqs || !Array.isArray(faqs)) return [];
  
  return faqs
    .filter((faq) => faq.question && faq.answer)
    .map((faq) => ({
      question: faq.question as string,
      answer: faq.answer as string,
    }));
}
