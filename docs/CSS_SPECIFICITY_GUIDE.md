# CSS Specificity & Tailwind Priority Guide

**Project:** Health Nutrition Hacks  
**Tailwind Version:** v4.1.17  
**Next.js Version:** 16.0.8

---

## 🎯 Golden Rule

**Tailwind utilities MUST ALWAYS override global CSS unless a specific global class is intentionally invoked.**

This document ensures you understand and maintain proper CSS cascade order in this project.

---

## 📊 CSS Load Order & Priority

### Load Sequence (in browser):
```
1. CriticalCSS.tsx (inline <style> in <head>) ← LOADS FIRST
2. globals.css (@import "tailwindcss")        ← LOADS SECOND
3. Tailwind utilities                         ← LOADS THIRD
4. Component-specific styles                  ← LOADS LAST
```

### Specificity Hierarchy (Tailwind v4):
```
LOWEST  → @layer base           (base element resets)
         ↓
MEDIUM  → @layer components     (custom component classes)
         ↓
HIGHEST → Tailwind utilities    (bg-*, px-*, border-*, etc.)
         ↓
NUCLEAR → !important             (avoid unless absolutely necessary)
```

---

## ✅ How to Ensure Tailwind Always Wins

### Rule 1: Minimal CriticalCSS
**Location:** `app/CriticalCSS.tsx`

**ONLY include these in inline critical CSS:**
- ✅ CSS custom properties (`--variable-name`)
- ✅ `box-sizing: border-box`
- ✅ Font family inheritance
- ✅ Line height/font size inheritance
- ✅ Basic color inheritance

**NEVER include in critical CSS:**
- ❌ `padding: 0` or any padding values
- ❌ `margin: 0` or any margin values
- ❌ `border-width: 0` or any border properties
- ❌ Background colors (use Tailwind utilities)
- ❌ Display properties (use Tailwind utilities)
- ❌ Width/height values (use Tailwind utilities)

**Why?** Inline styles in `<head>` load before Tailwind and have equal/higher specificity due to cascade order.

### Rule 2: Use @layer base for Element Resets
**Location:** `app/globals.css`

```css
/* ✅ CORRECT: Minimal resets that allow Tailwind to override */
@layer base {
  button {
    background-color: transparent;  /* Allows bg-* classes to work */
    background-image: none;
  }
  
  input {
    border-width: 0;  /* Allows border-* classes to work */
  }
}
```

```css
/* ❌ WRONG: Aggressive resets that block Tailwind */
@layer base {
  button {
    padding: 1rem 2rem;  /* Blocks px-*, py-* classes! */
    border-radius: 0.5rem;  /* Blocks rounded-* classes! */
  }
}
```

**Why?** `@layer base` has the LOWEST priority in Tailwind v4. Utilities will automatically override it.

### Rule 3: Scope @layer components Carefully
**Location:** `app/globals.css`

```css
/* ✅ CORRECT: Scoped to specific context */
@layer components {
  article h2,
  .prose h2 {
    font-size: 1.875rem !important;  /* Only affects prose content */
  }
}
```

```css
/* ❌ WRONG: Global element selector */
@layer components {
  h2 {
    font-size: 1.875rem;  /* Affects ALL h2 elements! */
  }
}
```

**Why?** Scoped selectors (`article h2`, `.prose h2`) only affect specific contexts, leaving general elements free for Tailwind utilities.

### Rule 4: Never Use !important in @layer base
```css
/* ❌ WRONG: !important in base layer */
@layer base {
  button {
    padding: 0 !important;  /* BLOCKS ALL Tailwind padding utilities! */
  }
}
```

```css
/* ✅ CORRECT: No !important needed */
@layer base {
  button {
    background-color: transparent;  /* Tailwind utilities override this */
  }
}
```

**Why?** `!important` in `@layer base` defeats the entire purpose of the layer system and blocks Tailwind utilities.

---

## 🔬 Testing Tailwind Priority

### Quick Test Checklist

1. **Create a test button:**
```tsx
<button className="bg-emerald-600 px-8 py-4 text-white rounded-xl">
  Test Button
</button>
```

2. **Open browser DevTools** → Inspect the button

3. **Verify in Styles panel:**
```css
/* Should see Tailwind classes applied: */
background-color: rgb(16, 185, 129);  /* bg-emerald-600 */
padding-left: 2rem;                   /* px-8 */
padding-right: 2rem;                  /* px-8 */
padding-top: 1rem;                    /* py-4 */
padding-bottom: 1rem;                 /* py-4 */
color: rgb(255, 255, 255);            /* text-white */
border-radius: 0.75rem;               /* rounded-xl */
```

4. **Check for crossed-out styles:**
   - If you see base styles crossed out ✓ = **GOOD** (Tailwind winning)
   - If you see Tailwind utilities crossed out ✗ = **BAD** (base CSS winning)

---

## 🛠️ Common Issues & Fixes

### Issue 1: Button Padding Not Working

