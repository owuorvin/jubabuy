// components/search/EnhancedSearchBar.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X, MapPin, Home, Car, Map } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { apiClient } from '@/lib/api/client';

interface SearchResult {
  id: string;
  title: string;
  type: 'property' | 'car' | 'land';
  entityType: string;
  price: number;
  location?: string;
  category?: string;
  slug: string;
  image?: string;
}

export default function EnhancedSearchBar() {
  const { actions } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'property' | 'car' | 'land'>('all');
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchType]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await apiClient.search(query, {
        type: searchType,
      });
      
      if (response.data) {
        const allResults: SearchResult[] = [];
        
        if (response.data.properties) {
          allResults.push(...response.data.properties.map(p => ({
            ...p,
            type: 'property' as const,
            entityType: 'property',
          })));
        }
        
        if (response.data.cars) {
          allResults.push(...response.data.cars.map(c => ({
            ...c,
            type: 'car' as const,
            entityType: 'car',
          })));
        }
        
        if (response.data.land) {
          allResults.push(...response.data.land.map(l => ({
            ...l,
            type: 'land' as const,
            entityType: 'land',
          })));
        }
        
        setResults(allResults);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Navigate to details page
    window.location.href = `/details?id=${result.id}&type=${result.type}`;
    setShowResults(false);
    setQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'property':
        return <Home className="w-4 h-4" />;
      case 'car':
        return <Car className="w-4 h-4" />;
      case 'land':
        return <Map className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryLabel = (result: SearchResult) => {
    if (result.type === 'property') {
      return result.category === 'sale' ? 'For Sale' : 
             result.category === 'rent' ? 'For Rent' : 'Short Stay';
    } else if (result.type === 'car') {
      return result.category === 'sale' ? 'For Sale' : 'For Rent';
    } else if (result.type === 'land') {
      return result.category === 'sale' ? 'For Sale' : 
             result.category === 'lease' ? 'For Lease' : 'For Rent';
    }
    return '';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto">
      <div className="relative">
        {/* Search Type Selector */}
        <div className="absolute left-0 top-0 bottom-0 flex items-center pl-4">
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as any)}
            className="bg-transparent text-gray-600 text-sm font-medium focus:outline-none pr-2"
          >
            <option value="all">All</option>
            <option value="property">Properties</option>
            <option value="car">Vehicles</option>
            <option value="land">Land</option>
          </select>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search properties, vehicles, or land..."
          className="w-full pl-24 pr-12 py-4 bg-white rounded-xl shadow-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Search Icon */}
        <div className="absolute right-4 top-0 bottom-0 flex items-center">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          ) : (
            <Search className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl max-h-96 overflow-y-auto z-50">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 hover:bg-gray-50 transition-colors flex items-start space-x-3 border-b last:border-b-0"
            >
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(result.type)}
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-medium text-gray-900">{result.title}</h4>
                <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                  <span className="font-semibold text-gray-700">
                    ${result.price.toLocaleString()}
                  </span>
                  {result.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {result.location}
                      </span>
                    </>
                  )}
                  <span>•</span>
                  <span className="text-blue-600">{getCategoryLabel(result)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl p-8 text-center z-50">
          <p className="text-gray-500">No results found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}