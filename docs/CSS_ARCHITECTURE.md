# CSS Architecture & Tailwind Priority System

**Last Updated:** January 25, 2026

---

## 🎯 Core Principle

**Tailwind CSS utilities ALWAYS override global CSS unless a specific global class is intentionally invoked.**

This document defines the CSS architecture for the Health Nutrition Hacks project to ensure Tailwind utilities have absolute priority.

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CSS LOAD ORDER                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. CriticalCSS.tsx (inline <style> in <head>)             │
│     ↓ Purpose: Eliminate FOUC, minimal styles only         │
│     ↓ Priority: HIGH (but no layout/spacing styles)        │
│                                                             │
│  2. globals.css (@import "tailwindcss")                     │
│     ↓ Purpose: Import Tailwind base + load custom layers   │
│     ↓ Priority: MEDIUM                                      │
│                                                             │
│  3. @layer base (in globals.css)                            │
│     ↓ Purpose: Minimal element resets                      │
│     ↓ Priority: LOWEST                                      │
│                                                             │
│  4. @layer components (in globals.css)                      │
│     ↓ Purpose: Scoped component classes (.prose, etc.)     │
│     ↓ Priority: LOW-MEDIUM                                  │
│                                                             │
│  5. Tailwind Utilities (generated)                          │
│     ↓ Purpose: All utility classes (bg-*, px-*, etc.)      │
│     ↓ Priority: HIGHEST (always wins)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ File Structure

```
app/
├── CriticalCSS.tsx          ← Inline critical styles (MINIMAL)
├── globals.css              ← Main CSS file
│   ├── @import "tailwindcss"
│   ├── @layer base          ← Element resets (LOW priority)
│   ├── @layer components    ← Custom classes (MEDIUM priority)
│   └── body styles          ← Body-specific styles
└── layout.tsx               ← Imports CriticalCSS + globals.css
```

---

## 📋 What Goes Where

### CriticalCSS.tsx (Inline in `<head>`)

**✅ ALLOWED:**
- CSS custom properties (`--variable-name`)
- `box-sizing: border-box`
- Font family inheritance
- Font size inheritance
- Line height inheritance
- Color inheritance
- Basic display/flex for layout structure

**❌ FORBIDDEN:**
- `padding` values (breaks Tailwind `px-*`, `py-*`, `p-*`)
- `margin` values (breaks Tailwind `mx-*`, `my-*`, `m-*`)
- `border-width` (breaks Tailwind `border-*`)
- `border-radius` (breaks Tailwind `rounded-*`)
- `background-color` (breaks Tailwind `bg-*`)
- Width/height values (breaks Tailwind sizing)

**Why?** Inline styles in `<head>` load first and can block Tailwind utilities through cascade order.

---

### globals.css - @layer base

**Purpose:** Reset browser default styles to a neutral baseline.

**✅ ALLOWED:**
```css
@layer base {
  button {
    background-color: transparent;  /* Neutral reset */
    background-image: none;
  }
  
  input {
    border-width: 0;  /* Reset to allow Tailwind borders */
  }
}
```

**❌ FORBIDDEN:**
```css
@layer base {
  button {
    padding: 1rem;  /* ❌ Blocks Tailwind padding */
    border-radius: 0.5rem;  /* ❌ Blocks Tailwind rounded-* */
  }
}
```

**Why?** `@layer base` has the LOWEST priority. It resets elements to neutral so Tailwind utilities can style them.

---

### globals.css - @layer components

**Purpose:** Create reusable component classes that are scoped to specific contexts.

**✅ ALLOWED:**
```css
@layer components {
  /* Scoped to prose/article content */
  .prose h2,
  article h2 {
    font-size: 1.875rem !important;
  }
  
  /* Custom component class */
  .card {
    @apply rounded-lg shadow-md p-4;
  }
}
```

**❌ FORBIDDEN:**
```css
@layer components {
  /* Global element selector - affects ALL buttons! */
  button {
    padding: 1rem 2rem;
  }
}
```

**Why?** Component layer should only contain scoped selectors (`.prose h2`) or custom component classes (`.card`), never global element selectors.

---

## ⚖️ Specificity Rules

### The Cascade Hierarchy

```
Lowest Priority  → @layer base
                   ↓
Medium Priority  → @layer components (without !important)
                   ↓
High Priority    → Tailwind utilities
                   ↓
Highest Priority → Tailwind utilities with !important
                   ↓
Nuclear Option   → Inline styles with !important
```

### How Tailwind Wins

Tailwind v4 utilities are generated AFTER all `@layer` directives, giving them natural cascade priority:

```css
/* In globals.css */
@layer base {
  button {
    background-color: transparent;  /* Priority: 1 */
  }
}

/* Tailwind generates this AFTER @layer base */
.bg-emerald-600 {
  background-color: rgb(16, 185, 129);  /* Priority: 2 - WINS! */
}
```

