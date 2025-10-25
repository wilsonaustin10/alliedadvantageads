import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Top area */}
        <div className="grid gap-8 py-8 md:grid-cols-12 md:py-12">
          {/* Logo */}
          <div className="md:col-span-4">
            <Link href="/" className="mb-2 inline-block" aria-label="Allied Advantage Ads">
              <Image
                src="/AAA Logo.png"
                width={150}
                height={60}
                alt="Allied Advantage Ads"
                className="object-contain brightness-0 invert"
              />
            </Link>
            <div className="text-sm text-gray-400">
              Empowering real estate wholesalers with cost-effective, nationwide lead generation.
            </div>
          </div>

          {/* Navigation */}
          <div className="grid gap-8 sm:grid-cols-3 md:col-span-8">
            {/* 1st block */}
            <div className="text-sm">
              <h6 className="mb-3 text-gray-200">Company</h6>
              <ul>
                <li className="mb-1">
                  <Link href="#about" className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out">
                    About Us
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="#contact" className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* 2nd block */}
            <div className="text-sm">
              <h6 className="mb-3 text-gray-200">Services</h6>
              <ul>
                <li className="mb-1">
                  <Link href="#services" className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out">
                    Google Ads Management
                  </Link>
                </li>
              </ul>
            </div>

            {/* 3rd block */}
            <div className="text-sm">
              <h6 className="mb-3 text-gray-200">Legal</h6>
              <ul>
                <li className="mb-1">
                  <Link href="/terms" className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out">
                    Terms & Conditions
                  </Link>
                </li>
                <li className="mb-1">
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-gray-100 transition duration-150 ease-in-out">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="border-t border-gray-800 py-4 md:py-6">
          <div className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} Allied Advantage Ads. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
