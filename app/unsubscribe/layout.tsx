import type { Metadata } from 'next';

const SITE_URL = 'https://healthnutritionhacks.com';
const OG_IMAGE = `${SITE_URL}/android-chrome-512x512.png`;

export const metadata: Metadata = {
  title: 'Manage Subscription | Health Nutrition Hacks',
  description:
    'Manage your Health Nutrition Hacks newsletter subscription. Unsubscribe or resubscribe to our weekly nutrition tips and wellness advice.',
  alternates: {
    canonical: `${SITE_URL}/unsubscribe`,
  },
  openGraph: {
    title: 'Manage Subscription | Health Nutrition Hacks',
    description:
      'Manage your newsletter subscription preferences for Health Nutrition Hacks.',
    url: `${SITE_URL}/unsubscribe`,
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
    title: 'Manage Subscription | Health Nutrition Hacks',
    description:
      'Manage your newsletter subscription preferences for Health Nutrition Hacks.',
    images: [OG_IMAGE],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
