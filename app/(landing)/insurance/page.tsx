import styles from './insurance.module.css'

export const metadata = {
  title: 'AI Operations Agent for Insurance Agencies',
  description:
    "Your agency's AI operations agent — handles renewals, cert requests, client follow-up, inbox triage, and quoting follow-up 24/7. Save 20+ hours per week. Built by Allied Advantage.",
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Allied Advantage — Your Agency\'s AI Operations Agent',
    description:
      'Stop drowning in admin. Your AI operations agent handles renewals, certificates, follow-ups, and client communication around the clock — so your producers can sell.',
    type: 'website',
    url: 'https://alliedadvantage.co/insurance',
  },
}

/* ---------- Reusable style tokens ---------- */
const gradientText =
  'bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent'
const btnPrimary =
  'inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold rounded-full shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200'
const btnOutline =
  'inline-flex items-center gap-2 border border-purple-600/40 text-gray-300 font-semibold rounded-full hover:bg-purple-600/10 hover:border-purple-600/60 hover:-translate-y-px transition-all duration-200'

/* ---------- Reusable SVG icons ---------- */
const CheckIcon = ({ className = 'w-5 h-5 text-blue-400' }: { className?: string }) => (
  <svg className={`${className} shrink-0 mt-0.5`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const ArrowIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

const FiveStars = () => (
  <div className="flex items-center gap-1 mb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} />
    ))}
  </div>
)

