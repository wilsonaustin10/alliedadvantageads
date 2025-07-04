export default function Benefits() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            Why Choose Allied Advantage Ads?
          </h2>
          <p className="text-xl text-gray-600">
            We're not just another lead generation company. We're your growth partner.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center" data-aos="fade-up">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Lowest Cost Per Lead</h3>
            <p className="text-gray-600">
              Average $18 per lead nationwide. Up to 70% cheaper than competitors with better quality.
            </p>
          </div>
          
          <div className="text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">100% Exclusive Leads</h3>
            <p className="text-gray-600">
              Your leads are yours alone. No sharing, no competition. Direct to your inbox in real-time.
            </p>
          </div>
          
          <div className="text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-gray-900">Fast Results</h3>
            <p className="text-gray-600">
              Start receiving motivated seller leads within 48 hours. Scale up or down anytime.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-blue-600 rounded-2xl p-8 text-center text-white" data-aos="zoom-in">
          <h3 className="text-2xl font-bold mb-4">Our Proven Process</h3>
          <div className="grid gap-4 md:grid-cols-4 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">1</div>
              <p className="text-sm">Custom Landing Page Creation</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">2</div>
              <p className="text-sm">Targeted PPC Campaigns</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">3</div>
              <p className="text-sm">Real-Time Lead Delivery</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-2 text-3xl font-bold">4</div>
              <p className="text-sm">Continuous Optimization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}