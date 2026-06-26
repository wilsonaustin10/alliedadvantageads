"use client";

import React, { useState } from 'react';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    a2pConsent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStatus('success');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-green-900 mb-2">Thank you!</h2>
        <p className="text-green-800">
          We&apos;ve received your request and a member of our team will reach out to schedule your consultation.
        </p>
      </div>
    );
  }

  const inputClasses =
    "block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={inputClasses}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          id="phone"
          required
          autoComplete="tel"
          value={formData.phone}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className={inputClasses}
        />
      </div>

      <div className="flex items-start">
        <input
          type="checkbox"
          name="a2pConsent"
          id="a2pConsent"
          checked={formData.a2pConsent}
          onChange={handleChange}
          disabled={status === 'submitting'}
          className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
          aria-describedby="a2pConsent-description"
        />
        <label htmlFor="a2pConsent" className="ml-3 text-sm text-gray-700">
          <span className="font-medium">I agree to receive text messages</span>
          <p id="a2pConsent-description" className="mt-1 text-gray-600">
            By checking this box, you agree to receive automated text messages from Allied Advantage Ads — including appointment confirmations, reminders, and account/service notifications — at the phone number provided above. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help. View our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>
        </label>
      </div>

      {status === 'error' && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Submitting…' : 'Book Consultation'}
      </button>
    </form>
  );
}