export default function InsuranceLandingPage() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">
      {/* ============================== NAV ============================== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <a href="https://alliedadvantage.co" className="flex items-center gap-2" aria-label="Allied Advantage">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/AA White Logo 200x60.png"
              alt="Allied Advantage"
              width={140}
              height={47}
              className="object-contain"
            />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="#pricing"
              className="hidden sm:inline-flex text-gray-400 hover:text-white text-sm font-medium transition-colors px-3 py-2"
            >
              Pricing
            </a>
            <a href="#booking" className={`${btnPrimary} text-sm px-5 py-2.5`}>
              Schedule a Demo
            </a>
          </div>
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Built for Independent Insurance Agencies
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
            Stop Drowning in Admin.
            <br />
            <span className={gradientText}>Start Closing.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed max-w-2xl mx-auto">
            Your agency&apos;s AI operations agent handles renewals, cert requests, client follow-up,
            inbox triage, and quoting follow-up — 24/7. So your producers can focus on selling.
          </p>

          <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
            Not a chatbot. Not another SaaS tool you&apos;ll never use. A persistent AI team member
            trained on how your agency actually works.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#booking" className={`${btnPrimary} px-8 py-4 text-lg`}>
              Schedule a Demo
              <ArrowIcon />
            </a>
            <a href="#how-it-works" className={`${btnOutline} px-8 py-4 text-lg`}>
              See How It Works
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            30 minutes. No pressure. Just a conversation about your operations.
          </p>

          {/* Stats bar */}
          <div className="mt-16 pt-10 border-t border-white/5" data-aos="fade-up">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
              {[
                { value: '20+', label: 'Hours Saved / Week' },
                { value: '24/7', label: 'Always Running' },
                { value: '4 wk', label: 'Discovery to Go-Live' },
                { value: '90d', label: 'Performance Guarantee' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className={`text-3xl md:text-4xl font-bold ${gradientText}`}>{stat.value}</div>
                  <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================== PROBLEM ============================== */}
      <section className="py-20 md:py-28 relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              The Problem
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Your Producers Should Be <span className={gradientText}>Selling</span>.
              <br className="hidden md:block" />
              Not Chasing Paperwork.
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              84% of agency staff time goes to administrative tasks. That&apos;s not an operations
              problem — it&apos;s a revenue problem.
            </p>
          </div>

          {/* Pain point cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                title: 'Renewal Follow-Up',
                body: "Hundreds of renewals tracked with sticky notes and spreadsheets. Policies slip through the cracks. Clients don't hear from you until it's too late.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                title: 'Certificate Requests',
                body: '50 to 200 cert requests a month — every single one a manual email chain. Your CSRs spend hours on work that should take seconds.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                title: 'Inbox Chaos',
                body: "Client inquiries, carrier notices, endorsement requests, claims questions — all buried in the same overflowing inbox. Nothing gets routed. Everything waits.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'Quoting Follow-Up',
                body: "80% of quoted leads never get a follow-up call. That's revenue walking out the door because your team is too buried in admin to pick up the phone.",
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                title: 'After-Hours Dead Zone',
                body: 'A client calls about a claim at 10 PM and gets voicemail. A prospect requests a quote on Saturday and hears back Monday. In insurance, that delay costs you the account.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                ),
                title: 'The Hiring Trap',
                body: 'You need more CSRs, but good ones cost $45K+ and take months to train. And when they leave, their knowledge walks out the door with them.',
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
                <h3 className="text-base font-bold text-white mb-1.5">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* The math */}
          <div data-aos="fade-up">
            <div className="bg-gradient-to-r from-red-600/10 to-orange-600/10 border border-red-500/20 rounded-2xl p-8 text-center max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl font-bold text-white mb-3">
                Every hour your producers spend on admin is an hour they&apos;re not selling.
              </p>
              <p className="text-gray-400 text-sm max-w-lg mx-auto">
                At $3K/mo, your AI agent costs less than a part-time CSR — and it works nights,
                weekends, and holidays. No PTO. No turnover. No training ramp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== WHAT YOU GET ============================== */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              What You Get
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              An AI Operations Agent
              <br className="hidden md:block" />
              <span className={gradientText}>Built for Insurance</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Not a generic chatbot. A purpose-built agent that understands renewals, certs,
              endorsements, carriers, and the daily reality of running an agency.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                ),
                iconGradient: 'from-blue-600/20 to-blue-600/10',
                iconColor: 'text-blue-400',
                title: 'Renewal Automation',
                body: 'Automated renewal follow-up sequences that start 90 days out. Personalized emails, reminders, and escalation — no policy slips through the cracks.',
                delay: 100,
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                ),
                iconGradient: 'from-blue-600/20 to-purple-600/10',
                iconColor: 'text-blue-400',
                title: 'Certificate Requests',
                body: 'AI handles inbound cert requests — parsing the request, pulling policy data, and drafting the certificate. What took 15 minutes now takes seconds.',
                delay: 200,
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                ),
                iconGradient: 'from-purple-600/20 to-purple-600/10',
                iconColor: 'text-purple-400',
                title: 'Inbox Triage',
                body: 'Every inbound email categorized, prioritized, and routed to the right person. Carrier notices flagged. Client requests queued. Morning digest delivered before you open your laptop.',
                delay: 300,
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                iconGradient: 'from-purple-600/20 to-blue-600/10',
                iconColor: 'text-purple-400',
                title: 'Quoting Follow-Up',
                body: 'Every quoted prospect gets a personalized follow-up sequence. Timed nudges, objection handling, and warm handoffs to your producers when the lead is ready to close.',
                delay: 400,
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                ),
                iconGradient: 'from-blue-600/20 to-blue-600/10',
                iconColor: 'text-blue-400',
                title: 'AI Receptionist',
                body: 'Voice AI answers calls 24/7. Qualifies new prospects, handles basic inquiries, takes messages with context, and routes urgent calls to the right person — even at 10 PM.',
                delay: 500,
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                ),
                iconGradient: 'from-emerald-600/20 to-emerald-600/10',
                iconColor: 'text-emerald-400',
                title: 'Daily Briefing',
                body: 'Start every morning with a summary: upcoming renewals, pending follow-ups, new inquiries overnight, and what needs your attention today. Delivered to your inbox before 8 AM.',
                delay: 600,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group"
                data-aos="fade-up"
                data-aos-delay={card.delay}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconGradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}
                >
                  <svg className={`w-6 h-6 ${card.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {card.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>

          {/* Comparison table */}
          <div className="mt-16" data-aos="fade-up">
            <div className="text-center mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                Not Another Tool to Learn.{' '}
                <span className="text-gray-500">A Team Member That Works.</span>
              </h3>
              <p className="text-gray-500 text-sm">Your AMS stores data. Your AI agent acts on it.</p>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className={`${styles.comparisonTable} w-full text-sm`}>
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="text-gray-400 font-semibold text-xs uppercase tracking-wider py-4 px-5">
                        What You Need
                      </th>
                      <th className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4 px-5">
                        Your AMS Alone
                      </th>
                      <th className="font-semibold text-xs uppercase tracking-wider py-4 px-5">
                        <span className={gradientText}>With AI Agent</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        need: 'Renewal tracking',
                        ams: 'Static list you check manually',
                        agent: 'Auto-sequences starting 90 days out',
                      },
                      {
                        need: 'Cert requests',
                        ams: 'CSR processes each one manually',
                        agent: 'Parsed, drafted, and queued in seconds',
                      },
                      {
                        need: 'Quote follow-up',
                        ams: 'If someone remembers',
                        agent: 'Every lead followed up, every time',
                      },
                      {
                        need: 'After-hours coverage',
                        ams: 'Voicemail',
                        agent: 'AI receptionist answers 24/7',
                      },
                      {
                        need: 'Client communication',
                        ams: 'Manual email, one at a time',
                        agent: 'Personalized at scale, in your voice',
                      },
                      {
                        need: 'Institutional knowledge',
                        ams: 'Leaves when your CSR does',
                        agent: 'Persistent memory, always improving',
                      },
                    ].map((row, i) => (
                      <tr key={row.need} className={i % 2 === 1 ? 'bg-white/[0.01]' : ''}>
                        <td className="text-gray-300 py-3.5 px-5">{row.need}</td>
                        <td className="text-gray-500 py-3.5 px-5">{row.ams}</td>
                        <td className="text-gray-200 py-3.5 px-5 font-medium">{row.agent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== THE GUARANTEE ============================== */}
      <section className="py-20 md:py-28 relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div data-aos="fade-up">
            <div className="bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-3xl p-10 md:p-14 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>

              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
                The 20 Hours Back Guarantee
              </div>

              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4 text-white">
                Save 20 Hours Per Week in 90 Days.
                <br />
                <span className={gradientText}>Or We Work Free Until You Do.</span>
              </h2>

              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                We don&apos;t ask you to &ldquo;trust the process.&rdquo; We measure it. Your AI agent
                logs every task it handles, every minute it saves. If we don&apos;t hit 20 hours per
                week within 90 days, we keep working at no cost until we do.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                {[
                  { value: '20 hrs/wk', label: 'Minimum time saved' },
                  { value: '90 days', label: 'To prove value' },
                  { value: 'No risk', label: 'We eat the downside' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-2xl font-extrabold text-white mb-1">{item.value}</div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== HOW IT WORKS ============================== */}
      <section id="how-it-works" className="py-20 md:py-28 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              How It Works
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Live in 4 Weeks.
              <br />
              <span className={gradientText}>Saving Time in Week 5.</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              No 6-month implementation. No committee approvals. A focused process designed for
              agencies that move fast.
            </p>
          </div>

          {/* Timeline */}
          <div className="grid md:grid-cols-4 gap-6 md:gap-3" data-aos="fade-up" data-aos-delay="100">
            {/* Step 1 */}
            <div className={`${styles.stepConnector} text-center`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
                <span className="text-xl font-extrabold text-white">1</span>
              </div>
              <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Week 1</div>
              <h3 className="text-base font-bold text-white mb-2">Discovery Call</h3>
              <p className="text-sm text-gray-500">
                We audit your top time-wasting workflows, map your tech stack, and identify quick wins.
                You talk, we listen.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`${styles.stepConnector} text-center`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
                <span className="text-xl font-extrabold text-white">2</span>
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">
                Weeks 2–3
              </div>
              <h3 className="text-base font-bold text-white mb-2">We Configure Your Agent</h3>
              <p className="text-sm text-gray-500">
                We build your agent&apos;s workflows, connect to your AMS and email, and tune the voice
                and personality to match your agency.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`${styles.stepConnector} text-center`}>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
                <span className="text-xl font-extrabold text-white">3</span>
              </div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Week 4</div>
              <h3 className="text-base font-bold text-white mb-2">Agent Goes Live</h3>
              <p className="text-sm text-gray-500">
                Your agent starts handling real work — with your team in the loop for the first week.
                We monitor, refine, and optimize in real time.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Ongoing</div>
              <h3 className="text-base font-bold text-white mb-2">20+ Hours Saved / Week</h3>
              <p className="text-sm text-gray-500">
                Your agent gets smarter every week. We continuously optimize, add new workflows, and
                deliver monthly performance reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== PRICING ============================== */}
      <section id="pricing" className="py-20 md:py-28 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-16" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              Pricing
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Two Ways to <span className={gradientText}>Get Started</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Start lean with a pre-built insurance agent, or go all-in with a custom deployment
              tailored to your agency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            {/* Starter Tier */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10 hover:-translate-y-1 transition-all duration-300">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Starter</h3>
                <p className="text-gray-500 text-sm">For agencies ready to automate the basics</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white">$250</span>
                  <span className="text-gray-500 text-lg">/mo</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">Usage-based overages for high volume</p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  'Pre-built insurance operations agent',
                  'AI voice receptionist (24/7 call handling)',
                  'Automated follow-up sequences',
                  'Daily operations briefing',
                  'Email inbox triage',
                  'Standard onboarding (1 week)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#booking"
                className={`${btnOutline} font-bold px-6 py-3.5 text-base w-full justify-center`}
              >
                Get Started
                <ArrowIcon className="w-4 h-4" />
              </a>
            </div>

            {/* Custom Tier */}
            <div className="bg-white/[0.03] border border-purple-500/30 rounded-2xl p-8 md:p-10 relative shadow-[0_0_60px_-12px_rgba(147,51,234,0.15)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-1">Custom</h3>
                <p className="text-gray-500 text-sm">White-glove deployment for your agency</p>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-extrabold text-white">$3K</span>
                  <span className="text-gray-500 text-lg">/mo</span>
                </div>
                <p className="text-gray-500 text-xs mt-1">
                  $10K one-time setup fee · 4-week implementation
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {[
                  { text: 'Everything in Starter, plus:', color: 'text-purple-400' },
                  {
                    text: 'Custom AMS integration (Applied Epic, Hawksoft, EZLynx)',
                    color: 'text-purple-400',
                  },
                  {
                    text: 'Dedicated agent personality matched to your brand',
                    color: 'text-purple-400',
                  },
                  {
                    text: 'Full workflow audit + custom automation design',
                    color: 'text-purple-400',
                  },
                  { text: '4-week white-glove implementation', color: 'text-purple-400' },
                  {
                    text: 'Ongoing optimization + monthly performance reports',
                    color: 'text-purple-400',
                  },
                  { text: 'Dedicated success manager', color: 'text-purple-400' },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <CheckIcon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-gray-300 text-sm">{item.text}</span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-emerald-300 text-sm font-semibold">
                    20 Hours Back Guarantee included
                  </span>
                </li>
              </ul>

              <a
                href="#booking"
                className={`${btnPrimary} px-6 py-3.5 text-base w-full justify-center`}
              >
                Schedule a Demo
                <ArrowIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* ROI callout */}
          <div className="mt-12" data-aos="fade-up">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-gray-500 text-sm">
                <strong className="text-gray-300">The math is simple:</strong> A CSR costs $45K+/year.
                Your AI agent costs a fraction of that — and works 24/7 with zero turnover. Most
                agencies see ROI within the first month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== SOCIAL PROOF ============================== */}
      <section className="py-20 md:py-28 bg-gray-900/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              Results
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              What Agency Owners <span className={gradientText}>Are Saying</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                quote:
                  '"We were spending 3 hours a day just processing cert requests. Now the AI handles 90% of them automatically. My CSRs are finally doing work that actually matters."',
                name: 'Sarah M.',
                role: 'Agency Principal, P&C Agency · Texas',
              },
              {
                quote:
                  '"The AI receptionist alone was worth it. We were losing after-hours leads to competitors. Now every call gets answered, every prospect gets qualified, and I get a summary in the morning."',
                name: 'David R.',
                role: 'Owner, Multi-Line Agency · Florida',
              },
              {
                quote:
                  '"I was about to hire two more CSRs. Instead, I deployed the AI agent and my existing team is handling 40% more volume. The renewal retention rate alone justified the cost."',
                name: 'Mike T.',
                role: 'Managing Partner, Commercial Lines Agency · Ohio',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7">
                <FiveStars />
                <p className="text-gray-300 text-sm leading-relaxed mb-5 italic">{t.quote}</p>
                <div>
                  <p className="text-white text-sm font-bold">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-xs mt-6" data-aos="fade-up">
            Names and details changed for privacy. Case studies with verified metrics available on
            request.
          </p>
        </div>
      </section>

      {/* ============================== SECURITY & TRUST ============================== */}
      <section className="py-20 md:py-28 relative">
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none"
          aria-hidden="true"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              Security &amp; Privacy
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Your Client Data <span className={gradientText}>Stays Yours</span>
            </h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">
              Insurance agencies handle sensitive client information. We built for that from day one.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5" data-aos="fade-up" data-aos-delay="100">
            {[
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01"
                  />
                ),
                title: 'Your Infrastructure, Your Control',
                body: "Your agent runs on infrastructure you control — not a shared multi-tenant platform. Your data never sits on someone else's servers or gets mixed with other agencies' information.",
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                ),
                title: 'No Training on Your Data',
                body: 'Your client data, policy information, and agency communications are never used to train AI models. Period. Your data works for you, not for a tech company.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                ),
                title: 'Encrypted Everything',
                body: 'All credentials, API keys, and data in transit use industry-standard encryption. Nothing stored in plaintext. Nothing transmitted insecurely.',
              },
              {
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                ),
                title: 'Full Audit Trail',
                body: 'Every action your AI agent takes is logged. Complete activity records available for compliance review, E&O documentation, or your own peace of mind.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {card.icon}
                    </svg>
                  </div>
                  <h4 className="font-bold text-white text-sm">{card.title}</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== ABOUT / WHY US ============================== */}
      <section className="py-20 md:py-28 bg-gray-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14" data-aos="fade-up">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
              About
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
              Built by an Operator.
              <br />
              <span className={gradientText}>Not a Tech Company.</span>
            </h2>
          </div>

          <div data-aos="fade-up">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="shrink-0">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <svg
                        className="w-10 h-10 text-gray-600 mx-auto mb-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-[10px] text-gray-600 font-medium">Photo</span>
                    </div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">
                    <span className={gradientText}>Austin Wilson</span>, Founder
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm mb-3">
                    Enterprise software sales executive turned AI operator. Background in complex B2B
                    sales, real estate investing, and building operational systems that scale. Austin
                    doesn&apos;t just understand the tech — he understands what it&apos;s like to run a
                    business where admin eats your day alive.
                  </p>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    Allied Advantage was built with an operator&apos;s mindset: if a task is done more
                    than once, it should be automated. If it requires judgment, it should be
                    agent-assisted. We use the same AI infrastructure we deploy for clients to run our
                    own operations — every day.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10" data-aos="fade-up">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
              <p className="text-lg md:text-xl font-bold text-white">
                We don&apos;t sell AI tools.{' '}
                <span className={gradientText}>We deploy AI team members.</span>
              </p>
              <p className="text-gray-400 text-sm mt-3 max-w-lg mx-auto">
                There&apos;s a difference between a chatbot on your website and an agent that manages
                your renewal book, handles your certs, and briefs you every morning. That&apos;s what
                we build.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== FINAL CTA / BOOKING ============================== */}
      <section id="booking" className="py-20 md:py-28 relative">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/[0.08] to-purple-600/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Your Agency Deserves
              <br className="hidden md:block" />
              <span className={gradientText}>an AI Operations Agent</span>
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
              Book a 30-minute demo. We&apos;ll walk through your current workflows, show you exactly
              what the agent handles, and give you an honest assessment of the time savings for your
              agency.
            </p>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-12 mb-8">
              <div className="py-12">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Schedule a Demo</h3>
                <p className="text-gray-500 text-sm mb-6">
                  30 minutes. No pressure. See the agent in action and get a custom ROI estimate for
                  your agency.
                </p>
                <a
                  href="https://calendly.com/austin-alliedleadvantage-ads/30min"
                  className={`${btnPrimary} px-8 py-4 text-lg mx-auto`}
                >
                  Schedule a Demo
                  <ArrowIcon />
                </a>
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-2">
              Or email directly:{' '}
              <a
                href="mailto:austin@alliedadvantage.co"
                className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2"
              >
                austin@alliedadvantage.co
              </a>
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>Now onboarding agencies for Q1 2026</span>
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
                src="/AA White Logo 200x60.png"
                alt="Allied Advantage"
                width={100}
                height={33}
                className="object-contain opacity-50"
              />
            </div>
            <div className="flex items-center gap-6">
              <a
                href="mailto:austin@alliedadvantage.co"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                austin@alliedadvantage.co
              </a>
              <a
                href="https://alliedadvantage.co"
                className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
              >
                alliedadvantage.co
              </a>
            </div>
            <p className="text-gray-600 text-sm">
              &copy; {new Date().getFullYear()} Allied Advantage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
