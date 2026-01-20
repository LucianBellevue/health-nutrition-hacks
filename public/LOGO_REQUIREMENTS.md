# Logo & Image Requirements for Health Nutrition Hacks

## 🎨 Required Logo Files

You need to create the following logo files from your existing `hnh_logo.svg`:

### 1. OpenGraph Logo (Social Media Sharing)

- **Filename**: `public/og-logo.png`
- **Dimensions**: 1200x630 pixels
- **Format**: PNG
- **Purpose**: Shows when your site is shared on Facebook, Twitter, LinkedIn
- **Design Tips**:
  - Center your logo
  - Add site name text
  - Use brand colors (emerald green)
  - Keep important content in center (safe zone: 1200x600)

### 2. Square Logo for Structured Data

- **Filename**: `public/logo-512.png`
- **Dimensions**: 512x512 pixels
- **Format**: PNG
- **Purpose**: Used in Google search results and structured data
- **Design Tips**: Logo should be centered on solid background

### 3. Favicon Package (Already Exist ✓)

These files already exist in your `app/` directory:

- ✓ `favicon.ico` (32x32)
- ✓ `favicon-16x16.png`
- ✓ `favicon-32x32.png`
- ✓ `apple-touch-icon.png` (180x180)
- ✓ `android-chrome-192x192.png`
- ✓ `android-chrome-512x512.png`

**ACTION NEEDED**: Move these files from `app/` to `public/` directory

---

## 📋 Quick Action Steps

### Step 1: Create Missing Logo Files

Use a tool like Figma, Canva, or Photoshop:

1. **Create `public/og-logo.png`**:

   ```
   Dimensions: 1200x630 pixels
   Background: Gradient (emerald-950 to emerald-600)
   Logo: Your SVG logo centered
   Text: "Health Nutrition Hacks" below logo
   Subtext: "Evidence-Based Nutrition Tips"
   ```

2. **Create `public/logo-512.png`**:
   ```
   Dimensions: 512x512 pixels
   Background: White or transparent
   Logo: Your SVG logo centered, scaled to ~400px
   ```

### Step 2: Move Existing Icons

Move these files from `app/` to `public/`:

```bash
# PowerShell commands
Move-Item app/favicon.ico public/
Move-Item app/favicon-16x16.png public/
Move-Item app/favicon-32x32.png public/
Move-Item app/apple-touch-icon.png public/
Move-Item app/android-chrome-192x192.png public/
Move-Item app/android-chrome-512x512.png public/
```

### Step 3: Verify File Structure

After completion, your `public/` folder should have:

```
public/
├── og-logo.png          (NEW - 1200x630)
├── logo-512.png         (NEW - 512x512)
├── favicon.ico          (MOVED)
├── favicon-16x16.png    (MOVED)
├── favicon-32x32.png    (MOVED)
├── apple-touch-icon.png (MOVED)
├── android-chrome-192x192.png (MOVED)
├── android-chrome-512x512.png (MOVED)
├── hnh_logo.svg         (EXISTING ✓)
└── og-default.png       (EXISTING ✓)
```

---

## 🎨 Design Recommendations for OG Logo

### Option A: Simple Centered Logo

```
┌─────────────────────────────────┐
│                                 │
│         [YOUR LOGO]             │
│   Health Nutrition Hacks        │
│  Evidence-Based Nutrition       │
│                                 │
└─────────────────────────────────┘
```

### Option B: Split Design

```
┌─────────────────────────────────┐
│  [LOGO]  │  Health Nutrition   │
│          │       Hacks         │
│          │  Your Trusted Guide │
│          │   to Better Health  │
└─────────────────────────────────┘
```

### Color Palette (from your site)

- Primary: `#10b981` (emerald-500)
- Dark: `#064e3b` (emerald-950)
- Light: `#d1fae5` (emerald-100)
- Background gradient: `#064e3b` → `#047857` → `#10b981`

---

## 🛠️ Quick Tools to Create Images

### Online Tools (Free)

1. **Canva** (easiest): https://www.canva.com
   - Template: "Social Media" → Custom size: 1200x630
2. **Figma** (professional): https://www.figma.com
   - Best for precise control

3. **Photopea** (Photoshop alternative): https://www.photopea.com
   - Upload your SVG and resize

### Command Line (if you have ImageMagick)

```bash
# Convert SVG to PNG (512x512)
magick convert hnh_logo.svg -resize 512x512 -background white -gravity center -extent 512x512 logo-512.png

# Create OG image (requires composition)
# Best done in graphic design tool
```

---

## ✅ After Creating Files

Once you've created and moved the files, I will have automatically updated:

- ✅ `app/layout.tsx` - Added icon metadata and og:logo
- ✅ `app/manifest.webmanifest` - Fixed icon paths
- ✅ Structured data with proper logo references
- ✅ OpenGraph metadata with logo
- ✅ RSS feed generator
- ✅ Additional SEO improvements

The code updates are already implemented - you just need to create the image files!
