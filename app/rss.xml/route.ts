import { getAllPosts } from '@/lib/db-posts';

export async function GET() {
  const posts = await getAllPosts();
  const siteUrl = 'https://healthnutritionhacks.com';

  const rssItems = posts
    .map((post) => {
      const { metadata } = post;
      const postUrl = `${siteUrl}/blog/${metadata.slug}`;
      const pubDate = new Date(metadata.date).toUTCString();

      return `
    <item>
      <title><![CDATA[${metadata.title}]]></title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <description><![CDATA[${metadata.description}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${metadata.author ? `<author>${metadata.author}</author>` : ''}
      ${metadata.tags ? metadata.tags.map(tag => `<category>${tag}</category>`).join('\n      ') : ''}
    </item>`;
    })
    .join('');

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Health Nutrition Hacks</title>
    <link>${siteUrl}</link>
    <description>Evidence-based nutrition tips, healthy recipes, and wellness advice</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
