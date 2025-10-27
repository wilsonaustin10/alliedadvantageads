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
            {/* Brand Badge */}
            <div className="mb-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold" data-aos="zoom-y-out">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-POWERED ADVERTISING REVOLUTION
            </div>
            
            <h1
              className="mb-6 text-5xl font-extrabold text-gray-900 md:text-7xl leading-tight"
              data-aos="zoom-y-out"
              data-aos-delay={150}
            >
              Allied Advantage:
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">#1 AI Advertising for Real Estate Wholesalers</span>
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-gray-700 md:text-2xl leading-relaxed"
                data-aos="zoom-y-out"
                data-aos-delay={300}
              >
                Revolutionary AI-powered methodology delivers <span className="font-bold text-blue-600">higher-quality leads</span> at
                <span className="font-bold text-purple-600"> lower costs</span> than any competitor.
                Built specifically for real estate wholesalers with a predictable flat monthly subscription—never a percentage of your ad spend.
              </p>
              <div className="mb-10 flex flex-col sm:flex-row gap-4 justify-center items-center text-lg" data-aos="zoom-y-out" data-aos-delay={350}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">AI-Optimized Google Ads</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Intent-Driven Search Campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Real-Time Conversion Tracking</span>
                </div>
              </div>
              <div className="relative">
                <div
                  className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center"
                  data-aos="zoom-y-out"
                  data-aos-delay={450}
                >
                  <a
                    className="btn group mb-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1 sm:mb-0 sm:w-auto px-10 py-5 text-xl font-bold rounded-full"
                    href="#consultation-form"
                  >
                    <span className="relative inline-flex items-center">
                      Unlock AI-Powered Growth
                      <span className="ml-3 tracking-normal transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </a>
                </div>
              </div>
              <p className="mt-4 text-gray-600" data-aos="zoom-y-out" data-aos-delay={500}>
                🤖 AI-Enhanced Campaigns • 🎯 Proven Methodology • 🚀 Launch in 48 Hours
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div
            className="mx-auto max-w-5xl"
            data-aos="zoom-y-out"
            data-aos-delay={600}
          >
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">45%</div>
                <p className="text-lg text-gray-600">Lower Cost Per Lead</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">3x</div>
                <p className="text-lg text-gray-600">Higher Conversion Rate</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">48h</div>
                <p className="text-lg text-gray-600">Guaranteed Launch Timeline</p>
              </div>
              <div className="text-center">
                <div className="mb-2 text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">10x</div>
                <p className="text-lg text-gray-600">Return on Ad Spend</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
