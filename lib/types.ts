export interface User {
    isAuthenticated: boolean;
    isAdmin: boolean;
    profile: UserProfile | null;
  }
  
  export interface UserProfile {
    name: string;
    email: string;
  }
  
  export interface Agent {
    id: string;
    name: string;
    phone: string;
    email: string;
  }
  
  export interface BaseItem {
    id: string;
    title: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'pending' | 'sold';
    featured: boolean;
    views: number;
    agent: Agent;
    images: string[];
    description?: string;
    location: string;  // Added to BaseItem so all items have location
    features: string[]; // Added to BaseItem so all items have features
  }
  
  export interface Property extends BaseItem {
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    furnished: boolean;
    amenities: string[];
  }
  
  export interface Car extends BaseItem {
    year: number;
    make: string;
    model: string;
    mileage: number;
    fuel: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric';
    transmission: 'Manual' | 'Automatic';
    condition: 'New' | 'Used';
  }
  
  export interface Land extends BaseItem {
    location: string;
    area: number;
    unit: string;
    zoning: 'Residential' | 'Commercial' | 'Mixed' | 'Agricultural';
  }
  
  export interface AppState {
    user: User;
    properties: Property[];
    cars: Car[];
    land: Land[];
    rentals: Property[];
    airbnb: Property[];
    favorites: string[];
    filters: Filters;
    ui: UIState;
  }
  
  export interface Filters {
    category: string;
    location: string;
    priceMin: string;
    priceMax: string;
    bedrooms: string;
    bathrooms: string;
    propertyType: string;
  }
  
  export interface UIState {
    currentPage: string;
    mobileMenuOpen: boolean;
    filterOpen: boolean;
    viewMode: 'grid' | 'list';
  }