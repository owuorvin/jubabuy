// hooks/useFeaturedListings.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

interface UseFeaturedListingsOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useFeaturedProperties(limit: number = 6, options?: UseFeaturedListingsOptions) {
  return useQuery({
    queryKey: ['featured-properties', limit],
    queryFn: async () => {
      const response = await apiClient.getFeaturedProperties(limit);
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled !== false,
  });
}

export function useFeaturedCars(limit: number = 6, options?: UseFeaturedListingsOptions) {
  return useQuery({
    queryKey: ['featured-cars', limit],
    queryFn: async () => {
      const response = await apiClient.getFeaturedCars(limit);
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled !== false,
  });
}

export function useFeaturedLand(limit: number = 6, options?: UseFeaturedListingsOptions) {
  return useQuery({
    queryKey: ['featured-land', limit],
    queryFn: async () => {
      const response = await apiClient.getFeaturedLand(limit);
      return response.data || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled !== false,
  });
}

export function useFeaturedAirbnb(limit: number = 3, options?: UseFeaturedListingsOptions) {
  return useQuery({
    queryKey: ['featured-airbnb', limit],
    queryFn: async () => {
      const response = await apiClient.getProperties({ 
        category: 'short-stay', 
        featured: true, 
        limit,
        status: 'active' 
      });
      return response.data?.items || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval,
    enabled: options?.enabled !== false,
  });
}

// Combined hook for all featured listings
export function useAllFeaturedListings(options?: UseFeaturedListingsOptions) {
  const properties = useFeaturedProperties(6, options);
  const cars = useFeaturedCars(6, options);
  const land = useFeaturedLand(6, options);
  const airbnb = useFeaturedAirbnb(3, options);

  const isLoading = properties.isLoading || cars.isLoading || land.isLoading || airbnb.isLoading;
  const isError = properties.isError || cars.isError || land.isError || airbnb.isError;
  const isSuccess = properties.isSuccess && cars.isSuccess && land.isSuccess && airbnb.isSuccess;

  const refetchAll = async () => {
    await Promise.all([
      properties.refetch(),
      cars.refetch(),
      land.refetch(),
      airbnb.refetch()
    ]);
  };

  return {
    properties: properties.data || [],
    cars: cars.data || [],
    land: land.data || [],
    airbnb: airbnb.data || [],
    isLoading,
    isError,
    isSuccess,
    refetchAll,
    loadingStates: {
      properties: properties.isLoading,
      cars: cars.isLoading,
      land: land.isLoading,
      airbnb: airbnb.isLoading,
    },
    errors: {
      properties: properties.error,
      cars: cars.error,
      land: land.error,
      airbnb: airbnb.error,
    }
  };
}