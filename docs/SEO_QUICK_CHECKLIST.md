# SEO Quick Reference Checklist

**Last Updated:** January 23, 2026  
**Overall SEO Score:** B+ (87/100)  
**Target:** A (95/100)

---

## 🔴 CRITICAL (Must Do Before Launch)

### Author Attribution
- [ ] magnesium-benefits.mdx
- [ ] best-probiotic-for-women-gut-health.mdx
- [ ] best-suplement-for-energy-without-caffeine.mdx
- [ ] healthy-breakfast-ideas-energy-weight-loss.mdx
- [ ] high-protein-snacks-for-weight-loss.mdx
- [ ] immune-boosting-habits.mdx
- [ ] metabolism-boosting-foods.mdx
- [ ] morning-gut-routine-to-reduce-bloating.mdx
- [ ] natural-stress-relief-supplements.mdx
- [ ] weight-loss-hacks.mdx

**What to add:**
```yaml
author: "Dr. Sarah Mitchell"
authorId: "sarah-mitchell"
```

---

### Image Alt Text Optimization

**Posts to update:**
- [ ] magnesium-benefits (3 images)
- [ ] best-probiotic-for-women-gut-health (3 images)
- [ ] best-suplement-for-energy-without-caffeine (3 images)
- [ ] healthy-breakfast-ideas-energy-weight-loss (3 images)
- [ ] high-protein-snacks-for-weight-loss (3 images)
- [ ] immune-boosting-habits (3 images)
- [ ] metabolism-boosting-foods (3 images)
- [ ] morning-gut-routine-to-reduce-bloating (3 images)
- [ ] natural-stress-relief-supplements (3 images)
- [ ] weight-loss-hacks (3 images)

**Formula:** "[Subject] [action/state] in [setting] with [relevant context]"

---

### FAQ Schema Implementation

**Posts with FAQs:**
- [ ] magnesium-benefits.mdx ✅ (has FAQs, needs schema)
- [ ] Check other posts for FAQ sections

**File to update:** `/app/blog/[slug]/page.tsx`

---

## 🟠 HIGH PRIORITY (Week 1-2)

### Author Profile Pages
- [ ] Create `/app/authors/[id]/page.tsx`
- [ ] Create `/app/authors/page.tsx` (all authors list)
- [ ] Update `/lib/authors.ts` with complete data
- [ ] Get author headshots (or create avatars)
- [ ] Add Person schema markup
- [ ] Link from posts to author pages

---

### Related Posts Component
- [ ] Create `/components/RelatedPosts.tsx`
- [ ] Add to blog post template
- [ ] Test with different categories/tags

---

### Breadcrumbs Navigation
- [ ] Create `/components/Breadcrumbs.tsx`
- [ ] Add to blog post template
- [ ] Add to category pages
- [ ] Style to match design

---

## 🟡 MEDIUM PRIORITY (Week 2-4)

### Technical Enhancements
- [ ] Add image sitemap (update `/app/sitemap.ts`)
- [ ] Add security headers (update `next.config.ts`)
- [ ] Create affiliate disclosure component
- [ ] Add "Last Updated" dates to posts

---

### Content Enhancements
- [ ] Add Table of Contents to posts >2,000 words
- [ ] Create "Key Takeaways" component
- [ ] Add social share buttons (optional)
- [ ] Create downloadable resources (PDFs)

---

## 🟢 LOW PRIORITY (Month 2+)

### Advanced Features
- [ ] Implement instant search
- [ ] Add reading progress indicator
- [ ] Create "Save for Later" feature
- [ ] Add print-friendly stylesheet
- [ ] Create infographics for Pinterest
- [ ] Add video embeds (if available)

---

## 📋 PRE-LAUNCH VALIDATION

### Content Validation
- [ ] All meta titles <60 characters
- [ ] All meta descriptions 150-160 characters
- [ ] All posts have featured images
- [ ] All images have unique alt text
- [ ] All posts have proper categories
- [ ] All posts have relevant tags

---

### Technical Validation
- [ ] Run Lighthouse audit (all pages >90 score)
- [ ] Validate all schema markup
- [ ] Test robots.txt: `/robots.txt`
- [ ] Test sitemap: `/sitemap.xml`
- [ ] Test RSS feed: `/rss.xml`
- [ ] Test 404 page
- [ ] Test mobile responsiveness

---

### Schema Validation Tools
- [ ] Validate with https://validator.schema.org/
- [ ] Test with https://search.google.com/test/rich-results
- [ ] Check Open Graph: https://developers.facebook.com/tools/debug/
- [ ] Check Twitter Card: https://cards-dev.twitter.com/validator

---

