import React from 'react';

export default function Services() {
  return (
    <section id="services" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
            Our Packages
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Custom Landing Pages */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold">Custom Landing Pages</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$250</span>
                <span className="text-gray-600">/each</span>
              </div>
              <p className="mb-6 text-gray-600">
                Get a professionally designed, high-converting landing page tailored to your brand.
              </p>
              <a
                href="#get-started"
                className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>

            {/* Google PPC Package */}
            <div className="rounded-lg border-2 border-blue-600 bg-white p-8 shadow-xl">
              <div className="mb-4">
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  Most Popular
                </span>
              </div>
              <h3 className="mb-4 text-2xl font-bold">Google PPC Package</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$1,500</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="mb-6 text-gray-600">
                Drive quality leads with our Google PPC campaigns.
              </p>
              <a
                href="#get-started"
                className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>

            {/* Google + Facebook PPC Package */}
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
              <h3 className="mb-4 text-2xl font-bold">Google + Facebook PPC Package</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-blue-600">$2,200</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="mb-6 text-gray-600">
                Expand your reach with integrated Google and Facebook ads.
              </p>
              <a
                href="#get-started"
                className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white hover:bg-blue-700"
              >
                Get Started
              </a>
            </div>
          </div>

          {/* Discounts */}
          <div className="mt-12 rounded-lg bg-gray-50 p-8">
            <h3 className="mb-6 text-xl font-semibold">Available Discounts</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-4 shadow">
                <span className="text-2xl font-bold text-blue-600">30% OFF</span>
                <p className="text-gray-600">Annual Payment</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow">
                <span className="text-2xl font-bold text-blue-600">20% OFF</span>
                <p className="text-gray-600">6-Month Payment</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow">
                <span className="text-2xl font-bold text-blue-600">15% OFF</span>
                <p className="text-gray-600">3-Month Payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 