'use client';

import { useState } from 'react';
import { Filter, Package } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import PropertyCard from '@/components/cards/PropertyCard';

interface ListingsPageProps {
  category: string;
  title: string;
}

export default function ListingsPage({ category, title }: ListingsPageProps) {
  const { state } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const listings = (state as any)[category] || [];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-blue-100">Showing {listings.length} results in Juba</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center"
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
              </button>
              <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
                <option>Sort: Newest First</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {listings.map((listing: any) => (
            <PropertyCard 
              key={listing.id} 
              property={listing} 
              type={category.includes('car') ? 'car' : category === 'land' ? 'land' : 'property'} 
            />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500">Check back later for new listings in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}