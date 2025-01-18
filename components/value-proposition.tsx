import React from 'react';

export default function ValueProposition() {
  return (
    <section id="about" className="relative bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center">
          <h2 className="mb-12 text-3xl font-bold text-gray-900 md:text-4xl">
            Why Choose Allied Advantage Ads?
          </h2>
          
          <div className="grid gap-8 sm:grid-cols-3">
            {/* Proprietary Strategy */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Proprietary Strategy</h3>
              <p className="text-gray-600">
                Our unique lead generation approach delivers consistent results for real estate wholesalers
              </p>
            </div>

            {/* Lead Cost */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">$18 Average Lead Cost</h3>
              <p className="text-gray-600">
                Nationwide lead generation at competitive prices*
              </p>
              <p className="mt-2 text-xs text-gray-500">*Results not guaranteed</p>
            </div>

            {/* Custom Landing Pages */}
            <div className="rounded-lg bg-white p-6 shadow-lg">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mx-auto">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Custom Landing Pages</h3>
              <p className="text-gray-600">
                Professionally designed, high-converting pages tailored to your brand
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 