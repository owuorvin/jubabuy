'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { state } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!state.user.isAuthenticated || !state.user.isAdmin) {
      router.push('/login');
    }
  }, [state.user, router]);

  if (!state.user.isAdmin) {
    return null;
  }

  return <AdminDashboard />;
}