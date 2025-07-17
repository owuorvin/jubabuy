// Since your DetailsPage fetches its own data, we can simplify the approach
// Just update your DetailsPageContent to extract the ID from the slug

// app/details/DetailsPageContent.tsx - Simplified version
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailsPage from '@/components/pages/DetailsPage';

interface DetailsPageContentProps {
  slug?: string;
  type?: 'property' | 'car' | 'land';
}

export default function DetailsPageContent({ slug, type }: DetailsPageContentProps = {}) {
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get identifier from props or query params
  const identifier = slug || searchParams.get('id');
  
  if (!identifier) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Item not found</h1>
          <p className="text-gray-600 mb-6">
            The listing you're looking for doesn't exist.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine type from props, query params, or identifier prefix
  const itemType = type || 
    (searchParams.get('type') as 'property' | 'car' | 'land') || 
    (identifier.startsWith('car-') ? 'car' :
     identifier.startsWith('land-') ? 'land' :
     'property');

  // Pass the identifier (which could be ID or slug) to DetailsPage
  // DetailsPage will handle fetching the data
  return <DetailsPage itemId={identifier} type={itemType} />;
}