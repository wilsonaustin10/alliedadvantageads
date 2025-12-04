export default function CaseStudyMini() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">
            Southern California Case Study
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            What Our Clients Achieve in 60 Days
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* Stat Card 1 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 mb-1">$2,500 &rarr; <span className="text-green-600 font-semibold">$1,162</span></div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">53% Lower</div>
            <p className="text-gray-600 text-sm">Avg. Cost Per Contract</p>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 mb-1">2-4 &rarr; <span className="text-blue-600 font-semibold">6-8</span></div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">2x More</div>
            <p className="text-gray-600 text-sm">Closed Contracts Per Month</p>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="text-sm text-gray-500 mb-1">$26k &rarr; <span className="text-purple-600 font-semibold">$57k</span></div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">119% Growth</div>
            <p className="text-gray-600 text-sm">Monthly Revenue Avg.</p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          *Results from an established wholesaler in Southern California. Individual results may vary.
        </p>
      </div>
    </section>
  );
}
