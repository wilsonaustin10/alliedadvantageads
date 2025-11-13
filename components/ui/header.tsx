"use client";

import Link from 'next/link'
import Image from 'next/image'
import MobileMenu from '@/components/ui/mobile-menu'

export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Link href="/" className="block" aria-label="Allied Advantage Ads">
              <Image
                src="/AAA Marquee.png"
                width={180}
                height={60}
                alt="Allied Advantage Ads"
                priority
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop menu links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="#services"
                  className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  FAQ
                </Link>
              </li>
            </ul>

            {/* Desktop CTA */}
            <ul className="flex justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/signin"
                  className="text-gray-600 hover:text-gray-900 px-3 lg:px-5 py-2 flex items-center transition duration-150 ease-in-out"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="#consultation-form"
                  className="btn-sm text-white bg-blue-600 hover:bg-blue-700 ml-3 shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </nav>

          {/* Mobile menu */}
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
