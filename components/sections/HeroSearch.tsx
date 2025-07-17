// components/sections/HeroSearch.tsx
'use client';

import { useState } from 'react';
import { Search, MapPin, DollarSign, ChevronDown, Home, Building, Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';

// Define types for better type safety
interface SubCategory {
  id: string;
  label: string;
  icon: string;
  route: string;
  filters: Record<string, string>;
}

interface Tab {
  id: string;
  label: string;
  labelShort: string; // Add short label for mobile
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subCategories: SubCategory[];
}

export default function HeroSearch() {
  const router = useRouter();
  const { actions } = useApp();
  const [activeTab, setActiveTab] = useState('houses');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [showSubMenu, setShowSubMenu] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    maxPrice: '',
    propertyType: '',
    searchQuery: ''
  });

  const tabs: Tab[] = [
    {
      id: 'houses',
      label: 'HOUSES',
      labelShort: 'Houses', // Shorter label for mobile
      icon: Home,
      color: 'bg-blue-600',
      subCategories: [
        { id: 'buy', label: 'Buy House', icon: '🏠', route: 'properties', filters: { category: 'sale' } },
        { id: 'rent', label: 'Rent House', icon: '🏘️', route: 'rentals', filters: { category: 'rent' } },
        { id: 'short-stay', label: 'Short Stay / Airbnb', icon: '🏨', route: 'airbnb', filters: { category: 'short-stay' } }
      ]
    },
    {
      id: 'land',
      label: 'LAND',
      labelShort: 'Land',
      icon: Building,
      color: 'bg-green-600',
      subCategories: [
        { id: 'sale', label: 'Sale Land', icon: '🏞️', route: 'land', filters: { landCategory: 'sale' } },
        { id: 'lease', label: 'Lease Land', icon: '📜', route: 'land', filters: { landCategory: 'lease' } },
        { id: 'rent', label: 'Rent Land', icon: '🌾', route: 'land', filters: { landCategory: 'rent' } }
      ]
    },
    {
      id: 'vehicles',
      label: 'VEHICLES',
      labelShort: 'Cars',
      icon: Car,
      color: 'bg-red-600',
      subCategories: [
        { id: 'new', label: 'New Vehicles', icon: '🚗', route: 'cars', filters: { condition: 'New', carCategory: 'sale' } },
        { id: 'used', label: 'Used Vehicles', icon: '🚙', route: 'cars', filters: { condition: 'Used', carCategory: 'sale' } },
        { id: 'rent', label: 'Car Hire / Rental', icon: '🚕', route: 'cars', filters: { carCategory: 'rent' } }
      ]
    }
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const getPlaceholderText = () => {
    switch (activeTab) {
      case 'vehicles':
        return 'Search for cars, SUVs, trucks...';
      case 'land':
        return 'Search for land, plots...';
      default:
        return 'Search for houses, apartments, villas...';
    }
  };

  const getPriceOptions = () => {
    if (activeTab === 'vehicles') {
      return [
        { value: '5000', label: '$5,000' },
        { value: '10000', label: '$10,000' },
        { value: '25000', label: '$25,000' },
        { value: '50000', label: '$50,000' },
        { value: '100000', label: '$100,000+' }
      ];
    }
    return [
      { value: '50000', label: '$50,000' },
      { value: '100000', label: '$100,000' },
      { value: '200000', label: '$200,000' },
      { value: '500000', label: '$500,000' },
      { value: '1000000', label: '$1,000,000+' }
    ];
  };

  const locations = [
    'HAI CINEMA', 'NEW SITE', 'MUNUKI', 'JEBEL', 'GUDELE', 
    'LOLOGO', 'THONGPINY', 'AMARAT', 'KONYOKONYO', 'CUSTOM MARKET'
  ];

  const handleSearch = () => {
    if (!selectedSubCategory) {
      alert('Please select a category first');
      return;
    }

    if (!currentTab) {
      alert('Please select a tab first');
      return;
    }

    const subCat = currentTab.subCategories.find((sub: SubCategory) => sub.id === selectedSubCategory);
    if (subCat) {
      // Set filters with all the search parameters
      const searchFilters = {
        ...filters,
        priceMax: filters.maxPrice,
        ...subCat.filters
      };
      
      // Remove empty values
      Object.keys(searchFilters).forEach(key => {
        if (!searchFilters[key as keyof typeof searchFilters]) {
          delete searchFilters[key as keyof typeof searchFilters];
        }
      });
      
      actions.setFilters(searchFilters);
      
      // Navigate to the appropriate page
      actions.setCurrentPage(subCat.route);
    }
  };

  const handleQuickSearch = (quickFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...quickFilters });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)`,
        }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-24 md:pt-32">
        {/* Hero Title */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-3 md:mb-4">
            Find Your Dream
            <span className="block mt-1 md:mt-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Property & Vehicle
            </span>
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            South Sudan's #1 marketplace for real estate, land, and vehicles
          </p>
        </div>

        {/* Search Section */}
        <div className="max-w-5xl mx-auto">
          {/* Main Tabs - Responsive Design */}
          <div className="flex justify-center mb-4 md:mb-6">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg p-1 md:p-2 flex space-x-1 md:space-x-2 w-full max-w-md md:max-w-none">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedSubCategory('');
                      setShowSubMenu(false);
                    }}
                    className={`flex-1 md:flex-initial flex items-center justify-center px-2 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? `${tab.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <IconComponent className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" />
                    {/* Show short label on mobile, full label on desktop */}
                    <span className="font-semibold text-xs sm:text-sm md:text-base">
                      <span className="md:hidden">{tab.labelShort}</span>
                      <span className="hidden md:inline">{tab.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-categories - Responsive */}
          {currentTab && (
            <div className="flex justify-center mb-4 md:mb-6">
              <div className="bg-white rounded-lg md:rounded-xl shadow-md p-1 w-full max-w-lg md:max-w-none">
                <div className="flex flex-wrap justify-center gap-1">
                  {currentTab.subCategories.map((subCat) => (
                    <button
                      key={subCat.id}
                      onClick={() => setSelectedSubCategory(subCat.id)}
                      className={`px-3 sm:px-4 md:px-6 py-2 md:py-2.5 rounded-md md:rounded-lg transition-all duration-200 text-xs sm:text-sm md:text-base ${
                        selectedSubCategory === subCat.id
                          ? 'bg-gray-900 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-1 md:mr-2">{subCat.icon}</span>
                      <span className="hidden sm:inline">{subCat.label}</span>
                      <span className="sm:hidden">{subCat.label.split('/')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Form - Responsive */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl md:shadow-2xl p-4 sm:p-6 md:p-8">
            {/* Search Input */}
            <div className="mb-4 md:mb-6">
              <input
                type="text"
                placeholder={getPlaceholderText()}
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-base md:text-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
              {/* Location Dropdown */}
              <div className="relative">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 md:w-5 h-4 md:h-5" />
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none text-sm md:text-base"
                  >
                    <option value="">All Locations</option>
                    {locations.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 md:w-5 h-4 md:h-5 pointer-events-none" />
                </div>
              </div>

              {/* Price Range */}
              <div className="relative">
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1 md:mb-2">
                  Max Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 md:w-5 h-4 md:h-5" />
                  <select
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full pl-10 md:pl-12 pr-8 md:pr-10 py-3 md:py-4 bg-gray-50 border-2 border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none text-sm md:text-base"
                  >
                    <option value="">Any Price</option>
                    {getPriceOptions().map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 md:w-5 h-4 md:h-5 pointer-events-none" />
                </div>
              </div>

              {/* Search Button */}
              <div className="relative">
                <label className="hidden md:block text-xs md:text-sm font-semibold text-transparent mb-1 md:mb-2">
                  Search
                </label>
                <button
                  onClick={handleSearch}
                  disabled={!selectedSubCategory}
                  className={`w-full py-3 md:py-4 rounded-lg md:rounded-xl transition-all duration-200 font-semibold text-base md:text-lg flex items-center justify-center mt-6 md:mt-0 ${
                    selectedSubCategory
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Search className="w-4 md:w-5 h-4 md:h-5 mr-2" />
                  Search Now
                </button>
              </div>
            </div>

            {/* Quick Search Suggestions - Responsive */}
            <div className="text-center">
              <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
                {activeTab === 'houses' && (
                  <>
                    <QuickSearchTag text="3 Bedroom" onClick={() => handleQuickSearch({ propertyType: '3-bedroom' })} />
                    <QuickSearchTag text="Juba" onClick={() => handleQuickSearch({ location: 'JUBA' })} />
                    <QuickSearchTag text="Furnished" onClick={() => handleQuickSearch({ propertyType: 'furnished' })} />
                    <QuickSearchTag text="<$100k" onClick={() => handleQuickSearch({ maxPrice: '100000' })} />
                  </>
                )}
                {activeTab === 'land' && (
                  <>
                    <QuickSearchTag text="Commercial" onClick={() => handleQuickSearch({ propertyType: 'commercial' })} />
                    <QuickSearchTag text="Residential" onClick={() => handleQuickSearch({ propertyType: 'residential' })} />
                    <QuickSearchTag text="Munuki" onClick={() => handleQuickSearch({ location: 'MUNUKI' })} />
                    <QuickSearchTag text="Lease" onClick={() => setSelectedSubCategory('lease')} />
                  </>
                )}
                {activeTab === 'vehicles' && (
                  <>
                    <QuickSearchTag text="Toyota" onClick={() => handleQuickSearch({ propertyType: 'toyota' })} />
                    <QuickSearchTag text="SUVs" onClick={() => handleQuickSearch({ propertyType: 'suv' })} />
                    <QuickSearchTag text="<$10k" onClick={() => handleQuickSearch({ maxPrice: '10000' })} />
                    <QuickSearchTag text="Rental" onClick={() => setSelectedSubCategory('rent')} />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Stats Section - Responsive */}
          <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            <StatCard number="2,500+" label="Properties" />
            <StatCard number="1,200+" label="Vehicles" />
            <StatCard number="800+" label="Land" />
            <StatCard number="5,000+" label="Customers" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickSearchTag({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 md:px-4 py-1.5 md:py-2 bg-blue-50 text-blue-700 rounded-full text-xs md:text-sm font-medium hover:bg-blue-100 transition-colors"
    >
      {text}
    </button>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-white rounded-lg md:rounded-xl p-3 md:p-6 text-center shadow-md md:shadow-lg">
      <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        {number}
      </p>
      <p className="text-xs md:text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}