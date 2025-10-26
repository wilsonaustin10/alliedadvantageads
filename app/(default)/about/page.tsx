import Link from 'next/link'

export const metadata = {
  title: 'About Allied Advantage Ads | Real Estate Lead Generation Experts',
  description:
    'Discover how Allied Advantage Ads helps real estate wholesalers win higher-quality leads with AI-driven campaigns and transparent pricing.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="pt-20" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-700">
            Built by wholesalers for wholesalers
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900">
            About Allied Advantage Ads
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We are an execution-first marketing partner focused on giving real estate wholesalers reliable, conversion-ready leads without the agency markup.
          </p>
        </div>

        <div className="space-y-12 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Rooted in the wholesaling grind</h2>
            <p>
              Allied Advantage Ads was born from founders who spent years on the phones sourcing off-market properties and negotiating with motivated sellers. We know the daily pressure of keeping a pipeline full, navigating tight margins, and turning every conversation into a deal.
            </p>
            <p>
              That firsthand experience shaped our obsession with marketing systems that actually deliver closable opportunities. We built Allied to be the partner we wished existed when we were building our own wholesaling teams.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why we walked away from pay-per-lead promises</h2>
            <p>
              After years of testing pay-per-lead services and outsourcing to traditional agencies, we kept hitting the same wall: recycled data, overpriced retainers, and lead quality that tanked our acquisition KPIs. Every vendor sold the dream of predictable deals, yet we were the ones left explaining missed revenue targets to our teams.
            </p>
            <p>
              That frustration pushed us to take control. We decided that the only way to scale with confidence was to own the data, the messaging, and the optimization loop from end to end.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The AI-driven shift</h2>
            <p>
              Our team rebuilt every campaign around real-time market signals and machine learning. By pairing high-intent search and social data with AI-assisted creative, we deliver messaging tailored to the seller&apos;s urgency, situation, and location.
            </p>
            <p>
              Instead of waiting on monthly agency reports, we iterate daily—testing copy, landing page flows, and audience segments automatically. That speed gives our clients a genuine competitive advantage in markets where response time makes or breaks the deal.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Performance we stand behind</h2>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6">
              <p>
                Across the campaigns we manage, wholesalers have seen a 45% decrease in cost per lead, doubled appointment rates, and a steady flow of motivated sellers who show up ready to talk numbers. We built Allied Advantage Ads to be a revenue engine—not a line item you have to justify every quarter.
              </p>
            </div>
            <p>
              With transparent dashboards and direct integration to your sales workflows, every marketing dollar is tied to measurable outcomes. We stay in the trenches with you, optimizing until the deals close.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Committed to accessible, high-quality leads</h2>
            <p>
              Quality lead generation shouldn&apos;t be reserved for enterprise budgets. We price our campaigns to make premium marketing accessible to growth-minded wholesalers, whether you&apos;re closing a few deals a month or scaling into new markets.
            </p>
            <p>
              Our promise is simple: deliver consistent, high-intent seller conversations that justify the spend and fuel sustainable growth for your acquisitions team.
            </p>
          </section>
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/#consultation"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Book a strategy session
          </Link>
          <Link
            href="/"
            className="text-base font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Explore our services
          </Link>
        </div>
      </div>
    </div>
  )
}
