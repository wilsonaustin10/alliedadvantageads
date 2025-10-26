"use client";

import { useState } from 'react';

const faqs = [
  {
    category: "AI Technology",
    question: "How does AI improve my advertising results?",
    answer: "Our AI analyzes millions of data points in real-time to optimize your campaigns 24/7. It automatically adjusts bids, refines targeting, tests creative variations, and identifies the highest-converting audiences. This results in 45% lower cost per lead and 3.2x better conversion rates compared to traditional methods."
  },
  {
    category: "Services",
    question: "What services do you offer?",
    answer: "We focus exclusively on Google Ads management. Our team handles everything from keyword research and campaign structure to bid automation, ad copy testing, and conversion tracking — all tailored to real estate wholesalers and home services businesses."
  },
  {
    category: "Results",
    question: "How quickly will I see results?",
    answer: "Thanks to our AI-powered optimization, most clients start receiving high-quality leads within 48 hours of campaign launch. Our machine learning algorithms typically achieve optimal performance within the first week, continuously improving results over time. We've generated over 15,000 leads monthly across our client base."
  },
  {
    category: "Pricing",
    question: "How does your pricing compare to competitors?",
    answer: "Our AI automation allows us to deliver superior results at lower costs. While traditional agencies charge premium prices for manual management, our technology enables us to reduce cost per lead by an average of 45% while maintaining higher quality. Plus, we offer transparent, performance-based pricing with no hidden fees."
  },
  {
    category: "Education",
    question: "What are the free educational courses about?",
    answer: "We offer comprehensive Google Ads courses covering campaign fundamentals, advanced search strategies, conversion tracking, and AI-assisted optimization. Each course includes lifetime access, weekly live Q&A sessions, and certificates of completion so you can continuously sharpen your Google Ads skills."
  },
  {
    category: "Future Tools",
    question: "What upcoming tools will be available?",
    answer: "In Fall 2025, we're launching three revolutionary tools: AI Keyword Generator ($29/month) for discovering high-converting keywords, Prompt Optimizer Pro ($49/month) for perfect ad copy creation, and Campaign Intelligence Suite ($99/month) for advanced analytics and optimization. Early adopters receive lifetime discounts."
  },
  {
    category: "Commitment",
    question: "Do you require long-term contracts?",
    answer: "No, we operate on a month-to-month basis with no long-term contracts required. Our campaigns are built to deliver up to 10x return on ad spend, so clients choose to stay based on performance. However, we offer significant discounts for longer commitments: 15% off for 3 months, 20% off for 6 months, and 30% off for annual agreements."
  },
  {
    category: "Coverage",
    question: "What industries and locations do you serve?",
    answer: "We specialize in real estate wholesaling and home services businesses nationwide across the United States. Our AI can target specific cities, counties, or regions based on your needs. We've successfully managed over 500 campaigns in markets ranging from major metros to rural areas."
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
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Everything You Need to Know
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Get answers about our AI-powered advertising solutions and how we deliver superior results
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
                      className={`w-6 h-6 text-blue-600 transform transition-transform duration-300 ${
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
            Still Have Questions?
          </h3>
          <p className="text-xl mb-8 text-blue-100">
            Our AI-powered team is here to help you succeed
          </p>
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
          >
            Get Expert Answers
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 