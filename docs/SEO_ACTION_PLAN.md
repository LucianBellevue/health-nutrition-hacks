# SEO Action Plan - Implementation Guide

**Priority Order:** Critical → High → Medium → Low  
**Estimated Total Time:** 8-12 hours for critical items

---

## 🔴 CRITICAL PRIORITY (Do First)

### 1. Add Author Attribution to All MDX Files

**Impact:** Essential for E-E-A-T in YMYL (health) content  
**Time:** 30 minutes  
**Difficulty:** Easy

#### Files to Update

All 10 files in `/content/posts/`:
- `magnesium-benefits.mdx`
- `best-probiotic-for-women-gut-health.mdx`
- `best-suplement-for-energy-without-caffeine.mdx`
- `healthy-breakfast-ideas-energy-weight-loss.mdx`
- `high-protein-snacks-for-weight-loss.mdx`
- `immune-boosting-habits.mdx`
- `metabolism-boosting-foods.mdx`
- `morning-gut-routine-to-reduce-bloating.mdx`
- `natural-stress-relief-supplements.mdx`
- `weight-loss-hacks.mdx`

#### Current State
```yaml
---
title: "Magnesium Glycinate Benefits..."
author: ""          # ❌ EMPTY
authorId: ""        # ❌ EMPTY
---
```

#### Target State
```yaml
---
title: "Magnesium Glycinate Benefits..."
author: "Dr. Sarah Mitchell"
authorId: "sarah-mitchell"
---
```

#### Available Authors

Check `/lib/authors.ts` for available author IDs:
- `sarah-mitchell` - Registered Dietitian (RD)
- `john-davis` - Nutritionist
- (Add more as needed)

#### Batch Update Command

```bash
# If all posts should have the same author:
# Update each file manually OR create a script:

# Example for one file:
# Find: author: ""
# Replace: author: "Dr. Sarah Mitchell"
# Find: authorId: ""
# Replace: authorId: "sarah-mitchell"
```

---

### 2. Optimize All Image Alt Text

**Impact:** Accessibility + Image SEO  
**Time:** 2-3 hours  
**Difficulty:** Medium

#### Current Implementation (Generic)
```tsx
<Image
  src={post.image}
  alt={post.title}  // ❌ Too generic
  width={1200}
  height={630}
/>
```

#### Target Implementation (Descriptive)
```tsx
<Image
  src={post.image}
  alt="Magnesium glycinate supplement capsules in a clear glass bottle on a marble nightstand, with a glass of water and reading lamp in soft evening light"
  width={1200}
  height={630}
/>
```

#### Image Inventory Checklist

Create a spreadsheet with:

| Post Slug | Image File | Current Alt Text | New Alt Text | Status |
|-----------|------------|------------------|--------------|--------|
| magnesium-benefits | hero.webp | "Magnesium Glycinate Benefits..." | "Magnesium glycinate supplement capsules..." | ⬜ |
| magnesium-benefits | section-1.webp | "Magnesium Glycinate Benefits..." | "Minimal supplement bottle in calm neutral setting..." | ⬜ |

#### Best Practices

1. **Describe what's in the image** (not the article topic)
2. **Include context** (setting, mood, relevant details)
3. **Keep under 125 characters** (optimal length)
4. **Don't start with "Image of..."** (redundant)
5. **Include keywords naturally** (if relevant)

#### Example Alt Texts by Post Type

**Supplement bottles:**
```
"[Supplement name] capsules in white bottle on wooden surface with glass of water"
```

**Food/meal prep:**
```
"High protein breakfast bowl with Greek yogurt, berries, granola, and chia seeds on bright kitchen counter"
```

**Lifestyle/wellness:**
```
"Woman practicing morning meditation in bright sunlit bedroom with plants"
```

---

### 3. Add FAQ Schema Markup

**Impact:** Rich snippets in Google search results  
**Time:** 1-2 hours  
**Difficulty:** Medium

#### Posts with FAQ Sections

- ✅ `magnesium-benefits.mdx` (has FAQ section)
- Check others for FAQ sections

#### Current State (No Schema)
```tsx
## FAQ
<details>
  <summary>What is magnesium glycinate best for?</summary>
  Many beginners use it to support relaxation routines...
</details>
```

#### Target State (With Schema)

**Step 1:** Extract FAQ data in page component

