# Health Nutrition Hacks – Post Guidelines

This document outlines the structure, styling, and best practices for creating blog posts that render correctly on the site with minimal revisions.

## File Structure

### Post Location

```
content/posts/[post-slug].mdx
```

### Image Location

```
public/images/posts/[post-slug]/
├── hero.webp        (required - used for OG image + hero)
├── section-1.webp   (optional)
├── section-2.webp   (optional)
└── ...
```

**Image Requirements:**

- Format: `.webp` or `.jpg` (webp preferred for compression)
- Hero image: 1200×630px minimum (16:8 aspect ratio)
- Section images: 1600×900px recommended (16:9 aspect ratio)
- Optimize before uploading (use Squoosh or similar)
- **Important:** Ensure file extension matches actual format (check file headers if unsure)

## Frontmatter Template

```yaml
---
title: "Your Post Title (Keep Under 60 Characters for SEO)"
description: "A compelling 150-160 character description for search results and social sharing."
date: "YYYY-MM-DD"
author: ""
authorId: ""
category: "Category Name"
tags: ["primary keyword", "secondary keyword", "related term"]
image: "/images/posts/[post-slug]/hero.webp"
readingTime: X
---
```

**Notes:**

- Leave `author` and `authorId` empty to use the default HNH Team author
- `category` must match an existing category from the list below
- `readingTime` is estimated minutes to read

### Available Categories

| Category | Slug | Description |
|----------|------|-------------|
| Energy | `energy` | Evidence-based strategies for sustaining steady energy throughout the day |
| Gut Health | `gut-health` | Digestive system support, microbiome education, and probiotic-forward tips |
| Meal Planning | `meal-planning` | Weekly prep methods, grocery tactics, and time-saving kitchen systems |
| Weight Loss | `weight-loss` | Metabolism-friendly habits and realistic nutrition guidance for weight goals |
| Heart Health | `heart-health` | Cardiovascular-friendly recipes and nutrient tips for a stronger heart |
| Mental Wellness | `mental-wellness` | Nutrition, habits, and routines that nurture mood and cognitive balance |

## Content Structure

### Recommended Post Outline

```
1. Hero Image (PostImage component)
2. Opening paragraph (hook the reader)
3. Quick-scan info cards (optional - 3 columns)
4. Disclaimer (small footnote-style span)
5. Main content sections with H2 headings
6. Section images between major topics
7. Product recommendations (ProductCard component)
8. Tips/actionable takeaways
9. CTA block
10. FAQ section
11. References section (REQUIRED)
```

## Images

There are **two ways** to add images depending on where the image is stored:

### Option 1: PostImage Component (Local Images)

Use `PostImage` for images stored locally in `/public/images/posts/[slug]/`:

```mdx
<PostImage
  slug="your-post-slug"
  src="image-name.webp"
  alt="Descriptive alt text for accessibility"
  variant="hero"
/>
```

**Variants:**
| Variant | Use Case | Aspect Ratio |
|---------|----------|--------------|
| `hero` | Top of post, main image | 16:8 |
| `section` | Between content sections | 16:9 |
| `inline` | Smaller inline images | 16:9 |

**Example:**

```mdx
<PostImage
  slug="best-probiotic-for-women-gut-health"
  src="smoothie.webp"
  alt="Woman mixing a green probiotic smoothie at home"
  variant="section"
/>
```

### Option 2: Image Component (Cloudinary/External URLs)

Use the Next.js `Image` component for images uploaded to Cloudinary or other external URLs:

```mdx
<Image
  src="https://res.cloudinary.com/your-cloud/image/upload/v123/image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={450}
  className="rounded-xl my-8"
/>
```

**When to use which:**
| Component | Use When | Example Source |
|-----------|----------|----------------|
| `PostImage` | Image is in `/public/images/posts/[slug]/` | `src="hero.webp"` |
| `Image` | Image is hosted on Cloudinary or external URL | `src="https://res.cloudinary.com/..."` |

**Note:** When using the admin editor to upload inline images, they are automatically uploaded to Cloudinary and inserted as `Image` components.

## Styled Content Blocks

### Info Cards (3-Column Grid)

Use for quick-scan information at the top of posts:

```mdx
<div className="not-prose grid gap-4 md:grid-cols-3 my-8">
  <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-5 shadow-inner">
    <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-600">
      Label
    </span>
    <span className="block text-lg font-semibold text-zinc-900 mt-2">
      Value or short description
    </span>
  </div>
  <!-- Repeat for 2 more cards -->
</div>
```

