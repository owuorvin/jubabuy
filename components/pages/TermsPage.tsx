// components/pages/TermsPage.tsx
'use client';

import { ScrollToTop } from '@/components/ScrollToTop';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-xl opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Table of Contents */}
            <div className="mb-12 p-6 bg-gray-50 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
              <ul className="space-y-2">
                <li><a href="#acceptance" className="text-blue-600 hover:underline">1. Acceptance of Terms</a></li>
                <li><a href="#services" className="text-blue-600 hover:underline">2. Description of Services</a></li>
                <li><a href="#registration" className="text-blue-600 hover:underline">3. User Registration</a></li>
                <li><a href="#listing-rules" className="text-blue-600 hover:underline">4. Listing Rules</a></li>
                <li><a href="#fees" className="text-blue-600 hover:underline">5. Fees and Payments</a></li>
                <li><a href="#prohibited" className="text-blue-600 hover:underline">6. Prohibited Activities</a></li>
                <li><a href="#content" className="text-blue-600 hover:underline">7. User Content</a></li>
                <li><a href="#privacy" className="text-blue-600 hover:underline">8. Privacy Policy</a></li>
                <li><a href="#liability" className="text-blue-600 hover:underline">9. Limitation of Liability</a></li>
                <li><a href="#termination" className="text-blue-600 hover:underline">10. Termination</a></li>
                <li><a href="#contact" className="text-blue-600 hover:underline">11. Contact Information</a></li>
              </ul>
            </div>

            {/* 1. Acceptance of Terms */}
            <section id="acceptance" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using the JubaBuy Ltd website and services ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700 mb-4">
                These Terms and Conditions ("Terms") govern your use of our website located at www.jubabuy.com (the "Service") operated by JubaBuy Ltd ("us", "we", or "our").
              </p>
            </section>

            {/* 2. Description of Services */}
            <section id="services" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">2. Description of Services</h2>
              <p className="text-gray-700 mb-4">
                JubaBuy Ltd provides an online platform that connects buyers and sellers of real estate properties, vehicles, and land in South Sudan. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Property listings for sale, rent, and short-term stays</li>
                <li>Vehicle listings for new and used cars</li>
                <li>Land and plot listings</li>
                <li>Communication tools between buyers and sellers</li>
                <li>Search and filtering capabilities</li>
                <li>Featured listing options</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We act solely as a venue for users to list and browse listings. We are not involved in the actual transaction between buyers and sellers.
              </p>
            </section>

            {/* 3. User Registration */}
            <section id="registration" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">3. User Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of our Service, you may be required to register for an account. When you register, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and accept all risks of unauthorized access</li>
                <li>Notify us immediately if you discover or suspect any security breaches</li>
                <li>Take responsibility for all activities that occur under your account</li>
              </ul>
            </section>

            {/* 4. Listing Rules */}
            <section id="listing-rules" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">4. Listing Rules</h2>
              <p className="text-gray-700 mb-4">
                When creating a listing on JubaBuy, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Provide accurate and truthful information about the property, vehicle, or land</li>
                <li>Have the legal right to sell or rent the listed item</li>
                <li>Include clear, accurate photographs that represent the current condition</li>
                <li>Respond to inquiries in a timely and professional manner</li>
                <li>Honor the terms stated in your listing</li>
                <li>Not post duplicate listings for the same item</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
              <p className="text-gray-700 mb-4">
                We reserve the right to remove any listing that violates these rules or our policies without prior notice.
              </p>
            </section>

            {/* 5. Fees and Payments */}
            <section id="fees" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">5. Fees and Payments</h2>
              <p className="text-gray-700 mb-4">
                JubaBuy offers both free and paid listing options:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Basic Listings:</strong> Free to post with standard features</li>
                <li><strong>Featured Listings:</strong> Paid options for enhanced visibility</li>
                <li><strong>Premium Services:</strong> Additional services may incur fees</li>
              </ul>
              <p className="text-gray-700 mb-4">
                All fees are non-refundable unless otherwise stated. Prices are subject to change with notice.
              </p>
            </section>

            {/* 6. Prohibited Activities */}
            <section id="prohibited" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-700 mb-4">
                You are prohibited from using the site or its content:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track the personal information of others</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                <li>To interfere with or circumvent the security features of the Service</li>
              </ul>
            </section>

            {/* 7. User Content */}
            <section id="content" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
              <p className="text-gray-700 mb-4">
                By posting content on JubaBuy, you grant us a non-exclusive, worldwide, royalty-free license to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Use, reproduce, and display your content in connection with the Service</li>
                <li>Distribute and publicly display your content</li>
                <li>Make modifications to your content for formatting and display purposes</li>
              </ul>
              <p className="text-gray-700 mb-4">
                You retain all rights to your content and are solely responsible for the content you post.
              </p>
            </section>

            {/* 8. Privacy Policy */}
            <section id="privacy" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">8. Privacy Policy</h2>
              <p className="text-gray-700 mb-4">
                Your use of our Service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            {/* 9. Limitation of Liability */}
            <section id="liability" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall JubaBuy Ltd, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any bugs, viruses, trojan horses, or the like that may be transmitted through our Service</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content</li>
              </ul>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Disclaimer:</strong> JubaBuy Ltd is not responsible for the accuracy of listings, the ability of sellers to sell items, or the ability of buyers to pay for items. We do not guarantee the quality, safety, or legality of items advertised.
                </p>
              </div>
            </section>

            {/* 10. Termination */}
            <section id="termination" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p className="text-gray-700 mb-4">
                If you wish to terminate your account, you may simply discontinue using the Service or contact us at info@jubabuy.com.
              </p>
            </section>

            {/* 11. Contact Information */}
            <section id="contact" className="mb-10">
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>JubaBuy Ltd</strong></p>
                <p className="text-gray-700 mb-2">Hai Cinema, Juba, South Sudan</p>
                <p className="text-gray-700 mb-2">Email: info@jubabuy.com</p>
                <p className="text-gray-700 mb-2">Phone: +211 981 779 330</p>
              </div>
            </section>

            {/* Acknowledgment */}
            <div className="mt-12 p-6 bg-blue-50 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Acknowledgment</h3>
              <p className="text-gray-700">
                By using the Service, you acknowledge that you have read these Terms and Conditions and agree to be bound by them.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}