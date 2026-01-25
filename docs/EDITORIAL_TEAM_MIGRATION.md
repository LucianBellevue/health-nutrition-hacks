# Editorial Team Author Migration Guide

## Current Status

✅ **The implementation is already complete!**

The `getAuthorByIdOrDefault` function in `lib/authors.ts` automatically maps any User ID that doesn't match an author ID to the "editorial-team" author. This means:

- **All existing posts** already use the editorial team author by default
- **All new posts** will use the editorial team author
- **No database migration needed** - the system works automatically

## How It Works

1. Posts store a `authorId` which is a User ID from the database
2. `getAuthorByIdOrDefault(post.authorId)` is called
3. If the User ID doesn't match any author ID in `lib/authors.ts`, it returns the editorial team author
4. The editorial team author shows:
   - "Editorial Review" label
   - "Verified" badge
   - Content disclosure component
   - Enhanced structured data with editorial review info

## Verification

To verify all posts are using editorial team:

1. Visit any blog post on your site
2. Check the Author Box - it should show:
   - "Editorial Review" (not "Author Spotlight")
   - "HNH Editorial Team" as the author name
   - "Verified" badge
   - Content disclosure component below the FAQ section

## Optional: Explicit Update

If you want to explicitly update all posts to use a specific admin user ID (for consistency), you can:

### Option 1: Use the API Endpoint

1. Go to your admin dashboard
2. Open browser console (F12)
3. Run:
```javascript
fetch('/api/admin/posts/update-authors', { method: 'POST' })
  .then(r => r.json())
  .then(console.log);
```

### Option 2: Run the Migration Script

```bash
npx tsx scripts/update-posts-to-editorial-team.ts
```

**Note:** This requires your database to be connected and accessible.

### Option 3: Direct SQL Update (Neon Console)

If you know your admin user ID, you can run this in Neon SQL Editor:

```sql
-- Update all published posts to use a specific user ID
-- Replace 'YOUR_ADMIN_USER_ID' with your actual admin user ID
UPDATE "Post" 
SET "authorId" = 'YOUR_ADMIN_USER_ID'
WHERE published = true;
```

To find your admin user ID:
```sql
SELECT id, email, name FROM "User" WHERE role = 'ADMIN' LIMIT 1;
```

## What Changed

1. ✅ `lib/authors.ts` - Added editorial team authors and updated default mapping
2. ✅ `components/ContentDisclosure.tsx` - New component for transparency
3. ✅ `components/AuthorBox.tsx` - Shows editorial review badges
4. ✅ `app/blog/[slug]/page.tsx` - Enhanced structured data and disclosure
5. ✅ `app/api/admin/posts/update-authors/route.ts` - Optional migration endpoint

## Testing

1. Visit a blog post: `/blog/[any-slug]`
2. Verify you see:
   - ✅ "Editorial Review" label in Author Box
   - ✅ "HNH Editorial Team" as author name
   - ✅ "Verified" badge
   - ✅ Content disclosure component
   - ✅ Enhanced structured data (check page source)

## Next Steps

1. **Verify**: Check a few posts to confirm editorial team is showing
2. **Monitor**: Track SEO performance in Google Search Console
3. **Iterate**: Adjust based on performance data

---

**Status**: ✅ Complete - All posts automatically use editorial team author  
**Last Updated**: January 25, 2026
