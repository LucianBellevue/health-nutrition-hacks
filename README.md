# Health Nutrition Hacks

A modern, SEO-optimized blog built with Next.js 15, TypeScript, Tailwind CSS v4, and MDX for publishing evidence-based nutrition tips and healthy recipes.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Typography Plugin
- **Content**: MDX with next-mdx-remote
- **Markdown**: gray-matter for frontmatter parsing
- **Plugins**: remark-gfm, rehype-slug, rehype-autolink-headings

## 📁 Project Structure

```
health-nutrition-hacks/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # Dynamic blog post page
│   │   └── page.tsx               # Blog index page
│   ├── rss.xml/
│   │   └── route.ts               # RSS feed generator
│   ├── layout.tsx                 # Root layout with Header & Footer
│   ├── page.tsx                   # Home page
│   ├── globals.css                # Global styles + Tailwind config
│   └── sitemap.ts                 # Auto-generated sitemap
├── components/
│   ├── AffiliateBlock.tsx         # Affiliate product component for MDX
│   ├── Footer.tsx                 # Site footer
│   ├── Header.tsx                 # Site header with navigation
│   ├── PostCard.tsx               # Blog post preview card
│   └── Prose.tsx                  # Typography wrapper for articles
├── content/
│   └── posts/
│       └── first-post.mdx         # Example blog post
├── lib/
│   └── posts.ts                   # Utility functions for post management
└── package.json
```

## 🎨 Features

### ✅ Core Features

- **Static Site Generation (SSG)** - All blog posts are pre-rendered at build time
- **MDX Support** - Write posts in Markdown with React components
- **SEO Optimized** - Auto-generated metadata, Open Graph tags, Twitter cards
- **RSS Feed** - Auto-generated at `/rss.xml`
- **Sitemap** - Auto-generated for search engines
- **Responsive Design** - Mobile-first, fully responsive layout
- **Typography** - Beautiful reading experience with Tailwind Typography

### 🎯 Blog Features

- **Frontmatter Support** - Title, description, date, author, image, tags
- **Post Filtering** - By date, tags, author
- **Code Highlighting** - Syntax highlighting in code blocks
- **Affiliate Blocks** - Reusable component for product recommendations
- **Auto-linking Headings** - All headings get anchor links
- **GitHub Flavored Markdown** - Tables, task lists, strikethrough, etc.

## 🏃 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## 📝 Writing Blog Posts

### Creating a New Post

1. Create a new `.mdx` file in `content/posts/`:

```bash
content/posts/my-new-post.mdx
```

2. Add frontmatter at the top of the file:

```mdx
---
title: "Your Post Title"
description: "A compelling description for SEO"
date: "2024-12-09"
author: "Your Name"
image: "https://example.com/image.jpg"
tags: ["nutrition", "health", "wellness"]
---

# Your Post Content

Write your content here...
```

### Using the AffiliateBlock Component

You can embed affiliate product recommendations directly in your MDX:

```mdx
<AffiliateBlock
  title="Product Name"
  description="Why this product is great"
  link="https://example.com/product"
  image="https://example.com/product-image.jpg"
  cta="Buy Now"
/>
```

### Frontmatter Fields

| Field         | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `title`       | string | ✅       | Post title (used in SEO)           |
| `description` | string | ✅       | Post excerpt (used in SEO & cards) |
| `date`        | string | ✅       | Publication date (YYYY-MM-DD)      |
| `author`      | string | ✅       | Author name                        |
| `image`       | string | ❌       | Featured image URL                 |
| `tags`        | array  | ❌       | Post tags/categories               |

## 🎨 Branding & Design

### Color Scheme

- **Primary**: Emerald (emerald-50 to emerald-700)
- **Secondary**: Teal & Cyan accents
- **Text**: Zinc-900 (headings), Zinc-600/700 (body)
- **Background**: Emerald-50 (light nutrition-friendly theme)

### Typography

- **Headings**: Geist Sans (bold)
- **Body**: Geist Sans
- **Code**: Geist Mono

## 🔧 Customization

### Update Site Metadata

Edit `app/layout.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Your Site Title",
  description: "Your site description",
  // ... other metadata
};
```

### Update Domain for RSS/Sitemap

Edit both `app/rss.xml/route.ts` and `app/sitemap.ts`:

```typescript
const siteUrl = "https://yourdomain.com";
```

### Customize Colors

Edit `app/globals.css`:

```css
:root {
  --background: #ecfdf5; /* emerald-50 */
  --foreground: #18181b; /* zinc-900 */
}
```

## 📦 Adding More Posts

Simply add more `.mdx` files to `content/posts/`. They will automatically:

- Appear on the blog index page
- Be included in the RSS feed
- Be added to the sitemap
- Get their own static page at `/blog/[slug]`

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Deploy!

### Other Platforms

This is a standard Next.js app and can be deployed to:

- Netlify
- AWS Amplify
- Railway
- Render
- Any platform supporting Node.js

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Next.js and Tailwind CSS
