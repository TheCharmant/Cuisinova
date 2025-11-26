/* eslint-disable react/no-unescaped-entities */
import { NextPage } from 'next';
import Head from 'next/head';

const Privacy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - Cuisinova</title>
        <meta name="description" content="Privacy Policy for Cuisinova app" />
      </Head>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

          <div className="bg-white shadow rounded-lg p-6 space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Welcome to Cuisinova ("we," "our," or "us"). We are committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you use our mobile application and website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Email address (when you sign up with Google OAuth)</li>
                <li>Name and profile picture (from Google account)</li>
                <li>Recipes you create and save</li>
                <li>User-generated content and preferences</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-700">
                <li>Device information (device type, operating system)</li>
                <li>App usage statistics</li>
                <li>Log data and crash reports</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700">
                <li>To provide and maintain our service</li>
                <li>To personalize your experience</li>
                <li>To communicate with you about updates and features</li>
                <li>To improve our app and develop new features</li>
                <li>To ensure security and prevent fraud</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties,
                except in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>In connection with a business transfer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not intended for children under 13. We do not knowingly collect
                personal information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@cuisinova.cloud
              </p>
            </section>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-500">
                Last updated: November 26, 2025
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;