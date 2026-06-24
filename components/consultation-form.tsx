"use client";

import React, { useState, useEffect } from 'react';

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    primaryMarket: '',
    monthlyBudget: '',
    dealsPerMonth: '',
    biggestBottleneck: '',
    a2pConsent: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isQualified, setIsQualified] = useState(false);

  // Qualification check based on budget and deals
  const checkQualification = (budget: string, deals: string): boolean => {
    const disqualifiedBudgets = ['Less than $3k/mo'];
    const disqualifiedDeals = ['0 deals (just getting started)'];
    // Disqualified if budget is too low OR no deals closed
    if (disqualifiedBudgets.includes(budget) || disqualifiedDeals.includes(deals)) {
      return false;
    }
    return true;
  };

  // Real-time validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'First name is required';
        if (value.length < 2) return 'First name must be at least 2 characters';
        return '';
      case 'lastName':
        if (!value.trim()) return 'Last name is required';
        if (value.length < 2) return 'Last name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-\(\)\+\.]{10,}$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'primaryMarket':
        if (!value.trim()) return 'Primary market is required';
        return '';
      case 'monthlyBudget':
        if (!value) return 'Please select your monthly marketing budget';
        return '';
      case 'dealsPerMonth':
        if (!value) return 'Please select how many deals you\'ve closed';
        return '';
      case 'a2pConsent':
        if (!value) return 'You must agree to receive text messages';
        return '';
      default:
        return '';
    }
  };

  // Check form validity
  useEffect(() => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'primaryMarket', 'monthlyBudget', 'dealsPerMonth'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].toString().trim());
    const hasA2PConsent = formData.a2pConsent === true;
    const hasNoErrors = Object.values(fieldErrors).every(error => !error);
    setIsFormValid(hasRequiredFields && hasA2PConsent && hasNoErrors);
  }, [formData, fieldErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    // Check qualification before submitting
    const qualified = checkQualification(formData.monthlyBudget, formData.dealsPerMonth);
    setIsQualified(qualified);

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isQualified: qualified,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      setStatus('success');
      if (qualified) {
        setShowCalendar(true);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setStatus('error');
      setErrorMessage('Failed to submit application. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Update form data
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: fieldValue
    });

    // Real-time validation
    const error = validateField(name, fieldValue.toString());
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Clear general error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  // Success state - Qualified: Show Calendly
  if (showCalendar && isQualified) {
    return (
      <section id="application-form" className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Application Received
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              You Qualify! Book A Strategy Session
            </h2>
            <p className="text-lg text-gray-600">
              Based on your application, you're a great fit for our Wholesaler Deal Flow System. Pick a time below to discuss your goals and see if we have capacity in your market.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Calendly embed */}
            <div className="calendly-inline-widget" data-url="https://calendly.com/austin-alliedleadvantage-ads/30min" style={{minWidth: '320px', height: '700px'}}></div>
            <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>

            {/* Fallback message if Calendly doesn't load */}
            <div className="text-center mt-8 text-gray-600">
              <p>Having trouble loading the calendar? <a href="https://calendly.com/austin-alliedleadvantage-ads/30min" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Click here to schedule directly</a>.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Success state - Not Qualified: Show thank you message
  if (status === 'success' && !isQualified) {
    return (
      <section id="application-form" className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="bg-white rounded-lg shadow-xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thanks for Your Application
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-xl mx-auto">
              We've received your application and will review it shortly. If there's a fit and we have capacity in your market, a member of our team will reach out within 1-2 business days.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-900">In the meantime:</span> Check your email for our Motivated Seller Deal Flow Power Pack with strategies you can implement today.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="application-form" className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Book A Strategy Session
          </h2>
          <p className="mb-8 text-center text-lg text-gray-600">
            Tell us a bit about your business so we can confirm capacity in your market.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  required
                  disabled={status === 'submitting'}
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                    fieldErrors.firstName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  aria-describedby={fieldErrors.firstName ? 'firstName-error' : undefined}
                />
                {fieldErrors.firstName && (
                  <p id="firstName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  required
                  disabled={status === 'submitting'}
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                    fieldErrors.lastName
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  aria-describedby={fieldErrors.lastName ? 'lastName-error' : undefined}
                />
                {fieldErrors.lastName && (
                  <p id="lastName-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                disabled={status === 'submitting'}
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                  fieldErrors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                disabled={status === 'submitting'}
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                  fieldErrors.phone
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
              />
              {fieldErrors.phone && (
                <p id="phone-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="primaryMarket" className="block text-sm font-medium text-gray-700">
                Primary Market(s) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="primaryMarket"
                id="primaryMarket"
                required
                disabled={status === 'submitting'}
                value={formData.primaryMarket}
                onChange={handleChange}
                placeholder="e.g., Dallas-Fort Worth, Houston"
                className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                  fieldErrors.primaryMarket
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                aria-describedby={fieldErrors.primaryMarket ? 'primaryMarket-error' : undefined}
              />
              {fieldErrors.primaryMarket && (
                <p id="primaryMarket-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldErrors.primaryMarket}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="monthlyBudget" className="block text-sm font-medium text-gray-700">
                  Monthly Marketing Budget <span className="text-red-500">*</span>
                </label>
                <select
                  name="monthlyBudget"
                  id="monthlyBudget"
                  required
                  disabled={status === 'submitting'}
                  value={formData.monthlyBudget}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                    fieldErrors.monthlyBudget
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  aria-describedby={fieldErrors.monthlyBudget ? 'monthlyBudget-error' : undefined}
                >
                  <option value="">Select budget range</option>
                  <option value="Less than $3k/mo">Less than $3k/mo</option>
                  <option value="$3k - $5k/mo">$3k - $5k/mo</option>
                  <option value="$5k - $10k/mo">$5k - $10k/mo</option>
                  <option value="$10k+/mo">$10k+/mo</option>
                </select>
                {fieldErrors.monthlyBudget && (
                  <p id="monthlyBudget-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.monthlyBudget}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="dealsPerMonth" className="block text-sm font-medium text-gray-700">
                  Deals Closed (Last 6 Months) <span className="text-red-500">*</span>
                </label>
                <select
                  name="dealsPerMonth"
                  id="dealsPerMonth"
                  required
                  disabled={status === 'submitting'}
                  value={formData.dealsPerMonth}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                    fieldErrors.dealsPerMonth
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  aria-describedby={fieldErrors.dealsPerMonth ? 'dealsPerMonth-error' : undefined}
                >
                  <option value="">Select deal range</option>
                  <option value="0 deals">0 deals (just getting started)</option>
                  <option value="1-2 deals">1-2 deals</option>
                  <option value="3-5 deals">3-5 deals</option>
                  <option value="6-10 deals">6-10 deals</option>
                  <option value="10+ deals">10+ deals</option>
                </select>
                {fieldErrors.dealsPerMonth && (
                  <p id="dealsPerMonth-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.dealsPerMonth}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="biggestBottleneck" className="block text-sm font-medium text-gray-700">
                Biggest Bottleneck Right Now <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                name="biggestBottleneck"
                id="biggestBottleneck"
                rows={3}
                disabled={status === 'submitting'}
                value={formData.biggestBottleneck}
                onChange={handleChange}
                placeholder="What's the biggest challenge holding back your deal flow?"
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50"
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="a2pConsent"
                  id="a2pConsent"
                  required
                  disabled={status === 'submitting'}
                  checked={formData.a2pConsent}
                  onChange={handleChange}
                  className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50"
                  aria-describedby="a2pConsent-description"
                />
                <label htmlFor="a2pConsent" className="ml-3 text-sm text-gray-700">
                  <span className="font-medium">I agree to receive text messages <span className="text-red-500">*</span></span>
                  <p id="a2pConsent-description" className="mt-1 text-gray-600">
                    By checking this box, you agree to receive automated text messages from Allied Advantage Ads — including appointment confirmations, reminders, and account/service notifications — at the phone number provided above. Consent is not a condition of purchase. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe, HELP for help. View our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                  </p>
                </label>
              </div>
              {fieldErrors.a2pConsent && (
                <p className="mt-2 ml-8 text-sm text-red-600" role="alert">
                  {fieldErrors.a2pConsent}
                </p>
              )}
            </div>

            {status === 'error' && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {errorMessage}
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={status === 'submitting' || !isFormValid}
                className={`inline-block rounded-full px-12 py-4 text-center text-lg font-bold text-white shadow-lg transition-all duration-200 ${
                  status === 'submitting' || !isFormValid
                    ? 'cursor-not-allowed opacity-50 bg-gray-400'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
                aria-describedby="submit-status"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
              <p className="mt-4 text-sm text-gray-500">
                We review all applications within 1-2 business days.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
