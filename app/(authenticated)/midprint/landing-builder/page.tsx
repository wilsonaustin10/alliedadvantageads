'use client';

import { useState } from 'react';
import type { LandingPageConfig } from '@/app/api/midprint/landing-builder/types';

export default function LandingPageBuilder() {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [validationResults, setValidationResults] = useState<any>(null);

  const [formData, setFormData] = useState<LandingPageConfig>({
    company: {
      name: '',
      email: '',
      phone: '',
      logo: '',
      description: ''
    },
    design: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    components: {
      header: true,
      hero: true,
      benefits: true,
      testimonials: true,
      leadForm: true,
      footer: true,
      privacyPage: false,
      termsPage: false,
      aboutPage: false
    },
    seo: {
      title: '',
      description: '',
      keywords: []
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleComponentToggle = (component: string) => {
    setFormData(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [component]: !prev.components[component as keyof typeof prev.components]
      }
    }));
  };

  const generateLandingPage = async () => {
    setLoading(true);
    setError('');
    setPreviewUrl('');
    setValidationResults(null);

    try {
      const response = await fetch('/api/midprint/landing-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate landing page');
      }

      if (data.preview) {
        setPreviewUrl(data.preview);
      }

      if (data.validation) {
        setValidationResults(data.validation);
      }

      if (data.page?.html) {
        const blob = new Blob([data.page.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Landing Page Builder</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    value={formData.company.name}
                    onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.company.email}
                    onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.company.phone}
                    onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Logo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={formData.company.logo}
                    onChange={(e) => handleInputChange('company', 'logo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    value={formData.company.description}
                    onChange={(e) => handleInputChange('company', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    placeholder="Describe your business, services, and unique value proposition..."
                    required
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Design Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Primary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.design.primaryColor}
                      onChange={(e) => handleInputChange('design', 'primaryColor', e.target.value)}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.design.primaryColor}
                      onChange={(e) => handleInputChange('design', 'primaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Secondary Color
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.design.secondaryColor}
                      onChange={(e) => handleInputChange('design', 'secondaryColor', e.target.value)}
                      className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.design.secondaryColor}
                      onChange={(e) => handleInputChange('design', 'secondaryColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Page Components</h2>
              <div className="space-y-3">
                {Object.entries(formData.components).map(([key, value]) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => handleComponentToggle(key)}
                      className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-700">SEO Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Page Title
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.title || ''}
                    onChange={(e) => handleInputChange('seo', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Professional Services | Your Company"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.seo?.description || ''}
                    onChange={(e) => handleInputChange('seo', 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="Brief description for search engines..."
                  />
                </div>
              </div>
            </section>

            {validationResults && (
              <section className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-700">Performance Validation</h3>
                <div className="space-y-2">
                  <div className={`text-sm ${validationResults.isValid ? 'text-green-600' : 'text-yellow-600'}`}>
                    Status: {validationResults.isValid ? '✅ Optimized' : '⚠️ Needs Improvement'}
                  </div>
                  
                  {validationResults.issues?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-red-600">Issues:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {validationResults.issues.map((issue: string, i: number) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {validationResults.suggestions?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-blue-600">Suggestions:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {validationResults.suggestions.map((suggestion: string, i: number) => (
                          <li key={i}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={generateLandingPage}
            disabled={loading || !formData.company.name || !formData.company.email}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              loading || !formData.company.name || !formData.company.email
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Landing Page...
              </span>
            ) : (
              'Generate Landing Page'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}