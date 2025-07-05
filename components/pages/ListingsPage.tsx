// components/pages/ListingsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Filter, Package, RefreshCw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import PropertyCard from '@/components/cards/PropertyCard';
import { apiClient } from '@/lib/api/client';

interface ListingsPageProps {
  category: string;
  title: string;
}

export default function ListingsPage({ category, title }: ListingsPageProps) {
  const { state, actions, loading: contextLoading } = useApp();
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [localLoading, setLocalLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Get listings from context or fetch separately
  const listings = actions.getFilteredListings(category);

  const handleSort = (listings: any[]) => {
    const sorted = [...listings];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'popular':
        return sorted.sort((a, b) => b.views - a.views);
      default:
        return sorted.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const handleLoadMore = async () => {
    setLocalLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: 12,
        ...state.filters
      };

      let response;
      if (category === 'cars') {
        response = await apiClient.getCars(params);
      } else if (category === 'land') {
        response = await apiClient.getLand(params);
      } else {
        const propertyCategory = 
          category === 'rentals' ? 'rent' : 
          category === 'airbnb' ? 'short-stay' : 
          'sale';
        
        response = await apiClient.getProperties({
          ...params,
          category: propertyCategory
        });
      }

      if (response.data) {
        const newItems = response.data.items || [];
        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          // Add new items to the appropriate category in state
          actions.addMultipleListings(category, newItems);
          setPage(page + 1);
        }
      }
    } catch (error) {
      console.error('Failed to load more listings:', error);
    } finally {
      setLocalLoading(false);
    }
  };

  const sortedListings = handleSort(listings);

  if (contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-blue-100">Showing {sortedListings.length} results in Juba</p>
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
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
              <button
                onClick={() => actions.refreshData()}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Refresh listings"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                List
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-6 pt-6 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select 
                  value={state.filters.location}
                  onChange={(e) => actions.setFilters({ location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  <option value="HAI CINEMA">Hai Cinema</option>
                  <option value="MUNUKI">Munuki</option>
                  <option value="NEW SITE">New Site</option>
                  <option value="JEBEL">Jebel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <input 
                  type="number"
                  value={state.filters.priceMin}
                  onChange={(e) => actions.setFilters({ priceMin: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <input 
                  type="number"
                  value={state.filters.priceMax}
                  onChange={(e) => actions.setFilters({ priceMax: e.target.value })}
                  placeholder="Any"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
              {category !== 'cars' && category !== 'land' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <select 
                      value={state.filters.bedrooms}
                      onChange={(e) => actions.setFilters({ bedrooms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <select 
                      value={state.filters.bathrooms}
                      onChange={(e) => actions.setFilters({ bathrooms: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                    </select>
                  </div>
                </>
              )}
              <div className="md:col-span-3 flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => actions.clearFilters()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {sortedListings.map((listing: any) => (
            <PropertyCard 
              key={listing.id} 
              property={listing} 
              type={category.includes('car') ? 'car' : category === 'land' ? 'land' : 'property'} 
              viewMode={viewMode}
            />
          ))}
        </div>

        {sortedListings.length === 0 && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or check back later.</p>
            <button
              onClick={() => actions.clearFilters()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {sortedListings.length > 0 && hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={localLoading}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {localLoading ? (
                <span className="flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Loading...
                </span>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}