// lib/api/client.ts
import { Property, Car, Land, Agent, Image } from '@/lib/db/schema';

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

export type ListResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    // Use your Vercel Functions URL or external API
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jubabuy.com';
  }

  private getAuthHeaders(): Record<string, string> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return {};
    }
    
    const token = localStorage.getItem('jubabuy_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
  private async fetcher<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const url = endpoint.startsWith('/') 
        ? `${this.baseUrl}${endpoint}` 
        : `${this.baseUrl}/${endpoint}`;
      
      // Build headers
      const authHeaders = this.getAuthHeaders();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...authHeaders,
      };
  
      // Don't set Content-Type for FormData
      if (options?.body instanceof FormData) {
        delete (headers as any)['Content-Type'];
      }
  
      // Merge with any provided headers
      if (options?.headers) {
        Object.assign(headers, options.headers);
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
  
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'API request failed' }));
        throw new Error(error.error || 'API request failed');
      }
  
      const data = await response.json();
      
      // Handle different response structures from the API
      // 1. Check for standard list response structure (data.items)
      if (data.data && typeof data.data === 'object' && 'items' in data.data) {
        return {
          data: data.data as T,
          pagination: data.data.pagination
        };
      }
      
      // 2. Check for single item response (data without items)
      if (data.data && typeof data.data === 'object' && !('items' in data.data)) {
        return { data: data.data as T };
      }
      
      // 3. Legacy structure with type-specific properties
      if ('properties' in data || 'cars' in data || 'land' in data) {
        const items = data.properties || data.cars || data.land || [];
        return {
          data: {
            items,
            pagination: data.pagination
          } as unknown as T
        };
      }
      
      // 4. Direct data property
      if ('data' in data) {
        return { data: data.data as T };
      }
      
      // 5. Fallback - assume the whole response is the data
      return { data: data as T };
      
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
//   private async fetcher<T>(
//     endpoint: string,
//     options?: RequestInit
//   ): Promise<ApiResponse<T>> {
//     try {
//       const url = endpoint.startsWith('/') 
//         ? `${this.baseUrl}${endpoint}` 
//         : `${this.baseUrl}/${endpoint}`;
      
//       // Build headers
//       const authHeaders = this.getAuthHeaders();
//       const headers: HeadersInit = {
//         'Content-Type': 'application/json',
//         ...authHeaders,
//       };

//       // Don't set Content-Type for FormData
//       if (options?.body instanceof FormData) {
//         delete (headers as any)['Content-Type'];
//       }

//       // Merge with any provided headers
//       if (options?.headers) {
//         Object.assign(headers, options.headers);
//       }
      
//       const response = await fetch(url, {
//         ...options,
//         headers,
//       });
  
//       if (!response.ok) {
//         const error = await response.json().catch(() => ({ error: 'API request failed' }));
//         throw new Error(error.error || 'API request failed');
//       }
  
//       const data = await response.json();
      
