'use client';

import { useApp } from '@/contexts/AppContext';

export function useAuth() {
  const { state, actions } = useApp();

  return {
    user: state.user,
    isAuthenticated: state.user.isAuthenticated,
    isAdmin: state.user.isAdmin,
    login: actions.login,
    logout: actions.logout,
  };
}