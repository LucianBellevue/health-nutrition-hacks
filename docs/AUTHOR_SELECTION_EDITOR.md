# Author Selection in Post Editor

## Overview

The post editor now includes a comprehensive author attribution system that allows you to:
- Select from predefined authors (including Editorial Team)
- Create custom authors with full details
- Default to Editorial Team if no author is selected
- Meet Google's E-E-A-T requirements for SEO

## How to Use

### Accessing Author Selection

1. Open any post in the editor (create new or edit existing)
2. Scroll to the **"Author Attribution"** section (located after SEO Settings)
3. Click to expand the section

### Selecting an Author

#### Option 1: Use Default (Editorial Team)
- Leave the dropdown empty or select "Editorial Team (Default)"
- This is the recommended option for AI-generated content
- Automatically shows:
  - "Editorial Review" label
  - "Verified" badge
  - Content disclosure component
  - Enhanced structured data

#### Option 2: Select Predefined Author
- Choose from the dropdown:
  - Dr. Sarah Mitchell
  - Chef Maria Rodriguez
  - James Chen, RD
  - HNH Editorial Team
  - Editorial Reviewer
- These authors have pre-configured bios and social links

#### Option 3: Create Custom Author
1. Select "Custom Author" from the dropdown
2. Fill in the required fields:
   - **Author Name** (required) - e.g., "Dr. Jane Smith, RD"
   - **Author Bio** (required) - Include credentials and expertise
   - **Avatar URL** (optional) - Link to author photo
   - **Social Links** (optional but recommended):
     - Website
     - Twitter/X
     - LinkedIn

### Google E-E-A-T Requirements

For custom authors, ensure you include:

✅ **Name**: Full name with credentials (e.g., "Dr. Jane Smith, RD")  
✅ **Bio**: Professional credentials, years of experience, areas of expertise  
✅ **Social Links**: Website, Twitter, LinkedIn (helps establish authority)  
✅ **Avatar**: Professional photo (optional but recommended)

**Example Bio:**
```
Registered dietitian with 10+ years of experience in clinical nutrition. 
Board-certified in sports nutrition and gut health. Published researcher 
in the Journal of Nutrition Science.
```

## How It Works

### Data Storage

- Author selection is stored in the post's `metadata` field
- Structure:
  ```json
  {
    "authorId": "custom" | "editorial-team" | "sarah-mitchell" | etc.,
    "customAuthor": {
      "name": "...",
      "bio": "...",
      "avatarUrl": "...",
      "social": {
        "website": "...",
        "twitter": "...",
        "linkedin": "..."
      }
    }
  }
  ```

### Display Logic

1. **Custom Author**: If `authorId === 'custom'` and `customAuthor` exists
   - Uses custom author data
   - Shows as "Author Spotlight" (not editorial)
   - Uses Person schema in structured data

2. **Predefined Author**: If `authorId` matches an author from `lib/authors.ts`
   - Uses predefined author data
   - Shows as "Author Spotlight" or "Editorial Review" based on author type

3. **Default/Empty**: If `authorId` is empty or undefined
   - Uses Editorial Team
   - Shows "Editorial Review" label
   - Includes content disclosure
   - Uses Organization schema in structured data

## Files Modified

1. **`components/admin/PostEditor.mdx.tsx`**
   - Added author selection UI
   - Added custom author fields
   - Integrated with form submission

2. **`app/api/admin/posts/[id]/route.ts`**
   - Updated to save author data in metadata
   - Merges with existing metadata (preserves FAQs)

3. **`app/api/admin/posts/route.ts`**
   - Updated to save author data in metadata for new posts

4. **`app/admin/posts/[slug]/edit/page.tsx`**
   - Loads author data from metadata when editing

5. **`app/blog/[slug]/page.tsx`**
   - Reads author from metadata
   - Falls back to default if not found
   - Handles custom authors correctly

6. **`components/AuthorBox.tsx`**
   - Updated to handle custom authors
   - Shows appropriate labels and badges

## Best Practices

1. **For AI-Generated Content**: Use default (Editorial Team)
   - Automatically includes all E-E-A-T signals
   - Shows content disclosure
   - Uses proper structured data

2. **For Guest Authors**: Use Custom Author
   - Include full credentials in bio
   - Add social links for authority
   - Use professional avatar

3. **For Regular Contributors**: Use Predefined Authors
   - Add new authors to `lib/authors.ts` if needed
   - Ensures consistency across posts

4. **Bio Guidelines**:
   - Minimum 50 words
   - Include: credentials, experience, expertise areas
   - Use professional tone
   - Mention publications/awards if relevant

## Example Custom Author Setup

```
Name: Dr. Sarah Johnson, MS, RD
Bio: Registered dietitian and nutrition researcher with 12 years of 
     experience in clinical nutrition and metabolic health. Board-certified 
     in obesity management. Published author in Nutrition Today and 
     American Journal of Clinical Nutrition. Specializes in diabetes 
     management and weight loss strategies.
Avatar: https://example.com/sarah-johnson.jpg
Website: https://sarahjohnsonnutrition.com
Twitter: https://twitter.com/sarahjrd
LinkedIn: https://linkedin.com/in/sarahjohnsonrd
```

## Testing

1. **Create a new post** with custom author
2. **Edit an existing post** and change author
3. **Leave author empty** - should default to Editorial Team
4. **View the post** - verify author box displays correctly
5. **Check page source** - verify structured data is correct

---

**Status**: ✅ Complete and Ready to Use  
**Last Updated**: January 25, 2026
