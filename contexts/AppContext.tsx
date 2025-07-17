// contexts/AppContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { apiClient, ApiResponse } from '@/lib/api/client';
import { Property, Car, Land } from '@/lib/db/schema';

interface UserProfile {
  name: string;
  email: string;
  id?: string;
}

interface User {
  isAuthenticated: boolean;
  isAdmin: boolean;
  profile: UserProfile | null;
}

interface AppState {
  user: User;
  properties: any[];
  cars: any[];
  land: any[];
  rentals: any[];
  airbnb: any[];
  favorites: string[];
  filters: {
    category: string;
    location: string;
    priceMin: string;
    priceMax: string;
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
    // Vehicle-specific
    condition?: string;
    carCategory?: string;
    make?: string;
    model?: string;
    yearMin?: string;
    yearMax?: string;
    fuel?: string;
    transmission?: string;
    // Land-specific
    landCategory?: string;
    areaMin?: string;
    areaMax?: string;
    unit?: string;
    zoning?: string;
    // Search
    searchQuery?: string;
  };
  ui: {
    currentPage: string;
    mobileMenuOpen: boolean;
    filterOpen: boolean;
    viewMode: 'grid' | 'list';
  };
}

interface AppContextType {
  state: AppState;
  actions: {
    setCurrentPage: (page: string) => void;
    addListing: (category: string, listing: any) => void;
    updateListing: (category: string, id: string, updates: any) => void;
    deleteListing: (category: string, id: string) => void;
    addMultipleListings: (category: string, listings: any[]) => void;
    toggleFavorite: (itemId: string) => void;
    setFilters: (filters: any) => void;
    getFilteredListings: (category: string) => any[];
    clearFilters: () => void;
    getFavoriteCount: () => number;
    refreshData: () => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: Partial<User>) => void;
    loadMoreListings: (category: string, page: number) => Promise<void>;
  };
  loading: boolean;
  error: string | null;
  loadingStates: Record<string, boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: {
    isAuthenticated: false,
    isAdmin: false,
    profile: null,
  },
  properties: [],
  cars: [],
  land: [],
  rentals: [],
  airbnb: [],
  favorites: [],
  filters: {
    category: '',
    location: '',
    priceMin: '',
    priceMax: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: ''
  },
  ui: {
    currentPage: 'home',
    mobileMenuOpen: false,
    filterOpen: false,
    viewMode: 'grid'
  }
};

// Type guard for array properties of state
function isArrayKey(key: string): key is 'properties' | 'cars' | 'land' | 'rentals' | 'airbnb' | 'favorites' {
  return ['properties', 'cars', 'land', 'rentals', 'airbnb', 'favorites'].includes(key);
}

// Type for timeout that works in both Node and browser
type TimeoutType = ReturnType<typeof setTimeout>;

// Enhanced cache implementation with different durations
const cache = new Map<string, { data: any; timestamp: number; duration?: number }>();
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const HOME_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for home page (shorter)
const LONG_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes for less frequently changing data

const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached) {
    const duration = cached.duration || DEFAULT_CACHE_DURATION;
    if (Date.now() - cached.timestamp < duration) {
      return cached.data;
    }
    cache.delete(key); // Remove expired cache
  }
  return null;
};

