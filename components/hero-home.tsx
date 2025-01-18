import Image from "next/image";
import PageIllustration from "@/components/page-illustration";

export default function HeroHome() {
  return (
    <section className="relative">
      <PageIllustration />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Section header */}
          <div className="pb-12 text-center md:pb-16">
            {/* Logo */}
            <div className="mb-8 flex justify-center" data-aos="zoom-y-out">
              <Image
                src="/images/allied-logo.svg"
                width={200}
                height={80}
                alt="Allied Advantage Ads Logo"
                priority
              />
            </div>
            
            <h1
              className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Generate Motivated Seller Leads with Allied Advantage Ads
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-700"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Empowering real estate wholesalers with cost-effective, nationwide lead generation
              </p>
              <div className="relative">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-blue-600 text-white hover:bg-blue-700 sm:mb-0 sm:w-auto"
                    href="#get-started"
                  >
                    <span className="relative inline-flex items-center">
                      Get Started Today{" "}
                      <span className="ml-1 tracking-normal transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </span>
                  </a>
                  <a
                    className="btn w-full border border-gray-200 bg-white text-gray-800 hover:bg-gray-50 sm:ml-4 sm:w-auto"
                    href="#learn-more"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div
            className="mx-auto max-w-3xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="relative rounded-2xl bg-gradient-to-b from-blue-50 to-white p-6 shadow-lg">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div className="text-center">
                  <div className="mb-3 text-3xl font-bold text-blue-600">$18</div>
                  <p className="text-sm text-gray-600">Average Lead Cost Nationwide*</p>
                </div>
                <div className="text-center">
                  <div className="mb-3 text-3xl font-bold text-blue-600">100%</div>
                  <p className="text-sm text-gray-600">Custom Landing Pages</p>
                </div>
                <div className="text-center">
                  <div className="mb-3 text-3xl font-bold text-blue-600">24/7</div>
                  <p className="text-sm text-gray-600">Lead Generation</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center">*Results not guaranteed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
