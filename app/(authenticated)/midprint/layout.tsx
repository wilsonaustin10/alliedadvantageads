'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/midprint', label: 'Performance' },
  { href: '/midprint/research', label: 'Research' },
];

export default function MidPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold">Allied Advantage Ads</h2>
              <span className="text-sm text-gray-500">MidPrint Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/home-portal" className="text-sm text-gray-600 transition hover:text-gray-900">
                Back to Portal
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="border-b bg-white">
        <div className="container mx-auto flex items-center gap-6 px-4">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/midprint' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-4 text-sm font-medium transition ${
                  isActive
                    ? 'text-blue-600 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-blue-600 after:content-[""]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}
