// app/land/page.tsx
'use client';

import { Suspense } from 'react';
import ListingsPage from '@/components/pages/OptimizedListingsPage';
import LoadingState from '@/components/LoadingState';

export default function LandPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ListingsPage category="land" title="Land & Plots for Sale" />
    </Suspense>
  );
}