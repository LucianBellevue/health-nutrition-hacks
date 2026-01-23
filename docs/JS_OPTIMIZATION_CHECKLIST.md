# JavaScript Optimization Testing Checklist

## Pre-Deployment Testing

### 1. Build Verification
- [ ] Run `npm run build` successfully
- [ ] Check build output for chunk sizes
- [ ] Verify no build errors or warnings
- [ ] Check that framework/lib/commons chunks are created

### 2. Development Testing
- [ ] Run `npm run dev`
- [ ] Test homepage loads correctly
- [ ] Test blog post pages load correctly
- [ ] Test admin pages (if applicable)
- [ ] Verify no console errors

### 3. Script Loading Tests

#### Google Analytics (GTM)
- [ ] Open Network tab in DevTools
- [ ] Filter by "gtag"
- [ ] Verify script loads with `lazyOnload` (loads after interaction)
- [ ] Check `dataLayer` exists in console: `window.dataLayer`
- [ ] Verify page views are tracked in Google Analytics Real-Time

#### AdSense
- [ ] Open Network tab in DevTools
- [ ] Filter by "adsbygoogle"
- [ ] Verify script loads with `lazyOnload`
- [ ] Scroll to ad locations
- [ ] Verify ads render only when in/near viewport
- [ ] Check browser console for AdSense errors

### 4. Lighthouse Audit

Run on incognito/private window:

**Before metrics (baseline)**:
- Performance score: _____
- FCP: _____
- LCP: _____
- TBT: _____
- Unused JavaScript: _____

**After metrics (with optimizations)**:
- Performance score: _____ (Target: +10-20 points)
- FCP: _____ (Target: <1.8s)
- LCP: _____ (Target: <2.5s)
- TBT: _____ (Target: <200ms)
- Unused JavaScript: _____ (Target: <100 KiB)

### 5. Code Coverage

- [ ] Open DevTools → Coverage tool
- [ ] Record and reload page
- [ ] Check unused bytes:
  - GTM script: Should be mostly used (>60%)
  - AdSense script: Should be mostly used (>50%)
  - Main bundle: Should be >70% used

### 6. Mobile Testing

- [ ] Test on real mobile device or DevTools mobile emulation
- [ ] Verify ads render correctly on mobile
- [ ] Check performance on slower 3G connection
- [ ] Test on iOS Safari (if possible)
- [ ] Test on Android Chrome (if possible)

### 7. Intersection Observer Testing

- [ ] Open blog post with multiple ads
- [ ] Open DevTools Network tab
- [ ] Scroll slowly through page
- [ ] Verify ads load progressively (not all at once)
- [ ] Check that ads 200px away from viewport start loading

### 8. Bundle Analysis

#### Check chunk sizes in build output:
```
Route (app)                              Size     First Load JS
┌ ○ /                                    X KB     Y KB
├ ○ /blog                                X KB     Y KB
├ ○ /blog/[slug]                         X KB     Y KB
```

Target first load JS: <200 KB for main routes

### 9. Functional Tests

#### Homepage
- [ ] Page loads without errors
- [ ] Images load correctly
- [ ] Navigation works
- [ ] Theme toggle works
- [ ] Newsletter popup appears (if enabled)

#### Blog Post
- [ ] Post content renders
- [ ] Images load correctly
- [ ] Ads appear in appropriate locations
- [ ] Related posts appear
- [ ] Comments work (if enabled)

#### Admin (if applicable)
- [ ] Login works
- [ ] Dashboard loads
- [ ] Post editor works
- [ ] Image upload works

### 10. Error Monitoring

- [ ] Check browser console for JavaScript errors
- [ ] Check for React hydration errors
- [ ] Check for AdSense policy violations
- [ ] Check for CORS errors

---

## Post-Deployment Verification

### 1. Production Lighthouse Audit
Run Lighthouse on production URL in incognito:

- [ ] Performance score: _____ (Target: 85+)
- [ ] FCP: _____ (Target: <1.8s)
- [ ] LCP: _____ (Target: <2.5s)
- [ ] TBT: _____ (Target: <200ms)
- [ ] CLS: _____ (Target: <0.1)

### 2. Real User Monitoring

Check after 24-48 hours:

- [ ] Google Analytics page load times
- [ ] Core Web Vitals in Google Search Console
- [ ] Bounce rate (should not increase significantly)
- [ ] Average session duration (should not decrease)

### 3. Ad Revenue Monitoring

Monitor for 7 days:

- [ ] AdSense impressions (should not drop >10%)
- [ ] AdSense RPM (should not drop >10%)
- [ ] AdSense CTR (should remain stable)
- [ ] Total revenue (should remain stable or improve)

### 4. SEO Monitoring

Monitor for 30 days:

- [ ] Google Search Console impressions
- [ ] Google Search Console CTR
- [ ] Average position
- [ ] Core Web Vitals assessment

---

## Rollback Plan

If issues occur:

### Minor Issues (ads not showing, analytics not tracking)
1. Check browser console
2. Verify script URLs are correct
3. Check AdSense account status
4. Review Intersection Observer thresholds

### Major Issues (site broken, significant traffic/revenue drop)
1. Revert changes via Git:
   ```bash
   git revert HEAD
   git push
   ```
2. Redeploy previous version
3. Monitor recovery
4. Investigate issue in development

---

## Success Criteria

✅ **Performance**
- Lighthouse score improved by 10+ points
- LCP under 2.5s
- TBT under 200ms
- Unused JavaScript reduced by 150+ KiB

✅ **Functionality**
- All pages load correctly
- Ads display properly
- Analytics tracking works
- No console errors

✅ **Business Metrics**
- Ad revenue stable or improved
- Bounce rate stable or improved
- User engagement stable or improved

---

## Notes & Observations

**Testing Date**: _____________

**Tester**: _____________

**Environment**: 
- [ ] Local development
- [ ] Staging
- [ ] Production

**Issues Found**:
1. ___________________________________
2. ___________________________________
3. ___________________________________

**Performance Improvements**:
- Lighthouse score: _____ → _____
- LCP: _____ → _____
- Unused JS: _____ → _____

**Next Steps**:
1. ___________________________________
2. ___________________________________
3. ___________________________________
