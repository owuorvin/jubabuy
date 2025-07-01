'use client';

import { useApp } from '@/contexts/AppContext';

export function useFavorites() {
  const { state, actions } = useApp();

  const isFavorite = (itemId: string) => {
    return state.favorites.includes(itemId);
  };

  const getFavoriteItems = () => {
    const allItems = [
      ...state.properties,
      ...state.cars,
      ...state.land,
      ...state.rentals,
      ...state.airbnb
    ];
    
    return allItems.filter(item => state.favorites.includes(item.id));
  };

  return {
    favorites: state.favorites,
    isFavorite,
    toggleFavorite: actions.toggleFavorite,
    getFavoriteItems,
  };
}