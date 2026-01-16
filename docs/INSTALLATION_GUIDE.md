# Installation & Package Reference

## Required Packages Installation Command

Run this command in your project directory to install all required dependencies:

```bash
npm install next-mdx-remote gray-matter @tailwindcss/typography remark-gfm rehype-slug rehype-autolink-headings
```

## Package Breakdown

### MDX Processing
- **next-mdx-remote** (v5.0.0+) - Processes MDX content at runtime, perfect for blog posts
- **gray-matter** (v4.0.3+) - Parses YAML frontmatter from markdown files

### Tailwind Typography
- **@tailwindcss/typography** (v0.5.15+) - Beautiful default styles for prose content

### Markdown Enhancement Plugins
- **remark-gfm** (v4.0.0+) - GitHub Flavored Markdown (tables, task lists, strikethrough)
- **rehype-slug** (v6.0.0+) - Adds id attributes to headings
- **rehype-autolink-headings** (v7.1.0+) - Adds anchor links to headings

## Already Installed (from Next.js template)

These packages were already included in your Next.js setup:
- **next** (16.0.8) - Next.js framework
- **react** (19.2.1) - React library
- **react-dom** (19.2.1) - React DOM renderer
- **tailwindcss** (v4) - Tailwind CSS framework
- **typescript** (v5) - TypeScript language

## Verification

After installation, your `package.json` dependencies should include:

```json
{
  "dependencies": {
    "next": "16.0.8",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "next-mdx-remote": "^5.0.0",
    "gray-matter": "^4.0.3",
    "@tailwindcss/typography": "^0.5.15",
    "remark-gfm": "^4.0.0",
    "rehype-slug": "^6.0.0",
    "rehype-autolink-headings": "^7.1.0"
  }
}
```

## Quick Start After Installation

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Build for production:**
   ```bash
   npm run build
   ```

3. **Start production server:**
   ```bash
   npm start
   ```

## Alternative Package Managers

### Using Yarn
```bash
yarn add next-mdx-remote gray-matter @tailwindcss/typography remark-gfm rehype-slug rehype-autolink-headings
```

### Using pnpm
```bash
pnpm add next-mdx-remote gray-matter @tailwindcss/typography remark-gfm rehype-slug rehype-autolink-headings
```

### Using bun
```bash
bun add next-mdx-remote gray-matter @tailwindcss/typography remark-gfm rehype-slug rehype-autolink-headings
```
