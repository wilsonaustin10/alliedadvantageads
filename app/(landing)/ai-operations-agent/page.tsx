export const metadata = {
  title: 'AI Operations Agent for VC Funds — Allied Advantage',
  description: 'A dedicated AI operations agent for your fund. Handles email, meetings, deal flow, portfolio monitoring, and LP communications 24/7. Built by Allied Advantage.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Allied Advantage — Your Fund\'s AI Operations Agent',
    description: 'A dedicated AI team member that handles email, meetings, deal flow, and portfolio monitoring around the clock.',
  },
}

const gradientText = 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
const btnPrimary = 'inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 transition-all duration-200'

export default function AiOperationsAgentPage() {
  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen">


  {/*  ============================================  */}
  {/*  NAVIGATION                                    */}
  {/*  ============================================  */}
  <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
      <a href="https://alliedadvantage.co" className="flex items-center gap-2" aria-label="Allied Advantage">
        <img
          src="https://alliedadvantage.co/_next/image?url=%2FAAA%20Master%20Logo.png&w=256&q=75"
          alt="Allied Advantage"
          width="140"
          height="47"
          className="object-contain brightness-0 invert"
          loading="eager"
         />
      </a>
      <a href="#booking" className="btn-primary text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg">
        Schedule a Discovery Call
      </a>
    </div>
  </nav>

  {/*  ============================================  */}
  {/*  HERO                                          */}
  {/*  ============================================  */}
  <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
    {/*  Background gradient orbs  */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-br from-blue-600/10 to-purple-600/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
    <div className="absolute top-[400px] right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-600/8 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
      {/*  Pill badge  */}
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        For VC Fund Operations
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6">
        Your Fund's <span className="gradient-text">AI Operations Agent</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-400 mb-4 leading-relaxed max-w-2xl mx-auto">
        A dedicated AI team member that handles email triage, meeting prep, deal flow research, portfolio monitoring, and LP communications — around the clock.
      </p>

      <p className="text-base text-gray-500 mb-8 max-w-xl mx-auto">
        Not a chatbot. Not a SaaS subscription. A persistent, memory-equipped operations agent built for how your fund actually works.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a href="#booking" className="btn-primary text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl inline-flex items-center gap-2">
          Schedule a Discovery Call
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>

      <p className="mt-4 text-sm text-gray-500">30 minutes. No pitch deck. Just a conversation about your operations.</p>

      {/*  Stats bar  */}
      <div className="mt-16 pt-10 border-t border-white/5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto">
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">24/7</div>
            <p className="text-sm text-gray-500 mt-1">Always Running</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">4 wk</div>
            <p className="text-sm text-gray-500 mt-1">Discovery to Go-Live</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">$10k</div>
            <p className="text-sm text-gray-500 mt-1">One-Time Setup</p>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold gradient-text">30d</div>
            <p className="text-sm text-gray-500 mt-1">Post-Launch Support</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  PROBLEM                                       */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none" aria-hidden="true"></div>
    <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
      <div className="text-center mb-14" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          The Problem
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Your Team Should Be Doing <span className="gradient-text">Deals</span>.<br className="hidden md:block" />
          Not Drowning in Operations.
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A significant chunk of every day goes to operational overhead that doesn't move the needle on returns.
        </p>
      </div>

      {/*  Pain point cards  */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16" data-aos="fade-up">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Email Triage</h3>
          <p className="text-gray-400 text-sm leading-relaxed">LP inquiries, founder pitches, legal docs, term sheets — buried under noise every morning.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Meeting Prep</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Pulling context on companies, reviewing past notes, building agendas — before every single meeting.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Deal Flow Management</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Tracking inbound, running initial research, screening against your thesis — manually, for every opportunity.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">LP Communications</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Drafting updates, preparing quarterly reports, managing follow-ups — time-intensive and high-stakes.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Scheduling Chaos</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Back-and-forth across time zones with founders, LPs, and co-investors. Every week.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.05] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 className="text-base font-bold text-white mb-1.5">Research</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Market sizing, competitive landscapes, comparable transactions — hours of work per opportunity.</p>
        </div>
      </div>

      {/*  Comparison table  */}
      <div data-aos="fade-up">
        <div className="text-center mb-8">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Why ChatGPT and Copilot <span className="text-gray-500">Aren't Enough</span>
          </h3>
          <p className="text-gray-500 text-sm">The gap between a search box and a team member.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="comparison-table w-full text-sm">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="text-gray-400 font-semibold text-xs uppercase tracking-wider py-4 px-5">What You Need</th>
                  <th className="text-gray-500 font-semibold text-xs uppercase tracking-wider py-4 px-5">ChatGPT / Claude</th>
                  <th className="font-semibold text-xs uppercase tracking-wider py-4 px-5"><span className="gradient-text">AI Operations Agent</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-gray-300 py-3.5 px-5">Remembers your portfolio</td>
                  <td className="text-gray-500 py-3.5 px-5">Forgets every session</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Persistent memory across months</td>
                </tr>
                <tr className="bg-white/[0.01]">
                  <td className="text-gray-300 py-3.5 px-5">Monitors email proactively</td>
                  <td className="text-gray-500 py-3.5 px-5">Only when you ask</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Runs 24/7, flags what matters</td>
                </tr>
                <tr>
                  <td className="text-gray-300 py-3.5 px-5">Drafts in your voice</td>
                  <td className="text-gray-500 py-3.5 px-5">Generic output</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Trained on your style & templates</td>
                </tr>
                <tr className="bg-white/[0.01]">
                  <td className="text-gray-300 py-3.5 px-5">Connects to your tools</td>
                  <td className="text-gray-500 py-3.5 px-5">Isolated chat window</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Email, calendar, Slack, files</td>
                </tr>
                <tr>
                  <td className="text-gray-300 py-3.5 px-5">Gets smarter over time</td>
                  <td className="text-gray-500 py-3.5 px-5">Same every session</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Learns preferences, builds knowledge</td>
                </tr>
                <tr className="bg-white/[0.01]">
                  <td className="text-gray-300 py-3.5 px-5">Works without prompting</td>
                  <td className="text-gray-500 py-3.5 px-5">Requires explicit instructions</td>
                  <td className="text-gray-200 py-3.5 px-5 font-medium">Proactive briefings & alerts</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  WHAT YOU GET                                   */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 relative overflow-hidden">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
      <div className="text-center mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          What You Get
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          A Full <span className="gradient-text">Operations Stack</span>,<br className="hidden md:block" />
          Configured for Your Fund
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Everything your AI agent handles — connected to your existing tools, trained on your workflows, running from day one.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/*  Card 1: Dedicated Agent  */}
        <div className="fade-up -delay-1 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Dedicated AI Agent</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Your own persistent agent with long-term memory, running on enterprise infrastructure. Customized to your fund's operations, tone, and priorities.</p>
        </div>

        {/*  Card 2: Email Intelligence  */}
        <div className="fade-up -delay-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Email Intelligence</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Automated triage, priority flagging for LP emails and term sheets, smart categorization, and morning digest summaries.</p>
        </div>

        {/*  Card 3: Calendar & Scheduling  */}
        <div className="fade-up -delay-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-purple-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Calendar & Scheduling</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Daily morning briefings, meeting prep packets with company context, conflict detection, and post-meeting follow-up tracking.</p>
        </div>

        {/*  Card 4: Deal Flow Research  */}
        <div className="fade-up -delay-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Deal Flow Research</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Company lookups, market analysis, founder backgrounds, and automated screening against your investment thesis for every inbound opportunity.</p>
        </div>

        {/*  Card 5: Document Drafting  */}
        <div className="fade-up -delay-5 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Document Drafting</h3>
          <p className="text-gray-400 text-sm leading-relaxed">LP update first drafts, investment memo scaffolding, meeting notes, follow-up emails, and internal deal summaries — all in your voice.</p>
        </div>

        {/*  Card 6: Portfolio Monitoring  */}
        <div className="fade-up -delay-6 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:bg-white/[0.05] transition-all group" data-aos="fade-up">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600/20 to-emerald-600/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Portfolio Monitoring</h3>
          <p className="text-gray-400 text-sm leading-relaxed">News alerts on portfolio companies, funding round tracking, competitive landscape monitoring, and automated weekly portfolio pulse reports.</p>
        </div>
      </div>

      {/*  Briefings callout  */}
      <div className="mt-12" data-aos="fade-up">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center max-w-3xl mx-auto">
          <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <p className="text-xl md:text-2xl font-bold text-white mb-2">
            Automated Daily & Weekly Briefings
          </p>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Start every day with an email summary, calendar overview, portfolio alerts, and market intelligence — delivered before you open your laptop. Weekly synthesis of deal flow, portfolio updates, and action items.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  HOW IT WORKS                                   */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 bg-gray-900/50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-16" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          How It Works
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          From Agreement to <span className="gradient-text">Go-Live</span> in 4 Weeks
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          A structured engagement — not a vague "digital transformation." You'll know exactly what's happening each week.
        </p>
      </div>

      {/*  Timeline  */}
      <div className="grid md:grid-cols-4 gap-6 md:gap-3" data-aos="fade-up">
        {/*  Week 1  */}
        <div className="step-connector text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <span className="text-xl font-extrabold text-white">1</span>
          </div>
          <div className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Week 1</div>
          <h3 className="text-base font-bold text-white mb-2">Discovery</h3>
          <p className="text-sm text-gray-500">Requirements gathering, infrastructure provisioning, access setup. We learn how your fund operates.</p>
        </div>

        {/*  Week 2  */}
        <div className="step-connector text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
            <span className="text-xl font-extrabold text-white">2</span>
          </div>
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Week 2</div>
          <h3 className="text-base font-bold text-white mb-2">Configuration</h3>
          <p className="text-sm text-gray-500">Agent personality tuning, workflow setup, tool integrations, email and calendar connected.</p>
        </div>

        {/*  Week 3  */}
        <div className="step-connector text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-4 shadow-lg shadow-purple-600/20">
            <span className="text-xl font-extrabold text-white">3</span>
          </div>
          <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-1">Week 3</div>
          <h3 className="text-base font-bold text-white mb-2">Testing</h3>
          <p className="text-sm text-gray-500">End-to-end testing, workflow refinement, edge case handling, your team gives feedback.</p>
        </div>

        {/*  Week 4  */}
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-600/20">
            <span className="text-xl font-extrabold text-white">4</span>
          </div>
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Week 4</div>
          <h3 className="text-base font-bold text-white mb-2">Go-Live</h3>
          <p className="text-sm text-gray-500">2-hour onboarding session, documentation delivery, agent goes live. 30 days of support included.</p>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  INVESTMENT                                     */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900/50 to-gray-950 pointer-events-none" aria-hidden="true"></div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
      <div className="text-center mb-14" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          Investment
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Transparent <span className="gradient-text">Pricing</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          One-time setup. No recurring surprise fees. Optional add-ons if you want to expand.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6" data-aos="fade-up">
        {/*  Core Package  */}
        <div className="md:col-span-2 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
          </div>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white mb-1">Agent Setup & Configuration</h3>
            <p className="text-gray-400 text-sm">Everything you need to go live</p>
          </div>
          <div className="mb-6">
            <span className="text-5xl font-extrabold text-white">$10,000</span>
            <span className="text-gray-500 text-lg ml-2">one-time</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Full agent instance — hosted on your infrastructure or managed VPS</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Custom agent personality tuned to your fund's operations</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">All integrations — email, calendar, Slack/Teams, documents</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">VC-specific workflows — deal flow, LP comms, portfolio monitoring</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Automated daily & weekly briefings</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">2-hour onboarding session + documentation</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">30 days post-launch support & optimization</span>
            </li>
          </ul>
          <a href="#booking" className="btn-primary text-white font-bold px-6 py-3.5 rounded-full shadow-xl inline-flex items-center gap-2 text-sm">
            Schedule a Discovery Call
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>

        {/*  Add-ons  */}
        <div className="space-y-4">
          {/*  Managed Service  */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h4 className="font-bold text-white text-sm mb-1">Managed Service</h4>
            <p className="text-gray-500 text-xs mb-3">Ongoing optimization, new workflows, priority support, monthly reviews</p>
            <div className="text-2xl font-extrabold text-white">$3,000<span className="text-gray-500 text-sm font-normal">/mo</span></div>
          </div>

          {/*  Additional Agents  */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h4 className="font-bold text-white text-sm mb-1">Specialized Agents</h4>
            <p className="text-gray-500 text-xs mb-3">Research Analyst, Portfolio Monitor, LP Communications — dedicated agents for deep work</p>
            <div className="text-2xl font-extrabold text-white">$5,000<span className="text-gray-500 text-sm font-normal"> each</span></div>
          </div>

          {/*  Multi-Agent  */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
            <h4 className="font-bold text-white text-sm mb-1">Multi-Agent Coordination</h4>
            <p className="text-gray-500 text-xs mb-3">Orchestration layer — research feeds into memos, monitoring feeds into briefings</p>
            <div className="text-2xl font-extrabold text-white">$5,000<span className="text-gray-500 text-sm font-normal"> one-time</span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  WHY ALLIED ADVANTAGE                           */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 bg-gray-900/50">
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-14" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          Why Us
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          We Don't Demo AI.<br />
          <span className="gradient-text">We Run It.</span>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          This isn't a tool we researched for a pitch. It's the system we use every day to run our own operations. Same infrastructure. Same architecture. Battle-tested.
        </p>
      </div>

      {/*  What we've built  */}
      <div className="mb-12" data-aos="fade-up">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
          <h3 className="text-lg font-bold text-white mb-5">What we've built on this platform — for ourselves:</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Automated lead sourcing and enrichment pipelines</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">AI voice agents for call handling and qualification</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Market intelligence with daily sweeps and synthesis</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Email monitoring with smart triage and priority alerting</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Multi-channel outreach coordination</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
              <span className="text-gray-300 text-sm">Persistent memory across months of operations</span>
            </div>
          </div>
        </div>
      </div>

      {/*  About Austin  */}
      <div data-aos="fade-up">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="shrink-0">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center overflow-hidden">
                {/*  AUSTIN PHOTO: Replace this div with an {/* eslint-disable-next-line @next/next/no-img-element */}
 <img /> tag pointing to Austin's headshot  */}
                <div className="text-center">
                  <svg className="w-10 h-10 text-gray-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                  <span className="text-[10px] text-gray-600 font-medium">Photo</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3">
                <span className="gradient-text">Austin Wilson</span>, Founder
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm mb-3">
                Sales Manager at RavenDB (enterprise database), real estate investor with 15 rental units, and founder of Allied Advantage. Systems thinker with an operator's mindset — not just tech.
              </p>
              <p className="text-gray-400 leading-relaxed text-sm">
                Our philosophy: if a task is done more than once, it should be automated. If it requires judgment, it should be agent-assisted. The companies that adopt AI as operational infrastructure will dramatically outperform those that don't.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  Differentiator  */}
      <div className="mt-10" data-aos="fade-up">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-8 text-center">
          <p className="text-lg md:text-xl font-bold text-white">
            Most firms offering "AI consulting" configure off-the-shelf chatbots.<br />
            <span className="gradient-text">We build actual operational infrastructure.</span>
          </p>
          <p className="text-gray-400 text-sm mt-3">
            Agents that run autonomously, maintain memory, connect to your systems, and get better over time. The difference between a doorbell and a smart home.
          </p>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  SECURITY                                       */}
  {/*  ============================================  */}
  <section className="py-20 md:py-28 relative">
    <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 pointer-events-none" aria-hidden="true"></div>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 relative">
      <div className="text-center mb-14" data-aos="fade-up">
        <div className="inline-flex items-center gap-2 bg-gray-500/10 border border-gray-500/20 text-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
          Security & Privacy
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
          Built for <span className="gradient-text">Fund-Grade</span> Security
        </h2>
        <p className="text-lg text-gray-400 max-w-xl mx-auto">
          We take data security seriously — especially for operations handling sensitive deal and LP information.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5" data-aos="fade-up">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
            </div>
            <h4 className="font-bold text-white text-sm">Data Residency</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Self-hosted option available. All data stays on your infrastructure — nothing leaves your network except AI model API calls.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <h4 className="font-bold text-white text-sm">SOC 2 AI Provider</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Powered by Anthropic (Claude) — enterprise-grade, SOC 2 Type II certified. Your data is never used for model training.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h4 className="font-bold text-white text-sm">Encrypted Credentials</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">API keys and passwords stored in encrypted local storage. Never in plaintext, never transmitted insecurely.</p>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>
            </div>
            <h4 className="font-bold text-white text-sm">Full Audit Trail</h4>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">Complete logging of all agent actions. Daily memory files provide a full activity record for compliance review.</p>
        </div>
      </div>

      <p className="text-center text-gray-500 text-sm mt-8" data-aos="fade-up">
        We conduct a security review during discovery to ensure the setup meets your fund's compliance requirements.
      </p>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  FINAL CTA / BOOKING                           */}
  {/*  ============================================  */}
  <section id="booking" className="py-20 md:py-28 relative bg-gray-900/50">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-br from-blue-600/8 to-purple-600/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

    <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative">
      <div data-aos="fade-up">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
          Ready to Give Your Fund<br className="hidden md:block" />
          <span className="gradient-text">an AI Operations Agent?</span>
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
          Book a 30-minute discovery call. We'll learn about your workflows, tools, and pain points — and tell you honestly whether this is a fit.
        </p>

        {/*  Calendly Embed Area  */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 md:p-12 mb-8">
          {/*  CALENDLY EMBED: Replace with your Calendly inline widget  */}
          {/*  Example:  */}
          {/*  <div className="calendly-inline-widget" data-url="https://calendly.com/YOUR_LINK" style="min-width:320px;height:700px;"></div>  */}
          {/*  <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>  */}

          {/*  Placeholder (remove when adding Calendly)  */}
          <div className="py-12">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Schedule a Discovery Call</h3>
            <p className="text-gray-500 text-sm mb-6">30 minutes. No commitment. We'll map your operations and see if an AI agent makes sense for your fund.</p>
            {/*  {{calendarLink}} — Replace href with your actual Calendly or booking link  */}
            <a href="{{calendarLink}}" className="btn-primary text-white font-bold px-8 py-4 rounded-full text-lg shadow-xl inline-flex items-center gap-2 mx-auto">
              Schedule a 30-Minute Discovery Call
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </a>
          </div>
          {/*  END Calendly Placeholder  */}
        </div>

        <p className="text-gray-500 text-sm mb-2">
          Or email directly: <a href="mailto:austin@alliedadvantage.co" className="text-blue-400 hover:text-blue-300 transition-colors underline underline-offset-2">austin@alliedadvantage.co</a>
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mt-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Accepting new fund clients for Q1 2026</span>
        </div>
      </div>
    </div>
  </section>

  {/*  ============================================  */}
  {/*  FOOTER                                        */}
  {/*  ============================================  */}
  <footer className="py-10 border-t border-white/5">
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src="https://alliedadvantage.co/_next/image?url=%2FAAA%20Master%20Logo.png&w=256&q=75"
            alt="Allied Advantage"
            width="100"
            height="33"
            className="object-contain brightness-0 invert opacity-50"
            loading="lazy"
           />
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:austin@alliedadvantage.co" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">austin@alliedadvantage.co</a>
          <a href="https://alliedadvantage.co" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">alliedadvantage.co</a>
        </div>
        <p className="text-gray-600 text-sm">
          &copy;  Allied Advantage. All rights reserved.
        </p>
      </div>
    </div>
  </footer>

  {/*  ============================================  */}
  {/*  SCROLL ANIMATION                              */}
  {/*  ============================================  */}
  


    </div>
  )
}
