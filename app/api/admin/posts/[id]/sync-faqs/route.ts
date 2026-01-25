import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { syncFAQsForPost } from '@/lib/faqSync';

/**
 * POST /api/admin/posts/[id]/sync-faqs
 * Sync FAQs from post content/metadata to database
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {

    const { id } = await params;
    const result = await syncFAQsForPost(id);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error syncing FAQs:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to sync FAQs' },
      { status: 500 }
    );
  }
}
