// contexts/AppContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Property, Car, Land } from '@/lib/types';
import { apiClient } from '@/lib/api/client';
import { ApiResponse, ListResponse } from '@/lib/api/client';
import { transformApiProperty, transformApiCar, transformApiLand } from '@/lib/transforms';

interface AppContextType {
  state: Omit<AppState, 'user'>;
  actions: {
    setCurrentPage: (page: string) => void;
    addListing: (category: string, listing: any) => void;
    updateListing: (category: string, id: string, updates: any) => void;
    deleteListing: (category: string, id: string) => void;
    addMultipleListings: (category: string, listings: any) => void;
    toggleFavorite: (itemId: string) => void;
    setFilters: (filters: any) => void;
    getFilteredListings: (category: string) => any[];
    clearFilters: () => void;
    getFavoriteCount: () => number;
    refreshData: () => void;
  };
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: Omit<AppState, 'user'> = {
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Omit<AppState, 'user'>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
    loadFavorites();
  }, []);

  
const loadInitialData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    // Fetch all data in parallel
    const [propertiesRes, carsRes, landRes] = await Promise.all([
      apiClient.getProperties({ limit: 100 }),
      apiClient.getCars({ limit: 100 }),
      apiClient.getLand({ limit: 100 })
    ]);

    // Transform API responses to match frontend types
    const allProperties = (propertiesRes.data?.items || []).map(transformApiProperty);
    const properties = allProperties.filter(p => p.category === 'sale');
    const rentals = allProperties.filter(p => p.category === 'rent');
    const airbnb = allProperties.filter(p => p.category === 'short-stay');

    const cars = (carsRes.data?.items || []).map(transformApiCar);
    const land = (landRes.data?.items || []).map(transformApiLand);

    setState(prev => ({
      ...prev,
      properties,
      cars,
      land,
      rentals,
      airbnb
    }));
  } catch (err) {
    console.error('Failed to load data:', err);
    setError('Failed to load listings. Please try again later.');
  } finally {
    setLoading(false);
  }
};

  const loadFavorites = async () => {
    try {
      const response = await apiClient.getFavorites();
      if (response.data) {
        const favoriteIds = [
          ...(response.data.properties?.map(p => p.id) || []),
          ...(response.data.cars?.map(c => c.id) || []),
          ...(response.data.land?.map(l => l.id) || [])
        ];
        setState(prev => ({ ...prev, favorites: favoriteIds }));
      }
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  };

  const actions = {
    setCurrentPage: (page: string) => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentPage: page } }));
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
    
        if (response.data) {
          setState(prev => ({
            ...prev,
            [category]: [...(prev as any)[category], response.data]
          }));
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
    
        if (response.data) {
          setState(prev => ({
            ...prev,
            [category]: (prev as any)[category].map((item: any) => 
              item.id === id ? response.data : item
            )
          }));
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

        setState(prev => ({
          ...prev,
          [category]: (prev as any)[category].filter((item: any) => item.id !== id)
        }));
      } catch (err) {
        console.error('Failed to delete listing:', err);
        throw err;
      }
    },

    toggleFavorite: async (itemId: string) => {
      try {
        const entityType: 'property' | 'car' | 'land' = 
          itemId.startsWith('car-') ? 'car' : 
          itemId.startsWith('land-') ? 'land' : 
          'property';
    
        const response = await apiClient.toggleFavorite(entityType, itemId);
        
        if (response.data && 'favorited' in response.data) {
          setState(prev => ({
            ...prev,
            favorites: response.data!.favorited
              ? [...prev.favorites, itemId]
              : prev.favorites.filter(id => id !== itemId)
          }));
        }
      } catch (err) {
        console.error('Failed to toggle favorite:', err);
      }
    },

    addMultipleListings: (category: string, listings: any[]) => {
      setState(prev => ({
        ...prev,
        [category]: [...(prev as any)[category], ...listings]
      }));
    },

    setFilters: (filters: any) => {
      setState(prev => ({ 
        ...prev, 
        filters: { ...prev.filters, ...filters } 
      }));
    },

    clearFilters: () => {
      setState(prev => ({ 
        ...prev, 
        filters: initialState.filters 
      }));
    },

    getFavoriteCount: () => {
      return state.favorites.length;
    },

    refreshData: () => {
      loadInitialData();
    },

    getFilteredListings: (category: string) => {
      const listings = (state as any)[category] || [];
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
    }
  };

  return (
    <AppContext.Provider value={{ state, actions, loading, error }}>
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