# OpenGraph & Social Sharing Setup

## Overview
This document explains the OpenGraph (OG) implementation for proper social media sharing previews on Health Nutrition Hacks.

## What Was Fixed

### 1. Dynamic OG Image Generation
- **Created**: `/app/api/og/route.tsx` - Edge runtime API that generates 1200x630 images on-demand
- **Features**: 
  - Proper dimensions (1200x630px) for all social platforms
  - Dynamic titles, categories, and author names
  - Emerald gradient branding matching site design
  - Works for Twitter, Facebook, LinkedIn, Slack, etc.

### 2. Updated Metadata Across All Pages

#### Homepage (`/app/page.tsx`)
- ✅ Uses dynamic OG image (1200x630)
- ✅ Twitter card: `summary_large_image`
- ✅ Includes Twitter handle: `@healthnutritionhacks`

#### Blog Posts (`/app/blog/[slug]/page.tsx`)
- ✅ Uses post's featured image if available
- ✅ Falls back to dynamic OG image with post title
- ✅ Includes article metadata (publish date, tags, author)
- ✅ Proper absolute URLs for all images

#### Blog Listing (`/app/blog/page.tsx`)
- ✅ Dynamic OG image for blog archive
- ✅ Consistent branding

#### Category Pages (`/app/categories/[category]/page.tsx`)
- ✅ Category-specific OG images
- ✅ Dynamic titles based on category name

#### Root Layout (`/app/layout.tsx`)
- ✅ Default OG configuration
- ✅ Twitter handles configured

## Testing Your OG Images

### Method 1: Facebook Sharing Debugger
1. Go to: https://developers.facebook.com/tools/debug/
2. Enter URL: `https://www.healthnutritionhacks.com/blog/[your-post-slug]`
3. Click "Debug"
4. Verify:
   - Image appears (1200x630)
   - Title is correct
   - Description is present
   - No errors shown

### Method 2: Twitter Card Validator
1. Go to: https://cards-dev.twitter.com/validator
2. Enter URL: `https://www.healthnutritionhacks.com/blog/[your-post-slug]`
3. Click "Preview card"
4. Verify large image card displays

### Method 3: LinkedIn Post Inspector
1. Go to: https://www.linkedin.com/post-inspector/
2. Enter URL and click "Inspect"
3. Verify image and metadata

### Method 4: Local Testing (Chrome DevTools)
1. Open your page in Chrome
2. Right-click → View Page Source
3. Search for `og:image` and verify:
   ```html
   <meta property="og:image" content="https://www.healthnutritionhacks.com/api/og?title=..." />
   <meta property="og:image:width" content="1200" />
   <meta property="og:image:height" content="630" />
   ```

### Method 5: Browser Extension
Install "OpenGraph Preview" or "Meta SEO Inspector" Chrome extension to see OG tags instantly.

## OG Image URLs

### Homepage
```
https://www.healthnutritionhacks.com/api/og?title=Evidence-Based%20Wellness%20Tips%20%26%20Meal%20Prep%20Guides&category=Health&author=HNH%20Team
```

### Blog Posts
- With featured image: Uses the post's image path
- Without featured image: 
```
https://www.healthnutritionhacks.com/api/og?title=[POST_TITLE]&category=[CATEGORY]&author=[AUTHOR]
```

### Category Pages
```
https://www.healthnutritionhacks.com/api/og?title=[CATEGORY_NAME]&category=[CATEGORY_NAME]&author=HNH%20Team
```

## Customizing OG Images

### Option 1: Use Post Featured Images
Upload a 1200x630 image for each post in your admin panel. The system will automatically use it.

### Option 2: Customize the Dynamic Generator
Edit `/app/api/og/route.tsx` to change:
- Colors/gradient
- Fonts
- Layout
- Add your logo
- Add background patterns

### Option 3: Create Static OG Images
Place images in `/public/og/` and reference them directly in metadata.

## Common Issues & Solutions

### Issue: Image not updating on social platforms
**Solution**: After updating metadata:
1. Clear the cache on Facebook Debugger
2. Use "Scrape Again" button
3. Wait 24 hours for LinkedIn cache to expire

### Issue: Image appears blank
**Solution**: 
- Verify the `/api/og` route is accessible
- Check that all query parameters are URL-encoded
- Test the image URL directly in browser

### Issue: Wrong dimensions showing
**Solution**: 
- Ensure metadata specifies width: 1200, height: 630
- Check that images aren't being resized by hosting provider

### Issue: Relative URLs not working
**Solution**: All OG images must use absolute URLs (starting with `https://`)

## Best Practices

1. **Always use 1200x630 dimensions** - Works best across all platforms
2. **Keep text readable** - Important info should be in top 2/3 of image
3. **Use high contrast** - Ensure text stands out from background
4. **Test on mobile** - Preview how it looks on phones
5. **Include branding** - Logo or site name should be visible
6. **Update regularly** - Refresh OG cache when making changes

## Twitter Specific

- Handle: `@healthnutritionhacks`
- Card type: `summary_large_image`
- Minimum size: 300x157
- Maximum size: 4096x4096
- Recommended: 1200x630
- File size: <5MB

## Facebook Specific

- Recommended: 1200x630
- Minimum: 600x314
- Aspect ratio: 1.91:1
- File size: <8MB

## LinkedIn Specific

- Recommended: 1200x627
- Minimum: 1200x627
- Aspect ratio: 1.91:1

## Next Steps

1. **Deploy your site** with these changes
2. **Test each page type** using the validators above
3. **Request re-scraping** on Facebook/LinkedIn for existing posts
4. **Monitor performance** in Google Search Console under "Enhancements"
5. **Create custom OG images** for your most popular posts

## Additional Resources

- [OpenGraph Protocol](https://ogp.me/)
- [Twitter Cards Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)
