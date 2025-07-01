import { MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 mr-3">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="white" strokeWidth="3"/>
                  {[...Array(12)].map((_, i) => (
                    <g key={i} transform={`rotate(${i * 30} 100 100)`}>
                      {[...Array(8)].map((_, j) => (
                        <rect
                          key={j}
                          x={90 + j * 8}
                          y="95"
                          width="6"
                          height="10"
                          fill="white"
                          rx="1"
                        />
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold">JUBABUY LTD</h3>
                <p className="text-gray-400 text-sm">Premium Real Estate & Automotive</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for real estate and automotive solutions in Juba, South Sudan. 
              We provide premium services with integrity and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Categories</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Houses for Sale</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Properties for Rent</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Cars</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Used Cars</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
                <span className="text-gray-400">
                  Juba Town, South Sudan<br />
                  P.O. Box 123
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-400">+211 123 456 789</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-blue-500 mr-3" />
                <span className="text-gray-400">info@jubabuy.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Aries Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}