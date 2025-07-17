'use client';

import { Suspense } from 'react';
import OptimizedListingsPage from '@/components/pages/OptimizedListingsPage';
import LoadingState from '@/components/LoadingState';

export default function PropertiesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <OptimizedListingsPage 
        category="properties" 
        title="Houses for Sale"
      />
    </Suspense>
  );
}