//       // Handle different response structures from the API
//       if ('properties' in data || 'cars' in data || 'land' in data) {
//         // List response
//         const items = data.properties || data.cars || data.land || [];
//         return {
//           data: {
//             items,
//             pagination: data.pagination
//           } as unknown as T
//         };
//       } else if ('data' in data) {
//         // Direct data response
//         return { data: data.data };
//       } else {
//         // Assume the whole response is the data
//         return { data: data as T };
//       }

      
//     } catch (error) {
//       console.error('API Error:', error);
//       return { error: error instanceof Error ? error.message : 'Unknown error' };
//     }
//   }

  // ==================== PROPERTIES ====================

  async getProperties(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<ListResponse<Property>>(
      `/api/properties${queryString ? `?${queryString}` : ''}`
    );
  }

  async getProperty(id: string) {
    return this.fetcher<Property>(`/api/properties/${id}`);
  }

  async getPropertyBySlug(slug: string) {
    return this.fetcher<Property>(`/api/properties/slug/${slug}`);
  }

  async createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fetcher<Property>('/api/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: string, data: Partial<Property>) {
    return this.fetcher<Property>(`/api/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: string) {
    return this.fetcher<{ success: boolean }>(`/api/properties/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeaturedProperties(limit: number = 6) {
    return this.fetcher<Property[]>(`/api/properties/featured?limit=${limit}`);
  }

  // ==================== CARS ====================

  async getCars(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<ListResponse<Car>>(
      `/api/cars${queryString ? `?${queryString}` : ''}`
    );
  }

  async getCar(id: string) {
    return this.fetcher<Car>(`/api/cars/${id}`);
  }

  async getCarBySlug(slug: string) {
    return this.fetcher<Car>(`/api/cars/slug/${slug}`);
  }

  async createCar(data: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fetcher<Car>('/api/cars', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCar(id: string, data: Partial<Car>) {
    return this.fetcher<Car>(`/api/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCar(id: string) {
    return this.fetcher<{ success: boolean }>(`/api/cars/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeaturedCars(limit: number = 6) {
    return this.fetcher<Car[]>(`/api/cars/featured?limit=${limit}`);
  }

  // ==================== LAND ====================

  async getLand(params?: Record<string, any>) {
    const queryString = new URLSearchParams(params).toString();
    return this.fetcher<ListResponse<Land>>(
      `/api/land${queryString ? `?${queryString}` : ''}`
    );
  }

  async getLandById(id: string) {
    return this.fetcher<Land>(`/api/land/${id}`);
  }

  async getLandBySlug(slug: string) {
    return this.fetcher<Land>(`/api/land/slug/${slug}`);
  }

  async createLand(data: Omit<Land, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fetcher<Land>('/api/land', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLand(id: string, data: Partial<Land>) {
    return this.fetcher<Land>(`/api/land/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLand(id: string) {
    return this.fetcher<{ success: boolean }>(`/api/land/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeaturedLand(limit: number = 6) {
    return this.fetcher<Land[]>(`/api/land/featured?limit=${limit}`);
  }

  // ==================== SEARCH ====================

  async search(query: string, filters?: {
    category?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    type?: string;
  }) {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.category && { category: filters.category }),
      ...(filters?.location && { location: filters.location }),
      ...(filters?.priceMin && { priceMin: filters.priceMin.toString() }),
      ...(filters?.priceMax && { priceMax: filters.priceMax.toString() }),
      ...(filters?.type && { type: filters.type }),
    });
    
    return this.fetcher<{
      properties: Property[];
      cars: Car[];
      land: Land[];
    }>(`/api/search?${params}`);
  }

  // ==================== FAVORITES ====================

  async getFavorites() {
    return this.fetcher<{
      properties: Property[];
      cars: Car[];
      land: Land[];
    }>('/api/favorites');
  }

  async toggleFavorite(entityType: 'property' | 'car' | 'land', entityId: string) {
    return this.fetcher<{ favorited: boolean }>('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ entityType, entityId }),
    });
  }

  async isFavorite(entityType: 'property' | 'car' | 'land', entityId: string) {
    return this.fetcher<{ isFavorite: boolean }>(
      `/api/favorites/check?type=${entityType}&id=${entityId}`
    );
  }

  // ==================== INQUIRIES ====================

  // async submitInquiry(data: {
  //   name: string;
  //   email: string;
  //   phone: string;
  //   message?: string;
  //   entityType: 'property' | 'car' | 'land';
  //   entityId: string;
  // }) {
  //   return this.fetcher<{ success: boolean; inquiryId: string }>('/api/inquiries', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });
  // }

  async submitInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    subject?: string; // Added for general inquiries
    entityType?: 'property' | 'car' | 'land' | 'general'; // Made optional with 'general' option
    entityId?: string; // Made optional
  }) {
    // Default to general inquiry if no entity specified
    const inquiryData = {
      ...data,
      entityType: data.entityType || 'general',
      entityId: data.entityId || 'contact-form',
    };
  
    return this.fetcher<{ success: boolean; inquiryId: string }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(inquiryData),
    });
  }
  
  // Add a method specifically for contact form submissions
  async submitContactForm(data: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
  }) {
    return this.submitInquiry({
      ...data,
      entityType: 'general',
      entityId: 'contact-form',
    });
  }
  
  // Add a method specifically for listing-related inquiries
  async submitListingInquiry(
    entityType: 'property' | 'car' | 'land',
    entityId: string,
    data: {
      name: string;
      email: string;
      phone: string;
      message?: string;
    }
  ) {
    return this.submitInquiry({
      ...data,
      entityType,
      entityId,
    });
  }


  async getInquiries(params?: {
    status?: 'new' | 'contacted' | 'closed';
    entityType?: string;
    page?: number;
    limit?: number;
  }) {
    const queryString = new URLSearchParams(params as any).toString();
    return this.fetcher<ListResponse<any>>(
      `/api/inquiries${queryString ? `?${queryString}` : ''}`
    );
  }

  async updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'closed') {
    return this.fetcher<{ success: boolean }>(`/api/inquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // ==================== AGENTS ====================

  async getAgents() {
    return this.fetcher<Agent[]>('/api/agents');
  }

  async getAgent(id: string) {
    return this.fetcher<Agent>(`/api/agents/${id}`);
  }

  async createAgent(data: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.fetcher<Agent>('/api/agents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAgent(id: string, data: Partial<Agent>) {
    return this.fetcher<Agent>(`/api/agents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAgent(id: string) {
    return this.fetcher<{ success: boolean }>(`/api/agents/${id}`, {
      method: 'DELETE',
    });
  }

  // ==================== IMAGES ====================

  async uploadImage(file: File, metadata: {
    entityType: 'property' | 'car' | 'land';
    entityId: string;
    isMain?: boolean;
    order?: number;
  }) {
    const formData = new FormData();
    formData.append('file', file);
    Object.entries(metadata).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    return this.fetcher<Image>('/api/images/upload', {
      method: 'POST',
      body: formData,
    });
  }

  async deleteImage(id: string) {
    return this.fetcher<{ success: boolean }>(`/api/images/${id}`, {
      method: 'DELETE',
    });
  }

  async reorderImages(entityType: string, entityId: string, imageIds: string[]) {
    return this.fetcher<{ success: boolean }>('/api/images/reorder', {
      method: 'PUT',
      body: JSON.stringify({ entityType, entityId, imageIds }),
    });
  }

  // ==================== STATS ====================

  async getStats() {
    return this.fetcher<{
      totalRevenue: number;
      activeListings: number;
      totalViews: number;
      newUsers: number;
      conversionRate: number;
      properties: number;
      cars: number;
      land: number;
      rentals: number;
    }>('/api/stats');
  }

  async getRecentListings(limit: number = 10) {
    return this.fetcher<Array<Property | Car | Land>>(
      `/api/listings/recent?limit=${limit}`
    );
  }

  // ==================== CATEGORIES ====================

  async getPropertyTypes() {
    return this.fetcher<string[]>('/api/properties/types');
  }

  async getCarMakes() {
    return this.fetcher<string[]>('/api/cars/makes');
  }

  async getCarModels(make: string) {
    return this.fetcher<string[]>(`/api/cars/models?make=${make}`);
  }

  async getLocations() {
    return this.fetcher<string[]>('/api/locations');
  }

  // ==================== ADMIN ====================

  async adminLogin(email: string, password: string) {
    return this.fetcher<{ token: string; user: any }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async adminLogout() {
    return this.fetcher<{ success: boolean }>('/api/auth/logout', {
      method: 'POST',
    });
  }

  async getAdminStats(dateRange?: string) {
    return this.fetcher<any>(`/api/admin/stats${dateRange ? `?range=${dateRange}` : ''}`);
  }

  async bulkUpdateStatus(
    entityType: 'property' | 'car' | 'land',
    ids: string[],
    status: string
  ) {
    return this.fetcher<{ success: boolean; updated: number }>('/api/admin/bulk-update', {
      method: 'PUT',
      body: JSON.stringify({ entityType, ids, status }),
    });
  }

  async exportData(entityType: 'property' | 'car' | 'land', format: 'csv' | 'json') {
    return this.fetcher<{ downloadUrl: string }>(
      `/api/admin/export?type=${entityType}&format=${format}`
    );
  }

  

}

export const apiClient = new ApiClient();