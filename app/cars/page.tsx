// app/cars/page.tsx
'use client';

import { Suspense } from 'react';
import ListingsPage from '@/components/pages/OptimizedListingsPage';
import LoadingState from '@/components/LoadingState';

export default function CarsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ListingsPage category="cars" title="Cars for Sale" />
    </Suspense>
  );
}