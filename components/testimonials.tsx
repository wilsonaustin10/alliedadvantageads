export default function Testimonials() {
  const testimonials = [
    {
      content: "The AI optimization is unreal! Our cost per lead dropped 67% in the first month while lead quality actually improved. We're closing 3x more deals with the same budget.",
      author: "Michael Thompson",
      role: "CEO, Phoenix Wholesale Group",
      location: "Phoenix, AZ",
      rating: 5,
      metric: "67% Lower CPL",
      highlight: "AI-Powered Success"
    },
    {
      content: "Allied's AI technology identified audience segments we never knew existed. Generated 147 qualified leads in our first month - more than we got all last year with our previous agency.",
      author: "Sarah Mitchell",
      role: "Founder, DFW Home Solutions",
      location: "Dallas, TX",
      rating: 5,
      metric: "147 Leads/Month",
      highlight: "10x Lead Volume"
    },
    {
      content: "Allied's Google Ads campaigns are unstoppable. Our conversion rate went from 2% to 8.4% with search traffic alone. Best ROI we've ever seen.",
      author: "James Chen",
      role: "Operations Director, Quick Cash Homes",
      location: "San Francisco, CA",
      rating: 5,
      metric: "8.4% Conversion Rate",
      highlight: "4x Conversion Boost"
    },
    {
      content: "We switched from a traditional agency charging $5k/month with mediocre results. Allied delivers 3x the leads at half the cost. The AI automation is a game-changer.",
      author: "Maria Garcia",
      role: "Marketing Director, Atlanta Home Buyers",
      location: "Atlanta, GA",
      rating: 5,
      metric: "3x More Leads",
      highlight: "50% Cost Reduction"
    },
    {
      content: "The free education alone is worth thousands. Combined with their AI campaigns, we've scaled from 2 to 15 deals per month. Can't recommend Allied enough!",
      author: "Robert Kim",
      role: "Principal, Premier Property Solutions",
      location: "Los Angeles, CA",
      rating: 5,
      metric: "15 Deals/Month",
      highlight: "650% Growth"
    },
    {
      content: "Their AI predicts which leads will convert with scary accuracy. We focus our time on the hottest prospects and our close rate jumped from 12% to 31%.",
      author: "Jennifer Adams",
      role: "VP Sales, Sunshine State Properties",
      location: "Miami, FL",
      rating: 5,
      metric: "31% Close Rate",
      highlight: "AI Lead Scoring"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            PROVEN RESULTS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Real Success Stories from Real Clients
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            See how leading real estate and home service brands achieve extraordinary results with our AI-powered advertising
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  {testimonial.highlight}
                </span>
              </div>
              
              <blockquote className="mb-6">
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </blockquote>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {testimonial.metric}
                </p>
              </div>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {testimonials.slice(3).map((testimonial, index) => (
            <div
              key={index + 3}
              className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200"
              data-aos="fade-up"
              data-aos-delay={600 + index * 100}
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {testimonial.metric.split(' ')[0]}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                      {testimonial.highlight}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="900">
            Ready to write your own success story?
          </p>
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            Start Your Success Story
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}