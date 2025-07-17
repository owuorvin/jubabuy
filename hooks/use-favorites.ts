// hooks/use-favorites.ts
import { useEffect, useState } from 'react';

type ItemType = 'property' | 'car' | 'land';

interface FavoriteItem {
  id: string;
  type: ItemType;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('jubabuy_favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('jubabuy_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (type: ItemType, id: string) => {
    setFavorites(prev => {
      const exists = prev.some(fav => fav.id === id && fav.type === type);
      
      if (exists) {
        // Remove from favorites
        return prev.filter(fav => !(fav.id === id && fav.type === type));
      } else {
        // Add to favorites
        return [...prev, { id, type }];
      }
    });
  };

  const isFavorite = (id: string, type?: ItemType) => {
    if (type) {
      return favorites.some(fav => fav.id === id && fav.type === type);
    }
    // Check if ID exists in any type (backward compatibility)
    return favorites.some(fav => fav.id === id);
  };

  const getFavoritesByType = (type: ItemType) => {
    return favorites.filter(fav => fav.type === type);
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    getFavoritesByType,
  };
}