**Symptom:**
```tsx
<button className="px-8 py-4">Click me</button>
// Button has no padding
```

**Cause:** Critical CSS or @layer base has `padding: 0`

**Fix:**
```tsx
// Remove from CriticalCSS.tsx:
button { padding: 0; }  // ❌ DELETE THIS

// Update globals.css @layer base:
@layer base {
  button {
    /* Don't set padding here - let Tailwind handle it */
  }
}
```

---

### Issue 2: Input Borders Not Showing

**Symptom:**
```tsx
<input className="border border-zinc-200" />
// No border visible
```

**Cause:** Critical CSS has `border-width: 0` on all elements

**Fix:**
```tsx
// Remove from CriticalCSS.tsx:
*, ::before, ::after { border-width: 0; }  // ❌ DELETE THIS

// Add to globals.css @layer base:
@layer base {
  input, textarea, select {
    border-width: 0;  /* Reset only form elements */
  }
}
```

---

### Issue 3: Background Colors Not Applying

**Symptom:**
```tsx
<div className="bg-emerald-50">Content</div>
// Background stays transparent
```

**Cause:** Critical CSS or base layer has background-color set

**Fix:**
```css
/* In @layer base, reset to transparent: */
@layer base {
  div {
    background-color: transparent;  /* Allows bg-* to work */
  }
}
```

---

## 📋 Before Deploying Checklist

- [ ] No padding/margin in `CriticalCSS.tsx` element selectors
- [ ] No border-width on `*` selector in `CriticalCSS.tsx`
- [ ] All element resets in `globals.css` use `@layer base`
- [ ] No `!important` in `@layer base`
- [ ] Scoped selectors in `@layer components` (e.g., `.prose h2`, not `h2`)
- [ ] Tested button with `bg-*`, `px-*`, `py-*`, `rounded-*` classes
- [ ] Tested input with `border`, `px-*`, `py-*`, `rounded-*` classes
- [ ] Verified in browser DevTools that Tailwind classes apply
- [ ] No Tailwind utilities are crossed out in DevTools

---

## 🎨 Best Practices

### DO's ✅

1. **Use Tailwind utilities for all styling**
   ```tsx
   <button className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg">
     Styled with Tailwind
   </button>
   ```

2. **Keep CriticalCSS minimal**
   - Only CSS variables
   - Only box-sizing
   - Only font/color inheritance

3. **Use @layer base for element resets**
   ```css
   @layer base {
     button {
       background-color: transparent;
     }
   }
   ```

4. **Scope custom styles to specific contexts**
   ```css
   @layer components {
     .prose h2 { /* Only affects .prose content */ }
   }
   ```

5. **Test immediately after adding global CSS**
   - Add style → Refresh browser → Check DevTools

### DON'Ts ❌

1. **Don't add layout styles to CriticalCSS**
   ```tsx
   // ❌ BAD
   button { padding: 0.5rem 1rem; }
   ```

2. **Don't use !important in @layer base**
   ```css
   /* ❌ BAD */
   @layer base {
     button { padding: 0 !important; }
   }
   ```

3. **Don't use global element selectors in @layer components**
   ```css
   /* ❌ BAD */
   @layer components {
     button { /* Affects ALL buttons */ }
   }
   ```

4. **Don't assume Tailwind "just works"**
   - Always test in browser
   - Always check DevTools
   - Always verify utilities aren't crossed out

---

## 🔍 Debugging Workflow

When a Tailwind utility isn't working:

1. **Identify the element**
   - Right-click → Inspect

2. **Check Computed styles**
   - Is the property value what you expect?
   - If not, look at the Styles panel

3. **Find the conflicting style**
   - Look for styles that aren't Tailwind utilities
   - Check if Tailwind utility is crossed out

4. **Trace the source**
   - Is it from CriticalCSS.tsx?
   - Is it from globals.css?
   - Is it from a component style?

5. **Apply the fix**
   - Remove conflicting style from source
   - Move to appropriate @layer if needed
   - Ensure proper specificity

6. **Verify the fix**
   - Refresh browser
   - Check DevTools again
   - Test other similar elements

---

## 📚 Reference Links

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [CSS Cascade Layers MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [CSS Specificity Calculator](https://specificity.keegan.st/)
- [Tailwind v4 Migration Guide](https://tailwindcss.com/docs/upgrade-guide)

---

## 🚨 Emergency Fix

If Tailwind utilities suddenly stop working across the entire app:

1. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Check globals.css:**
   - Ensure `@import "tailwindcss";` is first line
   - Ensure no element selectors outside @layer

3. **Check CriticalCSS.tsx:**
   - Remove any padding/margin/border-width from element selectors
   - Keep only box-sizing and inheritance

4. **Verify postcss.config.mjs:**
   ```js
   plugins: {
     "@tailwindcss/postcss": {},
   }
   ```

5. **Restart dev server:**
   ```bash
   npm run dev
   ```

---

**Last Updated:** January 25, 2026  
**Maintainer:** Development Team  
**Review Frequency:** Before each major deployment
