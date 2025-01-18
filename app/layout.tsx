import "./css/style.css";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    template: '%s | Allied Lead Gen',
    default: 'Allied Lead Gen - Real Estate Lead Generation',
  },
  description: 'Generate motivated seller leads for your real estate wholesaling business with Allied Lead Gen. Cost-effective, nationwide lead generation services.',
  keywords: ['real estate leads', 'motivated seller leads', 'real estate wholesaling', 'lead generation', 'PPC advertising'],
  authors: [{ name: 'Allied Lead Gen' }],
  creator: 'Allied Lead Gen',
  metadataBase: new URL('https://www.alliedleadgen.com'),
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
    url: 'https://www.alliedleadgen.com',
    title: 'Allied Lead Gen - Real Estate Lead Generation',
    description: 'Generate motivated seller leads for your real estate wholesaling business. Cost-effective, nationwide lead generation services.',
    siteName: 'Allied Lead Gen',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Allied Lead Gen - Real Estate Lead Generation',
    description: 'Generate motivated seller leads for your real estate wholesaling business. Cost-effective, nationwide lead generation services.',
    creator: '@alliedleadgen',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-inter antialiased bg-white tracking-tight`}>
        <div className="flex min-h-screen flex-col overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
