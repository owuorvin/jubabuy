// components/pages/OptimizedListingsPage.tsx
'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '@/hooks/useDebounce';
import { useInfiniteListings } from '@/hooks/useListings';
import PropertyCard from '@/components/cards/PropertyCard';
import { ListingSkeleton } from '@/components/skeletons/ListingSkeleton';
import EmptyState from '@/components/EmptyState';
import AdvancedFilters from '@/components/filters/AdvancedFilters';
import { 
  Grid3X3, List, ChevronDown, Package, RefreshCw, 
  MapPin, DollarSign, Home, Car, Square, SlidersHorizontal 
} from 'lucide-react';

interface FilterState {
  category?: string;
  status?: string;
  searchQuery?: string;
  location?: string;
  priceMin?: string | number;
  priceMax?: string | number;
  bedrooms?: string | number;
  bathrooms?: string | number;
  propertyType?: string;
  furnished?: boolean;
  make?: string;
  model?: string;
  yearMin?: string | number;
  yearMax?: string | number;
  mileageMax?: string | number;
  fuel?: string;
  transmission?: string;
  condition?: string;
  carCategory?: string;
  areaMin?: string | number;
  areaMax?: string | number;
  unit?: string;
  zoning?: string;
  landCategory?: string;
  [key: string]: any;
}

interface OptimizedListingsPageProps {
  category: 'properties' | 'cars' | 'land' | 'rentals' | 'airbnb';
  title: string;
  initialFilters?: FilterState;
}

