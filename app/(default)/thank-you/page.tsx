export const metadata = {
  title: 'Thank You - Allied Advantage',
  description: 'Your download is on the way. See if you qualify for our Wholesaler Deal Flow System.',
}

import Link from 'next/link'

export default function ThankYou() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Success indicator */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your Playbook Is On The Way
            </div>
          </div>

          {/* Tripwire Offer */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 md:p-10 mb-10 relative overflow-hidden">
            {/* Corner ribbon */}
            <div className="absolute -top-1 -right-1">
              <div className="bg-red-500 text-white text-xs font-bold px-8 py-1 transform rotate-45 translate-x-6 translate-y-3">
                LIMITED
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
                One-Time Offer
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3">
                The $12,000 Negative Keyword Vault
              </h2>

              <p className="text-lg text-gray-700 mb-6 max-w-xl mx-auto">
                Stop paying for clicks that will <span className="font-semibold">never</span> turn into contracts. Get our complete list of <span className="font-bold text-amber-700">2,000+ battle-tested negative keywords</span> that block junk traffic and protect your ad spend.
              </p>

              {/* Value stack */}
              <div className="bg-white rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">What's Inside:</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>2,000+ negative keywords</strong> organized by category</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Copy-paste ready</strong> for Google Ads import</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Blocks tire-kickers</strong>, agents, job seekers & more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700"><strong>Saves $12,000+/year</strong> in wasted ad spend (avg.)</span>
                  </li>
                </ul>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl text-gray-400 line-through">$97</span>
                  <span className="text-5xl font-extrabold text-gray-900">$7</span>
                </div>
                <p className="text-sm text-gray-500">One-time payment. Instant access. No subscription.</p>
              </div>

              {/* CTA */}
              <a
                href="https://buy.stripe.com/8x24gs79Z0iS0WLgo7cV20j"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Get Instant Access for $7
              </a>

              <p className="mt-4 text-xs text-gray-500">
                Secure checkout powered by Stripe. Download link delivered instantly.
              </p>
            </div>
          </div>

          {/* Main content card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-4">Or, if you're ready to go bigger...</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">
              Want Us to Build This System{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                For You?
              </span>
            </h2>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We only partner with a few wholesalers per market. Click below to see if you qualify for our Wholesaler Deal Flow System.
            </p>

            {/* CTA Button */}
            <Link
              href="/#application-form"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            >
              Check Availability & See If You Qualify
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            {/* Microcopy */}
            <p className="mt-6 text-gray-500 max-w-lg mx-auto">
              If we have capacity in your market and you meet our criteria, you'll be able to book a Deal Flow Strategy Session.
            </p>
          </div>

          {/* What to expect */}
          <div className="mt-12 bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">
              What Happens Next
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Check Your Email</h3>
                <p className="text-sm text-gray-600">
                  Your Motivated Seller Deal Flow Playbook is on its way to your inbox.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <span className="text-blue-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Review the Playbook</h3>
                <p className="text-sm text-gray-600">
                  Learn our 5-step system for turning Google Ads into consistent contracts.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                  <span className="text-blue-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Apply If Ready</h3>
                <p className="text-sm text-gray-600">
                  If you're closing deals and ready to scale, apply to see if we have capacity.
                </p>
              </div>
            </div>
          </div>

          {/* Who this is for reminder */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Best suited for:</span> Wholesalers already closing deals and investing $2k+/mo in marketing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
