'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, Property, Car, Land } from '@/lib/types';
import { generateMockData } from '@/lib/mock-data';

interface AppContextType {
  state: AppState;
  actions: {
    setCurrentPage: (page: string) => void;
    login: (email: string, password: string) => boolean;
    logout: () => void;
    addListing: (category: string, listing: any) => void;
    updateListing: (category: string, id: string, updates: any) => void;
    deleteListing: (category: string, id: string) => void;
    toggleFavorite: (itemId: string) => void;
    setFilters: (filters: any) => void;
    getFilteredListings: (category: string) => any[];
    clearFilters: () => void;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialState: AppState = {
  user: {
    isAuthenticated: false,
    isAdmin: false,
    profile: null
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

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setState(prev => ({
      ...prev,
      properties: generateMockData('properties', 20),
      cars: generateMockData('cars', 15),
      land: generateMockData('land', 10),
      rentals: generateMockData('rentals', 12),
      airbnb: generateMockData('airbnb', 8)
    }));
  };

  const actions = {
    setCurrentPage: (page: string) => {
      setState(prev => ({ ...prev, ui: { ...prev.ui, currentPage: page } }));
    },

    login: (email: string, password: string) => {
      if (email === 'admin@ariesltd.com' && password === 'admin123') {
        setState(prev => ({
          ...prev,
          user: {
            isAuthenticated: true,
            isAdmin: true,
            profile: {
              name: 'Admin User',
              email: 'admin@ariesltd.com'
            }
          }
        }));
        return true;
      }
      return false;
    },

    logout: () => {
      setState(prev => ({
        ...prev,
        user: {
          isAuthenticated: false,
          isAdmin: false,
          profile: null
        },
        ui: { ...prev.ui, currentPage: 'home' }
      }));
    },

    addListing: (category: string, listing: any) => {
      const newListing = {
        ...listing,
        id: `${category}-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        views: 0
      };

      setState(prev => ({
        ...prev,
        [category]: [...(prev as any)[category], newListing]
      }));
    },

    updateListing: (category: string, id: string, updates: any) => {
      setState(prev => ({
        ...prev,
        [category]: (prev as any)[category].map((item: any) => 
          item.id === id 
            ? { ...item, ...updates, updatedAt: new Date().toISOString() }
            : item
        )
      }));
    },

    deleteListing: (category: string, id: string) => {
      setState(prev => ({
        ...prev,
        [category]: (prev as any)[category].filter((item: any) => item.id !== id)
      }));
    },

    toggleFavorite: (itemId: string) => {
      setState(prev => ({
        ...prev,
        favorites: prev.favorites.includes(itemId)
          ? prev.favorites.filter(id => id !== itemId)
          : [...prev.favorites, itemId]
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

    getFilteredListings: (category: string) => {
      const listings = (state as any)[category] || [];
      const { location, priceMin, priceMax, propertyType, bedrooms, bathrooms } = state.filters;
      
      return listings.filter((item: any) => {
        // Location filter
        if (location && item.location !== location) return false;
        
        // Price range filter
        if (priceMin && item.price < parseInt(priceMin)) return false;
        if (priceMax && item.price > parseInt(priceMax)) return false;
        
        // Property type filter
        if (propertyType) {
          // For properties
          if ('bedrooms' in item && propertyType === 'house' && !item.title.toLowerCase().includes('house')) return false;
          if ('bedrooms' in item && propertyType === 'apartment' && !item.title.toLowerCase().includes('apartment')) return false;
          if ('bedrooms' in item && propertyType === 'villa' && !item.title.toLowerCase().includes('villa')) return false;
          
          // For cars
          if ('make' in item) {
            const carType = item.model?.toLowerCase() || '';
            if (propertyType === 'sedan' && !carType.includes('sedan')) return false;
            if (propertyType === 'suv' && !carType.includes('suv') && !carType.includes('forester')) return false;
            if (propertyType === 'truck' && !carType.includes('truck')) return false;
          }
        }
        
        // Bedrooms filter (for properties only)
        if (bedrooms && 'bedrooms' in item && item.bedrooms < parseInt(bedrooms)) return false;
        
        // Bathrooms filter (for properties only)
        if (bathrooms && 'bathrooms' in item && item.bathrooms < parseInt(bathrooms)) return false;
        
        return true;
      });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
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