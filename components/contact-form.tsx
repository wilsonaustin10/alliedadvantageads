"use client";

import React, { useState, useEffect } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    package: ''
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Real-time validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length < 2) return 'Name must be at least 2 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      case 'phone':
        if (value && !/^[\d\s\-\(\)\+\.]/.test(value)) return 'Please enter a valid phone number';
        return '';
      case 'package':
        if (!value) return 'Please select a package';
        return '';
      default:
        return '';
    }
  };

  // Check form validity
  useEffect(() => {
    const requiredFields = ['name', 'email', 'package'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].trim());
    const hasNoErrors = Object.values(fieldErrors).every(error => !error);
    setIsFormValid(hasRequiredFields && hasNoErrors);
  }, [formData, fieldErrors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
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
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        package: ''
      });

      // Reset form to idle state after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      setErrorMessage('Failed to submit form. Please try again later.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error
    }));

    // Clear general error when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <section id="get-started" className="relative bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            Get Started Today
          </h2>
          <p className="mb-8 text-center text-lg text-gray-600">
            Fill out the form below and start generating quality leads within 48 hours. We'll respond within 2 business hours.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  disabled={status === 'submitting'}
                  value={formData.name}
                  onChange={handleChange}
                  autoFocus
                  className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                    fieldErrors.name 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                />
                {fieldErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
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
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  disabled={status === 'submitting'}
                  value={formData.phone}
                  onChange={handleChange}
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
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  disabled={status === 'submitting'}
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="package" className="block text-sm font-medium text-gray-700">
                Interested Package
              </label>
              <select
                name="package"
                id="package"
                required
                disabled={status === 'submitting'}
                value={formData.package}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border px-4 py-3 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 ${
                  fieldErrors.package 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                aria-describedby={fieldErrors.package ? 'package-error' : undefined}
              >
                <option value="">Select a package</option>
                <option value="landing-page">Custom Landing Page</option>
                <option value="google-ppc">Google PPC Package - Most Popular</option>
                <option value="google-facebook">Google + Facebook PPC Package - Best Value</option>
              </select>
              {fieldErrors.package && (
                <p id="package-error" className="mt-1 text-sm text-red-600" role="alert">
                  {fieldErrors.package}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                disabled={status === 'submitting'}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              />
            </div>

            {status === 'error' && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  {errorMessage}
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="text-sm text-green-700">
                  Thank you for your submission! We'll be in touch soon.
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                disabled={status === 'submitting' || !isFormValid}
                className={`inline-block rounded-lg px-12 py-4 text-center text-base font-semibold text-white shadow-lg transition-all duration-200 ${
                  status === 'submitting' || !isFormValid
                    ? 'cursor-not-allowed opacity-50 bg-gray-400'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
                aria-describedby="submit-status"
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Request'
                )}
              </button>
              {!isFormValid && (
                <p id="submit-status" className="mt-2 text-sm text-gray-500 text-center">
                  Please fill in all required fields
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
} 