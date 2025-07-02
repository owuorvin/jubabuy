// lib/api/client.ts
import { Property, Car } from '@/lib/db/schema';
import { Land } from '../types';

type ApiResponse<T> = {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  private async fetcher<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Properties
  async getProperties(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<{ properties: Property[]; pagination: any }>(
      `/api/properties${queryString ? `?${queryString}` : ''}`
    );
  }

  async getProperty(id: string) {
    return this.fetcher<Property>(`/api/properties/${id}`);
  }

  async createProperty(data: any) {
    return this.fetcher<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Cars

  async createCar(data: any) {
    return this.fetcher<any>('/api/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCar(id: string, data: any) {
    return this.fetcher<any>(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCar(id: string) {
    return this.fetcher<any>(`/api/cars/${id}`, {
      method: 'DELETE',
    });
  }


  async getCars(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<{ cars: Car[]; pagination: any }>(
      `/api/cars${queryString ? `?${queryString}` : ''}`
    );
  }

  async getCar(id: string) {
    return this.fetcher<Car>(`/api/cars/${id}`);
  }

  // Search
  async search(query: string) {
    return this.fetcher<{ results: any[] }>(
      `/api/search?q=${encodeURIComponent(query)}`
    );
  }

  // Favorites
  async getFavorites() {
    return this.fetcher<{ favorites: any[] }>('/api/favorites');
  }

  async toggleFavorite(entityType: 'property' | 'car', entityId: string) {
    return this.fetcher<{ favorited: boolean }>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ entityType, entityId }),
    });
  }

  // Inquiries
  async submitInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    entityType: string;
    entityId: string;
  }) {
    return this.fetcher('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  async deleteProperty(id: string) {
    return this.fetcher(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async updateProperty(id: string, data: any) {
    return this.fetcher<Property>(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Land
  async getLand(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<{ land: Land[]; pagination: any }>(
      `/api/land${queryString ? `?${queryString}` : ''}`
    );
  }

  async createLand(data: any) {
    return this.fetcher<Land>('/api/land', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLand(id: string, data: any) {
    return this.fetcher<Land>(`/api/land/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLand(id: string) {
    return this.fetcher(`/api/land/${id}`, {
      method: 'DELETE',
    });
  }


}

export const apiClient = new ApiClient();