// components/pages/PrivacyPage.tsx
'use client';

import { ScrollToTop } from '@/components/ScrollToTop';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-gray-700 mb-4">
                JubaBuy Ltd ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website www.jubabuy.com and use our services.
              </p>
              <p className="text-gray-700 mb-4">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Data</h3>
              <p className="text-gray-700 mb-4">
                We may collect personal identification information from Users in various ways, including when Users:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Register on our site</li>
                <li>Create a listing</li>
                <li>Subscribe to our newsletter</li>
                <li>Fill out a form</li>
                <li>Contact other users through our platform</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Information Collected Includes:</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Contact Information:</strong> Name, email address, phone number, address</li>
                <li><strong>Account Information:</strong> Username, password, profile picture</li>
                <li><strong>Listing Information:</strong> Property details, vehicle information, land specifications, photos, pricing</li>
                <li><strong>Communication Data:</strong> Messages sent through our platform</li>
                <li><strong>Transaction Data:</strong> Payment information for premium services</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you visit our website, we may automatically collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect in the following ways:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information to improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To facilitate transactions between users</li>
                <li>To verify listing authenticity</li>
              </ul>
            </section>

            {/* Data Sharing and Disclosure */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following situations:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">With Other Users</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Contact information when you create a public listing</li>
                <li>Messages sent through our platform to other users</li>
                <li>Public profile information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">With Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We may share your information with third-party service providers who assist us in:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Payment processing</li>
                <li>Data analysis</li>
                <li>Email delivery</li>
                <li>Hosting services</li>
                <li>Customer service</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required to do so by law or in response to valid requests by public authorities.
              </p>
            </section>

            {/* Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal data against:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Unauthorized access</li>
                <li>Alteration or disclosure</li>
                <li>Accidental loss or destruction</li>
              </ul>
              <p className="text-gray-700 mb-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide our services</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes</li>
                <li>Enforce our agreements</li>
              </ul>
              <p className="text-gray-700 mb-4">
                When your account is deleted, we may retain certain information for legal and legitimate business purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Objection:</strong> Object to certain processing of your data</li>
                <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 mb-4">
                To exercise these rights, please contact us at privacy@jubabuy.com.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 18 years of age. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>
            </section>

            {/* International Data Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and maintained on servers located outside of your country. By using our Service, you consent to such transfers.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending you an email notification (for significant changes)</li>
              </ul>
            </section>

            {/* Contact Us */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>JubaBuy Ltd</strong></p>
                <p className="text-gray-700 mb-2">Privacy Department</p>
                <p className="text-gray-700 mb-2">Email: privacy@jubabuy.com</p>
                <p className="text-gray-700 mb-2">Phone: +211 981 779 330</p>
                <p className="text-gray-700 mb-2">Address: Hai Cinema, Juba, South Sudan</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}