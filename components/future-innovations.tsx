"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const WaitlistPopup = dynamic(() => import("./waitlist-popup"), { ssr: false });

export default function FutureInnovations() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);

  const handleJoinWaitlist = (toolName: string) => {
    setSelectedTool(toolName);
    setIsWaitlistOpen(true);
  };
  const tools = [
    {
      name: "AI Keyword Generator",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      description: "Generate high-converting keywords with AI analysis of search intent and competition",
      features: [
        "Long-tail keyword discovery",
        "Competition analysis",
        "Search volume predictions",
        "ROI projections"
      ],
      status: "Coming Fall 2025",
      price: "$29/month"
    },
    {
      name: "Prompt Optimizer Pro",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: "Create perfect ad copy and content with our AI prompt engineering tool",
      features: [
        "Ad copy generation",
        "Landing page content",
        "Email sequences",
        "Social media posts"
      ],
      status: "Coming Fall 2025",
      price: "$49/month"
    },
    {
      name: "Campaign Intelligence Suite",
      icon: (
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: "Complete campaign analytics and optimization recommendations powered by machine learning",
      features: [
        "Performance predictions",
        "Budget optimization",
        "Audience insights",
        "Competitor tracking"
      ],
      status: "Coming Winter 2025",
      price: "$99/month"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            FUTURE INNOVATIONS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Next-Gen Tools Coming Soon
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Stay ahead of the curve with our upcoming suite of AI-powered marketing tools designed to give you an unfair advantage
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {tools.map((tool, index) => (
            <div
              key={index}
              className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200 hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay={300 + index * 100}
            >
              <div className="absolute top-4 right-4">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                  {tool.status}
                </span>
              </div>

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white mb-6">
                {tool.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {tool.name}
              </h3>

              <p className="text-gray-600 mb-6">
                {tool.description}
              </p>

              <ul className="space-y-2 mb-6">
                {tool.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-purple-200">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {tool.price}
                  </span>
                  <button 
                    onClick={() => handleJoinWaitlist(tool.name)}
                    className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">
                    Join Waitlist →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white" data-aos="fade-up" data-aos-delay="600">
          <h3 className="text-3xl font-bold mb-4">
            Be the First to Access These Game-Changing Tools
          </h3>
          <p className="text-xl mb-8 text-purple-100">
            Early adopters get lifetime discounts and exclusive beta access
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#consultation-form"
              className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-bold hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
            >
              Reserve Your Spot
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/future-tools"
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold hover:bg-white/30 transition-all duration-200">
              Learn More
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <WaitlistPopup 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        toolName={selectedTool}
      />
    </section>
  );
}