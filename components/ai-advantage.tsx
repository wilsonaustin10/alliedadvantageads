"use client";

import { useState } from "react";

export default function AIAdvantage() {
  const [activeTab, setActiveTab] = useState(0);

  const advantages = [
    {
      title: "AI Campaign Optimization",
      icon: "🤖",
      description: "Our proprietary AI algorithms analyze millions of data points to optimize your campaigns in real-time",
      benefits: [
        "Predictive audience targeting reduces wasted ad spend by 67%",
        "Automated bid adjustments maximize ROI 24/7",
        "Dynamic creative optimization increases CTR by 3.2x",
        "Machine learning improves performance week over week"
      ]
    },
    {
      title: "Advanced Analytics & Insights",
      icon: "📊",
      description: "Deep learning models provide unprecedented insights into your campaign performance and customer behavior",
      benefits: [
        "Predictive lead scoring identifies hottest prospects",
        "Attribution modeling tracks true conversion paths",
        "Competitor analysis keeps you ahead of the market",
        "Custom dashboards provide real-time visibility"
      ]
    },
    {
      title: "Automated Content Generation",
      icon: "✨",
      description: "AI-powered content creation ensures your messaging resonates with your target audience",
      benefits: [
        "Generate hundreds of ad variations instantly",
        "Personalized landing pages for each audience segment",
        "SEO-optimized content that ranks and converts",
        "A/B testing at scale with statistical significance"
      ]
    }
  ];

  const stats = [
    { value: "10x", label: "Faster Campaign Setup" },
    { value: "89%", label: "Accuracy in Lead Prediction" },
    { value: "24/7", label: "Automated Optimization" },
    { value: "12", label: "Specialist Playbooks" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            THE AI ADVANTAGE
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4" data-aos="fade-up" data-aos-delay="100">
            Why AI Makes All the Difference
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            While competitors rely on outdated manual methods, our advanced AI agents work tirelessly to optimize every aspect of your campaigns
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-4xl mx-auto justify-items-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center"
              data-aos="zoom-in"
              data-aos-delay={300 + index * 100}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-blue-200">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12" data-aos="fade-up" data-aos-delay="400">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="space-y-2">
                {advantages.map((advantage, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                      activeTab === index
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/5 hover:bg-white/10 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{advantage.icon}</span>
                      <span className="font-semibold">{advantage.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:w-2/3">
              <div className="bg-white/5 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4">
                  {advantages[activeTab].title}
                </h3>
                <p className="text-blue-100 mb-6">
                  {advantages[activeTab].description}
                </p>
                <ul className="space-y-3">
                  {advantages[activeTab].benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-100">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-xl text-blue-100 mb-8" data-aos="fade-up" data-aos-delay="500">
            Ready to leave your competition in the dust?
          </p>
          <a
            href="#consultation-form"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Experience the AI Advantage
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}