const setCachedData = (key: string, data: any, duration?: number) => {
  cache.set(key, { data, timestamp: Date.now(), duration });
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  
  // Refs for debouncing and tracking
  const filterTimeoutRef = useRef<TimeoutType | null>(null);
  const categoryDataLoaded = useRef<Record<string, boolean>>({});
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // Check for stored auth token
    const token = typeof window !== 'undefined' ? localStorage.getItem('jubabuy_token') : null;
    const userProfile = typeof window !== 'undefined' ? localStorage.getItem('jubabuy_user') : null;
    
    if (token && userProfile) {
      try {
        const user = JSON.parse(userProfile);
        setState(prev => ({
          ...prev,
          user: {
            isAuthenticated: true,
            isAdmin: user.role === 'admin',
            profile: {
              name: user.name,
              email: user.email,
              id: user.id
            }
          }
        }));
      } catch (err) {
        console.error('Failed to parse user profile:', err);
      }
    }

    // For initial load, we don't need to load any data
    // The HomePage component will handle its own data loading
    setLoading(false);
    isInitialLoad.current = false;
    
    // Only load favorites if authenticated
    if (token) {
      loadFavorites();
    }
    
    // Cleanup function
    return () => {
      if (filterTimeoutRef.current !== null) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, []);

  const loadInitialData = async () => {
    // This is now only called when navigating to non-home pages
    const currentPage = state.ui.currentPage;
    
    if (currentPage === 'home') {
      // Home page handles its own data loading
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await loadCategoryData(currentPage, true);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryData = async (category: string, forceReload = false, page = 1) => {
    // Map page names to data categories
    const categoryMap: Record<string, string> = {
      'properties': 'properties',
      'rentals': 'rentals',
      'airbnb': 'airbnb',
      'cars': 'cars',
      'land': 'land'
    };
    
    const dataCategory = categoryMap[category];
    if (!dataCategory) return;

    // Skip if already loading
    if (loadingStates[dataCategory]) return;

    // Check if we already have data and don't need to reload
    const currentData = state[dataCategory as keyof AppState];
    if (!forceReload && categoryDataLoaded.current[dataCategory] && Array.isArray(currentData) && currentData.length > 0) {
      return;
    }

    // Use appropriate cache duration based on category
    const cacheDuration = category === 'home' ? HOME_CACHE_DURATION : DEFAULT_CACHE_DURATION;
    
    // Check cache first
    const cacheKey = `${dataCategory}-${page}-${JSON.stringify(state.filters)}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData && !forceReload) {
      if (page === 1) {
        setState(prev => ({
          ...prev,
          [dataCategory]: cachedData
        }));
      } else {
        const currentData = state[dataCategory as keyof AppState];
        setState(prev => ({
          ...prev,
          [dataCategory]: Array.isArray(currentData) ? [...currentData, ...cachedData] : cachedData
        }));
      }
      return;
    }

    setLoadingStates(prev => ({ ...prev, [dataCategory]: true }));
    
    try {
      let response;
      const limit = 12; // Optimized for better performance
      
      switch (dataCategory) {
        case 'properties':
          response = await apiClient.getProperties({ 
            page,
            limit, 
            status: 'active',
            ...state.filters,
            category: 'sale'
          });
          break;
        case 'rentals':
          response = await apiClient.getProperties({ 
            page,
            limit, 
            status: 'active',
            ...state.filters,
            category: 'rent'
          });
          break;
        case 'airbnb':
          response = await apiClient.getProperties({ 
            page,
            limit, 
            status: 'active',
            ...state.filters,
            category: 'short-stay'
          });
          break;
        case 'cars':
          response = await apiClient.getCars({ 
            page,
            limit,
            status: 'active',
            ...state.filters 
          });
          break;
        case 'land':
          response = await apiClient.getLand({ 
            page,
            limit,
            status: 'active',
            ...state.filters 
          });
          break;
      }
      
      if (response?.data?.items) {
        const items = response.data.items;
        setCachedData(cacheKey, items, cacheDuration);
        
        if (page === 1) {
          setState(prev => ({
            ...prev,
            [dataCategory]: items
          }));
        } else {
          setState(prev => {
            const currentData = prev[dataCategory as keyof AppState];
            return {
              ...prev,
              [dataCategory]: Array.isArray(currentData) ? [...currentData, ...items] : items
            };
          });
        }
        
        categoryDataLoaded.current[dataCategory] = true;
      }
    } catch (err) {
      console.error(`Failed to load ${dataCategory}:`, err);
      // Don't set global error for individual category failures
      // Try to use any existing data as fallback
    } finally {
      setLoadingStates(prev => ({ ...prev, [dataCategory]: false }));
    }
  };

  const loadFavorites = async () => {
    // Only load if authenticated
    if (!state.user.isAuthenticated) return;
    
    try {
      // Check cache first with longer duration
      const cached = getCachedData('favorites');
      if (cached) {
        setState(prev => ({ ...prev, favorites: cached }));
        return;
      }
      
      const response = await apiClient.getFavorites();
      if (response.data) {
        const favoriteIds = [
          ...(response.data.properties?.map((p: any) => p.id) || []),
          ...(response.data.cars?.map((c: any) => c.id) || []),
          ...(response.data.land?.map((l: any) => l.id) || [])
        ];
        
        setState(prev => ({ ...prev, favorites: favoriteIds }));
        setCachedData('favorites', favoriteIds, LONG_CACHE_DURATION);
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const actions = {
    setCurrentPage: useCallback((page: string) => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentPage: page } }));
      
      // Only load data for non-home pages
      if (page !== 'home') {
        loadCategoryData(page);
      }
    }, [state.filters]),

    login: async (email: string, password: string) => {
      try {
        const response = await apiClient.adminLogin(email, password);
        if (response.data) {
          const { token, user } = response.data;
          
          // Store auth token
          if (typeof window !== 'undefined') {
            localStorage.setItem('jubabuy_token', token);
            localStorage.setItem('jubabuy_user', JSON.stringify(user));
          }
          
          // Update state
          setState(prev => ({
            ...prev,
            user: {
              isAuthenticated: true,
              isAdmin: user.role === 'admin',
              profile: {
                name: user.name,
                email: user.email,
                id: user.id
              }
            }
          }));
          
          // Load favorites after login
          loadFavorites();
        }
      } catch (err) {
        console.error('Login failed:', err);
        throw err;
      }
    },

    logout: () => {
      // Clear stored auth
      if (typeof window !== 'undefined') {
        localStorage.removeItem('jubabuy_token');
        localStorage.removeItem('jubabuy_user');
      }
      
      // Clear cache
      cache.clear();
      categoryDataLoaded.current = {};
      
      // Reset user state
      setState(prev => ({
        ...prev,
        user: initialState.user,
        favorites: []
      }));
    },

    setUser: (userUpdate: Partial<User>) => {
      setState(prev => ({
        ...prev,
        user: { ...prev.user, ...userUpdate }
      }));
    },

    addListing: async (category: string, listing: any) => {
      try {
        let response: ApiResponse<any>;
        
        if (category === 'cars') {
          response = await apiClient.createCar(listing);
        } else if (category === 'land') {
          response = await apiClient.createLand(listing);
        } else {
          const propertyCategory = 
            category === 'rentals' ? 'rent' : 
            category === 'airbnb' ? 'short-stay' : 
            'sale';
          
          response = await apiClient.createProperty({
            ...listing,
            category: propertyCategory
          });
        }
    
        if (response.data && isArrayKey(category)) {
          setState(prev => ({
            ...prev,
            [category]: [...prev[category], response.data]
          }));
          
          // Clear cache for this category
          cache.forEach((_, key) => {
            if (key.startsWith(category)) {
              cache.delete(key);
            }
          });
        }
      } catch (err) {
        console.error('Failed to add listing:', err);
        throw err;
      }
    },

    updateListing: async (category: string, id: string, updates: any) => {
      try {
        let response: ApiResponse<any>;
        
        if (category === 'cars') {
          response = await apiClient.updateCar(id, updates);
        } else if (category === 'land') {
          response = await apiClient.updateLand(id, updates);
        } else {
          response = await apiClient.updateProperty(id, updates);
        }
    
        if (response.data && isArrayKey(category)) {
          setState(prev => ({
            ...prev,
            [category]: prev[category].map((item: any) => 
              item.id === id ? response.data : item
            )
          }));
          
          // Clear cache for this category
          cache.forEach((_, key) => {
            if (key.startsWith(category)) {
              cache.delete(key);
            }
          });
        }
      } catch (err) {
        console.error('Failed to update listing:', err);
        throw err;
      }
    },

    deleteListing: async (category: string, id: string) => {
      try {
        if (category === 'cars') {
          await apiClient.deleteCar(id);
        } else if (category === 'land') {
          await apiClient.deleteLand(id);
        } else {
          await apiClient.deleteProperty(id);
        }

        if (isArrayKey(category)) {
          setState(prev => ({
            ...prev,
            [category]: prev[category].filter((item: any) => item.id !== id)
          }));
          
          // Clear cache for this category
          cache.forEach((_, key) => {
            if (key.startsWith(category)) {
              cache.delete(key);
            }
          });
        }
      } catch (err) {
        console.error('Failed to delete listing:', err);
        throw err;
      }
    },

    toggleFavorite: async (itemId: string) => {
      // Optimistic update
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.includes(itemId)
          ? prev.favorites.filter(id => id !== itemId)
          : [...prev.favorites, itemId]
      }));
      
      try {
        const entityType: 'property' | 'car' | 'land' = 
          itemId.startsWith('car-') ? 'car' : 
          itemId.startsWith('land-') ? 'land' : 
          'property';
    
        const response = await apiClient.toggleFavorite(entityType, itemId);
        
        if (response.data && 'favorited' in response.data) {
          // Update with server response
          setState(prev => ({
            ...prev,
            favorites: response.data!.favorited
              ? [...prev.favorites.filter(id => id !== itemId), itemId]
              : prev.favorites.filter(id => id !== itemId)
          }));
          
          // Clear favorites cache
          cache.delete('favorites');
        }
      } catch (err) {
        console.error('Failed to toggle favorite:', err);
        // Revert optimistic update on error
        setState(prev => ({
          ...prev,
          favorites: prev.favorites.includes(itemId)
            ? prev.favorites.filter(id => id !== itemId)
            : [...prev.favorites, itemId]
        }));
      }
    },

    addMultipleListings: (category: string, listings: any[]) => {
      if (isArrayKey(category)) {
        setState(prev => ({
          ...prev,
          [category]: [...prev[category], ...listings]
        }));
      }
    },

    setFilters: useCallback((filters: any) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, ...filters } 
      }));
      
      // Debounce API calls when filters change
      if (filterTimeoutRef.current !== null) {
        clearTimeout(filterTimeoutRef.current);
      }
      
      filterTimeoutRef.current = setTimeout(() => {
        const currentCategory = state.ui.currentPage;
        if (currentCategory && currentCategory !== 'home') {
          // Clear cached data for this category
          categoryDataLoaded.current[currentCategory] = false;
          loadCategoryData(currentCategory, true);
        }
      }, 500);
    }, [state.ui.currentPage]),

    clearFilters: () => {
      setState(prev => ({ 
        ...prev, 
        filters: initialState.filters 
      }));
      
      // Reload current category with cleared filters
      const currentCategory = state.ui.currentPage;
      if (currentCategory && currentCategory !== 'home') {
        categoryDataLoaded.current[currentCategory] = false;
        loadCategoryData(currentCategory, true);
      }
    },

    getFavoriteCount: () => {
      return state.favorites.length;
    },

    refreshData: () => {
      // Clear specific cache entries based on current page
      const currentCategory = state.ui.currentPage;
      
      if (currentCategory === 'home') {
        // Clear home-related cache entries
        cache.forEach((_, key) => {
          if (key.includes('featured') || key.includes('home')) {
            cache.delete(key);
          }
        });
      } else {
        // Clear category-specific cache
        cache.forEach((_, key) => {
          if (key.startsWith(currentCategory)) {
            cache.delete(key);
          }
        });
        categoryDataLoaded.current[currentCategory] = false;
        loadCategoryData(currentCategory, true);
      }
      
      if (state.user.isAuthenticated) {
        cache.delete('favorites');
        loadFavorites();
      }
    },

    getFilteredListings: (category: string) => {
      if (!isArrayKey(category)) {
        return [];
      }
      
      const listings = state[category] || [];
      const { location, priceMin, priceMax, propertyType, bedrooms, bathrooms } = state.filters;
      
      return listings.filter((item: any) => {
        if (location && item.location !== location) return false;
        if (priceMin && item.price < parseInt(priceMin)) return false;
        if (priceMax && item.price > parseInt(priceMax)) return false;
        
        if (propertyType) {
          if ('bedrooms' in item && propertyType === 'house' && !item.title.toLowerCase().includes('house')) return false;
          if ('bedrooms' in item && propertyType === 'apartment' && !item.title.toLowerCase().includes('apartment')) return false;
          if ('bedrooms' in item && propertyType === 'villa' && !item.title.toLowerCase().includes('villa')) return false;
          
          if ('make' in item) {
            const carType = item.model?.toLowerCase() || '';
            if (propertyType === 'sedan' && !carType.includes('sedan')) return false;
            if (propertyType === 'suv' && !carType.includes('suv') && !carType.includes('forester')) return false;
            if (propertyType === 'truck' && !carType.includes('truck')) return false;
          }
        }
        
        if (bedrooms && 'bedrooms' in item && item.bedrooms < parseInt(bedrooms)) return false;
        if (bathrooms && 'bathrooms' in item && item.bathrooms < parseInt(bathrooms)) return false;
        
        return true;
      });
    },

    loadMoreListings: async (category: string, page: number) => {
      await loadCategoryData(category, false, page);
    }
  };

  return (
    <AppContext.Provider value={{ state, actions, loading, error, loadingStates }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};