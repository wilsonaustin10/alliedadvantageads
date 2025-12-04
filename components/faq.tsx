"use client";

import { useState } from 'react';

const faqs = [
  {
    category: "Fit",
    question: "Who is this service for?",
    answer: "Our Wholesaler Deal Flow System is built for established real estate wholesalers who are already closing deals and investing at least $2k/month in marketing. If you're brand new to wholesaling or not ready to invest seriously in paid acquisition, this isn't the right fit yet."
  },
  {
    category: "Fit",
    question: "Why do I need to apply? Can't I just sign up?",
    answer: "We only partner with one wholesaler per core market to protect your territory and ensure we can deliver results. The application helps us confirm we have capacity in your market and that we're a good mutual fit. We're selective because our success depends on your success."
  },
  {
    category: "System",
    question: "What's included in the Wholesaler Deal Flow System?",
    answer: "Everything you need to turn Google Ads into closed contracts: AI-trained motivated seller campaigns, our 2,000+ negative keyword vault to protect your ad spend, high-converting landing pages built for sellers, contract-to-click attribution tracking, and ongoing optimization. We build and manage the entire system for you."
  },
  {
    category: "System",
    question: "How is this different from other PPC agencies?",
    answer: "Most agencies optimize for cheap leads and low CPL. We optimize for cost per contract and profit per deal. We understand assignment fees, spreads, and motivated seller reality — not just generic 'real estate leads.' Plus, we offer market exclusivity so you're not competing against our other clients in your area."
  },
  {
    category: "Results",
    question: "How quickly will I see results?",
    answer: "Most partners start receiving motivated seller leads within 48 hours of campaign launch. Our AI-powered optimization typically achieves strong performance within 60 days, continuously improving over time. We track everything from click to contract so you know exactly what's working."
  },
  {
    category: "Results",
    question: "What kind of results can I expect?",
    answer: "Results vary by market and budget, but our partners typically see 67% lower cost per contract compared to managing campaigns themselves or using generic agencies. We focus on qualified motivated sellers who are actually ready to sell — not tire-kickers or people looking for retail agents."
  },
  {
    category: "Pricing",
    question: "How does pricing work?",
    answer: "We operate on a predictable flat monthly fee — your management costs stay the same whether you're spending $3k or $30k on ads. Most agencies tie their fees to your ad spend, meaning your bill grows every time you scale. We believe growth should reward you, not penalize you."
  },
  {
    category: "Pricing",
    question: "What's the minimum ad spend requirement?",
    answer: "We work best with wholesalers investing at least $2k/month in ad spend. This gives us enough data to optimize effectively and generate consistent deal flow. If you're not ready for that level of investment yet, download our free Playbook to learn the system first."
  },
  {
    category: "Commitment",
    question: "Do you require long-term contracts?",
    answer: "We operate month-to-month after an initial 90-day campaign maturity period. This gives our AI enough time to learn your market and optimize for your specific goals. Our partners stay because of results, not contracts — though we do offer discounts for longer commitments."
  },
  {
    category: "Coverage",
    question: "What markets do you serve?",
    answer: "We serve wholesalers nationwide across the United States. Our AI can target specific cities, counties, or regions based on your buying criteria. However, we only partner with one wholesaler per core market to protect your territory — so availability depends on whether your market is already taken."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative bg-gray-50 py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            COMMON QUESTIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Is This Right for You?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Answers about our Wholesaler Deal Flow System and how we help serious operators scale
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl"
                data-aos="fade-up"
                data-aos-delay={300 + index * 50}
              >
                <button
                  className="w-full px-8 py-6 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full">
                        {faq.category}
                      </span>
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 flex-shrink-0 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                <div
                  className={`px-8 pb-6 transition-all duration-300 ${
                    activeIndex === index ? 'block' : 'hidden'
                  }`}
                >
                  <p className="text-gray-600 leading-relaxed pl-20">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white" data-aos="fade-up" data-aos-delay="600">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            If you're already closing deals and serious about scaling, let's talk.
          </p>
          <a
            href="#application-form"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
          >
            Book A Strategy Session
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
