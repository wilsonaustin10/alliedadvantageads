export const metadata = {
  title: 'Privacy Policy | Allied Advantage Ads',
  description: 'Privacy Policy for Allied Advantage Ads - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header spacing */}
      <div className="pt-20"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">
            Last Updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Important Notice About Contact Information</h2>
            <p className="text-blue-800 mb-0">
              <strong>By providing your contact information through our website forms, you expressly consent to Allied Advantage Ads and our team contacting you via phone, email, or text message regarding our services, consultations, and business opportunities. This consent is not required as a condition of purchase.</strong>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information You Provide</h3>
            <p className="text-gray-700 mb-4">
              When you use our website or services, we may collect the following personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Contact Information:</strong> First name, last name, email address, phone number</li>
              <li><strong>Business Information:</strong> Company name, number of deals per month, business interests</li>
              <li><strong>Communication Preferences:</strong> Service packages of interest, consultation requests</li>
              <li><strong>Messages:</strong> Any messages or inquiries you send through our contact forms</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>IP address and location data</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Website usage patterns and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your personal information for the following purposes:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Service Delivery:</strong> To provide our lead generation services and consultations</li>
              <li><strong>Communication:</strong> To contact you about our services, respond to inquiries, and schedule consultations</li>
              <li><strong>Marketing:</strong> To send you information about our services, promotions, and business opportunities</li>
              <li><strong>Customer Support:</strong> To provide technical support and customer service</li>
              <li><strong>Business Operations:</strong> To improve our services, analyze website usage, and conduct business operations</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Your Consent to Contact</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Express Consent for Communications</h3>
              <p className="text-yellow-800 mb-3">
                By submitting your contact information through our website forms, you provide express written consent for Allied Advantage Ads and our authorized representatives to contact you for the following purposes:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-2">
                <li>Responding to your consultation requests and inquiries</li>
                <li>Discussing our lead generation services and business opportunities</li>
                <li>Scheduling appointments and consultations</li>
                <li>Providing information about our services, pricing, and promotions</li>
                <li>Following up on your interest in our services</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Methods of Contact</h3>
            <p className="text-gray-700 mb-4">
              Your consent includes authorization for us to contact you via:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Phone calls (including to wireless/mobile numbers)</li>
              <li>Text messages/SMS</li>
              <li>Email communications</li>
              <li>Direct mail</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Opt-Out Rights</h3>
            <p className="text-gray-700 mb-4">
              You may withdraw your consent at any time by:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Replying "STOP" to any text message</li>
              <li>Clicking "unsubscribe" in any email</li>
              <li>Contacting us directly at the information provided below</li>
              <li>Informing our representatives during any phone call</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We may share your personal information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in our operations</li>
              <li><strong>Business Partners:</strong> With partners who help deliver our services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information to third parties for their marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Generally, we keep contact information for active marketing purposes for up to 3 years from your last interaction with us.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
            <p className="text-gray-700 mb-4">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies and similar tracking technologies to enhance your experience, analyze usage, and provide personalized content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Links</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Allied Advantage Ads</strong></p>
              <p className="text-gray-700 mb-2">Email: privacy@alliedadvantageads.com</p>
              <p className="text-gray-700 mb-2">Phone: (555) 123-4567</p>
              <p className="text-gray-700">Address: [Your Business Address]</p>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              This Privacy Policy is effective as of the date listed above and applies to all information collected by Allied Advantage Ads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}