// ============================================
// NEW: components/filters/FilterPanel.tsx
// ============================================

import React from 'react';
import { X } from 'lucide-react';

interface FilterPanelProps {
  category: 'properties' | 'cars' | 'land' | 'rentals' | 'airbnb';
  filters: Record<string, any>;
  onChange: (filters: Record<string, any>) => void;
}

export default function FilterPanel({ category, filters, onChange }: FilterPanelProps) {
  const handleChange = (key: string, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin || ''}
              onChange={(e) => handleChange('priceMin', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax || ''}
              onChange={(e) => handleChange('priceMax', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <select
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Locations</option>
            <option value="Juba">Juba</option>
            <option value="Gudele">Gudele</option>
            <option value="Munuki">Munuki</option>
            <option value="Konyokonyo">Konyokonyo</option>
            <option value="Thongpiny">Thongpiny</option>
          </select>
        </div>

        {/* Property-specific filters */}
        {category === 'properties' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={filters.propertyType || ''}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </>
        )}

        {/* Car-specific filters */}
        {category === 'cars' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Make
              </label>
              <select
                value={filters.make || ''}
                onChange={(e) => handleChange('make', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Makes</option>
                <option value="Toyota">Toyota</option>
                <option value="Honda">Honda</option>
                <option value="Nissan">Nissan</option>
                <option value="Mercedes">Mercedes</option>
                <option value="BMW">BMW</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="From"
                  value={filters.yearMin || ''}
                  onChange={(e) => handleChange('yearMin', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={filters.yearMax || ''}
                  onChange={(e) => handleChange('yearMax', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fuel Type
              </label>
              <select
                value={filters.fuel || ''}
                onChange={(e) => handleChange('fuel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="hybrid">Hybrid</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </>
        )}

        {/* Land-specific filters */}
        {category === 'land' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Min sqm"
                  value={filters.areaMin || ''}
                  onChange={(e) => handleChange('areaMin', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max sqm"
                  value={filters.areaMax || ''}
                  onChange={(e) => handleChange('areaMax', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoning
              </label>
              <select
                value={filters.zoning || ''}
                onChange={(e) => handleChange('zoning', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Zones</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="agricultural">Agricultural</option>
                <option value="mixed">Mixed Use</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
