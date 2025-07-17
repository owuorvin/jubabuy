// components/sections/CTASection.tsx
'use client';

import { ArrowRight, Phone, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600" />
      
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to Find Your Dream Property?
          </h2>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who found their perfect home, land, or vehicle with JubaBuy Ltd
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button 
              onClick={() => router.push('/properties')}
              className="group bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Browse Properties
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => router.push('/list-property')}
              className="group bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              List Your Property
            </button>
          </div>

          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white">
            <a 
              href="tel:+211981779330"
              className="flex items-center hover:text-blue-200 transition-colors"
            >
              <Phone className="w-5 h-5 mr-2" />
              <span className="font-medium">Call: +211 981 779 330</span>
            </a>
            
            <span className="hidden sm:block">•</span>
            
            <a 
              href="https://wa.me/211981779330"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-green-200 transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              <span className="font-medium">WhatsApp Us</span>
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-12 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              <div>
                <p className="text-3xl font-bold mb-2">10+</p>
                <p className="text-sm opacity-80">Years of Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">5,000+</p>
                <p className="text-sm opacity-80">Properties Sold</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">98%</p>
                <p className="text-sm opacity-80">Customer Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">24/7</p>
                <p className="text-sm opacity-80">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}