export default function OptimizedListingsPage({ 
  category, 
  title, 
  initialFilters = {} 
}: OptimizedListingsPageProps) {
  // Get URL search params
  const searchParams = useSearchParams();
  
  // Map UI categories to actual filter categories
  const getCategoryFilter = () => {
    switch (category) {
      case 'rentals':
        return { category: 'rent' };
      case 'airbnb':
        return { category: 'short-stay' };
      case 'properties':
        return { category: initialFilters.category || 'sale' };
      default:
        return {};
    }
  };

  // Parse URL parameters into filters
  const getUrlFilters = (): FilterState => {
    const urlFilters: FilterState = {};
    
    searchParams.forEach((value, key) => {
      if (!isNaN(Number(value))) {
        urlFilters[key] = Number(value);
      } else if (value === 'true' || value === 'false') {
        urlFilters[key] = value === 'true';
      } else {
        urlFilters[key] = value;
      }
    });
    
    // Special handling for car filters
    if (category === 'cars') {
      if (urlFilters.condition && !urlFilters.carCategory) {
        urlFilters.carCategory = 'sale';
      }
      if (urlFilters.condition && typeof urlFilters.condition === 'string') {
        urlFilters.condition = urlFilters.condition.charAt(0).toUpperCase() + urlFilters.condition.slice(1).toLowerCase();
      }
    }
    
    return urlFilters;
  };

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileSort, setShowMobileSort] = useState(false);
  
  // Initialize filters from URL params, initial filters, and category
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...initialFilters,
    ...getCategoryFilter(),
    ...getUrlFilters(),
  }));
  
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Update filters when URL changes
  useEffect(() => {
    const urlFilters = getUrlFilters();
    const categoryFilter = getCategoryFilter();
    setFilters(prev => ({
      ...prev,
      ...categoryFilter,
      ...urlFilters,
    }));
  }, [searchParams, category]);
  
  // Map UI category to API category
  const apiCategory = ['rentals', 'airbnb'].includes(category) ? 'properties' : category;
  
  // Debounce filter changes
  const debouncedFilters = useDebounce(filters, 500);
  
  // Intersection observer for infinite scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });
  
  // Optimized query with all filters
  const queryFilters = useMemo(() => ({
    ...debouncedFilters,
    sortBy,
    sortOrder,
    status: 'active',
  }), [debouncedFilters, sortBy, sortOrder]);
  
  // Use infinite query with proper category mapping
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteListings(apiCategory as 'properties' | 'cars' | 'land', queryFilters);
  
  // Load more when scrolling
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);
  
  // Flatten pages data
  const listings = useMemo(() => {
    return data?.pages.flatMap(page => page?.items || []) || [];
  }, [data]);
  
  const totalCount = data?.pages[0]?.pagination?.total || 0;
  
  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterState) => {
    const categoryFilter = getCategoryFilter();
    const urlFilters = getUrlFilters();
    setFilters({ ...newFilters, ...categoryFilter, ...urlFilters });
  }, [category, searchParams]);
  
  // Handle sort changes
  const handleSortChange = useCallback((value: string) => {
    const [field, order] = value.split('-');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    setShowMobileSort(false);
  }, []);
  
  // Get active filter count (exclude system filters)
  const activeFilterCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      return value && key !== 'category' && key !== 'status' && key !== 'searchQuery';
    }).length;
  }, [filters]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <ListingSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 md:pt-20 flex items-center justify-center px-4">
        <EmptyState
          icon={Package}
          title="Something went wrong"
          description={`Failed to load listings. ${error instanceof Error ? error.message : 'Please try again.'}`}
          action={{
            label: "Retry",
            onClick: () => refetch(),
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-16 md:top-20 z-30">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {totalCount} {totalCount === 1 ? 'listing' : 'listings'} found
                {isFetching && !isFetchingNextPage && (
                  <span className="ml-2 inline-flex items-center">
                    <RefreshCw className="w-3 h-3 animate-spin mr-1" />
                    Updating...
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <AdvancedFilters 
                category={category} 
                onApply={handleFilterChange}
              />
              
              {/* Sort Dropdown - Desktop */}
              <div className="hidden sm:block relative">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  {(category === 'properties' || category === 'rentals' || category === 'airbnb') && (
                    <>
                      <option value="bedrooms-desc">Bedrooms: Most First</option>
                      <option value="area-desc">Size: Largest First</option>
                    </>
                  )}
                  {category === 'cars' && (
                    <>
                      <option value="year-desc">Year: Newest First</option>
                      <option value="mileage-asc">Mileage: Lowest First</option>
                    </>
                  )}
                  {category === 'land' && (
                    <>
                      <option value="area-desc">Area: Largest First</option>
                      <option value="area-asc">Area: Smallest First</option>
                    </>
                  )}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              
              {/* Sort Button - Mobile */}
              <button
                onClick={() => setShowMobileSort(!showMobileSort)}
                className="sm:hidden flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <SlidersHorizontal className="w-4 h-4 mr-1" />
                Sort
              </button>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  aria-label="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Sort Options */}
          {showMobileSort && (
            <div className="mt-3 pt-3 border-t sm:hidden">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSortChange('createdAt-desc')}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    sortBy === 'createdAt' && sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => handleSortChange('createdAt-asc')}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    sortBy === 'createdAt' && sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Oldest First
                </button>
                <button
                  onClick={() => handleSortChange('price-asc')}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    sortBy === 'price' && sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => handleSortChange('price-desc')}
                  className={`px-3 py-2 text-sm rounded-lg ${
                    sortBy === 'price' && sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  Price: High to Low
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="bg-blue-50 border-b border-blue-100">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {Object.entries(filters).map(([key, value]) => {
                if (!value || key === 'searchQuery' || key === 'category' || key === 'status') return null;
                
                const getFilterLabel = (key: string, value: any): string => {
                  switch (key) {
                    case 'location': return `Location: ${value}`;
                    case 'priceMin': return `Min Price: $${Number(value).toLocaleString()}`;
                    case 'priceMax': return `Max Price: $${Number(value).toLocaleString()}`;
                    case 'bedrooms': return `${value}+ Bedrooms`;
                    case 'bathrooms': return `${value}+ Bathrooms`;
                    case 'propertyType': return `Type: ${value}`;
                    case 'furnished': return 'Furnished';
                    case 'make': return `Make: ${value}`;
                    case 'model': return `Model: ${value}`;
                    case 'yearMin': return `Year: ${value}+`;
                    case 'yearMax': return `Year: Up to ${value}`;
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
                    className="inline-flex items-center px-3 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-sm"
                  >
                    <span>{label}</span>
                    <button
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key];
                        handleFilterChange(newFilters);
                      }}
                      className="ml-2 hover:text-blue-900"
                      aria-label={`Remove ${label} filter`}
                    >
                      ×
                    </button>
                  </span>
                );
              })}
              {activeFilterCount > 2 && (
                <button
                  onClick={() => handleFilterChange(getCategoryFilter())}
                  className="text-sm text-red-600 hover:text-red-700 underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {listings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No listings found"
            description="Try adjusting your filters or search criteria"
            action={{
              label: "Clear filters",
              onClick: () => {
                const categoryFilter = getCategoryFilter();
                handleFilterChange(categoryFilter);
              },
            }}
          />
        ) : (
          <>
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
                : 'space-y-4'
            }>
              {listings.map((listing: any) => (
                <PropertyCard
                  key={listing.id}
                  property={listing}
                  type={apiCategory === 'cars' ? 'car' : apiCategory === 'land' ? 'land' : 'property'}
                  viewMode={viewMode}
                />
              ))}
            </div>
            
            {/* Infinite scroll trigger */}
            <div ref={loadMoreRef} className="py-8 text-center">
              {isFetchingNextPage ? (
                <div className="inline-flex items-center text-gray-600">
                  <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                  Loading more...
                </div>
              ) : hasNextPage ? (
                <button
                  onClick={() => fetchNextPage()}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Load More
                </button>
              ) : listings.length > 12 ? (
                <p className="text-gray-500">You've reached the end</p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}