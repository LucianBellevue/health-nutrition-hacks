import type { Metadata } from 'next';

const SITE_URL = 'https://healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export const metadata: Metadata = {
  title: 'Contact Us | Health Nutrition Hacks',
  description:
    'Get in touch with Health Nutrition Hacks. Have questions about nutrition, health tips, or partnership opportunities? We\'d love to hear from you.',
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  openGraph: {
    title: 'Contact Us | Health Nutrition Hacks',
    description:
      'Reach out to the Health Nutrition Hacks team for questions, feedback, or partnership inquiries.',
    url: `${SITE_URL}/contact`,
    siteName: 'Health Nutrition Hacks',
    type: 'website',
    images: [
      {
        url: OG_IMAGE,
        width: 512,
        height: 512,
        alt: 'Health Nutrition Hacks',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Health Nutrition Hacks',
    description:
      'Reach out to the Health Nutrition Hacks team for questions, feedback, or partnership inquiries.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const contactPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Us | Health Nutrition Hacks',
  url: `${SITE_URL}/contact`,
  description: 'Get in touch with Health Nutrition Hacks for questions about nutrition, health tips, or partnership opportunities.',
  mainEntity: {
    '@type': 'Organization',
    name: 'Health Nutrition Hacks',
    telephone: '+1-706-460-1201',
    email: 'info@healthnutritionhacks.com',
    url: `${SITE_URL}/contact`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-706-460-1201',
      email: 'info@healthnutritionhacks.com',
      contactType: 'customer service',
      areaServed: 'US',
      availableLanguage: 'English',
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      {children}
    </>
  );
}
