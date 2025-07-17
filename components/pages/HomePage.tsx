// components/pages/HomePage.tsx
'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAllFeaturedListings } from '@/hooks/useFeaturedListings';
import HeroSearch from '@/components/sections/HeroSearch';
import ServicesSection from '@/components/sections/ServicesSection';
import CTASection from '@/components/sections/CTASection';
import PropertyCard from '@/components/cards/PropertyCard';
import { Star, Shield, Award, Users, ArrowRight, Mail, RefreshCw } from 'lucide-react';

// Skeleton component for loading states
const ListingSkeleton = () => (
  <div className="bg-white rounded-xl shadow-lg animate-pulse">
    <div className="h-48 bg-gray-200 rounded-t-xl"></div>
    <div className="p-6">
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export default function HomePage() {
  const { actions } = useApp();
  const [email, setEmail] = useState('');
  
  // Use React Query hooks for data fetching
  const {
    properties,
    cars,
    land,
    airbnb,
    loadingStates,
    refetchAll,
  } = useAllFeaturedListings();
  
  // Partners data
  const partners = [
    { name: 'South Sudan Real Estate Association', logo: '/images/partners/ssrea.jpg' },
    { name: 'Juba Commercial Bank', logo: '/images/partners/jcb.jpg' },
    { name: 'Ministry of Housing', logo: '/images/partners/ministry.jpg' },
    { name: 'Chamber of Commerce', logo: '/images/partners/chamber.jpg' },
    { name: 'Urban Development Authority', logo: '/images/partners/uda.jpg' }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
    alert('Thank you for subscribing! You will receive our weekly newsletter.');
  };

  const handleRefresh = () => {
    refetchAll();
  };

  return (
    <div className="pt-16 md:pt-20">
      <HeroSearch />
      
      {/* Featured Properties */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Properties
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Hand-picked premium properties in prime locations
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Refresh listings"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => actions.setCurrentPage('properties')}
                className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm md:text-base"
              >
                View all properties <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
              </button>
            </div>
          </div>

          {loadingStates.properties ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} type="property" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured properties available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Premium Vehicles */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Premium Vehicles
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Latest cars and best deals on used vehicles
              </p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('cars')}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm md:text-base"
            >
              View all vehicles <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {loadingStates.cars ? (
              [...Array(6)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))
            ) : cars.length > 0 ? (
              cars.map((car) => (
                <PropertyCard key={car.id} property={car} type="car" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured vehicles available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Land */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Premium Land
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Prime land opportunities for investment and development
              </p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('land')}
              className="text-green-600 hover:text-green-700 font-semibold flex items-center text-sm md:text-base"
            >
              View all land <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {loadingStates.land ? (
              [...Array(6)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))
            ) : land.length > 0 ? (
              land.map((landItem) => (
                <PropertyCard key={landItem.id} property={landItem} type="land" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured land available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Short Stay Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Short Stay Accommodations
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">
                Comfortable stays for business and leisure
              </p>
            </div>
            <button 
              onClick={() => actions.setCurrentPage('airbnb')}
              className="text-green-600 hover:text-green-700 font-semibold flex items-center text-sm md:text-base"
            >
              View all accommodations <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {loadingStates.airbnb ? (
              [...Array(3)].map((_, i) => (
                <ListingSkeleton key={i} />
              ))
            ) : airbnb.length > 0 ? (
              airbnb.map((accommodation) => (
                <PropertyCard key={accommodation.id} property={accommodation} type="property" />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">No featured accommodations available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trusted Partners */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 md:mb-4">
              Trusted Partners
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Working with South Sudan's leading organizations
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 lg:gap-8 items-center">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl p-4 md:p-6 hover:bg-gray-100 transition-colors"
              >
                <div className="w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl mx-auto mb-2 md:mb-4 flex items-center justify-center">
                  <span className="text-lg md:text-2xl font-bold text-blue-600">
                    {partner.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-600 text-center font-medium line-clamp-2">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              Why Choose JubaBuy Ltd
            </h2>
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              We're South Sudan's most trusted platform for real estate and automotive solutions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: Shield,
                color: 'blue',
                title: 'Verified Listings',
                description: 'All properties and vehicles are thoroughly verified for authenticity'
              },
              {
                icon: Users,
                color: 'green',
                title: 'Expert Agents',
                description: 'Professional agents with deep local market knowledge'
              },
              {
                icon: Award,
                color: 'purple',
                title: 'Best Prices',
                description: 'Competitive pricing with transparent fee structure'
              },
              {
                icon: Star,
                color: 'red',
                title: '5-Star Service',
                description: 'Exceptional customer service from inquiry to closing'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-14 h-14 md:w-16 md:h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6`}>
                  <feature.icon className={`w-6 h-6 md:w-8 md:h-8 text-${feature.color}-600`} />
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 md:mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/20">
              <div className="text-center">
                <div className="flex justify-center mb-6 md:mb-8">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                    <Mail className="w-8 h-8 md:w-10 md:h-10 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                  Get Expert Advice and Popular Properties
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 md:mb-12 max-w-3xl mx-auto">
                  Stay updated with market trends, new listings, and expert insights delivered weekly
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-2xl">
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <div className="flex-1 relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email..."
                          className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-gray-900 placeholder-gray-500 text-base md:text-lg"
                          required
                        />
                        <Mail className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 md:px-10 py-3 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 md:hover:-translate-y-1 text-base md:text-lg whitespace-nowrap"
                      >
                        Subscribe Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 mt-6 md:mt-8 text-blue-100">
                    {['Free Newsletter', 'No Spam', 'Unsubscribe Anytime'].map((text, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-xs md:text-sm">{text}</span>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServicesSection />
      <CTASection />
    </div>
  );
}