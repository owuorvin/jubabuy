// components/pages/ListingsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Filter, Package, RefreshCw, MapPin, DollarSign, Home, Car, Square, Bed, Calendar, Fuel, Settings } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import PropertyCard from '@/components/cards/PropertyCard';
import { apiClient } from '@/lib/api/client';
import AdvancedFilters from '@/components/filters/AdvancedFilters';

interface ListingsPageProps {
  category: string;
  title: string;
  filters?: any;
}

export default function ListingsPage({ category, title, filters: initialFilters = {} }: ListingsPageProps) {
  const { state, actions } = useApp();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [appliedFilters, setAppliedFilters] = useState({
    ...state.filters,
    ...initialFilters
  });

  useEffect(() => {
    fetchListings();
  }, [category, page, sortBy, sortOrder, appliedFilters]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
        sortBy,
        sortOrder,
        status: 'active',
        ...appliedFilters,
        // Handle search query
        search: appliedFilters.searchQuery || undefined,
      };

      // Clean up undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === undefined || params[key] === '') {
          delete params[key];
        }
      });

      let response: any;
      
      if (category === 'properties' || category === 'rentals' || category === 'airbnb') {
        // Map category to API parameter
        const categoryMap = {
          'properties': 'sale',
          'rentals': 'rent',
          'airbnb': 'short-stay'
        };
        response = await apiClient.getProperties({
          ...params,
          category: categoryMap[category] || params.category,
        });
      } else if (category === 'cars') {
        // Handle car category (sale vs rent)
        response = await apiClient.getCars({
          ...params,
          category: params.carCategory || undefined,
        });
      } else if (category === 'land') {
        // Handle land category (sale, lease, rent)
        response = await apiClient.getLand({
          ...params,
          category: params.landCategory || undefined,
        });
      }

      if (response?.data) {
        // Handle the response structure
        if (response.data.items) {
          setListings(response.data.items);
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
            setTotalCount(response.data.pagination.total || 0);
          }
        } else if (Array.isArray(response.data)) {
          setListings(response.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error);
      // Fallback to context data if API fails
      const contextListings = actions.getFilteredListings(category);
      setListings(contextListings);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersApply = (filters: any) => {
    setAppliedFilters(filters);
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryLabel = () => {
    switch (category) {
      case 'properties':
        return 'properties';
      case 'rentals':
        return 'rental properties';
      case 'airbnb':
        return 'short stay accommodations';
      case 'cars':
        return 'vehicles';
      case 'land':
        return 'land parcels';
      default:
        return 'listings';
    }
  };

  const getEmptyMessage = () => {
    switch (category) {
      case 'properties':
        return 'No properties for sale found matching your criteria.';
      case 'rentals':
        return 'No rental properties found matching your criteria.';
      case 'airbnb':
        return 'No short stay accommodations found matching your criteria.';
      case 'cars':
        return 'No vehicles found matching your criteria.';
      case 'land':
        return 'No land parcels found matching your criteria.';
      default:
        return 'No listings found matching your criteria.';
    }
  };

  if (loading && page === 1) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading {getCategoryLabel()}...</p>
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
          <p className="text-blue-100">
            {totalCount > 0 ? `${totalCount} ${getCategoryLabel()} available` : `Searching for ${getCategoryLabel()}...`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <AdvancedFilters 
                category={category} 
                onApply={handleFiltersApply}
              />
              
              <select 
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="createdAt-desc">Sort: Newest First</option>
                <option value="createdAt-asc">Sort: Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                {category === 'properties' || category === 'rentals' || category === 'airbnb' ? (
                  <>
                    <option value="bedrooms-desc">Bedrooms: Most First</option>
                    <option value="area-desc">Size: Largest First</option>
                  </>
                ) : category === 'cars' ? (
                  <>
                    <option value="year-desc">Year: Newest First</option>
                    <option value="mileage-asc">Mileage: Lowest First</option>
                  </>
                ) : category === 'land' ? (
                  <>
                    <option value="area-desc">Area: Largest First</option>
                    <option value="area-asc">Area: Smallest First</option>
                  </>
                ) : null}
              </select>
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
              
              <button
                onClick={fetchListings}
                className="p-2 text-gray-600 hover:text-blue-600"
                title="Refresh listings"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.keys(appliedFilters).length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {Object.entries(appliedFilters).map(([key, value]) => {
                  if (!value || key === 'searchQuery') return null;
                  
                  const getFilterLabel = (key: string, value: any): string => {
                    switch (key) {
                      case 'location': return `Location: ${value}`;
                      case 'priceMin': return `Min Price: $${Number(value).toLocaleString()}`;
                      case 'priceMax': return `Max Price: $${Number(value).toLocaleString()}`;
                      case 'bedrooms': return `${value}+ Bedrooms`;
                      case 'bathrooms': return `${value}+ Bathrooms`;
                      case 'propertyType': return `Type: ${value}`;
                      case 'make': return `Make: ${value}`;
                      case 'model': return `Model: ${value}`;
                      case 'yearMin': return `Year: ${value}+`;
                      case 'fuel': return `Fuel: ${value}`;
                      case 'transmission': return `Transmission: ${value}`;
                      case 'condition': return `Condition: ${value}`;
                      case 'carCategory': return value === 'rent' ? 'For Rent' : 'For Sale';
                      case 'landCategory': 
                        return value === 'sale' ? 'For Sale' : 
                               value === 'lease' ? 'For Lease' : 'For Rent';
                      case 'areaMin': return `Min Area: ${value}`;
                      case 'areaMax': return `Max Area: ${value}`;
                      case 'zoning': return `Zoning: ${value}`;
                      default: return `${key}: ${value}`;
                    }
                  };
                  
                  const label = getFilterLabel(key, value);
                  
                  return (
                    <span
                      key={key}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center"
                    >
                      <span>{label}</span>
                      <button
                        onClick={() => {
                          const newFilters = { ...appliedFilters };
                          delete newFilters[key];
                          handleFiltersApply(newFilters);
                        }}
                        className="ml-2 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                {Object.keys(appliedFilters).length > 2 && (
                  <button
                    onClick={() => handleFiltersApply({})}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-xl"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
              {listings.map((listing: any) => (
                <PropertyCard 
                  key={listing.id} 
                  property={listing} 
                  type={category === 'cars' ? 'car' : category === 'land' ? 'land' : 'property'} 
                  viewMode={viewMode}
                />
              ))}
            </div>

            {listings.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No listings found</h3>
                <p className="text-gray-500 mb-6">{getEmptyMessage()}</p>
                <button
                  onClick={() => handleFiltersApply({})}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={i}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg ${
                            page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}