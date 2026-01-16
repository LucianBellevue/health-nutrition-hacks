# MDX Editor Setup Guide

This guide covers the full MDX integration for your Health Nutrition Hacks blog.

## 🎯 What Was Implemented

### 1. Database Schema Updates
- Added `format` field to Post model (supports "html" or "mdx")
- Default format is "html" for backward compatibility

### 2. MDX Editor Components
- **`components/admin/MDXEditor.tsx`**: Full-featured markdown editor with live preview
- **`components/admin/PostEditor.mdx.tsx`**: Complete post editor using MDX format
- **`components/MDXContent.tsx`**: Client component for rendering MDX with custom styling

### 3. Blog Post Rendering
- **`app/blog/[slug]/page.db.tsx`**: Database-backed blog post page that supports both HTML and MDX
- Automatically detects format and renders accordingly

### 4. Migration Tools
- **`scripts/migrate-mdx-posts.ts`**: Script to import existing MDX files from `/content/posts` into database

## 📦 Installed Packages

```bash
@uiw/react-md-editor
@uiw/react-markdown-preview
next-mdx-remote
rehype-highlight
rehype-slug
rehype-autolink-headings
remark-gfm
highlight.js
```

## 🚀 How to Use

### Option 1: Use MDX Editor (Recommended for new posts)

The new MDX editor (`PostEditor.mdx.tsx`) provides:
- Live markdown preview
- Syntax highlighting
- Drag-to-resize editor
- All standard post features (categories, tags, SEO, scheduling)

**To switch to MDX editor:**
1. Update `app/admin/posts/new/page.tsx` to import `PostEditor` from `PostEditor.mdx.tsx`
2. Update `app/admin/posts/[slug]/edit/page.tsx` similarly

### Option 2: Keep Current TipTap Editor

The existing TipTap editor (`PostEditor.tsx`) still works and saves posts as HTML format.

### Option 3: Use Both (Dual Mode)

You can offer both editors and let users choose their preferred format.

## 📝 Migrating Existing MDX Files

Run the migration script to import your 10 existing MDX posts from `/content/posts`:

```bash
npm run db:migrate:mdx
```

This will:
- Read all `.mdx` files from `content/posts/`
- Parse frontmatter metadata
- Match categories to database
- Insert posts with `format: 'mdx'`
- Skip posts that already exist
- Provide a summary of results

**Prerequisites:**
1. Categories must be seeded first: `npm run db:seed:categories`
2. Admin user must exist: `npm run db:seed`

## 🎨 Custom MDX Components

The MDX renderer includes custom styled components:
- Headings (h1-h3) with proper spacing
- Styled paragraphs, lists, blockquotes
- Code blocks with syntax highlighting
- Tables with responsive layout
- Custom inline code styling
- Proper image rendering

## 🔄 Switching Blog to Database

To use database posts instead of file-based posts:

1. **Rename current file-based blog page:**
   ```bash
   mv app/blog/[slug]/page.tsx app/blog/[slug]/page.old.tsx
   ```

2. **Rename database-backed page:**
   ```bash
   mv app/blog/[slug]/page.db.tsx app/blog/[slug]/page.tsx
   ```

3. **Update blog listing page** (`app/blog/page.tsx`) to fetch from database instead of files

## 📋 Testing Checklist

- [ ] Run migration script successfully
- [ ] Test MDX post rendering on frontend
- [ ] Test creating new MDX post in admin
- [ ] Test editing existing MDX post
- [ ] Test HTML post still renders correctly
- [ ] Verify SEO metadata works
- [ ] Check image rendering in MDX
- [ ] Test syntax highlighting in code blocks
- [ ] Verify mobile responsiveness

## 🐛 Troubleshooting

### TypeScript Errors for `format` field
Run `npx prisma generate` to update Prisma client types.

### MDX Components Not Rendering
Ensure you're passing the custom components to MDXRemote:
```tsx
<MDXRemote source={content} components={components} options={options} />
```

### Images Not Loading
Check that image paths in MDX match your public folder structure.

### Migration Script Fails
- Verify `DATABASE_URL` is set in `.env`
- Ensure categories exist in database
- Check admin user exists

## 🎯 Next Steps

1. **Run migration:** `npm run db:migrate:mdx`
2. **Test a migrated post:** Visit `/blog/magnesium-benefits` or any other migrated post
3. **Switch admin editor:** Update new/edit pages to use `PostEditor.mdx.tsx`
4. **Switch blog pages:** Rename `page.db.tsx` to `page.tsx`
5. **Update blog listing:** Modify `app/blog/page.tsx` to use database queries

## 📚 Additional Resources

- [MDX Documentation](https://mdxjs.com/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [@uiw/react-md-editor](https://uiwjs.github.io/react-md-editor/)

---

**Note:** The proxy.ts file replaces the deprecated middleware.ts file for Next.js 16 compatibility.
