"use client";

import { useState } from "react";

export default function LeadMagnetSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Submit to your email list endpoint
      const response = await fetch("/api/playbook-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to submit");

      setStatus("success");
      // Redirect to thank you page after short delay
      setTimeout(() => {
        window.location.href = "/thank-you";
      }, 1500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="power-pack" className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              FREE POWER PACK
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">
              The Motivated Seller{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                Deal Flow Power Pack
              </span>
            </h2>

            <p className="text-xl text-blue-100 mb-8">
              Learn how established wholesalers turn Google Ads into consistent contracts — without wasting budget on junk leads.
            </p>

            {/* What's inside */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-white">7-Step Google Ads Deal Flow Playbook</span>
                  <span className="text-blue-200"> — from search term to signed contract</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-white">Core 200 Negative Keywords</span>
                  <span className="text-blue-200"> — protect your ad spend from wasted clicks</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <span className="font-semibold text-white">Deal Tracking Tech Stack</span>
                  <span className="text-blue-200"> — tie every contract back to a click</span>
                </div>
              </div>
            </div>

            {/* Who this is for */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-sm text-blue-200">
                <span className="font-semibold text-white">Who this is for:</span> This isn't for beginners or someone just kicking the tires on wholesaling. It's for investors already closing deals who want a more predictable way to scale.
              </p>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
                <p className="text-gray-600">Your Power Pack is on its way. Redirecting you now...</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Instantly Get the 7-Step Google Ads Deal Flow Playbook
                </h3>
                <p className="text-gray-600 mb-6">
                  Plus 200 proven negative keywords to protect your ad spend. 100% free.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      id="magnet-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg text-gray-900"
                      placeholder="Enter your email"
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={`px-6 py-4 rounded-lg font-bold text-lg transition-all duration-200 whitespace-nowrap ${
                        status === "submitting"
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg transform hover:-translate-y-0.5 text-white"
                      }`}
                    >
                      {status === "submitting" ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        "Get It Free"
                      )}
                    </button>
                  </div>

                  {status === "error" && (
                    <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                  )}

                  <p className="text-xs text-gray-500 text-center">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </form>

                {/* Next steps teaser */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    <span className="font-semibold text-gray-900">Already closing deals?</span>{" "}
                    <a href="#application-form" className="text-blue-600 hover:underline font-medium">
                      Book A Strategy Session →
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Next step ladder */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-white mb-8">Your Path to Predictable Deal Flow</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Download the Power Pack</h4>
              <p className="text-sm text-blue-200">
                Learn our proven system for turning Google Ads into contracts.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Book A Strategy Session</h4>
              <p className="text-sm text-blue-200">
                If you're closing deals and investing in marketing, book a call with us.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Get Your Custom Game Plan</h4>
              <p className="text-sm text-blue-200">
                If there's a fit and we have capacity, schedule your Deal Flow Strategy Session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
