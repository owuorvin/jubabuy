// app/rentals/page.tsx
'use client';

import { Suspense } from 'react';
import ListingsPage from '@/components/pages/OptimizedListingsPage';
import LoadingState from '@/components/LoadingState';

export default function RentalsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ListingsPage 
        category="properties" 
        title="Houses for Rent" 
        initialFilters={{ category: 'rent' }}
      />
    </Suspense>
  );
}