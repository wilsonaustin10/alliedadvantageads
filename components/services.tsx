export default function Services() {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      title: "Google Ads Growth Engine",
      description: "Dominate search results with our proven PPC strategies and advanced keyword optimization tailored for motivated sellers leads",
      features: [
        "Intent-based keyword research",
        "Quality score optimization",
        "Smart bidding strategies",
        "Landing page alignment",
        "Conversion tracking & reporting"
      ],
      gradient: "from-green-500 to-teal-600"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            GOOGLE ADS EXPERTISE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Google Ads Management Built to Scale
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Everything you need to dominate search and capture high-intent leads, powered by advanced AI and proven Google Ads methodologies
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r ${service.gradient} text-white flex-shrink-0`}>
                  {service.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>

                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>

                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Start Your AI-Powered Campaign
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 
