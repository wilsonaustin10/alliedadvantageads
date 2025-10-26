export default function ValueProposition() {
  const propositions = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Higher Quality Leads",
      metric: "3.2x",
      description: "Our AI-powered methodology generates leads that convert 3.2x better than industry average",
      proof: "Validated across 18 specialized markets"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Lower Cost Per Lead",
      metric: "45%",
      description: "Advanced AI optimization reduces your cost per lead by 45% compared to traditional agencies",
      proof: "Average savings: $127 per lead"
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Proven Methodology",
      metric: "10x",
      description: "Our tested approach delivers up to 10x return on ad spend with precise Google Ads scaling",
      proof: "Case study highlight: $42K revenue from $4.2K ad spend"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            THE ALLIED ADVANTAGE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Why We Outperform Every Competitor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Our unique AI-powered methodology is specifically designed for real estate wholesalers and home services businesses
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
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {prop.title}
              </h3>
              
              <p className="text-gray-600 mb-3">
                {prop.description}
              </p>
              
              <p className="text-sm text-blue-600 font-semibold">
                ✓ {prop.proof}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12 border border-blue-200" data-aos="fade-up" data-aos-delay="600">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Our Tested Lead Generation Methodology
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                While others guess, we know. Our proprietary system combines advanced AI with battle-tested strategies to deliver predictable, scalable results.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI-Powered Audience Discovery</h4>
                    <p className="text-gray-600">Identify and target your ideal customers with surgical precision</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dynamic Creative Optimization</h4>
                    <p className="text-gray-600">Test and optimize hundreds of ad variations automatically</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Predictive Lead Scoring</h4>
                    <p className="text-gray-600">Focus on leads most likely to convert and close</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-xl">
              <h4 className="text-xl font-bold text-gray-900 mb-6">Real Results from Real Clients</h4>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <p className="text-gray-700 italic mb-2">
                    "Cut our cost per lead by 62% while doubling lead quality"
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">- Mike R., Phoenix Wholesaler</p>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <p className="text-gray-700 italic mb-2">
                    "Generated 147 qualified leads in our first month"
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">- Sarah L., Dallas HVAC Company</p>
                </div>
                <div className="border-l-4 border-green-600 pl-4">
                  <p className="text-gray-700 italic mb-2">
                    "Best ROI we've ever seen from digital marketing"
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">- Tom K., Atlanta Real Estate</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            Get Your Custom Strategy
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 