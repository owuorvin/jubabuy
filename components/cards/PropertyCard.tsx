'use client';

import { Heart, MapPin, Bed, Bath, Square, Camera } from 'lucide-react';
import { Property } from '@/lib/db/schema';
import { useFavorites } from '@/hooks/use-favorites';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: Property & { images?: any[]; agent?: any };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();
  const mainImage = property.images?.find(img => img.isMain) || property.images?.[0];

  const handleClick = () => {
    router.push(`/properties/${property.slug}`);
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite('property', property.id);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
    >
      <div className="relative overflow-hidden h-64">
        <img 
          src={mainImage?.url || '/images/placeholder.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'active' ? 'bg-green-500 text-white' :
            property.status === 'sold' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {property.status}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <button 
            onClick={handleFavorite}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-white"
          >
            <Heart className={`w-5 h-5 ${
              isFavorite(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-700'
            }`} />
          </button>
        </div>

        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center">
          <Camera className="w-4 h-4 mr-1.5" />
          {property.images?.length || 0} Photos
        </div>
      </div>

      <div className="p-6">
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900">
            {formatPrice(property.price)}
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
          <span className="text-sm">{property.location}</span>
        </div>

        {property.bedrooms && (
          <div className="grid grid-cols-3 gap-3 py-4 border-y border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Bed className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.bedrooms}</p>
              <p className="text-xs text-gray-500">Bedrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Bath className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.bathrooms}</p>
              <p className="text-xs text-gray-500">Bathrooms</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center text-gray-400 mb-1">
                <Square className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{property.area}</p>
              <p className="text-xs text-gray-500">Sqft</p>
            </div>
          </div>
        )}

        {property.agent && (
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <img 
                src={property.agent.avatar || `https://ui-avatars.com/api/?name=${property.agent.name}&background=e5e7eb&color=374151&bold=true`}
                alt={property.agent.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">{property.agent.name}</p>
                <p className="text-xs text-gray-500">Verified Agent</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}