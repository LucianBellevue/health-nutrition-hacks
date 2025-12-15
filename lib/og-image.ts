/**
 * Utility to fetch Open Graph images from product URLs.
 * Used by ProductCard to display product thumbnails.
 */

// Cache for fetched OG images to avoid repeated requests
const ogImageCache = new Map<string, string | null>();

/**
 * Extract Amazon ASIN from URL and return product image URL.
 * Amazon blocks server-side fetches, so we construct the image URL directly.
 */
function getAmazonImageUrl(url: string): string | null {
  // Match ASIN patterns: /dp/ASIN, /gp/product/ASIN, or /product/ASIN
  const asinMatch = url.match(/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i);
  if (asinMatch?.[1]) {
    const asin = asinMatch[1];
    // Use Amazon's media CDN URL pattern (more reliable)
    return `https://m.media-amazon.com/images/I/${asin}._AC_SX300_.jpg`;
  }
  return null;
}

/**
 * Extract iHerb product ID from URL and return product image URL.
 * iHerb blocks server-side fetches, so we construct the image URL directly.
 */
function getIherbImageUrl(url: string): string | null {
  // Match iHerb product ID patterns: /pr/product-name/12345 or just /12345
  const productIdMatch = url.match(/\/(\d{4,6})(?:\?|$)/);
  if (productIdMatch?.[1]) {
    const productId = productIdMatch[1];
    // Use iHerb's CDN URL pattern
    return `https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/product/${productId}/1.jpg`;
  }
  return null;
}

/**
 * Fetches the Open Graph image from a URL.
 * Returns null if no image is found or request fails.
 */
export async function getOgImage(url: string): Promise<string | null> {
  // Check cache first
  if (ogImageCache.has(url)) {
    return ogImageCache.get(url) ?? null;
  }

  // Handle Amazon URLs specially (they block server-side fetches)
  if (url.includes('amazon.com')) {
    const amazonImage = getAmazonImageUrl(url);
    ogImageCache.set(url, amazonImage);
    return amazonImage;
  }

  // Handle iHerb URLs specially (they block server-side fetches)
  if (url.includes('iherb.com')) {
    const iherbImage = getIherbImageUrl(url);
    ogImageCache.set(url, iherbImage);
    return iherbImage;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      ogImageCache.set(url, null);
      return null;
    }

    const html = await response.text();
    
    // Try to find og:image meta tag
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    
    if (ogImageMatch?.[1]) {
      const imageUrl = ogImageMatch[1];
      ogImageCache.set(url, imageUrl);
      return imageUrl;
    }

    // Fallback: try to find twitter:image
    const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);

    if (twitterImageMatch?.[1]) {
      const imageUrl = twitterImageMatch[1];
      ogImageCache.set(url, imageUrl);
      return imageUrl;
    }

    ogImageCache.set(url, null);
    return null;
  } catch (error) {
    console.error(`Failed to fetch OG image for ${url}:`, error);
    ogImageCache.set(url, null);
    return null;
  }
}
