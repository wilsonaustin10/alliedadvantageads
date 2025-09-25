'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function CourseLandingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/course-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage('Success! Check your email for course access.');
        setEmail('');
      } else {
        setSubmitMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="w-full py-6 px-8 bg-blue-600 flex justify-center">
        <Image 
          src="/AA White Logo 200x60.png" 
          alt="Allied Advantage" 
          width={200} 
          height={60}
          className="h-[60px] w-auto"
        />
      </header>

      <main className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Free Access{' '}
              <span className="text-blue-600">($297 Value)</span>{' '}
              to "The Ultimate Lead Generation Course"
            </h2>
            <p className="text-xl md:text-2xl text-gray-600">
              Everything you need to start and run your own Google Ads Campaigns
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Processing...' : 'Get Your Free Course'}
            </button>
          </form>

          {submitMessage && (
            <p className={`text-lg ${submitMessage.includes('Success') ? 'text-green-600' : 'text-red-600'}`}>
              {submitMessage}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}