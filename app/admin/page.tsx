'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { apiClient } from '@/lib/api/client';

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      setStats(data.stats);
      setListings(data.recentListings || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      // Use mock data as fallback
      setStats({
        totalRevenue: 500000,
        activeListings: 42,
        totalViews: 1250,
        newUsers: 28,
        conversionRate: 3.5
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard />
    </ProtectedRoute>
  );
}