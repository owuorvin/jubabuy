export default function CTASection() {
    return (
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Find Your Dream Property?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their perfect home or vehicle with Aries Ltd
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg">
              Browse Properties
            </button>
            <button className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all">
              List Your Property
            </button>
          </div>
        </div>
      </section>
    );
  }