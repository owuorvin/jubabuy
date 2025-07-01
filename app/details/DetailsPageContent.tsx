// app/details/DetailsPageContent.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DetailsPage from '@/components/pages/DetailsPage';

export default function DetailsPageContent() {
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

  const id = searchParams.get('id');
  
  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h1>
          <p className="text-gray-600 mb-6">The item you're looking for doesn't exist.</p>
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
  
  // Determine type based on ID prefix
  const type: 'property' | 'car' | 'land' = 
    id.startsWith('car-') ? 'car' : 
    id.startsWith('land-') ? 'land' : 
    'property';
  
  return <DetailsPage itemId={id} type={type} />;
}