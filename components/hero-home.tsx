import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-16 md:pt-40">
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left column - Copy */}
            <div className="lg:col-span-2 text-center lg:text-left">
              {/* Qualifier Badge */}
              <div
                className="mb-6 inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                data-aos="fade-right"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                FOR ESTABLISHED WHOLESALERS
              </div>

              {/* Headline */}
              <h1
                className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl leading-tight"
                data-aos="fade-right"
                data-aos-delay={100}
              >
                Predictable Deal Flow from{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Google Ads
                </span>
              </h1>

              {/* Subhead */}
              <p
                className="mb-6 text-lg text-gray-600 md:text-xl"
                data-aos="fade-right"
                data-aos-delay={150}
              >
                Done-for-you motivated seller campaigns. Limited spots per market.
              </p>

              {/* CTA */}
              <div
                className="mb-4"
                data-aos="fade-right"
                data-aos-delay={200}
              >
                <a
                  className="btn group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 px-8 py-4 text-lg font-bold rounded-full"
                  href="#application-form"
                >
                  Book A Strategy Session
                  <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>

              {/* Scarcity indicator */}
              <div
                className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1.5 rounded-full text-sm font-medium"
                data-aos="fade-right"
                data-aos-delay={250}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Few strategy slots left this month
              </div>
            </div>

            {/* Right column - VSL */}
            <div
              className="lg:col-span-3"
              data-aos="fade-left"
              data-aos-delay={100}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900">
                {/* Video aspect ratio container */}
                <div className="relative pt-[56.25%]">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/0jUQf0cS7L0?rel=0&modestbranding=1"
                    title="Allied Advantage - Deal Flow System Breakdown"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                {/* Video caption */}
                <div className="bg-gray-900 px-4 py-3 text-center">
                  <p className="text-gray-300 text-sm">
                    <span className="text-white font-medium">Watch:</span> How we generate predictable deals for wholesalers
                  </p>
                </div>
              </div>
              {/* Power Pack CTA below video */}
              <div className="mt-4 text-center">
                <a
                  href="#power-pack"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-semibold text-sm hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Get Your Free Power Pack
                </a>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 pt-12 border-t border-gray-200"
            data-aos="fade-up"
            data-aos-delay={300}
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  3x
                </div>
                <p className="text-sm md:text-base text-gray-600">More Deals Closed</p>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  92%
                </div>
                <p className="text-sm md:text-base text-gray-600">Higher Conversion</p>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  48h
                </div>
                <p className="text-sm md:text-base text-gray-600">Campaign Launch</p>
              </div>
              <div className="text-center">
                <div className="mb-1 text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Limited
                </div>
                <p className="text-sm md:text-base text-gray-600">Availability Per Market</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
