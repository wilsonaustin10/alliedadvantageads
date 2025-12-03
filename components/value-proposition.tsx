export default function ValueProposition() {
  const propositions = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Predictable Deal Flow",
      metric: "67%",
      description: "Lower cost per contract than traditional PPC agencies. We optimize for closed deals, not just cheap clicks.",
      proof: "Powered by AI-trained campaigns and 2,000+ negative keywords"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Cost Per Contract Focus",
      metric: "3x",
      description: "More qualified motivated seller leads. We track from click to contract so you know exactly what's working.",
      proof: "Full attribution from ad spend to assignment fee"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Market Exclusivity",
      metric: "1",
      description: "Partner per core market. When you lock in your territory, competitors can't access our system in your area.",
      proof: "Protected campaigns in select cities nationwide"
    }
  ];

  const testimonialQuotes = [
    {
      quote: "Within 45 days we scaled from inconsistent lead flow to a calendar booked out two weeks in advance.",
      author: "Michael Tran, RiverCity Holdings",
      borderClass: "border-blue-500"
    },
    {
      quote: "The Allied Advantage campaign system delivered our lowest cost-per-contract in five years of marketing.",
      author: "Danielle Wright, Keystone Homebuyers",
      borderClass: "border-purple-500"
    },
    {
      quote: "We closed three wholesale deals in the first month — the AI targeting found sellers nobody else was reaching.",
      author: "Rafael Ortiz, Summit Property Group",
      borderClass: "border-indigo-500"
    }
  ];

  const showTestimonials = testimonialQuotes.length > 0;

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            THE WHOLESALER DEAL FLOW SYSTEM
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Built for Serious Wholesalers Who Want Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Stop chasing cheap leads. Start scaling contracts with a system designed specifically for motivated seller acquisition.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {propositions.map((prop, index) => (
            <div
              key={index}
              className="text-center"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 mb-6">
                {prop.icon}
              </div>

              <div className="mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {prop.metric}
                </span>
                {prop.title === "Market Exclusivity" && (
                  <span className="text-2xl font-bold text-gray-400 ml-1">partner</span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {prop.title}
              </h3>

              <p className="text-gray-600 mb-3">
                {prop.description}
              </p>

              <p className="text-sm text-blue-600 font-semibold">
                {prop.proof}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-200" data-aos="fade-up" data-aos-delay="600">
          <div
            className={`grid gap-12 ${
              showTestimonials ? "md:grid-cols-2 items-start" : "md:grid-cols-1 md:justify-items-center"
            }`}
          >
            <div className="max-w-3xl mx-auto">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                How We Turn Ad Spend Into Closed Contracts
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                We understand assignment fees, spreads, and motivated seller reality. Our system plugs into your existing deal machine and turns up the volume.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Trained Campaign Launch</h4>
                    <p className="text-gray-600">Motivated seller campaigns built on data from thousands of successful wholesaler deals</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ad Spend Protection</h4>
                    <p className="text-gray-600">2,000+ negative keywords block junk traffic and protect your budget from wasted clicks</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Contract-to-Click Tracking</h4>
                    <p className="text-gray-600">Tie every closed deal back to the click that started it — know your true cost per contract</p>
                  </div>
                </li>
              </ul>
            </div>
            {showTestimonials && (
              <div className="bg-white rounded-xl p-8 shadow-xl">
                <h4 className="text-xl font-bold text-gray-900 mb-6">What Our Partners Are Saying</h4>
                <div className="space-y-6">
                  {testimonialQuotes.map(({ quote, author, borderClass }) => (
                    <div
                      key={author}
                      className={`border-l-4 pl-4 ${borderClass}`}
                    >
                      <p className="text-gray-700 italic mb-2">&ldquo;{quote}&rdquo;</p>
                      <p className="text-sm text-gray-600 font-semibold">- {author}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#application-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            Check Availability in Your Market
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
