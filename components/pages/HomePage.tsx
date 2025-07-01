'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import HeroSearch from '@/components/sections/HeroSearch';
import ServicesSection from '@/components/sections/ServicesSection';
import CTASection from '@/components/sections/CTASection';
import PropertyCard from '@/components/cards/PropertyCard';
import { ChevronLeft, ChevronRight, Star, Shield, Award, Users, ArrowRight, Mail } from 'lucide-react';

export default function HomePage() {
  const { state, actions } = useApp();
  const [email, setEmail] = useState('');
  
  // Sample partners data
  const partners = [
    { name: 'South Sudan Real Estate Association', logo: '/images/partners/ssrea.jpg' },
    { name: 'Juba Commercial Bank', logo: '/images/partners/jcb.jpg' },
    { name: 'Ministry of Housing', logo: '/images/partners/ministry.jpg' },
    { name: 'Chamber of Commerce', logo: '/images/partners/chamber.jpg' },
    { name: 'Urban Development Authority', logo: '/images/partners/uda.jpg' }
  ];

  const categories = [
    { title: 'Houses for Sale', count: '850+', link: 'houses', icon: '🏠' },
    { title: 'Apartments for Sale', count: '640+', link: 'apartments', icon: '🏢' },
    { title: 'Villas for Sale', count: '220+', link: 'villas', icon: '🏛️' },
    { title: 'Land for Sale', count: '400+', link: 'land', icon: '🏞️' },
    { title: 'Houses for Rent', count: '320+', link: 'rentals', icon: '🏘️' },
    { title: 'Apartments for Rent', count: '480+', link: 'apartment-rentals', icon: '🏬' },
    { title: 'Short Stay Rentals', count: '150+', link: 'airbnb', icon: '🏨' },
    { title: 'Commercial for Rent', count: '90+', link: 'commercial-rent', icon: '🏪' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <div className="pt-20">
      <HeroSearch />
      
      {/* Property Categories Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Browse by Category</h2>
          <p className="text-gray-600 text-center mb-12">Find exactly what you're looking for</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => actions.setCurrentPage(category.link)}
                className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl p-6 text-center transition-all duration-200 group"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {category.title}
                </h3>
                <p className="text-blue-600 font-bold text-lg">{category.count}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Featured Properties</h2>
              <p className="text-lg text-gray-600">Hand-picked premium properties in prime locations</p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('properties')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              View all properties <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.properties.filter(p => p.featured).slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} type="property" />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Vehicles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Premium Vehicles</h2>
              <p className="text-lg text-gray-600">Latest cars and best deals on used vehicles</p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('cars')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
            >
              View all vehicles <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          {/* Car Categories Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 rounded-xl p-1 inline-flex">
              <button className="px-6 py-2 rounded-lg bg-white shadow-sm font-medium text-gray-900">
                All Vehicles
              </button>
              <button className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900">
                New Cars
              </button>
              <button className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:text-gray-900">
                Used Cars
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.cars.filter(c => c.featured).slice(0, 6).map((car) => (
              <PropertyCard key={car.id} property={car} type="car" />
            ))}
          </div>
        </div>
      </section>

      {/* Short Stay Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">Short Stay Accommodations</h2>
              <p className="text-lg text-gray-600">Comfortable stays for business and leisure</p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('airbnb')}
              className="text-green-600 hover:text-green-700 font-semibold flex items-center"
            >
              View all accommodations <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.airbnb.filter(a => a.featured).slice(0, 3).map((accommodation) => (
              <PropertyCard key={accommodation.id} property={accommodation} type="property" />
            ))}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted Partners</h2>
            <p className="text-gray-600">Working with South Sudan's leading organizations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center">
            {partners.map((partner, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {partner.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 text-center font-medium">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose JubaBuy Ltd</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're South Sudan's most trusted platform for real estate and automotive solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Listings</h3>
              <p className="text-gray-600">All properties and vehicles are thoroughly verified for authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Agents</h3>
              <p className="text-gray-600">Professional agents with deep local market knowledge</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Best Prices</h3>
              <p className="text-gray-600">Competitive pricing with transparent fee structure</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">5-Star Service</h3>
              <p className="text-gray-600">Exceptional customer service from inquiry to closing</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Background Card for Better Visibility */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20">
              <div className="text-center">
                <div className="flex justify-center mb-8">
                  <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Get Expert Advice and Popular Properties
                </h2>
                <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
                  Stay updated with market trends, new listings, and expert insights delivered weekly to your inbox
                </p>
                
                {/* Enhanced Form with Better Visibility */}
                <form onSubmit={handleNewsletterSubmit} className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-2xl p-4 shadow-2xl">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address..."
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-lg"
                          required
                        />
                        <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-lg whitespace-nowrap"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                  
                  {/* Trust Indicators */}
                  <div className="flex justify-center items-center space-x-8 mt-8 text-blue-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Free Newsletter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">No Spam</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm">Unsubscribe Anytime</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Estate Market Info */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Real Estate Market in South Sudan</h2>
            
            <div className="prose prose-lg text-gray-600 mb-8">
              <p>
                Are you looking to invest in <strong>Juba</strong> real estate? Or maybe you prefer the growing opportunities in 
                <strong> Bentiu</strong> or <strong>Malakal</strong>? With over 2,500+ listings for sale, JubaBuy Ltd can 
                match you with a property to call home. Get exclusive insights into popular neighborhoods such as 
                <strong> Hai Cinema</strong>, <strong>Munuki</strong>, and <strong>New Site</strong>. 
                Filter down to what's important for you.
              </p>
              
              <p>
                Looking for just <strong>3 bedroom houses in Juba</strong>? Or do you long for a lovely 
                <strong> townhouse</strong> rather than a <strong>Juba apartment</strong>? We can guide you to the best 
                places to invest in South Sudan's growing real estate market.
              </p>
              
              <p>
                Not ready to commit long term? Rent a <strong>family friendly house</strong>, an 
                <strong> apartment to share with friends</strong> or a <strong>furnished short-stay accommodation</strong>. 
                No matter your needs, we'll help you discover a rental you'll love.
              </p>
            </div>


            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'Houses for sale', 'Apartments for sale', 'Villas for sale', 'Land for sale',
                'Houses for rent', 'Apartments for rent', 'Short stay rentals', 'Commercial spaces'
              ].map((link, index) => (
                <button
                  key={index}
                  className="text-blue-600 hover:text-blue-700 text-left font-medium"
                  onClick={() => actions.setCurrentPage('properties')}
                >
                  {link}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <ServicesSection />
      <CTASection />
    </div>
  );
}