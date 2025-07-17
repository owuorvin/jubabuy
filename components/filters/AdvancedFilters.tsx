// components/filters/AdvancedFilters.tsx
'use client';

import { useState } from 'react';
import { 
  Filter, X, ChevronDown, MapPin, DollarSign, 
  Home, Car, Map, Calendar, Fuel, Settings 
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface FilterProps {
    category: string;
    onApply: (filters: any) => void;
  }

export default function AdvancedFilters({ category, onApply }: FilterProps) {
  const { state, actions } = useApp();
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    location: '',
    priceMin: '',
    priceMax: '',
    // Property specific
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
    furnished: false,
    // Car specific
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    fuel: '',
    transmission: '',
    condition: '',
    carCategory: '', // sale or rent
    // Land specific
    areaMin: '',
    areaMax: '',
    unit: 'sqm',
    zoning: '',
    landCategory: '', // sale, lease, or rent
  });

  const locations = [
    'HAI CINEMA', 'NEW SITE', 'MUNUKI', 'JEBEL', 'GUDELE', 
    'LOLOGO', 'THONGPINY', 'AMARAT', 'KONYOKONYO', 'CUSTOM MARKET'
  ];

  const propertyTypes = ['house', 'apartment', 'villa'];
  const carMakes = ['Toyota', 'Nissan', 'Honda', 'Mercedes-Benz', 'BMW', 'Ford', 'Hyundai'];
  const fuelTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric'];
  const transmissionTypes = ['Manual', 'Automatic'];
  const zoningTypes = ['Residential', 'Commercial', 'Mixed', 'Agricultural'];

  const handleApply = () => {
    // Remove empty values
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, value]) => value !== '' && value !== false)
    );
    
    actions.setFilters(cleanedFilters);
    onApply(cleanedFilters);
    setShowFilters(false);
  };

  const handleClear = () => {
    setLocalFilters({
      location: '',
      priceMin: '',
      priceMax: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
      furnished: false,
      make: '',
      model: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuel: '',
      transmission: '',
      condition: '',
      carCategory: '',
      areaMin: '',
      areaMax: '',
      unit: 'sqm',
      zoning: '',
      landCategory: '',
    });
    actions.clearFilters();
    onApply({});
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
      >
        <Filter className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Filters</span>
        <span className="sm:hidden">Filter</span>
        {Object.values(state.filters).filter(v => v).length > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
            {Object.values(state.filters).filter(v => v).length}
          </span>
        )}
      </button>

      {showFilters && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setShowFilters(false)}
          />
          
          {/* Filter dropdown - Fixed positioning for left side */}
          <div className="fixed inset-x-4 top-20 bottom-20 lg:fixed lg:top-24 lg:left-4 lg:bottom-4 lg:right-auto lg:w-96 lg:max-w-sm bg-white rounded-xl shadow-xl z-50 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 lg:p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="space-y-4">
                {/* Common Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={localFilters.location}
                    onChange={(e) => setLocalFilters({ ...localFilters, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={localFilters.priceMin}
                      onChange={(e) => setLocalFilters({ ...localFilters, priceMin: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={localFilters.priceMax}
                      onChange={(e) => setLocalFilters({ ...localFilters, priceMax: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                {/* Property Filters */}
                {(category === 'properties' || category === 'rentals' || category === 'airbnb') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Property Type
                      </label>
                      <select
                        value={localFilters.propertyType}
                        onChange={(e) => setLocalFilters({ ...localFilters, propertyType: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Types</option>
                        {propertyTypes.map(type => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bedrooms
                        </label>
                        <select
                          value={localFilters.bedrooms}
                          onChange={(e) => setLocalFilters({ ...localFilters, bedrooms: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Any</option>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num}+</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bathrooms
                        </label>
                        <select
                          value={localFilters.bathrooms}
                          onChange={(e) => setLocalFilters({ ...localFilters, bathrooms: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="">Any</option>
                          {[1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num}+</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="furnished"
                        checked={localFilters.furnished}
                        onChange={(e) => setLocalFilters({ ...localFilters, furnished: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="furnished" className="ml-2 text-sm text-gray-700">
                        Furnished only
                      </label>
                    </div>
                  </>
                )}

                {/* Car Filters */}
                {category === 'cars' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={localFilters.carCategory}
                        onChange={(e) => setLocalFilters({ ...localFilters, carCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All</option>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent / Car Hire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Make
                      </label>
                      <select
                        value={localFilters.make}
                        onChange={(e) => setLocalFilters({ ...localFilters, make: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Makes</option>
                        {carMakes.map(make => (
                          <option key={make} value={make}>{make}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Year Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="From"
                          value={localFilters.yearMin}
                          onChange={(e) => setLocalFilters({ ...localFilters, yearMin: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="To"
                          value={localFilters.yearMax}
                          onChange={(e) => setLocalFilters({ ...localFilters, yearMax: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fuel Type
                      </label>
                      <select
                        value={localFilters.fuel}
                        onChange={(e) => setLocalFilters({ ...localFilters, fuel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Types</option>
                        {fuelTypes.map(fuel => (
                          <option key={fuel} value={fuel}>{fuel}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Transmission
                      </label>
                      <select
                        value={localFilters.transmission}
                        onChange={(e) => setLocalFilters({ ...localFilters, transmission: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All</option>
                        {transmissionTypes.map(trans => (
                          <option key={trans} value={trans}>{trans}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Land Filters */}
                {category === 'land' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={localFilters.landCategory}
                        onChange={(e) => setLocalFilters({ ...localFilters, landCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All</option>
                        <option value="sale">For Sale</option>
                        <option value="lease">For Lease</option>
                        <option value="rent">For Rent</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area Range
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Min"
                          value={localFilters.areaMin}
                          onChange={(e) => setLocalFilters({ ...localFilters, areaMin: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <input
                          type="number"
                          placeholder="Max"
                          value={localFilters.areaMax}
                          onChange={(e) => setLocalFilters({ ...localFilters, areaMax: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        />
                        <select
                          value={localFilters.unit}
                          onChange={(e) => setLocalFilters({ ...localFilters, unit: e.target.value })}
                          className="w-20 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                          <option value="sqm">sqm</option>
                          <option value="acres">acres</option>
                          <option value="hectares">ha</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Zoning
                      </label>
                      <select
                        value={localFilters.zoning}
                        onChange={(e) => setLocalFilters({ ...localFilters, zoning: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      >
                        <option value="">All Zoning</option>
                        {zoningTypes.map(zone => (
                          <option key={zone} value={zone}>{zone}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer with buttons */}
            <div className="flex space-x-3 p-4 lg:p-6 border-t bg-gray-50 rounded-b-xl">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
              <button
                onClick={handleApply}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}