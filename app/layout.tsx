import "./css/style.css";

import { Inter } from "next/font/google";
import Script from "next/script";

import SmoothScroll from "@/components/smooth-scroll";

const previewImageUrl = "/opengraph-image";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    template: '%s | Allied Advantage Ads',
    default: 'Allied Advantage Ads – #1 PPC Leads for Real Estate Wholesalers',
  },
  description:
    'Discover why Allied Advantage Ads is the #1 PPC lead source for real estate wholesalers nationwide. Unlock motivated seller opportunities with proven advertising strategies.',
  keywords: ['real estate leads', 'motivated seller leads', 'real estate wholesaling', 'lead generation', 'PPC advertising'],
  authors: [{ name: 'Allied Advantage Ads' }],
  creator: 'Allied Advantage Ads',
  metadataBase: new URL('https://alliedadvantage.co'),
  icons: {
    icon: '/images/favicon.svg',
    shortcut: '/images/favicon.svg',
    apple: '/images/favicon.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/images/favicon.svg',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alliedadvantage.co',
    title: 'Allied Advantage Ads – #1 PPC Leads for Real Estate Wholesalers',
    description:
      'Partner with Allied Advantage Ads to capture motivated seller leads through top-performing PPC campaigns tailored for real estate wholesalers.',
    siteName: 'Allied Advantage Ads',
    images: [
      {
        url: previewImageUrl,
        width: 1200,
        height: 630,
        alt: 'Allied Advantage Ads logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allied Advantage Ads: #1 PPC Leads for Real Estate Wholesalers',
    description:
      'Scale your real estate wholesaling deals with Allied Advantage Ads, delivering top PPC lead performance nationwide.',
    creator: '@alliedadvantageads',
    images: [previewImageUrl],
  },
  manifest: 'https://alliedadvantage.co/.well-known/acp.json',
  other: {
    'llm-profile': 'https://api.getsphere.xyz/users/68f9455cf540a350e4564dd9/profile',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-inter antialiased bg-white tracking-tight`}>
        <Script
          id="llm-profile-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
        >
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            url: 'https://api.getsphere.xyz/users/68f9455cf540a350e4564dd9/profile',
          })}
        </Script>
        <SmoothScroll />
        <div className="flex min-h-screen flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
