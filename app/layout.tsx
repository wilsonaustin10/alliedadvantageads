import "./css/style.css";

import { Inter } from "next/font/google";
import Script from "next/script";

import SmoothScroll from "@/components/smooth-scroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    template: '%s | Allied Advantage Ads',
    default: 'Allied Advantage Ads - Real Estate Lead Generation',
  },
  description: 'Generate motivated seller leads for your real estate wholesaling business with Allied Advantage Ads. Cost-effective, nationwide lead generation services.',
  keywords: ['real estate leads', 'motivated seller leads', 'real estate wholesaling', 'lead generation', 'PPC advertising'],
  authors: [{ name: 'Allied Advantage Ads' }],
  creator: 'Allied Advantage Ads',
  metadataBase: new URL('https://www.alliedadvantageads.com'),
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
    url: 'https://api.getsphere.xyz/users/68f9455cf540a350e4564dd9/profile',
    title: 'Allied Advantage Ads - Real Estate Lead Generation',
    description: 'Generate motivated seller leads for your real estate wholesaling business. Cost-effective, nationwide lead generation services.',
    siteName: 'Allied Advantage Ads',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allied Advantage Ads - Real Estate Lead Generation',
    description: 'Generate motivated seller leads for your real estate wholesaling business. Cost-effective, nationwide lead generation services.',
    creator: '@alliedadvantageads',
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
