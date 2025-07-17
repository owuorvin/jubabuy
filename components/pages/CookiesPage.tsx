// components/pages/CookiesPage.tsx
'use client';

import { ScrollToTop } from '@/components/ScrollToTop';

export default function CookiesPage() {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <ScrollToTop />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-xl opacity-90">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            {/* Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">What Are Cookies</h2>
              <p className="text-gray-700 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
              <p className="text-gray-700 mb-4">
                This Cookie Policy explains what cookies are, how we use them, and your choices regarding cookies on JubaBuy Ltd's website.
              </p>
            </section>

            {/* How We Use Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">How We Use Cookies</h2>
              <p className="text-gray-700 mb-4">
                JubaBuy uses cookies for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Authentication:</strong> To identify you when you sign in to our website</li>
                <li><strong>Security:</strong> To enable and support security features</li>
                <li><strong>Preferences:</strong> To remember your settings and preferences</li>
                <li><strong>Analytics:</strong> To understand how you use our website and improve our services</li>
                <li><strong>Advertising:</strong> To deliver relevant advertisements</li>
                <li><strong>Performance:</strong> To improve website speed and functionality</li>
              </ul>
            </section>

            {/* Types of Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Types of Cookies We Use</h2>
              
              <h3 className="text-xl font-semibold mb-3">Essential Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies are necessary for the website to function properly. They include:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cookie Name</th>
                      <th className="text-left p-2">Purpose</th>
                      <th className="text-left p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">session_id</td>
                      <td className="p-2">Maintains user session</td>
                      <td className="p-2">Session</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">auth_token</td>
                      <td className="p-2">User authentication</td>
                      <td className="p-2">7 days</td>
                    </tr>
                    <tr>
                      <td className="p-2">csrf_token</td>
                      <td className="p-2">Security protection</td>
                      <td className="p-2">Session</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-3">Performance Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies collect information about how you use our website:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cookie Name</th>
                      <th className="text-left p-2">Purpose</th>
                      <th className="text-left p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">_ga</td>
                      <td className="p-2">Google Analytics</td>
                      <td className="p-2">2 years</td>
                    </tr>
                    <tr>
                      <td className="p-2">_gid</td>
                      <td className="p-2">Google Analytics</td>
                      <td className="p-2">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-3">Functionality Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies allow us to remember your preferences:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Cookie Name</th>
                      <th className="text-left p-2">Purpose</th>
                      <th className="text-left p-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2">language</td>
                      <td className="p-2">Language preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2">currency</td>
                      <td className="p-2">Currency preference</td>
                      <td className="p-2">1 year</td>
                    </tr>
                    <tr>
                      <td className="p-2">view_mode</td>
                      <td className="p-2">List/Grid view preference</td>
                      <td className="p-2">30 days</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-semibold mb-3">Targeting Cookies</h3>
              <p className="text-gray-700 mb-4">
                These cookies may be set through our site by advertising partners:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Track your browsing habits</li>
                <li>Show relevant advertisements</li>
                <li>Limit the number of times you see an ad</li>
                <li>Measure the effectiveness of advertising campaigns</li>
              </ul>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Third-Party Cookies</h2>
              <p className="text-gray-700 mb-4">
                We use services from the following third parties that may set cookies:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Google AdSense:</strong> For displaying advertisements</li>
                <li><strong>Facebook Pixel:</strong> For social media integration</li>
                <li><strong>Cloudflare:</strong> For security and performance</li>
              </ul>
            </section>

            {/* Managing Cookies */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-gray-700 mb-4">
                You can control and manage cookies in various ways:
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Browser Settings</h3>
              <p className="text-gray-700 mb-4">
                Most browsers allow you to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>See what cookies you have and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from particular sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">Cookie Settings Links</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li><a href="https://support.google.com/chrome/answer/95647" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Internet Explorer</a></li>
                <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Opera</a></li>
              </ul>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Note:</strong> Blocking all cookies may impact the functionality of our website and prevent you from using certain features.
                </p>
              </div>
            </section>

            {/* Cookie Consent */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Cookie Consent</h2>
              <p className="text-gray-700 mb-4">
                When you first visit our website, we will show you a cookie consent banner. By clicking "Accept" or continuing to use the website, you consent to our use of cookies as described in this policy.
              </p>
              <p className="text-gray-700 mb-4">
                You can withdraw your consent at any time by:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Clearing your cookies</li>
                <li>Changing your browser settings</li>
                <li>Contacting us at privacy@jubabuy.com</li>
              </ul>
            </section>

            {/* Updates to This Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Updates to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any significant changes by updating the date at the top of this policy.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2"><strong>JubaBuy Ltd</strong></p>
                <p className="text-gray-700 mb-2">Email: privacy@jubabuy.com</p>
                <p className="text-gray-700 mb-2">Phone: +211 981 779 330</p>
                <p className="text-gray-700 mb-2">Address: Hai Cinema, Juba, South Sudan</p>
              </div>
            </section>

            {/* Cookie Settings Button */}
            <div className="mt-12 text-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Manage Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}