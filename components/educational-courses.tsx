"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const WaitlistPopup = dynamic(() => import("./waitlist-popup"), { ssr: false });

export default function EducationalCourses() {
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  const handleEnroll = (courseName: string) => {
    setSelectedCourse(courseName);
    setIsEnrollOpen(true);
  };
  const courses = [
    {
      title: "Google Ads Foundations",
      level: "Beginner to Advanced",
      duration: "8 weeks",
      modules: 12,
      description: "Master Google Ads from the ground up. Build bulletproof account structures and launch high-converting campaigns.",
      topics: [
        "Campaign structure and objectives",
        "Keyword and audience research",
        "Ad copy & extension best practices",
        "Budget pacing and optimization"
      ],
      icon: "📘",
      color: "blue"
    },
    {
      title: "Search Ads Domination",
      level: "Intermediate",
      duration: "6 weeks",
      modules: 10,
      description: "Conquer Google Ads search campaigns with proven strategies for high-intent traffic and conversion scaling.",
      topics: [
        "Keyword research mastery",
        "Quality score optimization",
        "Conversion tracking setup",
        "Advanced bidding strategies"
      ],
      icon: "🔍",
      color: "green"
    },
    {
      title: "Conversion Tracking Blueprint",
      level: "All Levels",
      duration: "4 weeks",
      modules: 8,
      description: "Implement bulletproof conversion tracking that keeps your Google Ads campaigns optimized and accountable.",
      topics: [
        "Tag Manager and GA4 essentials",
        "Offline conversion imports",
        "Attribution modeling",
        "Testing & troubleshooting"
      ],
      icon: "🧠",
      color: "purple"
    },
    {
      title: "AI Optimization for Google Ads",
      level: "Advanced",
      duration: "10 weeks",
      modules: 15,
      description: "Leverage AI tools and automation to 10x your Google Ads performance with less effort.",
      topics: [
        "AI tool integration",
        "Automated campaign management",
        "Predictive bid adjustments",
        "Machine learning basics"
      ],
      icon: "🤖",
      color: "indigo"
    }
  ];

  const benefits = [
    "Lifetime access to all course materials",
    "Weekly live Q&A sessions with experts",
    "Private community of successful marketers",
    "Real campaign walkthroughs and case studies",
    "Certificate of completion for each course",
    "30-day money-back guarantee"
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, border: string, text: string }> = {
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-600" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-600" },
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-600" }
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-4" data-aos="fade-up">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            FREE EDUCATION
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4" data-aos="fade-up" data-aos-delay="100">
            Learn From the Best, For Free
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            Empower yourself with cutting-edge marketing knowledge. Our comprehensive courses help you maximize your campaigns and achieve extraordinary results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {courses.map((course, index) => {
            const colors = getColorClasses(course.color);
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-2xl p-8 hover:shadow-xl transition-all duration-300`}
                data-aos="fade-up"
                data-aos-delay={300 + index * 100}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{course.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            {course.modules} modules
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className={`inline-block ${colors.text} ${colors.bg} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  {course.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2">
                    {course.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start gap-2">
                        <svg className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button 
                  onClick={() => handleEnroll(course.title)}
                  className={`w-full ${colors.text} font-semibold py-3 px-6 rounded-lg border-2 ${colors.border} hover:bg-opacity-50 transition-all duration-200`}>
                  Enroll for Free →
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-12 text-white" data-aos="fade-up" data-aos-delay="700">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Why We Offer Free Education
              </h3>
              <p className="text-lg mb-6 text-green-50">
                We believe that when our clients succeed, we succeed. By providing world-class education at no cost, we empower businesses to achieve their full potential and build lasting partnerships.
              </p>
              <ul className="space-y-3">
                {benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-50">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
                <h4 className="text-2xl font-bold mb-4">Course Benefits</h4>
                <ul className="space-y-3">
                  {benefits.slice(3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-300 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-50">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#consultation-form"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-full font-bold mt-6 hover:shadow-xl transform transition-all duration-200 hover:-translate-y-1"
                >
                  Start Learning Today
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <WaitlistPopup 
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
        toolName={`${selectedCourse} Course`}
      />
    </section>
  );
}