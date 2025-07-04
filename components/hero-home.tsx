import Image from "next/image";
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
            {/* Logo */}
            <div className="mb-6 flex justify-center" data-aos="zoom-y-out">
              <Image
                src="/AAA Marquee.png"
                width={240}
                height={80}
                alt="Allied Advantage Ads Logo"
                priority
                className="object-contain"
              />
            </div>
            
            <h1
              className="mb-6 text-5xl font-extrabold text-gray-900 md:text-7xl leading-tight"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Get 50+ Motivated Seller Leads.
              <br />
              <span className="text-blue-600">Every Single Month.</span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-10 text-xl text-gray-700 md:text-2xl"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Stop wasting time on cold calling. We deliver high-quality, exclusive leads 
                directly to your inbox for <span className="font-bold text-blue-600">as low as $18 per lead</span>.
              </p>
              <div className="relative">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 sm:mb-0 sm:w-auto px-10 py-5 text-xl font-bold rounded-full"
                    href="#consultation-form"
                  >
                    <span className="relative inline-flex items-center">
                      Get Your Free Consultation
                      <span className="ml-3 tracking-normal transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </div>
              </div>
              <p className="mt-4 text-gray-600" data-aos="zoom-y-out" data-aos-delay={500}>
                🔒 No credit card required • 🚀 Start getting leads in 48 hours
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div
            className="mx-auto max-w-5xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-gray-900">257+</div>
                <p className="text-lg text-gray-600">Happy Wholesalers</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-gray-900">15,000+</div>
                <p className="text-lg text-gray-600">Leads Generated Monthly</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold text-gray-900">$23M+</div>
                <p className="text-lg text-gray-600">In Closed Deals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
