"use client";

import { useState } from 'react'
import Link from 'next/link'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        className="text-gray-500 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
      >
        <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
          {isOpen ? (
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
            />
          ) : (
            <path
              fillRule="evenodd"
              d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
            />
          )}
        </svg>
      </button>

      {/* Mobile navigation */}
      {isOpen && (
        <div className="absolute left-0 top-full z-20 w-full bg-white px-4 py-2 shadow-lg">
          <ul className="space-y-2">
            <li>
              <Link
                href="#services"
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href="#faq"
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/signin"
                className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </li>
            <li>
              <Link
                href="#consultation-form"
                className="mt-2 block rounded bg-blue-600 px-4 py-2 text-center text-sm text-white hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
} 