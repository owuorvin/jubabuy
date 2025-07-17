// hooks/useListings.ts
import React from 'react';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

// Import the ListResponse type from API client
import type { ListResponse } from '@/lib/api/client';

// Extend ListResponse with computed properties
interface ListingDataWithComputed<T = any> extends ListResponse<T> {
  pagination: ListResponse<T>['pagination'] & {
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Regular listings hook with prefetching
export function useOptimizedListings(
  category: 'properties' | 'cars' | 'land',
  filters: Record<string, any> = {}
) {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['listings', category, filters],
    queryFn: async () => {
      console.log(`[useOptimizedListings] Fetching ${category} with filters:`, filters);
      
    //   const fetchFn = {
    //     properties: apiClient.getProperties,
    //     cars: apiClient.getCars,
    //     land: apiClient.getLand,
    //   }[category];
    const fetchFn = {
        properties: (params: any) => apiClient.getProperties(params),
        cars: (params: any) => apiClient.getCars(params),
        land: (params: any) => apiClient.getLand(params),
      }[category];
      
      const response = await fetchFn(filters);
      console.log(`[useOptimizedListings] Response:`, response);
      
      // Handle different response structures
      if (response.error) {
        throw new Error(response.error);
      }
      
      if (response.data && response.data.pagination) {
        const { page, pages } = response.data.pagination;
        return {
          ...response.data,
          pagination: {
            ...response.data.pagination,
            hasNext: page < pages,
            hasPrev: page > 1,
          }
        } as ListingDataWithComputed;
      }
      
      // Fallback for missing data
      return {
        items: [],
        pagination: {
          page: 1,
          pages: 0,
          total: 0,
          limit: 12,
          hasNext: false,
          hasPrev: false,
        }
      } as ListingDataWithComputed;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Prefetch next page after successful query
  React.useEffect(() => {
    if (query.data?.pagination?.hasNext) {
      queryClient.prefetchQuery({
        queryKey: ['listings', category, { ...filters, page: (filters.page || 1) + 1 }],
        queryFn: async () => {
          const fetchFn = {
            properties: apiClient.getProperties,
            cars: apiClient.getCars,
            land: apiClient.getLand,
          }[category];
          
          const response = await fetchFn({ 
            ...filters, 
            page: (filters.page || 1) + 1 
          });
          return response.data;
        },
      });
    }
  }, [query.data, queryClient, category, filters]);
  
  return query;
}

// Infinite scroll hook with better error handling
export function useInfiniteListings(
  category: 'properties' | 'cars' | 'land' | 'rentals' | 'airbnb',
  filters: Record<string, any> = {}
) {
  // Map UI categories to API categories
  const apiCategory = ['rentals', 'airbnb'].includes(category) ? 'properties' : category;
  
  return useInfiniteQuery({
    queryKey: ['listings-infinite', category, filters],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        console.log(`[useInfiniteListings] Fetching2 ${apiCategory} page ${pageParam} with filters:`, filters);
        
        const fetchFn = {
            properties: (params: any) => apiClient.getProperties(params),
            cars: (params: any) => apiClient.getCars(params),
            land: (params: any) => apiClient.getLand(params),
            rentals: (params: any) => apiClient.getProperties(params),
            airbnb: (params: any) => apiClient.getProperties(params),
        }[apiCategory as 'properties' | 'cars' | 'land'];
        
        if (!fetchFn) {
          throw new Error(`No fetch function for category: ${apiCategory}`);
        }
        
        const response = await fetchFn({
          ...filters,
          page: pageParam,
          limit: 12,
        });
        
        console.log(`[useInfiniteListings] Response for page ${pageParam}:`, response);
        
        // Handle API errors
        if (response.error) {
          throw new Error(response.error);
        }
        
        // Handle successful response with data
        if (response.data) {
          // Check if response has the expected structure
          if ('items' in response.data && 'pagination' in response.data) {
            const { page, pages } = response.data.pagination;
            return {
              ...response.data,
              pagination: {
                ...response.data.pagination,
                hasNext: page < pages,
                hasPrev: page > 1,
              }
            } as ListingDataWithComputed;
          }
          
          // Handle legacy response structure (direct array)
          if (Array.isArray(response.data)) {
            console.warn('[useInfiniteListings] Legacy response structure detected');
            return {
              items: response.data,
              pagination: {
                page: pageParam,
                pages: 1,
                //total: response.data.length,
                total: 10,
                limit: 12,
                hasNext: false,
                hasPrev: pageParam > 1,
              }
            } as ListingDataWithComputed;
          }
        }
        
        // Return empty result if no valid data structure
        console.warn('[useInfiniteListings] No valid data structure found in response');
        return {
          items: [],
          pagination: {
            page: pageParam,
            pages: 0,
            total: 0,
            limit: 12,
            hasNext: false,
            hasPrev: false,
          }
        } as ListingDataWithComputed;
        
      } catch (error) {
        console.error('[useInfiniteListings] Error:', error);
        throw error;
      }
    },
    getNextPageParam: (lastPage: ListingDataWithComputed) => {
      if (!lastPage?.pagination) {
        console.log('[useInfiniteListings] No pagination in lastPage');
        return undefined;
      }
      
      const { page, pages } = lastPage.pagination;
      const nextPage = page < pages ? page + 1 : undefined;
      console.log(`[useInfiniteListings] Next page: ${nextPage} (current: ${page}/${pages})`);
      return nextPage;
    },
    initialPageParam: 1,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}

// Hook to get a single listing
export function useListing(
  category: 'property' | 'car' | 'land',
  id: string
) {
  return useQuery({
    queryKey: ['listing', category, id],
    queryFn: async () => {
      const fetchFn = {
        property: apiClient.getProperty,
        car: apiClient.getCar,
        land: apiClient.getLandById,
      }[category];
      
      const response = await fetchFn(id);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook to toggle favorite
export function useFavoriteToggle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      entityType, 
      entityId 
    }: { 
      entityType: 'property' | 'car' | 'land'; 
      entityId: string;
    }) => {
      const response = await apiClient.toggleFavorite(entityType, entityId);
      if (response.error) {
        throw new Error(response.error);
      }
      return response.data;
    },
    onSuccess: () => {
      // Invalidate favorites and listings queries
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}