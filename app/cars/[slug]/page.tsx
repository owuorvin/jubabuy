'use client';
import { Suspense } from 'react';
import DetailsPageContent from '@/app/details/DetailsPageContent';

export default function CarDetailsPage({ params }: { params: { slug: string } }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DetailsPageContent slug={params.slug} type="car" />
    </Suspense>
  );
}