// components/pages/AboutPage.tsx
'use client';

import { Building2, Users, Award, Target, Globe, Shield, Clock, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Years in Business', value: '10+', icon: Clock },
    { label: 'Properties Listed', value: '5,000+', icon: Building2 },
    { label: 'Happy Customers', value: '15,000+', icon: Users },
    { label: 'Success Rate', value: '98%', icon: TrendingUp },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Transparency',
      description: 'We build lasting relationships through honest dealings and transparent processes.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering exceptional service and exceeding expectations.',
    },
    {
      icon: Globe,
      title: 'Local Expertise',
      description: 'Deep understanding of South Sudan\'s real estate and automotive markets.',
    },
    {
      icon: Target,
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We go above and beyond for every client.',
    },
  ];

  const team = [
    {
      name: 'John Akol',
      role: 'CEO & Founder',
      image: 'https://ui-avatars.com/api/?name=John+Akol&size=200',
      description: 'Over 15 years experience in real estate and business development.',
    },
    {
      name: 'Mary Ayen',
      role: 'Head of Sales',
      image: 'https://ui-avatars.com/api/?name=Mary+Ayen&size=200',
      description: 'Expert in property valuation and market analysis.',
    },
    {
      name: 'James Deng',
      role: 'Operations Manager',
      image: 'https://ui-avatars.com/api/?name=James+Deng&size=200',
      description: 'Ensuring smooth operations and customer satisfaction.',
    },
    {
      name: 'Sarah Nyok',
      role: 'Marketing Director',
      image: 'https://ui-avatars.com/api/?name=Sarah+Nyok&size=200',
      description: 'Creative marketing strategies for maximum property exposure.',
    },
  ];

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-6">About JubaBuy Ltd</h1>
          <p className="text-xl max-w-3xl">
            South Sudan's premier real estate and automotive marketplace, connecting buyers and sellers 
            with trust, transparency, and excellence since 2014.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p className="mb-6">
                Founded in 2014, JubaBuy Ltd emerged from a simple vision: to revolutionize how 
                South Sudanese buy, sell, and rent properties and vehicles. What started as a small 
                office in Juba has grown into the nation's most trusted marketplace.
              </p>
              <p className="mb-6">
                We recognized the challenges in our local market - limited access to reliable listings, 
                lack of transparency in pricing, and difficulty connecting buyers with sellers. Our 
                platform bridges these gaps, providing a secure, efficient, and user-friendly solution.
              </p>
              <p>
                Today, we're proud to serve thousands of customers across South Sudan, facilitating 
                property transactions worth millions and helping families find their dream homes, 
                entrepreneurs secure commercial spaces, and individuals purchase reliable vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide a transparent, efficient, and accessible platform that empowers 
                South Sudanese to make informed real estate and automotive decisions, while 
                fostering economic growth and community development.
              </p>
            </div>
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading force in transforming South Sudan's real estate and automotive 
                sectors through innovation, integrity, and exceptional service, making property 
                ownership and vehicle acquisition accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Meet Our Team</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our dedicated team of professionals is committed to providing you with exceptional service 
            and expert guidance throughout your property journey.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-12 text-center">Why Choose JubaBuy Ltd?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Verified Listings</h3>
              <p className="text-blue-100">
                Every property and vehicle is thoroughly verified to ensure authenticity and accuracy.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Expert Support</h3>
              <p className="text-blue-100">
                Our experienced agents guide you through every step of your transaction.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-4">Best Prices</h3>
              <p className="text-blue-100">
                Competitive pricing and transparent fees with no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Whether you're buying, selling, or renting, we're here to make your journey smooth and successful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/properties'}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
            >
              Browse Properties
            </button>
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}