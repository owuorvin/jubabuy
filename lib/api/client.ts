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
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jubabuy.vercel.app';
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('jubabuy_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async fetcher<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      // Build headers object ensuring no undefined values
      const authHeaders = this.getAuthHeaders();
      const baseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Merge headers properly
      const headers: HeadersInit = {
        ...baseHeaders,
        ...authHeaders,
        ...(options?.headers as Record<string, string> || {}),
      };

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'API request failed' }));
        throw new Error(error.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }


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

  async submitInquiry(data: {
    name: string;
    email: string;
    phone: string;
    message?: string;
    entityType: 'property' | 'car' | 'land';
    entityId: string;
  }) {
    return this.fetcher<{ success: boolean; inquiryId: string }>('/api/inquiries', {
      method: 'POST',
      body: JSON.stringify(data),
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

    const headers = {
      ...this.getAuthHeaders(),
      // Remove Content-Type for FormData
    };

    return this.fetcher<Image>('/api/images/upload', {
      method: 'POST',
      body: formData,
      headers: headers as HeadersInit,
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