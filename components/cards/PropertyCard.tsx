'use client';

import { Heart, MapPin, Bed, Bath, Square, Camera, Share2, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Property, Car, Land } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface PropertyCardProps {
  property: Property | Car | Land;
  type: 'property' | 'car' | 'land';
}

export default function PropertyCard({ property, type }: PropertyCardProps) {
  const { state, actions } = useApp();
  const isFavorite = state.favorites.includes(property.id);

  const router = useRouter();
  
  const handleViewDetails = () => {
    // Updated to use query parameter format for client-side routing
    router.push(`/details?id=${property.id}`);
  };

  const isProperty = (item: any): item is Property => {
    return 'bedrooms' in item;
  };

  const isCar = (item: any): item is Car => {
    return 'make' in item && 'model' in item;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
      <div className="relative overflow-hidden h-64">
        <img 
          src={property.images?.[0] || '/images/placeholder.jpg'} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'active' ? 'bg-green-500 text-white' :
            property.status === 'pending' ? 'bg-yellow-500 text-white' :
            property.status === 'sold' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {property.status || 'Available'}
          </span>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button 
            onClick={() => actions.toggleFavorite(property.id)}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-white"
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
          </button>
          <button className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-white">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Photo Count */}
        <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm flex items-center">
          <Camera className="w-4 h-4 mr-1.5" />
          {property.images?.length || 1} Photos
        </div>
      </div>

      <div className="p-6">
        {/* Price */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {formatPrice(property.price)}
            </p>
          </div>
          {property.featured && (
            <Sparkles className="w-6 h-6 text-yellow-500" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        {/* Location */}
        {(isProperty(property) || !isCar(property)) && (
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
            <span className="text-sm">{'location' in property ? property.location : ''}</span>
          </div>
        )}

        {/* Property Details */}
        {type === 'property' && isProperty(property) && (
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

        {/* Car Details */}
        {type === 'car' && isCar(property) && (
          <div className="grid grid-cols-2 gap-3 py-4 border-y border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Year</p>
              <p className="text-sm font-semibold text-gray-900">{property.year}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Mileage</p>
              <p className="text-sm font-semibold text-gray-900">{property.mileage} km</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Fuel</p>
              <p className="text-sm font-semibold text-gray-900">{property.fuel}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Transmission</p>
              <p className="text-sm font-semibold text-gray-900">{property.transmission}</p>
            </div>
          </div>
        )}

        {/* Agent Info & CTA */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img 
              src={`https://ui-avatars.com/api/?name=${property.agent?.name || 'Agent'}&background=e5e7eb&color=374151&bold=true`}
              alt={property.agent?.name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">{property.agent?.name || 'Agent'}</p>
              <p className="text-xs text-gray-500">Verified Agent</p>
            </div>
          </div>
          <button 
            onClick={handleViewDetails}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}