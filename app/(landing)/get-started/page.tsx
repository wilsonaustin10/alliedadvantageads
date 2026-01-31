export const metadata = {
  title: 'Get Started — Google Ads for Wholesalers',
  description:
    'Done-for-you Google Ads campaigns built by a wholesaler, for wholesalers. One specialist partner per market. Book a strategy call.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Allied Advantage Ads — Google Ads That Close Contracts',
    description:
      'We help wholesalers turn Google Ads into signed contracts — not just leads. Built by a wholesaler, for wholesalers.',
  },
}

/* ---------- inline style tokens (Tailwind can't do these) ---------- */
const gradientText =
  'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
const btnPrimary =
  'inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200'

export default function GetStartedPage() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">
      {/* ============================== NAV ============================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="https://alliedadvantage.co" className="flex items-center gap-2" aria-label="Allied Advantage Ads">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://alliedadvantage.co/_next/image?url=%2FAAA%20Master%20Logo.png&w=256&q=75"
              alt="Allied Advantage Ads"
              width={140}
              height={47}
              className="object-contain brightness-0 invert"
            />
          </a>
          <a href="#booking" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200">
            Book a Strategy Call
          </a>
        </div>
      </nav>
      {/* ============================== HERO ============================== */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute top-[400px] right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-600/[0.08] to-transparent rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-14 items-center">
            {/* Left — Copy */}
            <div className="lg:col-span-2 text-center lg:text-left" data-aos="fade-right">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                For Established Wholesalers
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-5">
                We Help Wholesalers Turn{' '}
                <span className={gradientText}>Google&nbsp;Ads</span> Into
                Signed Contracts&nbsp;— Not Just Leads
              </h1>

              <p className="text-lg md:text-xl text-gray-400 mb-8 leading-relaxed">
                Built by a wholesaler, for wholesalers. One specialist partner per
                market.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 lg:justify-start justify-center">
                <a href="#booking" className={btnPrimary}>
                  Book a 15-Minute Strategy Call
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                No commitment. No pitch deck. Just a strategy conversation.
              </p>
            </div>

            {/* Right — Video */}
            <div className="lg:col-span-3" data-aos="fade-left" data-aos-delay="150">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/10 bg-gray-900">
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/0jUQf0cS7L0?rel=0&modestbranding=1"
                    title="Allied Advantage — How We Help Wholesalers Scale with Google Ads"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <div className="bg-gray-900 px-4 py-3 text-center border-t border-white/5">
                  <p className="text-gray-400 text-sm">
                    <span className="text-white font-medium">Watch:</span> How we
                    generate predictable deals for wholesalers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 pt-10 border-t border-white/5" data-aos="fade-up" data-aos-delay="200">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              {[
                { value: '53%', label: 'Lower Cost Per Contract' },
                { value: '2x', label: 'More Deals Closed' },
                { value: '48h', label: 'Campaign Launch' },
                { value: '10x', label: 'ROAS Achieved' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className={`text-3xl md:text-4xl font-bold ${gradientText}`}>
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== PROBLEM / AGITATION ====================== */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              The Problem
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Most Google Ads agencies optimize for{' '}
              <span className="text-gray-500">leads</span>.
              <br className="hidden md:block" />
              We optimize for <span className={gradientText}>contracts</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'Broad Match Bleeding Money',
                body: "Generic agencies run broad match campaigns that attract tire-kickers, agents, and people who will never sell. Your ad spend disappears into clicks that never become contracts.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: 'Generic Landing Pages',
                body: "Cookie-cutter landing pages that weren't built for motivated sellers. Low conversion rates mean you're paying more per lead — and the leads you do get aren't motivated.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                ),
                title: 'No Contract-Level Tracking',
                body: "Your agency reports \"leads\" and \"cost per lead.\" But you need cost per contract. Without that, you're flying blind — unable to scale what actually makes you money.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================= THE SYSTEM ========================= */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              Done-For-You System
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              The Wholesaler <span className={gradientText}>Deal&nbsp;Flow</span>{' '}
              System
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Custom Google Ads campaigns, high-converting landing pages, and an AI
              voice agent that pre-qualifies every lead — before it hits your phone.
            </p>
          </div>

          {/* 4-Step Flow */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-3 mb-14" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                step: 1,
                title: 'Google Ads',
                desc: 'AI-trained campaigns targeting motivated sellers',
                gradient: 'from-blue-600 to-blue-700',
                shadow: 'shadow-blue-600/20',
                color: 'text-blue-400',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                ),
                connector: true,
              },
              {
                step: 2,
                title: 'Custom Landing Page',
                desc: 'High-converting pages built for motivated sellers',
                gradient: 'from-blue-600 to-purple-600',
                shadow: 'shadow-purple-600/20',
                color: 'text-purple-400',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                connector: true,
              },
              {
                step: 3,
                title: 'AI Pre-Qualification',
                desc: 'AI voice agent screens every lead automatically',
                gradient: 'from-purple-600 to-purple-700',
                shadow: 'shadow-purple-600/20',
                color: 'text-purple-400',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                connector: true,
              },
              {
                step: 4,
                title: 'Qualified Seller Calls You',
                desc: 'Only motivated sellers reach your phone',
                gradient: 'from-emerald-500 to-emerald-600',
                shadow: 'shadow-emerald-600/20',
                color: 'text-emerald-400',
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                ),
                connector: false,
              },
            ].map((s) => (
              <div key={s.step} className="text-center relative">
                <div
                  className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 shadow-lg ${s.shadow}`}
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {s.icon}
                  </svg>
                </div>
                <div className={`text-xs font-bold ${s.color} uppercase tracking-wider mb-1`}>
                  Step {s.step}
                </div>
                <h3 className="text-base font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Differentiator */}
          <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-xl md:text-2xl font-bold text-white">
                You only talk to motivated sellers.
                <br />
                <span className={gradientText}>Our AI screens every lead first.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== PROOF / CASE STUDIES ======================== */}
      <section className="py-20 md:py-28 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              Proven Results
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
              Real Wholesalers. <span className={gradientText}>Real Contracts.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                badge: '10x ROAS',
                quote:
                  '"Within 60 days, I was able to take my business to the next level, more than doubling my monthly revenue. I now consistently generate over $50k/mo in assignment fees with an amazing 10x ROAS."',
                name: 'Caesar',
                company: 'XVR House Buyers · San Diego, CA',
                metric: '$50k+',
                metricLabel: 'per month',
              },
              {
                badge: '6 Contracts in 6 Weeks',
                quote:
                  '"My team had been running Google Ads for two years with mediocre results. In my first 6 weeks with Allied, I locked up 6 contracts and closed a $52k deal."',
                name: 'Daniel',
                company: 'MPP Properties · Denver, CO',
                metric: '$52k',
                metricLabel: 'single deal',
              },
              {
                badge: '6-Figure Months',
                quote:
                  '"After partnering with Allied, I was able to spend more time on high-quality leads and generate over 6-figures in assignment fees every month."',
                name: 'Taylor',
                company: 'Great Stone Homebuyers · Houston, TX',
                metric: '$100k+',
                metricLabel: 'per month',
              },
            ].map((cs) => (
              <div
                key={cs.name}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all"
              >
                <div className="flex items-center gap-2 mb-5">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {cs.badge}
                  </span>
                </div>
                <blockquote className="text-gray-300 text-sm leading-relaxed mb-6">
                  {cs.quote}
                </blockquote>
                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{cs.name}</p>
                    <p className="text-gray-500 text-xs">{cs.company}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-extrabold ${gradientText}`}>{cs.metric}</p>
                    <p className="text-gray-500 text-xs">{cs.metricLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== ABOUT AUSTIN ========================== */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900 pointer-events-none" aria-hidden="true" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div data-aos="fade-up">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Photo placeholder */}
                <div className="shrink-0">
                  {/* TODO: Add Austin's headshot - download from LinkedIn or use provided photo */}
                  {/* Replace the placeholder div below with:
                      <Image
                        src="/images/austin-wilson.jpg"
                        alt="Austin Wilson"
                        width={160}
                        height={160}
                        className="rounded-2xl object-cover"
                      />
                  */}
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-[10px] text-gray-600 font-medium">Photo</span>
                    </div>
                  </div>
                </div>

                {/* Copy */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    Hey — I&apos;m <span className={gradientText}>Austin Wilson</span>.
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-3">
                    I&apos;m a wholesaler too — not just someone selling you ads. I
                    understand the difference between a lead and a signed contract
                    because I close deals myself.
                  </p>
                  <p className="text-gray-400 leading-relaxed">
                    Allied Advantage was built for operators like us. Every campaign,
                    every landing page, every optimization comes from someone who
                    actually knows what it takes to get a seller under contract.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WHO THIS IS FOR / NOT FOR ==================== */}
      <section className="py-20 md:py-28 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
              Is This a <span className={gradientText}>Fit</span> for You?
            </h2>
            <p className="text-gray-400 mt-3 text-lg">
              We&apos;re selective about who we work with. Here&apos;s how to know.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6" data-aos="fade-up" data-aos-delay="100">
            {/* This IS for you */}
            <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-emerald-400">This is for you if…</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "You're already closing deals and want a more predictable pipeline",
                  "You're investing at least $3k/mo in marketing",
                  'You want cost-per-contract tracking, not vanity metrics',
                  'You want a specialist partner — not a generic agency',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* This is NOT for you */}
            <div className="bg-red-500/[0.03] border border-red-500/[0.15] rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-red-400">This is not for you if…</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "You're brand new to wholesaling and haven't closed a deal yet",
                  "You're looking for \"cheap leads\" or free advice",
                  "You're not ready to invest seriously in marketing",
                  'You want a generic agency, not a specialist partner',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500/60 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-gray-400 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== MARKET EXCLUSIVITY ====================== */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center" data-aos="fade-up">
          <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 md:p-12">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
              One Partner Per Market.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              We only partner with one wholesaler per core market. This isn&apos;t a
              scalable agency model — it&apos;s an exclusive partnership. When your
              market is taken, it&apos;s taken.
            </p>
            <a href="#booking" className={btnPrimary}>
              Check If Your Market Is Available
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ========================= BOOKING CTA ========================= */}
      <section id="booking" className="py-20 md:py-28 relative bg-gray-900/50">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/[0.08] to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Ready to Stop Paying for Leads
              <br className="hidden md:block" />
              <span className={gradientText}>That Don&apos;t Close?</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Book a 15-minute strategy call. We&apos;ll look at your market, your
              numbers, and tell you honestly whether we can help.
            </p>

            {/* Booking embed placeholder */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-12 mb-8">
              {/* TODO: Replace with Calendly inline widget or GHL booking embed */}
              <div className="py-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Book Your Strategy Call</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Pick a time that works for you. 15 minutes. No obligation.
                </p>
                {/* TODO: Replace href with actual Calendly/booking link */}
                <a
                  href="https://alliedadvantage.co/qualify"
                  className={btnPrimary}
                >
                  Book a 15-Minute Strategy Call
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span>Limited spots available — one partner per market</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FOOTER ============================== */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://alliedadvantage.co/_next/image?url=%2FAAA%20Master%20Logo.png&w=256&q=75"
                alt="Allied Advantage Ads"
                width={100}
                height={33}
                className="object-contain brightness-0 invert opacity-50"
              />
            </div>
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Allied Advantage Ads. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
