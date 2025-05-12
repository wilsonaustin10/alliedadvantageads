"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import ContactForm from '@/components/contact-form';
import Image from 'next/image';

export default function SalesFunnel() {
  const [isAnnual, setIsAnnual] = useState(false);
  const monthlyPrice = 1500;
  const annualPrice = Math.round(monthlyPrice * 0.7); // 30% discount

  return (
    <>
      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="text-center pb-12 md:pb-16">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">
                Generate Exclusive <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Motivated Seller Leads</span>
              </h1>
              <div className="max-w-3xl mx-auto">
                <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">
                  Empower your real estate wholesale business with cost-effective, high-quality leads and take control of your marketing destiny. Stop relying on shared, overpriced PPL leads.
                </p>
                <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div data-aos="zoom-y-out" data-aos-delay="300">
                    <Link href="#offer" className="btn text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0">
                      Get Started Today →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
              <h2 className="h2 mb-4">Why Choose Allied Advantage Ads?</h2>
              <p className="text-xl text-gray-600">
                We understand the challenges real estate wholesalers face. Our proprietary strategy delivers consistent results, like an <span className="font-semibold text-blue-600">average lead cost of $18 nationwide*</span>.
              </p>
            </div>
            <div className="max-w-sm mx-auto grid gap-8 md:grid-cols-3 lg:gap-16 items-start md:max-w-none">
              <div className="relative flex flex-col items-center" data-aos="zoom-y-out" data-aos-delay="150">
                <div className="w-16 h-16 mb-4">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-blue-600 h-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="h4 mb-2">Exclusive Leads, Not PPL</h4>
                <p className="text-lg text-gray-600 text-center">Get motivated seller leads generated exclusively for your brand. No more competing for stale, widely distributed PPL lists.</p>
              </div>
              <div className="relative flex flex-col items-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div className="w-16 h-16 mb-4">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-blue-600 h-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="h4 mb-2">Control Your Marketing</h4>
                <p className="text-lg text-gray-600 text-center">Build your own brand and marketing assets. We empower you to own your lead flow and scale effectively.</p>
              </div>
              <div className="relative flex flex-col items-center" data-aos="zoom-y-out" data-aos-delay="450">
                <div className="w-16 h-16 mb-4">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-2xl bg-blue-600 h-full">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                    </svg>
                  </div>
                </div>
                <h4 className="h4 mb-2">Decades of Expertise</h4>
                <p className="text-lg text-gray-600 text-center">Leverage our 10+ years in real estate and digital marketing to get campaigns that are dialed in for wholesalers.</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 text-center mt-8">
              *Results not guaranteed. Average lead cost can vary based on market conditions and other factors.
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="offer" className="relative bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="py-12 md:py-20">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Our Premium Package</h2>
              <p className="text-xl text-gray-600">The ultimate solution for wholesalers seeking quality motivated seller leads.</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {/* Platinum Google PPC Package */}
              <div className="bg-white p-8 rounded-lg shadow-xl relative" data-aos="zoom-y-out">
                <div className="absolute top-0 right-0 left-0 -mt-4 text-center">
                  <div className="inline-flex text-lg font-bold py-2 px-6 text-blue-600 bg-blue-100 rounded-full">Premium Offering</div>
                </div>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 mt-4">PLATINUM GOOGLE PPC PACKAGE</h3>
                  
                  {/* Billing Toggle */}
                  <div className="flex items-center justify-center mb-6">
                    <span className={`mr-3 text-lg ${!isAnnual ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>Monthly</span>
                    <button
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      onClick={() => setIsAnnual(!isAnnual)}
                      role="switch"
                      aria-checked={isAnnual}
                    >
                      <span
                        className={`${
                          isAnnual ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                      />
                    </button>
                    <span className={`ml-3 text-lg ${isAnnual ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                      Annual <span className="text-green-600 text-sm">(Save 30%)</span>
                    </span>
                  </div>

                  <div className="relative inline-block">
                    <div className="text-3xl text-gray-400 mb-2 relative">
                      <span className="relative">
                        $2,500
                        <span className="absolute left-0 right-0 top-1/2 border-t-2 border-red-500 transform -rotate-12"></span>
                      </span>
                    </div>
                    <div className="text-5xl font-bold text-blue-600 mb-4">
                      ${isAnnual ? annualPrice : monthlyPrice}
                      <span className="text-2xl text-gray-600">/month</span>
                      {isAnnual && <div className="text-green-600 text-lg font-normal">Billed annually</div>}
                    </div>
                  </div>
                  <p className="text-xl text-gray-600">Exclusive, high-converting motivated seller leads for your wholesaling business</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                  <ul className="text-gray-600 space-y-4">
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Expert keyword research & optimization</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Compelling ad copy creation</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">High-converting landing page optimization</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Professional call tracking & recording</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Monthly performance optimization</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-lg">Dedicated campaign manager</span>
                    </li>
                  </ul>
                </div>
                <div className="text-center">
                  <Link href="#consultation" className="btn text-white bg-blue-600 hover:bg-blue-700 w-full md:w-auto md:px-12">
                    Get Started Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="consultation">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pb-12 md:pb-20">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="h2 mb-4">Get Started Today</h2>
              <p className="text-xl text-gray-600">
                Ready to supercharge your lead generation? Fill out the form below, or if you have questions, let's schedule a <span className="font-semibold">FREE, no-obligation consultation</span> to discuss your wholesaling goals.
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
} 