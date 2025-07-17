// components/LoadingState.tsx
import { ListingSkeleton } from '@/components/skeletons/ListingSkeleton';

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse mb-8">
          <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <ListingSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}