```typescript
// In /app/blog/[slug]/page.tsx

// Add this function
function extractFAQs(content: string) {
  // Parse MDX content to find FAQ sections
  // For now, manually define FAQs per post
  const faqsBySlug: Record<string, Array<{ question: string; answer: string }>> = {
    'magnesium-benefits': [
      {
        question: 'What is magnesium glycinate best for?',
        answer: 'Many beginners use it to support relaxation routines, sleep habits, and everyday muscle comfort.'
      },
      {
        question: 'Are some magnesium forms absorbed better than others?',
        answer: 'Yes. NIH ODS notes forms such as magnesium citrate, lactate, chloride, and aspartate are more easily absorbed than some others.'
      },
      {
        question: 'How much magnesium do adults need?',
        answer: 'NIH ODS lists approximately 400-420 mg/day for men and approximately 310-320 mg/day for women from all sources.'
      },
      {
        question: 'Can magnesium supplements interact with medications?',
        answer: 'Yes. NIH ODS notes potential interactions and recommends caution and professional guidance when needed.'
      }
    ]
  };
  
  return faqsBySlug[slug] || [];
}
```

**Step 2:** Generate FAQ Schema

```typescript
// In /app/blog/[slug]/page.tsx

export default async function PostPage({ params }: Props) {
  // ... existing code ...
  
  const faqs = extractFAQs(post.content);
  
  const faqSchema = faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  } : null;
  
  return (
    <article>
      {/* ... existing JSX ... */}
      
      {/* Add FAQ schema if present */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </article>
  );
}
```

**Alternative:** Store FAQs in database

```prisma
// In prisma/schema.prisma (add to Post model)
model Post {
  // ... existing fields ...
  faqs Json? // Store as JSON array
}
```

---

## 🟠 HIGH PRIORITY (Do Within 1 Week)

### 4. Create Author Profile Pages

**Impact:** Boosts E-E-A-T significantly  
**Time:** 4-6 hours  
**Difficulty:** Medium-High

#### File Structure
```
/app/authors/
  [id]/
    page.tsx          # Author profile page
  page.tsx            # All authors listing
```

#### Step 1: Create Author Detail Page