### Security & Legal
- [ ] HTTPS enabled (production)
- [ ] Privacy policy accessible
- [ ] Terms of service accessible
- [ ] Cookie consent working
- [ ] Disclaimer on all health content
- [ ] Affiliate disclosure visible

---

## 🚀 POST-LAUNCH TASKS

### Google Search Console
- [ ] Verify property ownership
- [ ] Submit sitemap: `https://healthnutritionhacks.com/sitemap.xml`
- [ ] Request indexing for homepage
- [ ] Request indexing for 5-10 key posts
- [ ] Monitor coverage reports
- [ ] Check mobile usability
- [ ] Review Core Web Vitals

---

### Monitoring Setup
- [ ] Verify Google Analytics tracking
- [ ] Set up custom events
- [ ] Create traffic goals
- [ ] Set up conversion tracking
- [ ] Monitor Core Web Vitals
- [ ] Track AdSense performance

---

### Bing Webmaster Tools
- [ ] Create account
- [ ] Verify property
- [ ] Submit sitemap
- [ ] Request indexing

---

## 📊 PERFORMANCE TARGETS

### Lighthouse Scores (Target)
- **Performance:** 90+ (currently excellent)
- **Accessibility:** 95+ (add ARIA labels)
- **Best Practices:** 95+ (add security headers)
- **SEO:** 100 (fix author attribution)

---

### Core Web Vitals (Target)
- **LCP:** <2.5s ✅ (currently good)
- **FID/INP:** <100ms/200ms ✅ (currently good)
- **CLS:** <0.1 ✅ (currently good)

---

### Traffic Goals (Month 3-6)
- **Daily visits:** 200-500
- **Pages per session:** 2+
- **Avg. session duration:** 3+ minutes
- **Bounce rate:** <60%

---

## 🎯 PRIORITY SCORING

| Task | Impact | Effort | Priority | Status |
|------|--------|--------|----------|--------|
| Author attribution | 🔴 HIGH | 30 min | CRITICAL | ⬜ |
| Image alt text | 🟠 HIGH | 2-3 hrs | CRITICAL | ⬜ |
| FAQ schema | 🟡 MED | 1-2 hrs | CRITICAL | ⬜ |
| Author pages | 🔴 HIGH | 4-6 hrs | HIGH | ⬜ |
| Related posts | 🟡 MED | 2-3 hrs | HIGH | ⬜ |
| Breadcrumbs | 🟢 LOW | 1 hr | HIGH | ⬜ |
| Image sitemap | 🟢 LOW | 30 min | MEDIUM | ⬜ |
| Security headers | 🟢 LOW | 15 min | MEDIUM | ⬜ |

---

## ⏱️ TIME ESTIMATES

### Critical Items (Total: 4-6 hours)
- Author attribution: 30 minutes
- Image alt text: 2-3 hours
- FAQ schema: 1-2 hours

### High Priority Items (Total: 7-10 hours)
- Author profile pages: 4-6 hours
- Related posts: 2-3 hours
- Breadcrumbs: 1 hour

### Medium Priority Items (Total: 1-2 hours)
- Image sitemap: 30 minutes
- Security headers: 15 minutes
- Affiliate disclosure: 30 minutes
- Testing: 30 minutes

**Total estimated time:** 12-18 hours

---

## 📞 QUICK REFERENCE LINKS

### Your Site
- Live site: https://healthnutritionhacks.com
- Sitemap: https://healthnutritionhacks.com/sitemap.xml
- Robots: https://healthnutritionhacks.com/robots.txt
- RSS: https://healthnutritionhacks.com/rss.xml

### Testing Tools
- Lighthouse: Chrome DevTools
- Schema: https://validator.schema.org/
- Rich Results: https://search.google.com/test/rich-results
- Mobile: https://search.google.com/test/mobile-friendly
- Page Speed: https://pagespeed.web.dev/

### Consoles
- Google Search Console: https://search.google.com/search-console
- Google Analytics: https://analytics.google.com/
- AdSense: https://www.google.com/adsense/

---

## ✅ COMPLETION TRACKER

**Progress:** ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜ 0/10 Critical Items

Update this as you complete items:
- ⬜ Not started
- 🔄 In progress
- ✅ Complete
- ❌ Blocked/Issue

---

**Last Reviewed:** January 23, 2026  
**Next Review:** After completing critical items

---

## 💡 QUICK TIPS

1. **Do critical items first** - These block launch
2. **Test after each change** - Don't batch all changes
3. **Use validators** - Catch errors early
4. **Document decisions** - Note why you chose specific alt text, etc.
5. **Back up regularly** - Commit to git after each major change

---

**Ready to start?** Begin with author attribution - it's the quickest win! ✨
