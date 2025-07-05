import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Property } from '@/lib/db/schema';

interface UsePropertiesOptions {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export function useProperties(options: UsePropertiesOptions = {}) {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
    });
  
    useEffect(() => {
      const fetchProperties = async () => {
        setLoading(true);
        setError(null);
  
        const response = await apiClient.getProperties(options);
  
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
            setProperties(response.data.items || []); 
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
  
        setLoading(false);
      };
  
      fetchProperties();
    }, [JSON.stringify(options)]);
  
    return { properties, loading, error, pagination };
  }
