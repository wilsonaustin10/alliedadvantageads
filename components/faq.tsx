import React from 'react';

const faqs = [
  {
    question: "What is a motivated seller lead?",
    answer: "A motivated seller lead is a property owner who has a strong desire or need to sell their property quickly, often at a below-market price. These sellers may be facing situations such as foreclosure, inheritance, divorce, or relocation, making them more likely to consider wholesale offers."
  },
  {
    question: "How quickly can I see results?",
    answer: "While results can vary, most clients start seeing leads within the first week of campaign activation. However, it typically takes 2-4 weeks to optimize campaigns for best performance and cost per lead. We continuously monitor and adjust campaigns to improve results."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can cancel your subscription at any time. We operate on a month-to-month basis for our PPC packages, with no long-term contracts required. However, longer commitments are eligible for significant discounts."
  },
  {
    question: "What areas do you service?",
    answer: "We provide nationwide lead generation services across the United States. Our campaigns can be targeted to specific cities, counties, or regions based on your business needs."
  },
  {
    question: "Do you guarantee results?",
    answer: "While we strive to maintain an average lead cost of $18 nationwide, specific results cannot be guaranteed as they depend on various factors including market conditions, competition, and seasonal variations. We work closely with you to optimize campaigns for the best possible performance."
  }
];

export default function FAQ() {
  return (
    <section id="faq" className="relative bg-gray-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-lg"
              >
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 