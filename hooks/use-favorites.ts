import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api/client';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggleFavorite = useCallback(async (
    entityType: 'property' | 'car',
    entityId: string
  ) => {
    setLoading(true);
    const response = await apiClient.toggleFavorite(entityType, entityId);
    
    if (response.data) {
      setFavorites(prev => {
        const newSet = new Set(prev);
        if (response.data?.favorited) {
          newSet.add(entityId);
        } else {
          newSet.delete(entityId);
        }
        return newSet;
      });
    }
    
    setLoading(false);
    return response.data?.favorited;
  }, []);

  const isFavorite = useCallback((entityId: string) => {
    return favorites.has(entityId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite, loading };
}