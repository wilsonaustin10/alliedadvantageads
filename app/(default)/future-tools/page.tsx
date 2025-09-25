"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const WaitlistPopup = dynamic(() => import("@/components/waitlist-popup"), { ssr: false });

export default function FutureToolsPage() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState("");

  const handleJoinWaitlist = (toolName: string) => {
    setSelectedTool(toolName);
    setIsWaitlistOpen(true);
  };

  const tools = [
    {
      name: "AI Keyword Generator",
      price: "$29/month",
      releaseDate: "Fall 2025",
      description: "Transform your keyword research with AI-powered insights that identify hidden opportunities your competitors miss.",
      icon: "🔍",
      features: [
        {
          title: "Semantic Keyword Expansion",
          description: "Discover related keywords and phrases that capture user intent beyond basic matching"
        },
        {
          title: "Competition Analysis",
          description: "Real-time analysis of keyword difficulty and competitor strategies"
        },
        {
          title: "Search Volume Predictions",
          description: "AI forecasts future search trends before they become mainstream"
        },
        {
          title: "ROI Projections",
          description: "Calculate expected returns for each keyword based on historical data"
        },
        {
          title: "Long-tail Discovery",
          description: "Uncover profitable long-tail keywords with high conversion potential"
        }
      ],
      benefits: [
        "Reduce keyword research time by 85%",
        "Discover 10x more profitable keywords",
        "Predict trends before competitors",
        "Maximize ad spend efficiency"
      ]
    },
    {
      name: "Prompt Optimizer Pro",
      price: "$49/month",
      releaseDate: "Fall 2025",
      description: "Create perfect ad copy and content in seconds with our advanced prompt engineering system.",
      icon: "✨",
      features: [
        {
          title: "Ad Copy Generation",
          description: "Generate hundreds of high-converting ad variations instantly"
        },
        {
          title: "Landing Page Content",
          description: "Create compelling landing page copy that matches user intent"
        },
        {
          title: "Email Sequences",
          description: "Build complete nurture campaigns with personalized messaging"
        },
        {
          title: "A/B Test Variations",
          description: "Automatically generate testing variations with different angles"
        },
        {
          title: "Tone & Style Matching",
          description: "Maintain brand voice consistency across all content"
        }
      ],
      benefits: [
        "Write 50x faster than manual creation",
        "Improve CTR by average of 42%",
        "Maintain perfect brand consistency",
        "Never run out of creative ideas"
      ]
    },
    {
      name: "Campaign Intelligence Suite",
      price: "$99/month",
      releaseDate: "Winter 2025",
      description: "Enterprise-level campaign analytics and optimization powered by machine learning.",
      icon: "📊",
      features: [
        {
          title: "Predictive Performance Modeling",
          description: "Forecast campaign performance before spending a dollar"
        },
        {
          title: "Budget Optimization Engine",
          description: "AI allocates budget across campaigns for maximum ROI"
        },
        {
          title: "Audience Intelligence",
          description: "Deep insights into audience behavior and preferences"
        },
        {
          title: "Competitor Monitoring",
          description: "Track competitor campaigns and strategies in real-time"
        },
        {
          title: "Custom Reporting",
          description: "White-label reports with actionable recommendations"
        }
      ],
      benefits: [
        "Increase ROAS by average of 67%",
        "Save 15 hours per week on analysis",
        "Spot opportunities before competitors",
        "Make data-driven decisions instantly"
      ]
    }
  ];

  const roadmap = [
    {
      quarter: "Q3 2025",
      title: "Beta Launch",
      items: [
        "AI Keyword Generator beta access",
        "Prompt Optimizer Pro early preview",
        "Founding member pricing locked in"
      ]
    },
    {
      quarter: "Q4 2025",
      title: "Public Release",
      items: [
        "Full public launch of first two tools",
        "API access for developers",
        "Campaign Intelligence Suite beta"
      ]
    },
    {
      quarter: "Q1 2026",
      title: "Full Suite Available",
      items: [
        "All tools fully operational",
        "Advanced integrations launched",
        "Enterprise features released"
      ]
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              COMING SOON
            </div>
            
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
              The Future of AI Marketing
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Revolutionary tools that give you an unfair advantage over your competition. 
              Join the waitlist to secure early access and lifetime discounts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSelectedTool("");
                  setIsWaitlistOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform transition-all duration-200 hover:-translate-y-1"
              >
                Join Early Access List
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-200"
              >
                View Pricing
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Detail Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Powerful Tools, Simple Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each tool is designed to work independently or as part of our complete marketing ecosystem
            </p>
          </div>

          <div className="space-y-20">
            {tools.map((tool, index) => (
              <div key={index} className={`${index % 2 === 0 ? '' : 'bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 py-12 rounded-2xl'}`}>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className={`${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="flex items-start gap-4 mb-6">
                      <span className="text-5xl">{tool.icon}</span>
                      <div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">
                          {tool.name}
                        </h3>
                        <div className="flex items-center gap-4">
                          <span className="text-2xl font-bold text-purple-600">
                            {tool.price}
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {tool.releaseDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg text-gray-700 mb-8">
                      {tool.description}
                    </p>

                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 mb-4">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {tool.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleJoinWaitlist(tool.name)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
                    >
                      Reserve Your Spot
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>

                  <div className={`${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
                      <h4 className="font-semibold text-gray-900 mb-6">Features Include:</h4>
                      <div className="space-y-4">
                        {tool.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="border-l-4 border-purple-400 pl-4">
                            <h5 className="font-semibold text-gray-900 mb-1">{feature.title}</h5>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Product Roadmap
            </h2>
            <p className="text-xl text-gray-600">
              Our timeline for revolutionizing digital marketing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {roadmap.map((phase, index) => (
              <div key={index} className="relative">
                {index < roadmap.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-purple-400 to-transparent"></div>
                )}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{phase.quarter}</h3>
                  <h4 className="text-lg font-semibold text-purple-600 mb-4">{phase.title}</h4>
                  <ul className="space-y-2">
                    {phase.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Early Bird Pricing
            </h2>
            <p className="text-xl text-purple-100">
              Lock in lifetime discounts by joining the waitlist today
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Starter</h3>
              <div className="text-4xl font-bold mb-2">$29</div>
              <p className="text-purple-100 mb-6">/month per tool</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Single tool access</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Basic support</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Monthly updates</span>
                </li>
              </ul>
            </div>

            <div className="bg-white text-gray-900 rounded-2xl p-8 transform scale-105 shadow-2xl">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm px-4 py-1 rounded-full inline-block mb-4">
                BEST VALUE
              </div>
              <h3 className="text-2xl font-bold mb-4">Professional</h3>
              <div className="text-4xl font-bold mb-2">$99</div>
              <p className="text-gray-600 mb-6">/month for all tools</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>All tools included</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Priority support</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>API access</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Save $78/month</span>
                </li>
              </ul>
              <button
                onClick={() => {
                  setSelectedTool("Professional Plan");
                  setIsWaitlistOpen(true);
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
              >
                Get Early Access
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <div className="text-4xl font-bold mb-2">Custom</div>
              <p className="text-purple-100 mb-6">Contact for pricing</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>White label options</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Dedicated support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Don't Get Left Behind
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            These tools will transform how businesses approach digital marketing. 
            Early adopters will have a massive advantage over their competition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setSelectedTool("");
                setIsWaitlistOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
            >
              Reserve Your Spot Now
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-200"
            >
              Back to Homepage
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <WaitlistPopup 
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        toolName={selectedTool}
      />
    </>
  );
}