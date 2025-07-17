// components/pages/ServicesPage.tsx
'use client';

import { 
  Home, Car, MapPin, Search, Shield, Users, 
  TrendingUp, FileText, Camera, Gavel, Key, 
  Building, Briefcase, Phone, CheckCircle 
} from 'lucide-react';

export default function ServicesPage() {
  const mainServices = [
    {
      icon: Home,
      title: 'Property Sales',
      description: 'Buy or sell residential and commercial properties with confidence.',
      features: [
        'Property valuation and pricing',
        'Marketing and advertising',
        'Buyer/seller matching',
        'Negotiation support',
        'Legal documentation assistance',
      ],
      color: 'blue',
    },
    {
      icon: Key,
      title: 'Property Rentals',
      description: 'Find the perfect rental property or list your property for rent.',
      features: [
        'Long-term residential rentals',
        'Commercial space rentals',
        'Short-stay accommodations',
        'Tenant screening',
        'Rental agreement preparation',
      ],
      color: 'green',
    },
    {
      icon: Car,
      title: 'Vehicle Sales',
      description: 'Buy or sell new and used vehicles with complete transparency.',
      features: [
        'Vehicle inspection and verification',
        'Price evaluation',
        'Financing assistance',
        'Documentation processing',
        'After-sales support',
      ],
      color: 'red',
    },
    {
      icon: MapPin,
      title: 'Land Sales & Leasing',
      description: 'Secure land for residential, commercial, or agricultural purposes.',
      features: [
        'Land surveys and verification',
        'Title deed verification',
        'Land leasing options',
        'Development consultation',
        'Legal compliance support',
      ],
      color: 'purple',
    },
  ];

  const additionalServices = [
    {
      icon: Search,
      title: 'Property Search Assistance',
      description: 'Let our experts help you find exactly what you\'re looking for.',
    },
    {
      icon: FileText,
      title: 'Documentation Services',
      description: 'Complete assistance with all legal paperwork and documentation.',
    },
    {
      icon: Camera,
      title: 'Professional Photography',
      description: 'High-quality photos and virtual tours for your listings.',
    },
    {
      icon: TrendingUp,
      title: 'Market Analysis',
      description: 'Get detailed market reports and investment insights.',
    },
    {
      icon: Shield,
      title: 'Property Insurance',
      description: 'Connect with trusted insurance providers for your assets.',
    },
    {
      icon: Building,
      title: 'Property Management',
      description: 'Professional management services for your rental properties.',
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'Discuss your requirements with our expert team.',
    },
    {
      step: '02',
      title: 'Property/Vehicle Search',
      description: 'We find options that match your criteria and budget.',
    },
    {
      step: '03',
      title: 'Viewing & Inspection',
      description: 'Arrange viewings and conduct thorough inspections.',
    },
    {
      step: '04',
      title: 'Negotiation & Agreement',
      description: 'We help negotiate the best terms for you.',
    },
    {
      step: '05',
      title: 'Documentation',
      description: 'Handle all paperwork and legal requirements.',
    },
    {
      step: '06',
      title: 'Completion',
      description: 'Finalize the transaction and provide after-sales support.',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive real estate and automotive solutions tailored to meet your needs. 
            From property sales to vehicle rentals, we've got you covered.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">What We Offer</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our comprehensive range of services ensures that all your real estate and automotive 
            needs are met under one roof.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow">
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${getColorClasses(service.color)}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Additional Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">How We Work</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Our streamlined process ensures a smooth and hassle-free experience from start to finish.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="text-6xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 text-blue-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Services */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Specialized Services</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <Gavel className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Property Auctions</h3>
              <p className="text-gray-600 mb-4">
                Participate in property auctions with expert guidance and bidding support.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Pre-auction property inspection</li>
                <li>• Bidding strategy consultation</li>
                <li>• Post-auction support</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <Briefcase className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Corporate Services</h3>
              <p className="text-gray-600 mb-4">
                Tailored solutions for businesses and corporate clients.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Office space solutions</li>
                <li>• Fleet management</li>
                <li>• Employee housing</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Investment Advisory</h3>
              <p className="text-gray-600 mb-4">
                Expert advice on real estate investment opportunities.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Market trend analysis</li>
                <li>• ROI calculations</li>
                <li>• Portfolio management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose Our Services?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified & Secure</h3>
              <p className="text-gray-600">All listings are verified for authenticity and security.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Team</h3>
              <p className="text-gray-600">Experienced professionals dedicated to your success.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Value</h3>
              <p className="text-gray-600">Competitive pricing with no hidden charges.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Always available to assist with your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Contact us today to discuss how we can help you achieve your real estate and automotive goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.location.href = '/contact'}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-100 transition-colors font-semibold"
            >
              Contact Us Now
            </button>
            <button
              onClick={() => window.location.href = '/list-property'}
              className="px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-colors font-semibold"
            >
              List Your Property
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}