```typescript
// /app/authors/[id]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAuthorById } from '@/lib/authors';
import prisma from '@/lib/prisma';
import PostCard from '@/components/PostCard';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({
    id: author.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = getAuthorById(id);

  if (!author) {
    return { title: 'Author Not Found' };
  }

  return {
    title: `${author.name} - Health Nutrition Hacks`,
    description: author.bio,
    openGraph: {
      title: `${author.name} - Health Nutrition Hacks`,
      description: author.bio,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = getAuthorById(id);

  if (!author) {
    notFound();
  }

  // Get posts by this author
  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
      published: true,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
    },
  });

  // Person schema for SEO
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': author.name,
    'jobTitle': author.credentials,
    'description': author.bio,
    'url': `https://healthnutritionhacks.com/authors/${id}`,
    'image': author.avatar,
    'sameAs': [
      author.social?.linkedin,
      author.social?.twitter,
      author.social?.website,
    ].filter(Boolean),
    'knowsAbout': author.expertise || ['Nutrition', 'Health', 'Wellness'],
    'alumniOf': author.education,
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Author Header */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-12 bg-zinc-900 p-8 rounded-3xl border border-zinc-800">
          {author.avatar && (
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-emerald-500"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {author.name}
            </h1>
            {author.credentials && (
              <p className="text-emerald-400 font-medium mb-4">
                {author.credentials}
              </p>
            )}
            <p className="text-zinc-300 leading-relaxed mb-4">
              {author.bio}
            </p>

            {/* Social Links */}
            {author.social && (
              <div className="flex gap-4">
                {author.social.linkedin && (
                  <a
                    href={author.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition"
                  >
                    LinkedIn
                  </a>
                )}
                {author.social.twitter && (
                  <a
                    href={author.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition"
                  >
                    Twitter
                  </a>
                )}
                {author.social.website && (
                  <a
                    href={author.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-emerald-400 transition"
                  >
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Education & Credentials */}
        {author.education && (
          <div className="mb-12 bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800">
            <h2 className="text-xl font-bold text-white mb-4">Education & Credentials</h2>
            <p className="text-zinc-300">{author.education}</p>
          </div>
        )}

        {/* Articles by this author */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Articles by {author.name} ({posts.length})
          </h2>
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.slug}
                  post={{
                    title: post.title,
                    description: post.description,
                    slug: post.slug,
                    date: post.createdAt.toISOString().split('T')[0],
                    author: author.name,
                    authorId: author.id,
                    category: post.category.name,
                    tags: post.tags,
                    image: post.image || undefined,
                    readingTime: post.readingTime || undefined,
                  }}
                />
              ))}
            </div>
          ) : (
            <p className="text-zinc-400">No published articles yet.</p>
          )}
        </div>
      </div>

      {/* Person Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
    </div>
  );
}
```

#### Step 2: Update Author Data in `/lib/authors.ts`

```typescript
// Add complete information for each author
export const AUTHORS = {
  'sarah-mitchell': {
    id: 'sarah-mitchell',
    name: 'Dr. Sarah Mitchell',
    credentials: 'Registered Dietitian (RD), MS Nutrition Science',
    bio: 'Dr. Sarah Mitchell is a board-certified registered dietitian with over 10 years of experience in clinical nutrition and functional medicine. She specializes in metabolic health, gut-brain connection, and evidence-based supplement protocols.',
    avatar: '/images/authors/sarah-mitchell.jpg',
    education: 'MS Nutrition Science - Columbia University, RD Certification',
    expertise: ['Metabolic Health', 'Functional Nutrition', 'Supplement Protocols', 'Gut Health'],
    social: {
      linkedin: 'https://linkedin.com/in/sarah-mitchell-rd',
      twitter: 'https://twitter.com/sarahmitchellrd',
      website: 'https://sarahmitchellnutrition.com',
    },
  },
  // Add more authors...
};
```

#### Step 3: Link to Author Pages

Update `/components/AuthorBox.tsx`:
```tsx
<Link href={`/authors/${author.id}`} className="font-semibold text-emerald-400 hover:underline">
  {author.name}
</Link>
```

---

### 5. Implement Related Posts Component

**Impact:** Better internal linking, increased session duration  
**Time:** 2-3 hours  
**Difficulty:** Medium

#### Step 1: Create Related Posts Component

```typescript
// /components/RelatedPosts.tsx

import Link from 'next/link';
import prisma from '@/lib/prisma';
import PostCard from './PostCard';

interface RelatedPostsProps {
  currentPostId: number;
  categoryId: number;
  tags: string[];
  limit?: number;
}

export default async function RelatedPosts({
  currentPostId,
  categoryId,
  tags,
  limit = 3,
}: RelatedPostsProps) {
  // Find related posts by category and tags
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: currentPostId },
      OR: [
        { categoryId: categoryId },
        {
          tags: {
            hasSome: tags, // Postgres array overlap
          },
        },
      ],
    },
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      category: { select: { name: true } },
      author: { select: { name: true } },
    },
  });

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-12 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8">
      <h2 className="text-2xl font-bold text-white mb-6">
        Related Articles You Might Enjoy
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <PostCard
            key={post.slug}
            post={{
              title: post.title,
              description: post.description,
              slug: post.slug,
              date: post.createdAt.toISOString().split('T')[0],
              author: post.author.name || 'Unknown',
              authorId: post.authorId,
              category: post.category.name,
              tags: post.tags,
              image: post.image || undefined,
              readingTime: post.readingTime || undefined,
            }}
          />
        ))}
      </div>
    </section>
  );
}
```

#### Step 2: Add to Blog Post Page

```typescript
// In /app/blog/[slug]/page.tsx

import RelatedPosts from '@/components/RelatedPosts';

export default async function PostPage({ params }: Props) {
  // ... existing code ...

  return (
    <article>
      {/* ... existing content ... */}

      {/* Author Box - Bottom */}
      <AuthorBox author={author} />

      {/* RELATED POSTS - NEW */}
      <RelatedPosts
        currentPostId={post.id}
        categoryId={post.categoryId}
        tags={post.tags}
        limit={3}
      />

      {/* Newsletter Signup */}
      <div className="my-8 sm:my-12">
        <NewsletterSignup />
      </div>

      {/* ... rest of content ... */}
    </article>
  );
}
```

---

### 6. Add Visible Breadcrumb Navigation

**Impact:** UX improvement, complements existing breadcrumb schema  
**Time:** 1 hour  
**Difficulty:** Easy

#### Create Breadcrumbs Component

```typescript
// /components/Breadcrumbs.tsx

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-sm text-zinc-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-400 transition"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4" />
            {index === items.length - 1 ? (
              <span className="text-zinc-300 font-medium" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-emerald-400 transition"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

#### Add to Blog Post Page

```typescript
// In /app/blog/[slug]/page.tsx

import Breadcrumbs from '@/components/Breadcrumbs';

export default async function PostPage({ params }: Props) {
  // ... existing code ...

  const breadcrumbItems = [
    { name: 'Blog', href: '/blog' },
    { name: post.category.name, href: `/categories/${post.category.slug}` },
    { name: post.title, href: `/blog/${slug}` },
  ];

  return (
    <article className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* BREADCRUMBS - NEW */}
        <Breadcrumbs items={breadcrumbItems} />

        {/* Article Header */}
        <header className="mb-8">
          {/* ... existing header content ... */}
        </header>

        {/* ... rest of content ... */}
      </div>
    </article>
  );
}
```

---

## 🟡 MEDIUM PRIORITY (Do Within 2-4 Weeks)

### 7. Create Image Sitemap

**Time:** 30 minutes  
**Difficulty:** Easy

```typescript
// Update /app/sitemap.ts

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = 'https://healthnutritionhacks.com';
  const posts = await getAllPosts();

  const blogPosts = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.metadata.slug}`,
    lastModified: new Date(post.metadata.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    // ADD IMAGES
    images: post.metadata.image
      ? [
          {
            url: `${siteUrl}${post.metadata.image}`,
            title: post.metadata.title,
            caption: post.metadata.description,
          },
        ]
      : undefined,
  }));

  return [
    // ... existing entries ...
    ...blogPosts,
  ];
}
```

---

### 8. Add Security Headers

**Time:** 15 minutes  
**Difficulty:** Easy

```typescript
// In next.config.ts

