import { Shield, DollarSign, Clock, Key } from 'lucide-react';

const services = [
  {
    icon: Shield,
    title: 'Verified Listings',
    description: 'All properties and vehicles are thoroughly verified for authenticity',
    color: 'bg-blue-500'
  },
  {
    icon: DollarSign,
    title: 'Best Price Guarantee',
    description: 'Get the most competitive prices in the Juba market',
    color: 'bg-green-500'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Our dedicated team is always ready to assist you',
    color: 'bg-purple-500'
  },
  {
    icon: Key,
    title: 'Easy Process',
    description: 'Simplified buying, selling, and renting procedures',
    color: 'bg-orange-500'
  }
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive solutions for all your real estate and automotive needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}