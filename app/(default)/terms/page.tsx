export const metadata = {
  title: 'Terms & Conditions | Allied Advantage Ads',
  description: 'Terms and Conditions for Allied Advantage Ads - Read our terms of service, usage policies, and legal agreements.',
}

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header spacing */}
      <div className="pt-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
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
            <h2 className="text-xl font-semibold text-blue-900 mb-3">Agreement to Terms</h2>
            <p className="text-blue-800 mb-0">
              <strong>By accessing or using our website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.</strong>
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Services Overview</h2>
            <p className="text-gray-700 mb-4">
              Allied Advantage Ads provides digital marketing and lead generation services, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Google Ads management and optimization</li>
              <li>Lead generation campaigns for real estate professionals</li>
              <li>Marketing consultation and strategy services</li>
              <li>Landing page creation and optimization</li>
              <li>Performance tracking and reporting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">
              By using our services, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Provide accurate and complete information when creating an account or submitting forms</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Use our services only for lawful purposes</li>
              <li>Not interfere with or disrupt our services or servers</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Not use our services to send spam or unsolicited communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Consent to Communications</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Express Consent</h3>
              <p className="text-yellow-800 mb-3">
                By submitting your contact information through our website forms, you expressly consent to receive communications from Allied Advantage Ads via:
              </p>
              <ul className="list-disc list-inside text-yellow-800 space-y-2">
                <li>Phone calls (including to wireless/mobile numbers)</li>
                <li>Text messages/SMS</li>
                <li>Email communications</li>
              </ul>
              <p className="text-yellow-800 mt-3">
                This consent is not a condition of purchase. Message and data rates may apply. You may opt out at any time by replying STOP to text messages or contacting us directly.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
            <p className="text-gray-700 mb-4">
              For paid services:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Fees are due as specified in your service agreement</li>
              <li>All payments are non-refundable unless otherwise stated in writing</li>
              <li>We reserve the right to modify pricing with 30 days notice</li>
              <li>Late payments may result in service suspension</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on our website, including text, graphics, logos, images, and software, is the property of Allied Advantage Ads or its content suppliers and is protected by intellectual property laws. You may not:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Copy, modify, or distribute our content without permission</li>
              <li>Use our trademarks or branding without authorization</li>
              <li>Reverse engineer or attempt to extract source code from our software</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Disclaimer</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 mb-3">
                <strong>No Guarantee of Results:</strong> While we strive to provide effective lead generation and marketing services, we cannot guarantee specific results, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Number of leads generated</li>
                <li>Quality or conversion rate of leads</li>
                <li>Return on investment</li>
                <li>Specific ranking or placement in search results</li>
              </ul>
              <p className="text-gray-700 mt-3">
                Results vary based on market conditions, competition, and other factors outside our control.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Allied Advantage Ads shall not be liable for any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Our total liability shall not exceed the amounts paid by you for services in the 12 months preceding the claim</li>
              <li>We are not responsible for any third-party platforms, including Google Ads, their policies, or their performance</li>
              <li>We are not liable for any loss of data, revenue, or business opportunities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify and hold harmless Allied Advantage Ads, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>Your use of our services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you provide to us</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your access to our services:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>For violation of these Terms</li>
              <li>For non-payment of fees</li>
              <li>At our discretion with reasonable notice</li>
              <li>Immediately if required by law</li>
            </ul>
            <p className="text-gray-700 mb-4">
              Upon termination, your right to use our services ceases immediately. Provisions that by their nature should survive termination will remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              Any disputes arising from these Terms or our services shall be:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
              <li>First attempted to be resolved through good-faith negotiation</li>
              <li>Subject to binding arbitration if negotiation fails</li>
              <li>Governed by the laws of the State of Texas</li>
              <li>Brought in the courts of Travis County, Texas, if litigation is necessary</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Modifications to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective upon posting to our website. Your continued use of our services after changes are posted constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Severability</h2>
            <p className="text-gray-700 mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-2"><strong>Allied Advantage Ads</strong></p>
              <p className="text-gray-700 mb-2">Email: legal@alliedleadgen.com</p>
              <p className="text-gray-700 mb-2">Phone: (888) 524-4496</p>
              <p className="text-gray-700">Address: 5900 Balcones Drive, Suite 12823, Austin, TX 78731</p>
            </div>
          </section>

          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-500 text-center">
              These Terms and Conditions are effective as of the date listed above and apply to all users of Allied Advantage Ads services and website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
