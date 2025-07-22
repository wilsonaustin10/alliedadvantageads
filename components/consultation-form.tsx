"use client";

import React, { useState, useEffect } from 'react';

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dealsPerMonth: '',
    a2pConsent: false,
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

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
      case 'dealsPerMonth':
        if (!value) return 'Please select how many deals you close per month';
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
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'dealsPerMonth'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].toString().trim());
    const hasA2PConsent = formData.a2pConsent === true;
    const hasNoErrors = Object.values(fieldErrors).every(error => !error);
    setIsFormValid(hasRequiredFields && hasA2PConsent && hasNoErrors);
  }, [formData, fieldErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setStatus('success');
      setShowCalendar(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    
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

  if (showCalendar) {
    return (
      <section id="consultation-form" className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Great! Now Let's Schedule Your Free Consultation
            </h2>
            <p className="text-lg text-gray-600">
              Pick a time that works best for you. We'll discuss your goals and create a custom lead generation strategy.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-xl p-8">
            {/* Calendly embed */}
            <div className="calendly-inline-widget" data-url="https://calendly.com/alliedadvantageads/consultation" style={{minWidth: '320px', height: '700px'}}></div>
            <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
            
            {/* Fallback message if Calendly doesn't load */}
            <div className="text-center mt-8 text-gray-600">
              <p>Having trouble loading the calendar? <a href="https://calendly.com/alliedadvantageads/consultation" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Click here to schedule directly</a>.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="consultation-form" className="relative bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Get Your Free Consultation
          </h2>
          <p className="mb-8 text-center text-lg text-gray-600">
            Tell us about your business and we'll create a custom lead generation strategy that delivers results.
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
              <label htmlFor="dealsPerMonth" className="block text-sm font-medium text-gray-700">
                How Many Deals Are You Closing Per Month? <span className="text-red-500">*</span>
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
                <option value="">Select number of deals</option>
                <option value="0-1">0-1 deals per month</option>
                <option value="2-5">2-5 deals per month</option>
                <option value="6-10">6-10 deals per month</option>
                <option value="11-20">11-20 deals per month</option>
                <option value="20+">20+ deals per month</option>
              </select>
              {fieldErrors.dealsPerMonth && (
                <p id="dealsPerMonth-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldErrors.dealsPerMonth}
                </p>
              )}
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
                    By checking this box, you consent to receive autodialed promotional text messages from Allied Advantage Ads at the phone number provided above. 
                    Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe. View our <a href="/terms" className="text-blue-600 hover:underline">Terms</a> and <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
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
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
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
                  'Get My Free Consultation'
                )}
              </button>
              <div className="mt-4 text-sm text-gray-500 max-w-lg mx-auto">
                <p className="mb-2">🔒 Your information is 100% secure. We'll never spam you.</p>
                <p>
                  By submitting this form, you consent to Allied Advantage Ads contacting you via phone, email, or text about our services. 
                  View our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}