async headers() {
  return [
    // ... existing headers ...
    {
      source: '/:path*',
      headers: [
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload'
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        },
        {
          key: 'X-Frame-Options',
          value: 'DENY'
        },
        {
          key: 'X-XSS-Protection',
          value: '1; mode=block'
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin'
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()'
        }
      ]
    }
  ];
}
```

---

## 🟢 LOW PRIORITY (Nice to Have)

### 9. Add Table of Contents to Long Posts

**Time:** 2-3 hours  
**Difficulty:** Medium

```typescript
// /components/TableOfContents.tsx

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TOCItem[] }) {
  return (
    <nav className="sticky top-8 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Table of Contents</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: `${(item.level - 2) * 1}rem` }}>
            <a
              href={`#${item.id}`}
              className="text-sm text-zinc-400 hover:text-emerald-400 transition"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

---

### 10. Add Affiliate Link Disclosure

**Time:** 30 minutes  
**Difficulty:** Easy

```typescript
// /components/AffiliateDisclosure.tsx

export default function AffiliateDisclosure() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4 my-6">
      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <strong>📢 Affiliate Disclosure:</strong> This article contains affiliate links.
        If you make a purchase through our links, we may earn a small commission at no
        additional cost to you. This helps us continue creating evidence-based content.
        We only recommend products we genuinely believe in.
      </p>
    </div>
  );
}
```

Add before product recommendations in MDX:
```tsx
<AffiliateDisclosure />

## Product Recommendations
<ProductCard ... />
```

---

## 📋 COMPLETE IMPLEMENTATION CHECKLIST

### Week 1: Critical Items
- [ ] Update all 10 MDX files with author attribution
- [ ] Write and update alt text for all images (estimate 30-40 images)
- [ ] Add FAQ schema to posts with FAQs
- [ ] Test all changes locally

### Week 2: High Priority Items
- [ ] Create author profile page template (`/app/authors/[id]/page.tsx`)
- [ ] Update author data in `/lib/authors.ts` with complete bios
- [ ] Get author headshots (or placeholder avatars)
- [ ] Create related posts component
- [ ] Add breadcrumbs component
- [ ] Integrate all components into blog post page

### Week 3: Medium Priority Items
- [ ] Add image sitemap
- [ ] Add security headers
- [ ] Create affiliate disclosure component
- [ ] Test on multiple devices

### Week 4: Polish & Launch
- [ ] Run full Lighthouse audit
- [ ] Test all schema markup with validators
- [ ] Mobile device testing
- [ ] Deploy to production
- [ ] Verify Google Search Console
- [ ] Submit sitemap

---

## 🛠️ TESTING TOOLS

After each implementation, test with:

1. **Schema Validator:** https://validator.schema.org/
2. **Rich Results Test:** https://search.google.com/test/rich-results
3. **Lighthouse:** Chrome DevTools > Lighthouse tab
4. **Mobile Test:** https://search.google.com/test/mobile-friendly
5. **Page Speed:** https://pagespeed.web.dev/

---

## 📊 SUCCESS METRICS

Track these after implementation:

### Immediate (Week 1-2)
- [ ] All schema validation passing
- [ ] Lighthouse SEO score: 100/100
- [ ] Lighthouse Performance score: >90
- [ ] All critical issues resolved

### Short-term (Month 1-2)
- [ ] Google indexing 50+ pages
- [ ] Featured snippets appearing (from FAQ schema)
- [ ] Organic traffic starting (10-50 visits/day)

### Medium-term (Month 3-6)
- [ ] Rich snippets showing in SERPs
- [ ] Author profile pages indexed
- [ ] Internal linking reducing bounce rate
- [ ] Organic traffic growing (100-500 visits/day)

---

**Created:** January 23, 2026  
**Last Updated:** January 23, 2026  
**Status:** Ready for Implementation

---
