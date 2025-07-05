// hooks/useApiCall.ts
import { apiClient } from '@/lib/api/client';
import { Property } from '@/lib/types';
import { useState, useCallback } from 'react';

export function useApiCall<T = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (apiCall: Promise<any>) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiCall;
      if (response.error) {
        setError(response.error);
      } else {
        setData(response.data);
      }
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, data };
}

// Usage
const { execute, loading, error, data } = useApiCall<Property[]>();

const fetchProperties = async () => {
  await execute(apiClient.getProperties({ category: 'sale' }));
};