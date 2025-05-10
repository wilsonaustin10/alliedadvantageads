'use client';

import { useState, FormEvent } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

// Utility function to generate request ID
const generateRequestId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
};

// Add formatDollarAmount utility function
const formatDollarAmount = (value: string) => {
  // Remove any non-digit characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = cleanValue.split('.');
  if (parts.length > 2) return value;
  
  // Handle decimal places
  if (parts.length === 2) {
    // Limit to 2 decimal places
    parts[1] = parts[1].slice(0, 2);
    return parts[0] + '.' + parts[1];
  }
  
  return cleanValue;
};

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    requestId: '',
    firstName: '',
    lastName: '',
    businessName: '',
    hasUrl: 'no',
    websiteUrl: '',
    websiteHosting: '',
    websiteLoginUrl: '',
    websiteUsername: '',
    websitePassword: '',
    hasCrm: 'no',
    crmName: '',
    crmApiKey: '',
    zapierWebhookUrl: '',
    hasLogo: 'no',
    createLogo: 'no',
    primaryColor: '#1D4ED8',
    secondaryColor: '#FBBF24',
    publicPhone: '',
    publicEmail: '',
    hasGoogleAds: 'no',
    googleAdsId: '',
    monthlyAdSpendBudget: '',
    targetGeographyType: 'nationwide',
    includeGeography: '',
    excludeGeography: ''
  });

  const predefinedColors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Teal', hex: '#14B8A6' },
    { name: 'Orange', hex: '#F97316' },
    { name: 'Pink', hex: '#EC4899' },
    { name: 'Gray', hex: '#6B7280' }
  ];

  const suggestedPalettes = [
    { name: 'Corporate Blue/Gray', primary: '#2563EB', secondary: '#9CA3AF' },
    { name: 'Modern Tech', primary: '#1F2937', secondary: '#3B82F6' },
    { name: 'Friendly Green/Yellow', primary: '#059669', secondary: '#FBBF24' },
    { name: 'Bold & Energetic', primary: '#D946EF', secondary: '#F59E0B' },
    { name: 'Elegant Dark', primary: '#374151', secondary: '#A78BFA' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for monthlyAdSpendBudget
    if (name === 'monthlyAdSpendBudget') {
      const formattedValue = formatDollarAmount(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Generate request ID at submission time
      const requestId = generateRequestId();
      const submissionData = {
        ...formData,
        requestId
      };

      const response = await fetch('https://allied-advantage-automation.web.app/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      alert(`Form submitted successfully!\nRequest ID: ${requestId}\nSubmission ID: ${data.submissionId}`);
      // Reset form
      setFormData({
        requestId: '',
        firstName: '',
        lastName: '',
        businessName: '',
        hasUrl: 'no',
        websiteUrl: '',
        websiteHosting: '',
        websiteLoginUrl: '',
        websiteUsername: '',
        websitePassword: '',
        hasCrm: 'no',
        crmName: '',
        crmApiKey: '',
        zapierWebhookUrl: '',
        hasLogo: 'no',
        createLogo: 'no',
        primaryColor: '#1D4ED8',
        secondaryColor: '#FBBF24',
        publicPhone: '',
        publicEmail: '',
        hasGoogleAds: 'no',
        googleAdsId: '',
        monthlyAdSpendBudget: '',
        targetGeographyType: 'nationwide',
        includeGeography: '',
        excludeGeography: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className={`bg-gray-100 p-4 md:p-8 ${inter.className}`}>
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Allied LeadGen</h1>
          <p className="text-xl text-gray-600">New Client Onboarding</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Client Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">Business Entity Name</label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Website Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Website Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a website URL?</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasUrl"
                    value="yes"
                    checked={formData.hasUrl === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasUrl"
                    value="no"
                    checked={formData.hasUrl === 'no'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {formData.hasUrl === 'yes' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">Website Address (URL)</label>
                  <input
                    type="url"
                    id="websiteUrl"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="websiteHosting" className="block text-sm font-medium text-gray-700 mb-1">Where is it hosted?</label>
                  <input
                    type="text"
                    id="websiteHosting"
                    name="websiteHosting"
                    value={formData.websiteHosting}
                    onChange={handleInputChange}
                    placeholder="e.g., GoDaddy, Bluehost, WP Engine"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="websiteLoginUrl" className="block text-sm font-medium text-gray-700 mb-1">Website Login URL</label>
                  <input
                    type="url"
                    id="websiteLoginUrl"
                    name="websiteLoginUrl"
                    value={formData.websiteLoginUrl}
                    onChange={handleInputChange}
                    placeholder="e.g., https://www.example.com/wp-admin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="websiteUsername" className="block text-sm font-medium text-gray-700 mb-1">Login Username</label>
                  <input
                    type="text"
                    id="websiteUsername"
                    name="websiteUsername"
                    value={formData.websiteUsername}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="websitePassword" className="block text-sm font-medium text-gray-700 mb-1">Login Password</label>
                  <input
                    type="password"
                    id="websitePassword"
                    name="websitePassword"
                    value={formData.websitePassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">For security, consider sharing credentials securely after form submission.</p>
                </div>
              </div>
            )}
          </div>

          {/* Budget Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Budget Information</h2>
            <div>
              <label htmlFor="monthlyAdSpendBudget" className="block text-sm font-medium text-gray-700 mb-1">Monthly Ad Spend Budget</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="monthlyAdSpendBudget"
                  name="monthlyAdSpendBudget"
                  value={formData.monthlyAdSpendBudget}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Enter your planned monthly budget for advertising campaigns (e.g., $1000.00)</p>
            </div>
          </div>

          {/* CRM & Lead Delivery Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">CRM & Lead Delivery</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a CRM?</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasCrm"
                    value="yes"
                    checked={formData.hasCrm === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasCrm"
                    value="no"
                    checked={formData.hasCrm === 'no'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {formData.hasCrm === 'yes' ? (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="crmName" className="block text-sm font-medium text-gray-700 mb-1">Which CRM do you use?</label>
                  <input
                    type="text"
                    id="crmName"
                    name="crmName"
                    value={formData.crmName}
                    onChange={handleInputChange}
                    placeholder="e.g., HubSpot, Salesforce, Zoho"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="crmApiKey" className="block text-sm font-medium text-gray-700 mb-1">What is the API Key to send leads to?</label>
                  <input
                    type="text"
                    id="crmApiKey"
                    name="crmApiKey"
                    value={formData.crmApiKey}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4">
                <label htmlFor="zapierWebhookUrl" className="block text-sm font-medium text-gray-700 mb-1">What is your Zapier Webhook URL?</label>
                <input
                  type="url"
                  id="zapierWebhookUrl"
                  name="zapierWebhookUrl"
                  value={formData.zapierWebhookUrl}
                  onChange={handleInputChange}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Branding & Design Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Branding & Design</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a logo?</label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLogo"
                      value="yes"
                      checked={formData.hasLogo === 'yes'}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="hasLogo"
                      value="no"
                      checked={formData.hasLogo === 'no'}
                      onChange={handleInputChange}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
              </div>

              {formData.hasLogo === 'no' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Can we create a logo for you?</label>
                  <div className="flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="createLogo"
                        value="yes"
                        checked={formData.createLogo === 'yes'}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="createLogo"
                        value="no"
                        checked={formData.createLogo === 'no'}
                        onChange={handleInputChange}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload your logo (if you have one):</label>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landing Page Colors</label>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                    <input
                      type="text"
                      id="primaryColor"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      placeholder="#1D4ED8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 mt-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color.hex}
                          type="button"
                          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 focus:outline-none focus:border-blue-500"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setFormData(prev => ({ ...prev, primaryColor: color.hex }))}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                    <input
                      type="text"
                      id="secondaryColor"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      placeholder="#FBBF24"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2 mt-2">
                      {predefinedColors.map(color => (
                        <button
                          key={color.hex}
                          type="button"
                          className="w-8 h-8 rounded-full border-2 border-transparent hover:border-gray-400 focus:outline-none focus:border-blue-500"
                          style={{ backgroundColor: color.hex }}
                          onClick={() => setFormData(prev => ({ ...prev, secondaryColor: color.hex }))}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggested Color Palettes:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {suggestedPalettes.map(palette => (
                      <button
                        key={palette.name}
                        type="button"
                        className="p-2 border rounded hover:border-blue-500 focus:outline-none focus:border-blue-500"
                        onClick={() => setFormData(prev => ({
                          ...prev,
                          primaryColor: palette.primary,
                          secondaryColor: palette.secondary
                        }))}
                      >
                        <p className="text-sm font-medium mb-1">{palette.name}</p>
                        <div className="flex gap-1">
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.primary }} />
                          <div className="w-6 h-6 rounded" style={{ backgroundColor: palette.secondary }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Public Contact Information Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Public Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="publicPhone" className="block text-sm font-medium text-gray-700 mb-1">Public Phone Number</label>
                <input
                  type="tel"
                  id="publicPhone"
                  name="publicPhone"
                  value={formData.publicPhone}
                  onChange={handleInputChange}
                  placeholder="(555) 123-4567"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="publicEmail" className="block text-sm font-medium text-gray-700 mb-1">Public Email Address</label>
                <input
                  type="email"
                  id="publicEmail"
                  name="publicEmail"
                  value={formData.publicEmail}
                  onChange={handleInputChange}
                  placeholder="contact@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Google Ads Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Google Ads</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a Google Ads account?</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasGoogleAds"
                    value="yes"
                    checked={formData.hasGoogleAds === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasGoogleAds"
                    value="no"
                    checked={formData.hasGoogleAds === 'no'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>

            {formData.hasGoogleAds === 'yes' && (
              <div className="mt-4">
                <label htmlFor="googleAdsId" className="block text-sm font-medium text-gray-700 mb-1">Google Ads Account ID</label>
                <input
                  type="text"
                  id="googleAdsId"
                  name="googleAdsId"
                  value={formData.googleAdsId}
                  onChange={handleInputChange}
                  placeholder="e.g., 123-456-7890"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          {/* Target Geography Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Target Geography</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What is your target geography?</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="targetGeographyType"
                    value="nationwide"
                    checked={formData.targetGeographyType === 'nationwide'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Nationwide (USA)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="targetGeographyType"
                    value="specific"
                    checked={formData.targetGeographyType === 'specific'}
                    onChange={handleInputChange}
                    className="form-radio h-4 w-4 text-blue-600"
                  />
                  <span className="ml-2">Specific States/Metro Areas</span>
                </label>
              </div>
            </div>

            {formData.targetGeographyType === 'specific' && (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="includeGeography" className="block text-sm font-medium text-gray-700 mb-1">States or Metro Areas to INCLUDE</label>
                  <textarea
                    id="includeGeography"
                    name="includeGeography"
                    value={formData.includeGeography}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., California, New York City, Dallas-Fort Worth metro"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple entries with commas or new lines.</p>
                </div>
                <div>
                  <label htmlFor="excludeGeography" className="block text-sm font-medium text-gray-700 mb-1">States or Metro Areas to EXCLUDE</label>
                  <textarea
                    id="excludeGeography"
                    name="excludeGeography"
                    value={formData.excludeGeography}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="e.g., Alaska, Hawaii (if targeting continental US)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">Separate multiple entries with commas or new lines.</p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center pt-4">
            <button
              type="submit"
              className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Onboarding Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 