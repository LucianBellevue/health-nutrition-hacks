# Post Editor Setup – Review & Recommendations

Review of the MDX post editor (`PostEditor.mdx.tsx` + `MDXEditor.tsx`) for UX, logic, and maintainability.

---

## What’s Working Well

- **Keyboard shortcuts** – Ctrl+S (save), Ctrl+Shift+P (publish), Ctrl+Shift+I (insert image), Esc (close modals) are wired and surfaced in a hint bar.
- **Auto-save to localStorage** – Draft saved every 30s; “Load draft?” on new post is clear.
- **Slug handling** – Auto-generation from title, uniqueness check, reset-from-title button, and preview URL shown.
- **SEO helpers** – Title/description length and “optimal” ranges (50–60 / 150–160) with visual status.
- **Templates** – How-To, Listicle, Review templates give a clear starting structure.
- **Featured image** – Drag-and-drop, alt required before upload, file-size warning, URL fallback.
- **Image management** – “Manage Images” with per-image alt editing and SEO tips.
- **FAQ extraction & sync** – FAQs from content, sync to DB, example usage shown.
- **Author attribution** – Preset authors + custom author with E-E-A-T–friendly fields.
- **Save verification** – After draft save, optional fetch-back to confirm; toasts for success/error.
- **Preview flow** – Save draft then open preview in new tab; slug required.
- **Insert inline image** – Upload → Cloudinary → inserts `<Image ... />` with alt; modal requires file + alt.

---

## Issues & Logic Fixes

### 1. **Inline image “variant” is ignored (bug)**

**Where:** Insert Image modal – Hero / Section / Inline options.

**Problem:** `handleConfirmImageInsert` always inserts the same markdown regardless of variant:

```ts
const imageComponent = `\n\n<Image src="${imageUrl}" alt="..." width={800} height={450} className="rounded-xl my-8" />\n\n`;
```

So “Hero”, “Section”, and “Inline” do nothing; the UI suggests behavior that doesn’t exist.

**Options:**

- **A.** Use variant when building the inserted string (e.g. different `width`/`height`/`className` for hero vs section vs inline) so the choice affects the output.
- **B.** Remove the variant selector and the helper text (“Hero: Full-width • …”) so the UI matches the single output style.

Recommendation: **A** – implement variant so the control is meaningful (e.g. hero: full width, section: 800×450, inline: smaller + different margin).

---

### 2. **No “unsaved changes” warning**

**Where:** Entire editor.

**Problem:** Leaving the page (link, refresh, close tab) with unsaved edits loses work. Only draft restore is localStorage auto-save, which is easy to miss.

**Recommendation:** Add `beforeunload` when the form is “dirty” (e.g. compare current `formData` to last saved or initial). Optionally, block in-app navigation (e.g. Next.js router) with a confirm dialog when dirty. Keep it simple: at least `beforeunload` so the browser shows “Leave site?”.

---

### 3. **Draft load uses `window.confirm`**

**Where:** “Found a saved draft. Would you like to load it?”

**Problem:** `window.confirm` is blocking and looks dated; no “Discard and start blank” vs “Load draft” in a clear, accessible way.

**Recommendation:** Replace with a small in-page modal or banner: “Draft found. [Load draft] [Start new]”. Improves UX and accessibility.

---

### 4. **Featured image alt required only in UI**

**Where:** Featured image modal – “Upload & Set as Featured” disabled when `!featuredImageData.altText.trim()`.

**Good:** Pre-upload validation.  
**Gap:** If someone sets featured image via “paste image URL” (the text input under the upload area), they can leave alt empty. Consider validating or auto-filling (e.g. from title) when saving or when URL is set.

---

### 5. **Category empty state on new post**

**Where:** `fetchData` sets `categoryId` to first category when `!formData.categoryId && data.length > 0`, but the select has `value=""` as “Select a category”.

**Problem:** For a new post with no initial data, after fetch you force the first category. If you want “no category” to be invalid, that’s fine; otherwise you’re overriding the user’s implicit “none” before they choose.

**Recommendation:** Either keep “Select a category” and require a category on submit, or don’t auto-set `categoryId` and allow empty until the user picks.

---

## UX Improvements

### 6. **Editor preview mode and theme**

**Where:** `MDXEditor.tsx` – `preview="edit"`, fixed height 600px, `data-color-mode="light"`.

**Suggestions:**

- **Preview mode:** `preview="edit"` is side-by-side. Consider exposing a toggle (e.g. “Edit only” / “Preview only” / “Split”) so long posts are easier to work with. If the library supports it, “live” (preview-only) can help focus.
- **Theme:** Sync with app theme (e.g. read `theme` or a class on `document` and set `data-color-mode="dark"` when the site is dark). Right now it’s forced light inside a dark admin.
- **Height:** 600px can be tight. Consider a larger default or a resizable panel (you already have `visibleDragbar={true}`; ensure it’s obvious).

---

### 7. **Insert image: insert at cursor**

**Where:** Inline image insert appends to `content`: `prev.content + imageComponent`.

**Problem:** User might want the image in the middle of the post. Appending is surprising if they’re focused elsewhere.

**Recommendation:** If the MD editor exposes cursor/selection or “insert at position”, insert there; otherwise add a short note like “Image will be added at the end of the content” so behavior is clear. Ideal fix: integrate with editor API to insert at cursor.

---

### 8. **Preview when slug is missing**

**Where:** Preview section and button: “Please add a slug before previewing” and disabled when `!formData.slug`.

**Suggestion:** When the user clicks “Open Preview” with no slug, auto-fill slug from title (if not already) and then save + open, instead of only showing an alert. Reduces friction.

---

### 9. **Save/Publish button state**

**Where:** Save Draft and Publish both disabled when `slugExists`.

**Good:** Prevents duplicate slugs.  
**Improvement:** When `slugExists`, show a short message near the buttons (e.g. “Change the slug to save”) so it’s obvious why they’re disabled.

---

### 10. **Required fields before publish**

**Where:** Submit only checks slug uniqueness and saving state.

**Suggestion:** For “Publish”, consider soft validation: title and slug required; category required if you don’t allow “none”; optionally featured image (warning only). Show inline errors or a small summary (“Missing: category”) instead of failing silently or with a generic API error.

---

## Optional Enhancements

- **Word count / read time** – You already show word count; adding “~X min read” is a small, familiar touch.
- **Markdown cheat sheet** – Collapsible “Formatting help” (headers, lists, links, code) next to the editor reduces guesswork.
- **Full-screen editor** – Optional “Focus mode” that hides sidebar/metadata and expands the MDX editor for long-form writing.
- **Image paste** – Paste from clipboard into the inline image flow (upload pasted file, then insert) for faster workflow.
- **Draft list** – Link “Load draft” to a list of recent localStorage drafts (e.g. by title + date) instead of a single slot, if you want multiple drafts.

---

## Summary Table

| Area              | Priority | Action |
|-------------------|----------|--------|
| Inline image variant | High    | Use variant in inserted markdown or remove selector |
| Unsaved changes  | High     | Add `beforeunload` (and optionally route guard) when dirty |
| Draft load UX    | Medium   | Replace `confirm()` with modal/banner |
| Editor theme     | Medium   | Sync `data-color-mode` with app dark/light |
| Insert at cursor | Medium   | Insert image at cursor or document current behavior |
| Preview without slug | Low  | Auto-fill slug from title when opening preview |
| Publish validation | Low   | Optional: inline required-field checks before publish |

If you tell me which of these you want to implement first (e.g. “fix variant + unsaved changes”), I can outline or apply the code changes next.
