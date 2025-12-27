import Link from 'next/link'

export const metadata = {
  title: 'About Allied Advantage | Google Ads for Serious Wholesalers',
  description:
    'We build and manage high-converting Google Ads campaigns exclusively for established real estate wholesalers. Market exclusivity, contract-to-click tracking, and a specialist partner who understands motivated seller deals.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-gray-900 px-4 py-1 text-sm font-semibold text-white">
            For Established Wholesalers Only
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            We're Not Another Agency. We're Your Deal Flow Partner.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Allied Advantage builds and manages motivated seller campaigns for wholesalers who are already closing deals and ready to scale predictably.
          </p>
        </div>

        <div className="space-y-12 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Built by wholesalers, for wholesalers</h2>
            <p>
              Allied Advantage was founded by operators who spent years on the phones sourcing off-market properties and negotiating with motivated sellers. We know the difference between a "lead" and an actual deal opportunity. We understand assignment fees, spreads, and the reality of motivated seller acquisition.
            </p>
            <p>
              That firsthand experience shaped everything we build. We're not a generic PPC agency that treats wholesaling like any other vertical. We're specialists who speak your language and optimize for the metrics that actually matter: cost per contract and profit per deal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why we're selective about who we work with</h2>
            <p>
              We have limited availability per market. That's not a marketing gimmick—it's how we protect your investment and ensure we can deliver results. When you work with us, we're fully committed to your success in that territory.
            </p>
            <p>
              This means we're picky. We work best with wholesalers who are already closing deals consistently and investing at least $3k/mo in marketing. If you're brand new or looking for cheap leads, we're not the right fit. But if you're serious about building a predictable deal flow machine, we should talk.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Wholesaler Deal Flow System</h2>
            <p>
              Our system isn't just "Google Ads management." It's a complete motivated seller acquisition engine built on data from thousands of successful wholesaler campaigns:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>AI-trained campaigns</strong> that know which keywords actually convert to contracts</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>2,000+ negative keywords</strong> that block junk traffic and protect your ad spend</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>High-converting landing pages</strong> designed specifically for motivated sellers</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span><strong>Contract-to-click tracking</strong> so you know your true cost per deal</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Results our partners see</h2>
            <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <p className="mb-4">
                Here's what one of our Southern California partners achieved in 60 days:
              </p>
              <ul className="space-y-2 text-gray-800">
                <li><strong>Cost per contract:</strong> $2,500 → $1,162 (53% lower)</li>
                <li><strong>Closed contracts:</strong> 2-4/mo → 6-8/mo (2x more)</li>
                <li><strong>Monthly revenue:</strong> $26k avg → $57k avg (119% growth)</li>
              </ul>
            </div>
            <p>
              We focus on qualified motivated sellers who are actually ready to sell—not tire-kickers looking for retail agents or people who clicked by accident. With transparent dashboards and full attribution from click to contract, every marketing dollar is tied to measurable outcomes.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Flat monthly pricing that doesn't punish growth</h2>
            <p>
              Most agencies tie their fees to your ad spend—meaning you pay more every time you scale. We believe growth should reward you, not penalize you. Our flat monthly fee stays the same whether you're spending $3k or $30k on ads.
            </p>
            <p>
              No percentage of ad spend. No hidden fees. Just predictable pricing for a system that delivers predictable deal flow.
            </p>
          </section>
        </div>

        <div className="mt-16 rounded-2xl bg-gray-900 p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            We only onboard a handful of partners each month. If you're already closing deals and serious about scaling, book a strategy session to see if we have capacity in your market.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#application-form"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Book A Strategy Session
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/"
              className="text-base font-semibold text-gray-300 transition hover:text-white"
            >
              Learn more about our system →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
