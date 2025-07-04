export default function Testimonials() {
  const testimonials = [
    {
      content: "Allied Advantage Ads transformed our lead generation. We went from 5 deals a month to 20+ consistently. The quality of leads is outstanding!",
      author: "Mike Johnson",
      role: "Real Estate Wholesaler",
      location: "Dallas, TX",
      rating: 5
    },
    {
      content: "Best investment I've made for my business. $18 per lead is unbeatable, and they're actually motivated sellers, not tire kickers.",
      author: "Sarah Chen",
      role: "REI Professional",
      location: "Phoenix, AZ",
      rating: 5
    },
    {
      content: "The team at Allied is incredible. They set up our campaigns, optimize them constantly, and we just focus on closing deals. Game changer!",
      author: "David Rodriguez",
      role: "Wholesale Expert",
      location: "Miami, FL",
      rating: 5
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600">
            Join 257+ successful wholesalers who trust Allied Advantage Ads
          </p>
        </div>
        
        <div className="grid gap-8 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="flex mb-4">
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
              
              <blockquote className="mb-6">
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </blockquote>
              
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}