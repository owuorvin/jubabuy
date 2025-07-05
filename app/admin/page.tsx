'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  // Mock data for now - replace with API calls later
  const mockStats = {
    totalRevenue: 500000,
    activeListings: 42,
    totalViews: 1250,
    newUsers: 28,
    conversionRate: 3.5
  };

  return (
    <ProtectedRoute requireAdmin>
      <AdminDashboard initialStats={mockStats} initialListings={[]} />
    </ProtectedRoute>
  );
}