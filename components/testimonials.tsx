export default function Testimonials() {
  const testimonials = [
    {
      content: "I came to Allied with inconsistent lead flow and revenue. Within 60 days, I was able to take my business to the next level, more than doubling my monthly revenue. I now consistently generate over $50k/mo in assignment fees with an amazing 10x ROAS.",
      author: "Caesar",
      role: "XVR House Buyers",
      location: "San Diego, CA",
      rating: 5,
      metric: "$50k+/mo",
      highlight: "10x ROAS"
    },
    {
      content: "My team had been running Google Ads for two years with mediocre results. In my first 6 weeks with Allied, I locked up 6 contracts and closed a $52k deal.",
      author: "Daniel",
      role: "MPP Properties",
      location: "Denver, CO",
      rating: 5,
      metric: "$52k Deal",
      highlight: "6 Contracts in 6 Weeks"
    },
    {
      content: "I had been burning tens of thousands a month on ad spend in Houston and at most was spinning my wheels on low-value leads. After partnering with Allied, I was able to spend more time on high-quality leads and generate over 6-figures in assignment fees every month.",
      author: "Taylor",
      role: "Great Stone Homebuyers",
      location: "Houston, TX",
      rating: 5,
      metric: "$100k+/mo",
      highlight: "6-Figure Months"
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
            See how wholesalers are scaling their deal flow with predictable Google Ads campaigns
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
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

        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8" data-aos="fade-up" data-aos-delay="900">
            Ready to join them?
          </p>
          <a
            href="#application-form"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-xl hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="1000"
          >
            Book A Strategy Session
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}