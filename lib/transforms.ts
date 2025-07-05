// lib/utils/transforms.ts

import { Property, Car, Land } from '@/lib/types';

// Transform API response to match frontend types
export function transformApiProperty(apiData: any): Property {
  return {
    id: apiData.id,
    title: apiData.title,
    price: apiData.price,
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || new Date().toISOString(),
    status: apiData.status || 'active',
    featured: apiData.featured || false,
    views: apiData.views || 0,
    description: apiData.description || '',
    location: apiData.location || 'Juba',
    features: apiData.features ? apiData.features.split(',') : [],
    bedrooms: apiData.bedrooms || 0,
    bathrooms: apiData.bathrooms || 0,
    area: apiData.area || 0,
    furnished: apiData.furnished || false,
    amenities: apiData.amenities ? apiData.amenities.split(',') : [],
    // Provide default values for missing relations
    agent: apiData.agent || {
      id: apiData.agentId || 'default',
      name: 'JUBABUY Agent',
      phone: '+211704049044',
      email: 'info@jubabuy.com'
    },
    images: apiData.images || []
  };
}

export function transformApiCar(apiData: any): Car {
  return {
    id: apiData.id,
    title: apiData.title,
    price: apiData.price,
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || new Date().toISOString(),
    status: apiData.status || 'active',
    featured: apiData.featured || false,
    views: apiData.views || 0,
    description: apiData.description || '',
    location: apiData.location || 'Juba', // Add default location
    features: apiData.features ? apiData.features.split(',') : [],
    year: apiData.year,
    make: apiData.make,
    model: apiData.model,
    mileage: apiData.mileage || 0,
    fuel: apiData.fuel || 'Petrol',
    transmission: apiData.transmission || 'Manual',
    condition: apiData.condition || 'Used',
    // Provide default values for missing relations
    agent: apiData.agent || {
      id: apiData.agentId || 'default',
      name: 'JUBABUY Agent',
      phone: '+211704049044',
      email: 'info@jubabuy.com'
    },
    images: apiData.images || []
  };
}

export function transformApiLand(apiData: any): Land {
  return {
    id: apiData.id,
    title: apiData.title,
    price: apiData.price,
    createdAt: apiData.createdAt || new Date().toISOString(),
    updatedAt: apiData.updatedAt || new Date().toISOString(),
    status: apiData.status || 'active',
    featured: apiData.featured || false,
    views: apiData.views || 0,
    description: apiData.description || '',
    location: apiData.location || 'Juba',
    features: apiData.features ? apiData.features.split(',') : [],
    area: apiData.area,
    unit: apiData.unit,
    zoning: apiData.zoning || 'Residential',
    // Provide default values for missing relations
    agent: apiData.agent || {
      id: apiData.agentId || 'default',
      name: 'JUBABUY Agent',
      phone: '+211704049044',
      email: 'info@jubabuy.com'
    },
    images: apiData.images || []
  };
}