### Disclaimer (Friendly Reminder)

**DO NOT use blockquotes for disclaimers.** Use this styled span instead:

```mdx
<span className="block text-xs text-zinc-500 dark:text-zinc-400 italic mt-6 mb-8">
  Friendly reminder: This article is educational and not medical advice. If you
  have persistent symptoms, speak with a qualified professional.
</span>
```

This renders as small, subtle footnote text that doesn't distract from the content.

### Two-Column Grid

```mdx
<div className="not-prose grid gap-4 md:grid-cols-2">
  <div className="rounded-3xl border border-zinc-100 bg-white/90 p-5 shadow-sm">
    <span className="block text-xs uppercase tracking-[0.3em] text-emerald-600 font-semibold">
      Section Title
    </span>
    <ul className="mt-3 space-y-2 text-sm text-zinc-700">
      <li>• First tip or point</li>
      <li>• Second tip or point</li>
      <li>• Third tip or point</li>
    </ul>
  </div>
  <!-- Second column -->
</div>
```

## Product Cards

### Using the ProductCard Component

Use the `ProductCard` component for Amazon affiliate product recommendations.

```mdx
<div className="not-prose grid gap-5 md:grid-cols-2">
  <ProductCard
    store="amazon"
    title="Best for beginners"
    productName="Product Name Here"
    href="https://www.amazon.com/dp/PRODUCT_ID"
    description="Brief description of why this product is recommended."
    image="https://m.media-amazon.com/images/I/71abc123._SL500_.jpg"
  />
  <ProductCard
    store="amazon"
    title="Budget-friendly option"
    productName="Another Product Name"
    href="https://www.amazon.com/dp/PRODUCT_ID"
    description="Brief description of why this product is recommended."
    image="https://m.media-amazon.com/images/I/81xyz456._SL500_.jpg"
  />
</div>
```

**Props:**

| Prop          | Required | Description                                                       |
| ------------- | -------- | ----------------------------------------------------------------- |
| `store`       | Yes      | `"amazon"` - sets badge color and CTA text                        |
| `title`       | Yes      | Short category/use case title (e.g., "Best for beginners")        |
| `productName` | Yes      | Full product name                                                 |
| `href`        | Yes      | Amazon affiliate link URL                                         |
| `description` | Yes      | 1-2 sentence description                                          |
| `image`       | No       | Product image URL (displays 80×80 thumbnail on left side of card) |
| `cta`         | No       | Custom CTA text (defaults to "View on Amazon")                    |

### Getting Amazon Product Images

To include a product thumbnail:

1. Go to the product page on Amazon
2. Right-click the main product image
3. Select "Copy image address"
4. Paste the URL in the `image` prop

**Example Amazon image URL:**

```
https://m.media-amazon.com/images/I/71xYz123ABC._SL500_.jpg
```

**Features:**

- Optional thumbnail image (80×80px) on left side when `image` prop is provided
- Without `image` prop, displays text-only card (still looks great)
- Emerald green styling with hover effects

## FAQ Section

Use interactive accordions:

```mdx
## FAQ

<div className="not-prose mt-6 space-y-4">
  <details className="group rounded-3xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/90 dark:bg-zinc-900/70 p-5 shadow-sm" open>
    <summary className="flex items-center justify-between gap-4 cursor-pointer text-base font-semibold text-zinc-900 dark:text-zinc-100">
      Question text here?
      <span className="text-emerald-500 group-open:rotate-45 transition">+</span>
    </summary>
    <span className="block mt-3 text-sm text-zinc-600 dark:text-zinc-300">
      Answer text here. Keep it concise and helpful.
    </span>
  </details>
  
  <!-- More FAQ items without 'open' attribute -->
</div>
```

**Note:** Add `open` to the first `<details>` tag only.

## CTA Block

Place before the FAQ section:

