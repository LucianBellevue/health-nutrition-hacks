import prisma from '@/lib/prisma';
import { extractFAQsFromMDX, extractFAQsFromMetadata } from '@/lib/faqExtractor';
import { FAQItem } from '@/components/FAQSection';

/**
 * Sync FAQs from post content/metadata to database
 * Extracts FAQs from MDX content or metadata and stores them in FAQ table
 */
export async function syncFAQsForPost(postId: string): Promise<{ created: number; updated: number; deleted: number }> {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      id: true,
      content: true,
      format: true,
      metadata: true,
    },
  });

  if (!post) {
    throw new Error(`Post with id ${postId} not found`);
  }

  // Extract FAQs from content (MDX) or metadata
  let faqs: FAQItem[] = [];
  
  if (post.format === 'mdx' && post.content) {
    faqs = extractFAQsFromMDX(post.content);
  }
  
  // Fallback to metadata if no FAQs found in content
  if (faqs.length === 0 && post.metadata) {
    faqs = extractFAQsFromMetadata(post.metadata);
  }

  // Get existing FAQs
  const existingFAQs = await prisma.fAQ.findMany({
    where: { postId },
    orderBy: { order: 'asc' },
  });

  const result = {
    created: 0,
    updated: 0,
    deleted: 0,
  };

  // Delete FAQs that are no longer in content
  const faqIdsToKeep = new Set<string>();
  
  // Update or create FAQs
  for (let i = 0; i < faqs.length; i++) {
    const faq = faqs[i];
    const existing = existingFAQs[i];
    
    if (existing) {
      // Check if FAQ needs updating
      if (existing.question !== faq.question || existing.answer !== faq.answer || existing.order !== i) {
        await prisma.fAQ.update({
          where: { id: existing.id },
          data: {
            question: faq.question,
            answer: faq.answer,
            order: i,
          },
        });
        result.updated++;
      }
      faqIdsToKeep.add(existing.id);
    } else {
      // Create new FAQ
      await prisma.fAQ.create({
        data: {
          postId,
          question: faq.question,
          answer: faq.answer,
          order: i,
        },
      });
      result.created++;
    }
  }

  // Delete FAQs that are no longer in content
  const faqsToDelete = existingFAQs.filter((f) => !faqIdsToKeep.has(f.id));
  if (faqsToDelete.length > 0) {
    await prisma.fAQ.deleteMany({
      where: {
        id: { in: faqsToDelete.map((f) => f.id) },
      },
    });
    result.deleted = faqsToDelete.length;
  }

  return result;
}

/**
 * Get FAQs for a post from database
 */
export async function getFAQsForPost(postId: string): Promise<FAQItem[]> {
  const faqs = await prisma.fAQ.findMany({
    where: { postId },
    orderBy: { order: 'asc' },
    select: {
      question: true,
      answer: true,
    },
  });

  return faqs.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));
}

/**
 * Sync FAQs for all posts (useful for migration)
 */
export async function syncFAQsForAllPosts(): Promise<Array<{ postId: string; result: { created: number; updated: number; deleted: number } | { error: string } }>> {
  const posts = await prisma.post.findMany({
    select: { id: true },
  });

  const results = [];
  for (const post of posts) {
    try {
      const result = await syncFAQsForPost(post.id);
      results.push({ postId: post.id, result });
    } catch (error) {
      console.error(`Failed to sync FAQs for post ${post.id}:`, error);
      results.push({ postId: post.id, result: { error: String(error) } });
    }
  }

  return results;
}