---

## 🧪 Testing Methodology

### 1. Visual Test
```tsx
<button className="bg-emerald-600 px-8 py-4 text-white rounded-xl hover:bg-emerald-700">
  Test Button
</button>
```

Should display:
- ✅ Emerald green background
- ✅ Substantial padding
- ✅ White text
- ✅ Rounded corners
- ✅ Darker green on hover

### 2. DevTools Test

**Steps:**
1. Right-click button → Inspect
2. Check **Computed** tab
3. Verify values:
   ```
   background-color: rgb(16, 185, 129)
   padding-left: 2rem
   padding-right: 2rem
   padding-top: 1rem
   padding-bottom: 1rem
   border-radius: 0.75rem
   color: rgb(255, 255, 255)
   ```

**In Styles panel:**
- ✅ Tailwind utilities should NOT be crossed out
- ✅ Base layer styles should be crossed out (overridden)
- ✅ If Tailwind utilities are crossed out = **PROBLEM**

### 3. Specificity Test

Use browser console:
```javascript
// Get computed styles
const button = document.querySelector('.test-button');
const styles = window.getComputedStyle(button);

console.log('Background:', styles.backgroundColor);
console.log('Padding:', styles.padding);
console.log('Border Radius:', styles.borderRadius);
```

---

## 🚨 Common Issues & Solutions

### Issue: Tailwind Utilities Not Applying

**Symptoms:**
```tsx
<button className="bg-emerald-600 px-4 py-2">
  No styles applied
</button>
```

**Diagnosis:**
1. Open DevTools → Inspect button
2. Check if Tailwind classes are crossed out
3. Identify what's overriding them

**Common Causes:**

| Problem | Location | Solution |
|---------|----------|----------|
| `padding: 0` on buttons | CriticalCSS.tsx | Remove it |
| `border-width: 0` on `*` | CriticalCSS.tsx | Remove it |
| Element selector in @layer components | globals.css | Scope to `.prose` or class |
| `!important` in @layer base | globals.css | Remove !important |

---

## 📝 Code Review Checklist

Before merging any CSS changes:

- [ ] No padding/margin/border-width in `CriticalCSS.tsx` element selectors
- [ ] No `!important` in `@layer base`
- [ ] All component styles scoped (`.prose h2`, not `h2`)
- [ ] Tested Tailwind utilities still work on buttons
- [ ] Tested Tailwind utilities still work on inputs
- [ ] Checked DevTools - no Tailwind utilities crossed out
- [ ] Hard refresh tested (`Ctrl + Shift + R`)

---

## 🎓 Training Examples

### Example 1: Adding a Custom Reset

**❌ WRONG:**
```css
/* This will break all button padding! */
button {
  padding: 0;
  margin: 0;
}
```

**✅ CORRECT:**
```css
/* Put in @layer base, minimal reset */
@layer base {
  button {
    background-color: transparent;
    background-image: none;
  }
}
```

### Example 2: Adding Prose Styles

**❌ WRONG:**
```css
/* Affects ALL h2 elements! */
@layer components {
  h2 {
    font-size: 2rem;
  }
}
```

**✅ CORRECT:**
```css
/* Only affects h2 inside article or .prose */
@layer components {
  article h2,
  .prose h2 {
    font-size: 2rem !important;
  }
}
```

### Example 3: Custom Component Class

**✅ CORRECT:**
```css
@layer components {
  .custom-card {
    @apply rounded-lg shadow-md p-6 bg-white;
  }
}
```

Usage:
```tsx
<div className="custom-card">
  <button className="bg-emerald-600 px-4 py-2">
    Tailwind utilities still work inside!
  </button>
</div>
```

---

## 🔧 Maintenance

### When to Update This Document

1. **Tailwind version upgrade** - Update architecture if cascade rules change
2. **Adding new global styles** - Document them here
3. **Encountering specificity issues** - Add to troubleshooting section
4. **New team members** - Review this document with them

### Review Schedule

- **Before each deployment** - Quick checklist review
- **Monthly** - Full architecture review
- **After major refactor** - Update examples and patterns

---

## 📚 Additional Resources

### Internal Documentation
- [CSS Styling Fix Summary](./CSS_STYLING_FIX_SUMMARY.md)
- [CSS Specificity Guide](./CSS_SPECIFICITY_GUIDE.md)

### External References
- [Tailwind v4 Beta Docs](https://tailwindcss.com/docs/v4-beta)
- [CSS @layer MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [CSS Cascade MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)
- [Specificity Calculator](https://specificity.keegan.st/)

---

**Document Owner:** Development Team  
**Review Frequency:** Monthly  
**Last Reviewed:** January 25, 2026