```mdx
<div className="not-prose my-16">
  <div className="relative overflow-hidden rounded-[32px] border border-emerald-100/70 bg-linear-to-r from-emerald-500/15 via-teal-500/10 to-cyan-400/10 shadow-[0_35px_80px_rgba(16,185,129,0.2)]">
    <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(circle_at_top,_white,transparent_60%)]" />
    <div className="relative px-8 py-10 md:px-12 md:py-14 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl space-y-4">
        <span className="block text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
          Eyebrow text
        </span>
        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-900 dark:text-white leading-tight">
          Compelling headline that encourages action
        </h2>
        <span className="block text-base md:text-lg text-zinc-700 dark:text-zinc-200">
          Supporting text that reinforces the value proposition.
        </span>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="#section-link"
          className="inline-flex items-center justify-center rounded-2xl bg-zinc-900 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-zinc-900/20 transition hover:-translate-y-0.5"
        >
          Primary Button
        </a>
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-2xl border border-zinc-900/20 dark:border-white/30 px-6 py-3 text-sm font-semibold text-zinc-900 dark:text-white bg-white/70 dark:bg-transparent backdrop-blur"
        >
          Secondary Button
        </a>
      </div>
    </div>
  </div>
</div>
```

## References Section

```mdx
## References (source links)

<div className="not-prose space-y-3 mt-4">
  <a
    href="https://example.com/source"
    target="_blank"
    rel="noopener noreferrer"
    className="block rounded-lg border border-emerald-200/70 dark:border-emerald-900/50 px-4 py-3 transition hover:border-emerald-400"
  >
    <span className="block text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
      [1] Source Organization Name
    </span>
    <span className="block text-sm text-zinc-800 dark:text-zinc-200">
      Page or Article Title
    </span>
  </a>
</div>
```

## Critical Rules

### DO:

- ✅ Use `<span className="block">` instead of `<p>` inside custom divs (prevents hydration errors)
- ✅ Always include `alt` text for images
- ✅ Use the `not-prose` class on custom styled blocks
- ✅ Test on mobile viewport before publishing
- ✅ Use semantic HTML (`<article>`, `<section>`, `<details>`)
- ✅ Include `target="_blank" rel="noopener noreferrer"` on external links
- ✅ Include a References section with source links (REQUIRED)
- ✅ Use `ProductCard` component for affiliate links (not raw HTML)
- ✅ Add internal links to related posts using `/blog/[slug]` format
- ✅ Use `PostImage` for local images in `/public/images/posts/[slug]/`
- ✅ Use `Image` component for Cloudinary/external URLs
- ✅ Include product images in `ProductCard` when available (use `image` prop)

### DON'T:

- ❌ Use `<p>` tags inside `not-prose` divs (causes hydration errors)
- ❌ Use raw `<img>` tags (use `PostImage` or `Image` component)
- ❌ Use `bg-gradient-to-*` (use `bg-linear-to-*` instead)
- ❌ Hardcode image paths (use the slug-based convention for local, full URL for external)
- ❌ Skip the frontmatter image field
- ❌ Use emojis unless specifically requested
- ❌ Use `{" "}` JSX spacers (causes rendering issues)
- ❌ Use blockquotes (`>`) for disclaimers (use styled span)
- ❌ Use raw HTML for product cards (use ProductCard component)
- ❌ Use `PostImage` for Cloudinary URLs (use `Image` component instead)

## Checklist Before Submission

### Required Elements

- [ ] Frontmatter complete with all required fields
- [ ] Hero image (PostImage with variant="hero")
- [ ] Opening paragraph
- [ ] Info cards (3-column grid)
- [ ] Disclaimer (styled span, NOT blockquote)
- [ ] At least one section image (PostImage with variant="section")
- [ ] Product recommendations using `ProductCard` component
- [ ] CTA block before FAQ
- [ ] FAQ section with `<details>` accordions (first one `open`)
- [ ] References section with numbered source links (REQUIRED)

### Technical Checks

- [ ] Local images added to `public/images/posts/[slug]/`
- [ ] Hero image is 1200×630px or larger
- [ ] Local images use `PostImage` component
- [ ] Cloudinary/external images use `Image` component with width/height
- [ ] No raw `<img>` tags anywhere
- [ ] No `<p>` tags inside custom divs (use `<span className="block">`)
- [ ] No `{" "}` JSX spacers anywhere
- [ ] External links have `target="_blank" rel="noopener noreferrer"`
- [ ] Internal links use `/blog/[slug]` format
- [ ] ProductCard includes `image` prop when product image is available
- [ ] Tested locally with `npm run dev` (no hydration errors)

### Content Quality

- [ ] Claims backed by numbered citations [1], [2], etc.
- [ ] References link to reputable sources (NIH, Harvard, Mayo Clinic, etc.)
- [ ] Related reading links to other blog posts
- [ ] Alt text on all images
- [ ] Mobile viewport tested
