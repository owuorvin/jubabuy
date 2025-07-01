import { useState } from 'react';
import { Search, MapPin, DollarSign, ChevronDown, X, Car, Home, Building, Hotel } from 'lucide-react';

// Mock data and context
const JUBA_AREAS = ['Juba', 'Munuki', 'Hai Cinema', 'New Site', 'Kator', 'Rock City'];

const useApp = () => ({
  actions: {
    setCurrentPage: (page: string) => console.log('Navigate to:', page),
    setFilters: (filters: any) => console.log('Set filters:', filters)
  }
});

export default function HeroSearch() {
  const { actions } = useApp();
  const [activeTab, setActiveTab] = useState('for-sale');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches] = useState([
    'Houses for sale in Juba',
    'Used cars in South Sudan',
    'Land for sale Juba',
    'Short stay apartments'
  ]);
  const [filters, setFilters] = useState({
    category: '',
    location: '',
    maxPrice: ''
  });

  const tabs = [
    { id: 'for-sale', label: 'SALE', color: 'bg-blue-600', icon: Home },
    { id: 'for-rent', label: 'RENT', color: 'bg-blue-600', icon: Building },
    { id: 'vehicles', label: 'CARS', color: 'bg-blue-600', icon: Car },
    { id: 'short-stay', label: 'STAY', color: 'bg-green-600', icon: Hotel }
  ];

  const getCategories = () => {
    switch (activeTab) {
      case 'for-sale':
        return [
          { label: 'Houses for Sale', type: 'property', icon: '🏠' },
          { label: 'Apartments for Sale', type: 'property', icon: '🏢' },
          { label: 'Villas for Sale', type: 'property', icon: '🏛️' },
          { label: 'Commercial Property for Sale', type: 'property', icon: '🏪' },
          { label: 'Land for Sale', type: 'property', icon: '🏞️' }
        ];
      case 'for-rent':
        return [
          { label: 'Houses for Rent', type: 'property', icon: '🏠' },
          { label: 'Apartments for Rent', type: 'property', icon: '🏢' },
          { label: 'Commercial Property for Rent', type: 'property', icon: '🏪' },
          { label: 'Office Space for Rent', type: 'property', icon: '🏢' }
        ];
      case 'vehicles':
        return [
          { label: 'New Cars', type: 'vehicle', icon: '🚗' },
          { label: 'Used Cars', type: 'vehicle', icon: '🚙' },
          { label: 'SUVs', type: 'vehicle', icon: '🚐' },
          { label: 'Trucks', type: 'vehicle', icon: '🚛' },
          { label: 'Motorcycles', type: 'vehicle', icon: '🏍️' },
          { label: 'Commercial Vehicles', type: 'vehicle', icon: '🚚' }
        ];
      case 'short-stay':
        return [
          { label: 'Furnished Apartments', type: 'property', icon: '🏨' },
          { label: 'Hotel Apartments', type: 'property', icon: '🏩' },
          { label: 'Guest Houses', type: 'property', icon: '🏘️' },
          { label: 'Vacation Rentals', type: 'property', icon: '🏖️' }
        ];
      default:
        return [];
    }
  };

  const isVehicleCategory = () => {
    return activeTab === 'vehicles' || getCategories().find(cat => cat.label === selectedCategory)?.type === 'vehicle';
  };

  const handleSearch = () => {
    const categoryMap: Record<string, string> = {
      'Houses for Sale': 'properties',
      'Apartments for Sale': 'properties',
      'Villas for Sale': 'properties',
      'Commercial Property for Sale': 'properties',
      'Land for Sale': 'land',
      'New Cars': 'cars',
      'Used Cars': 'cars',
      'SUVs': 'cars',
      'Trucks': 'cars',
      'Motorcycles': 'cars',
      'Commercial Vehicles': 'cars',
      'Houses for Rent': 'rentals',
      'Apartments for Rent': 'rentals',
      'Commercial Property for Rent': 'rentals',
      'Office Space for Rent': 'rentals',
      'Furnished Apartments': 'airbnb',
      'Hotel Apartments': 'airbnb',
      'Guest Houses': 'airbnb',
      'Vacation Rentals': 'airbnb'
    };
    
    actions.setFilters({
      ...filters,
      propertyType: selectedCategory,
      searchQuery: searchQuery
    });
    
    const targetPage = categoryMap[selectedCategory] || (activeTab === 'vehicles' ? 'cars' : 'properties');
    actions.setCurrentPage(targetPage);
  };

  const clearRecentSearch = (index: number) => {
    console.log('Clear recent search:', index);
  };

  const getPlaceholderText = () => {
    switch (activeTab) {
      case 'vehicles':
        return 'What car are you looking for?';
      case 'for-rent':
        return 'What rental property are you looking for?';
      case 'short-stay':
        return 'What accommodation are you looking for?';
      default:
        return 'What property are you looking for?';
    }
  };

  const getCategoryPlaceholder = () => {
    const categories = getCategories();
    if (categories.length > 0) {
      return categories[0].label;
    }
    return 'Select category';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066CC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating shapes */}
        <div className="absolute top-20 right-4 w-16 h-16 sm:top-32 sm:right-20 sm:w-32 sm:h-32 bg-blue-100/20 rounded-full blur-xl"></div>
        <div className="absolute top-32 left-4 w-12 h-12 sm:top-48 sm:left-16 sm:w-24 sm:h-24 bg-green-100/20 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-20 sm:pt-24 md:pt-32">
        {/* Hero Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-3 md:mb-6 leading-tight px-2">
            Find Your Perfect
            <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent block mt-1"> 
              Property & Vehicle
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover premium real estate, luxury vehicles, and short-stay accommodations in South Sudan
          </p>
        </div>

        {/* Search Section */}
        <div className="w-full max-w-6xl mx-auto">
          {/* Tabs - 2x2 Grid Layout like Screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedCategory('');
                  }}
                  className={`flex flex-col items-center justify-center py-6 px-4 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  <IconComponent className="w-6 h-6 mb-2" />
                  <span className="font-bold text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Form - All Fields in One Row like Screenshot */}
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="space-y-4">
              {/* All Fields in One Row for Medium+ Screens */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                {/* Category Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-left flex items-center justify-between hover:border-gray-300"
                  >
                    <span className="text-gray-500">
                      {selectedCategory || 'Select Category'}
                    </span>
                    <ChevronDown className={`w-5 h-5 transition-transform flex-shrink-0 ml-2 text-gray-400 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Category Dropdown */}
                  {showCategoryDropdown && (
                    <>
                      <div className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden" onClick={() => setShowCategoryDropdown(false)} />
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-50 max-h-80 overflow-y-auto">
                        <div className="p-2">
                          {getCategories().map((category) => (
                            <button
                              key={category.label}
                              onClick={() => {
                                setSelectedCategory(category.label);
                                setSearchQuery(category.label);
                                setShowCategoryDropdown(false);
                              }}
                              className="w-full px-4 py-4 text-left hover:bg-blue-50 text-gray-700 border-b border-gray-50 last:border-b-0 flex items-center transition-colors rounded-lg"
                            >
                              <span className="mr-3 text-lg flex-shrink-0">{category.icon}</span>
                              <span className="font-medium">{category.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Location Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter location, area..."
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base"
                    />
                  </div>
                </div>

                {/* Budget Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Budget</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none text-base"
                    >
                      <option value="">Max. Price</option>
                      {isVehicleCategory() ? (
                        <>
                          <option value="5000">$5,000</option>
                          <option value="10000">$10,000</option>
                          <option value="25000">$25,000</option>
                          <option value="50000">$50,000</option>
                          <option value="100000">$100,000+</option>
                        </>
                      ) : (
                        <>
                          <option value="50000">$50,000</option>
                          <option value="100000">$100,000</option>
                          <option value="200000">$200,000</option>
                          <option value="500000">$500,000</option>
                          <option value="1000000">$1,000,000+</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  </div>
                </div>

                {/* Search Button */}
                <div className="relative">
                  <button 
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3 transform hover:-translate-y-1 font-semibold text-lg active:scale-95"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* Advanced Search Link */}
              <div className="text-center mt-6">
                <button className="text-blue-600 hover:text-blue-700 font-medium underline">
                  Advanced Search Options
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="max-w-6xl mx-auto mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  className="bg-white rounded-full px-4 py-2 text-blue-600 border border-blue-200 hover:bg-blue-50 cursor-pointer flex items-center group shadow-sm text-sm"
                >
                  <span className="mr-2">{search}</span>
                  <button
                    onClick={() => clearRecentSearch(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats Section */}
        <div className="max-w-6xl mx-auto mt-12 mb-16 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">2,500+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Properties Available</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">1,200+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Vehicles in Stock</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">500+</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Happy Customers</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">24/7</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}