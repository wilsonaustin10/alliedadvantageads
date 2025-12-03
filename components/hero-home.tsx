import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative bg-gradient-to-b from-white to-gray-50">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            {/* Micro-headline / Qualifier Badge */}
            <div
              className="mb-8 inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-2 rounded-full text-sm font-semibold tracking-wide"
              data-aos="zoom-y-out"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              FOR ESTABLISHED REAL ESTATE WHOLESALERS
            </div>

            <h1
              className="mb-6 text-4xl font-extrabold text-gray-900 md:text-6xl lg:text-7xl leading-tight"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              High-Converting Google Ads for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Serious Wholesalers
              </span>{" "}
              Who Want Predictable Deal Flow
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-700 md:text-2xl leading-relaxed"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                We build and manage motivated seller campaigns for investors already closing deals and ready to scale.{" "}
                <span className="font-semibold text-gray-900">Limited capacity</span> and{" "}
                <span className="font-semibold text-gray-900">market exclusivity</span> in select cities.
              </p>

              {/* Benefit checklist */}
              <div
                className="mb-10 flex flex-col sm:flex-row gap-4 justify-center items-center text-lg"
                data-aos="zoom-y-out"
                data-aos-delay={350}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">AI-Optimized Campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Motivated Seller Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Contract-to-Click Tracking</span>
                </div>
              </div>

              {/* Primary CTA */}
              <div className="relative">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 sm:mb-0 sm:w-auto px-10 py-5 text-xl font-bold rounded-full"
                    href="#application-form"
                  >
                    <span className="relative inline-flex items-center">
                      See If You Qualify
                      <span className="ml-3 tracking-normal transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Qualifier microcopy */}
              <p
                className="mt-6 text-gray-600 max-w-xl mx-auto leading-relaxed"
                data-aos="zoom-y-out"
                data-aos-delay={500}
              >
                We only onboard a handful of serious wholesalers each month. Best suited for investors already closing deals and investing{" "}
                <span className="font-semibold text-gray-700">$2k+/mo</span> in marketing.
              </p>
            </div>
          </div>

          {/* Trust indicators - reframed for deal flow outcomes */}
          <div
            className="mx-auto max-w-5xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  67%
                </div>
                <p className="text-base md:text-lg text-gray-600">Lower Cost Per Contract</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  3x
                </div>
                <p className="text-base md:text-lg text-gray-600">More Qualified Leads</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  48h
                </div>
                <p className="text-base md:text-lg text-gray-600">Campaign Launch</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  1
                </div>
                <p className="text-base md:text-lg text-gray-600">Partner Per Market</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
